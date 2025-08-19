// src/services/wishlist/uploadimage.ts
import instance from "../../api/axiosInstance";

/** 1) Presigned URL 발급: POST /api/upload/user-image/upload-url */
export async function createUserImagePresignedUrl(params: {
  fileName: string; // ex) "gift_item.jpg"
  fileType: string; // ex) "image/jpeg" | "image/png"
}) {
  const { data } = await instance.post(
    "/upload/user-image/upload-url",
    params
  );

  // 서버가 {success,data:{...}} 또는 바로 {...} 로 줄 수 있어 느슨하게 파싱
  const payload = (data?.data ?? data) as {
    uploadUrl?: string;
    fileUrl?: string;
    key?: string;
    expires?: string;
    message?: string;
  };

  if (!payload?.uploadUrl || !payload?.fileUrl) {
    throw new Error(payload?.message || "FAILED_TO_GET_PRESIGNED_URL");
  }
  return {
    uploadUrl: payload.uploadUrl,
    fileUrl: payload.fileUrl,
    key: payload.key,
    expires: payload.expires,
  };
}

/** 2) 클라이언트에서 Presigned URL 로 S3 직접 업로드 (PUT) */
export async function putToS3(args: {
  uploadUrl: string;
  file: Blob;
  fileType: string;
}) {
  const res = await fetch(args.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": args.fileType },
    body: args.file,
  });
  if (!res.ok) throw new Error(`S3_UPLOAD_FAILED(${res.status})`);
}

/** 3) 업로드 검증: POST /api/upload/verify */
export async function verifyUpload(fileUrl: string) {
  const { data } = await instance.post("/upload/verify", { fileUrl });
  return data; // 필요 시 호출부에서 메시지/메타데이터 사용
}

/** 4) 업로드된 이미지 AI 분석 + 위시리스트 자동 등록 (경로 동일) */
export async function analyzeAndRegisterWishlistByImage(imageUrl: string) {
  const { data } = await instance.post("/wishlists/analyze", { imageUrl });
  return data;
}

/** 유틸: dataURL -> File */
export function dataUrlToFile(dataUrl: string, fileName = "image.jpg"): File {
  const [header, base64] = dataUrl.split(",");
  const match = header.match(/data:(.*?);base64/);
  const mime = match?.[1] || "image/jpeg";
  const bin = atob(base64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
  return new File([bytes], fileName, { type: mime });
}

/** 유틸: mime -> 확장자 */
export function extFromMime(mime: string) {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("heic")) return "heic";
  return "jpg";
}
