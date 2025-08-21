import instance from "../api/axiosInstance";

// ===== 전역 키/유틸 =====
const KEY_PROFILE_CACHE = "cached_profile";
const KEY_PROFILE_VER   = "profile_image_ver";

// 버전 읽기/설정
function getImageVer() {
  return localStorage.getItem(KEY_PROFILE_VER) || "";
}
function setImageVer(ver: number | string) {
  localStorage.setItem(KEY_PROFILE_VER, String(ver));
  // 다른 컴포넌트(또는 탭)에게도 알림
  window.dispatchEvent(new CustomEvent("profile_image_ver_updated", { detail: String(ver) }));
}

// ===== MIME 타입 정규화 =====
// - presigned URL 생성 시 백엔드가 서명에 포함할 Content-Type과
//   실제 PUT 요청에서 보낼 Content-Type이 정확히 일치해야 서명 오류가 나지 않는다.
// - file.type이 없거나 부정확할 수 있어 확장자 기반 보정 로직 포함.
// - jpg 계열은 반드시 image/jpeg로 통일한다.
function normalizeMimeType(file: File): string {
  if (file.type && typeof file.type === "string" && file.type.includes("/")) {
    if (/^image\/jpe?g$/i.test(file.type)) return "image/jpeg";
    return file.type;
  }
  const name = file.name || "";
  if (/\.(jpe?g)$/i.test(name)) return "image/jpeg";
  if (/\.png$/i.test(name)) return "image/png";
  if (/\.webp$/i.test(name)) return "image/webp";
  return "application/octet-stream";
}

// ===== presigned URL 기반 헤더 빌더 =====
// - presign 쿼리에 Content-Type이 있으면 그 값을 그대로 사용한다.
// - presign에 없으면 우리가 정규화한 값 사용. 다만 서명 정책에 따라
//   아예 헤더 미설정을 기대하는 경우도 있으므로 최소한으로만 설정한다.
// - presign 생성 시 포함되지 않은 x-amz-* 헤더는 임의로 붙이지 않는다.
function buildHeadersFromPresigned(uploadUrl: string, file: File): Record<string, string> {
  const u = new URL(uploadUrl);
  const params = u.searchParams;

  const ctFromUrl = params.get("Content-Type");
  const ct = ctFromUrl || normalizeMimeType(file);

  const headers: Record<string, string> = {};

  if (ctFromUrl) {
    headers["Content-Type"] = ct;
  } else {
    if (ct && ct !== "application/octet-stream") {
      headers["Content-Type"] = ct;
    }
  }

  // 예시) presign에 포함된 경우에만 사용 가능한 헤더들
  // headers["x-amz-acl"] = "public-read";

  return headers;
}

// bust 유틸: URL? → URL?v=123456789
export function bust(url?: string | null, ver?: string | number) {
  if (!url) return url ?? null;
  const v = ver ?? getImageVer();
  if (!v) return url;
  return url + (url.includes("?") ? "&" : "?") + `v=${v}`;
}

// 업로드 완료 방송 헬퍼
export function announceProfileImageUpdate(detail: { imageUrl: string; merged?: any; imageVer?: number | string }) {
  if (detail.imageVer) setImageVer(detail.imageVer);
  if (detail.merged) {
    try { localStorage.setItem(KEY_PROFILE_CACHE, JSON.stringify(detail.merged)); } catch {}
  }
  window.dispatchEvent(new CustomEvent("my_profile_updated", { detail }));
}

// ---------- 타입 ----------
export type UploadUrlSuccess = {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  expires?: string;
};

export type ConfirmSuccess = {
  fileUrl: string;
  uploadedAt?: string;
};

// 공통: 서버 응답에서 안전하게 꺼내기
function pick<T = string>(obj: any, ...keys: string[]): T | "" {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v) !== "") return v as T;
  }
  return "" as T;
}

