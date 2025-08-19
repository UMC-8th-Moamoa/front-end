import instance from "../api/axiosInstance";

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
export async function createUserImageUploadUrl(file: File): Promise<UploadUrlSuccess> {
  const body = {
    fileName: file.name,
    fileType: file.type || "application/octet-stream",
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
export async function putToS3(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
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

  // ❗ axiosInstance에서 multipart일 땐 Content-Type 지우도록 설정돼 있어야 함
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
  opts?: { confirm?: boolean; fallbackAuto?: boolean; autoFieldName?: "image" | "file" | "photo" }
): Promise<string> {
  try {
    const u = await createUserImageUploadUrl(file);
    await putToS3(u.uploadUrl, file);
    if (opts?.confirm !== false) {
      try {
        const c = await confirmUpload(u.fileUrl, file);
        return c.fileUrl || u.fileUrl;
      } catch {
        // confirm은 선택: 실패해도 presigned URL로 반환
        return u.fileUrl;
      }
    }
    return u.fileUrl;
  } catch (e) {
    // presigned 플로우 실패 시 auto로 폴백 (선택)
    if (opts?.fallbackAuto) {
      const a = await uploadUserImageAuto(file, opts.autoFieldName ?? "image");
      return a.fileUrl;
    }
    throw e;
  }
}
