// src/services/wishlist/uploadimage.ts
import instance from "../../api/axiosInstance";

/** DataURL -> File */
export function dataURLtoFile(dataUrl: string, filename = "wishlist-image.jpg"): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] ?? "application/octet-stream";
  const bin = atob(base64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new File([u8], filename, { type: mime });
}

/** presign: POST /api/upload/wishlist-image/upload-url
 *  body: { fileName, fileType }
 *  resp: { success, data: { uploadUrl, fileUrl, key, expires } }
 */
export async function getWishlistImagePresign(file: File) {
  const { data } = await instance.post("/upload/wishlist-image/upload-url", {
    fileName: file.name,
    fileType: file.type || "application/octet-stream",
  });

  const payload = data?.data ?? data;
  const uploadUrl: string = payload?.uploadUrl;
  const fileUrl: string = payload?.fileUrl;

  if (!uploadUrl || !fileUrl) {
    throw new Error("presign 응답에 uploadUrl/fileUrl이 없습니다.");
  }
  return { uploadUrl, fileUrl };
}

/** S3 PUT (presigned URL) */
export async function putToS3(uploadUrl: string, file: File, extraHeaders?: Record<string, string>) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      ...(extraHeaders ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`S3 업로드 실패: ${res.status} ${text}`);
  }
}

/** 업로드 → 공개 URL 반환 */
export async function uploadWishlistImageAuto(file: File): Promise<string> {
  const { uploadUrl, fileUrl } = await getWishlistImagePresign(file);
  await putToS3(uploadUrl, file);
  return fileUrl; // 공개 URL
}

/** 분석: POST /api/wishlists/analyze  { imageUrl } */
export type AnalyzeResult = {
  caption_en: string;
  caption_ko: string;
  extractedKeywords: string[];
  result?: { title: string; price: string; image: string; link: string; mallName?: string };
  searchKeyword?: string;
  analyzedAt?: string;
};

export async function analyzeWishlistImage(imageUrl: string): Promise<AnalyzeResult> {
  const { data } = await instance.post("/wishlists/analyze", { imageUrl });
  return (data?.data ?? data) as AnalyzeResult;
}