// ---------- 1) 업로드 URL 발급 ----------
// - 백엔드에서 presign 생성 시 서명에 포함하는 Content-Type과 정확히 일치하도록
//   fileType을 normalizeMimeType으로 정규화한다.
export async function createUserImageUploadUrl(file: File): Promise<UploadUrlSuccess> {
  const body = {
    fileName: file.name,
    fileType: normalizeMimeType(file),
    size: file.size,
  };

  const { data } = await instance.post("/upload/user-image/upload-url", body);

  // 응답 넓게 수용
  const src = data?.data ?? data?.success ?? data;
  const uploadUrl = pick<string>(src, "uploadUrl", "url", "putUrl");
  const fileUrl   = pick<string>(src, "fileUrl", "publicUrl", "imageUrl");
  const key       = pick<string>(src, "key", "fileKey", "path");
  const expires   = pick<string>(src, "expires", "expiresAt");

  if (!uploadUrl || !fileUrl || !key) {
    throw new Error(`URL_ISSUE: ${JSON.stringify(data)}`);
  }
  return { uploadUrl, fileUrl, key, expires: expires || undefined };
}

// ---------- 2) S3로 직접 업로드 (PUT) ----------
// - presigned URL 쿼리 기반으로 헤더를 구성해 서명-헤더 불일치를 방지한다.
export async function putToS3(uploadUrl: string, file: File): Promise<void> {
  const headers = buildHeadersFromPresigned(uploadUrl, file);
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers,
    body: file,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`S3_PUT_${res.status}: ${text}`);
  }
}

// ---------- 3) 업로드 확인 (선택) ----------
export async function confirmUpload(fileUrl: string, file: File): Promise<ConfirmSuccess> {
  const { data } = await instance.post("/upload/confirm", {
    fileUrl,
    fileName: file.name,
    fileSize: file.size,
  });

  const src = data?.data ?? data?.success ?? data;
  const finalUrl = pick<string>(src, "fileUrl", "url", "imageUrl");

  if (!finalUrl) throw new Error(`CONFIRM_FAILED: ${JSON.stringify(data)}`);
  return { fileUrl: finalUrl, uploadedAt: src?.uploadedAt };
}

// ---------- (옵션) 멀티파트 자동 업로드(백 폴백용) ----------
export async function uploadUserImageAuto(
  file: File,
  fieldName: "image" | "file" | "photo" = "image" // 백이 기대하는 필드명이 다를 수 있음
): Promise<{ fileUrl: string }> {
  const fd = new FormData();
  fd.append(fieldName, file);

  // axiosInstance 설정 상 multipart일 땐 Content-Type 헤더를 명시하지 않아야 브라우저가 경계를 자동 생성한다.
  const { data } = await instance.post("/upload/user-image/auto", fd);

  const fileUrl =
    data?.data?.fileUrl || data?.fileUrl || data?.url || data?.imageUrl;

  if (!fileUrl) {
    throw new Error(`AUTO_UPLOAD_FAILED: ${JSON.stringify(data)}`);
  }
  return { fileUrl };
}

// ---------- (편의) 프사 업로드 전과정 ----------
export async function uploadUserImage(
  file: File,
  opts?: {
    confirm?: boolean;
    fallbackAuto?: boolean;
    autoFieldName?: "image" | "file" | "photo";
    /** 업로드 후 전역 방송을 수행 (기본: true) */
    announce?: boolean;
    /** 방송 시 같이 싣고 싶은 병합된 프로필(있다면 캐시 갱신) */
    mergedProfileForBroadcast?: any;
  }
): Promise<{ fileUrl: string; imageVer: number }> {
  const doAnnounce = opts?.announce !== false;

  try {
    const u = await createUserImageUploadUrl(file);
    await putToS3(u.uploadUrl, file);

    let finalUrl = u.fileUrl;
    if (opts?.confirm !== false) {
      try {
        const c = await confirmUpload(u.fileUrl, file);
        if (c.fileUrl) finalUrl = c.fileUrl;
      } catch {
        // confirm 실패는 무시하고 presign 단계에서 받은 URL 사용
      }
    }

    // 업로드 성공 → 버전 갱신 + 방송
    const imageVer = Date.now();
    if (doAnnounce) {
      announceProfileImageUpdate({
        imageUrl: finalUrl,
        imageVer,
        merged: opts?.mergedProfileForBroadcast,
      });
    }

    return { fileUrl: finalUrl, imageVer };
  } catch (e) {
    if (opts?.fallbackAuto) {
      const a = await uploadUserImageAuto(file, opts.autoFieldName ?? "image");
      const imageVer = Date.now();
      if (doAnnounce) {
        announceProfileImageUpdate({
          imageUrl: a.fileUrl,
          imageVer,
          merged: opts?.mergedProfileForBroadcast,
        });
      }
      return { fileUrl: a.fileUrl, imageVer };
    }
    throw e;
  }
}
