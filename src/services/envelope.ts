// src/services/upload/envelope.ts
// 목적: 모아레터 편지봉투용 우표 이미지를 S3에 업로드(프리사인드 URL 이용)

import instance from "../api/axiosInstance";

// 허용 타입과 최대 용량(5MB)
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/bmp",
] as const;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

type AllowedType = (typeof ALLOWED_TYPES)[number];

type CreateUrlResponse = {
  success: boolean;
  message?: string;
  data?: {
    uploadUrl: string;
    fileUrl: string;
    key: string;
    expires: string; // ISO
    maxFileSize: number;
    contentType: string; // 서버가 서명에 사용한 Content-Type
    method: "PUT";
  };
};

export type EnvelopeUploadResult = {
  fileUrl: string;
  key: string;
};

/** DataURL을 Blob으로 변환. type을 명시적으로 지정해 Content-Type 불일치를 피함 */
export function dataURLtoBlob(dataURL: string, type: AllowedType) {
  const [meta, base64] = dataURL.split(",");
  const binary = atob(base64);
  const len = binary.length;
  const u8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
  return new Blob([u8], { type });
}

/** 서버에서 Presigned URL 발급 */
async function createEnvelopeUploadUrl(fileName: string, fileType: AllowedType) {
  const { data } = await instance.post<CreateUrlResponse>(
    "/upload/letter-envelope/upload-url", // Swagger에 명시된 정확한 경로
    { fileName, fileType }
  );
  if (!data?.success || !data?.data?.uploadUrl) {
    const msg = data?.message || "업로드 URL 생성에 실패했습니다.";
    throw new Error(msg);
  }
  return data.data;
}

/** 프리사인드 URL로 S3에 PUT. presign 시 사용한 Content-Type과 동일해야 함 */
async function putToS3(uploadUrl: string, file: Blob, contentType: string) {
  const resp = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`S3 PUT 실패: ${resp.status} ${text}`);
  }
}



/**
 * 메인 유틸:
 * - 파일/Blob을 받아 타입·용량 검증
 * - 서버에서 presigned URL 발급
 * - S3 PUT
 * - fileUrl 반환
 */
export async function uploadEnvelopeImage(input: File | Blob, fileNameHint?: string): Promise<EnvelopeUploadResult> {
  const size = input.size;
  const type = (input.type || "").toLowerCase() as AllowedType;

  if (!type || !ALLOWED_TYPES.includes(type)) {
    throw new Error("지원하지 않는 파일 형식입니다. PNG/JPEG/JPG/GIF/BMP만 가능합니다.");
  }
  if (size > MAX_SIZE) {
    throw new Error("파일 크기가 5MB를 초과했습니다.");
  }

  // 파일명이 없을 수도 있어 hint 사용
  const ext = extFromMime(type); // 예: image/png -> png
  const fileName = fileNameHint
    ? ensureExt(fileNameHint, ext)
    : `envelope_${Date.now()}.${ext}`;

  // 1) Presigned URL 발급
  const { uploadUrl, fileUrl, key, contentType } = await createEnvelopeUploadUrl(fileName, type);

  // 2) S3 PUT (Content-Type 반드시 presigned와 동일)
  await putToS3(uploadUrl, input, contentType);

  // 3) 결과 반환
  return { fileUrl, key };
}

/** MIME에서 확장자 추출 */
function extFromMime(mime: string) {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/bmp": "bmp",
  };
  return map[mime] || "bin";
}

/** 확장자 보정: fileNameHint에 확장자가 없거나 다르면 덮어씀 */
function ensureExt(fileName: string, ext: string) {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return `${fileName}.${ext}`;
  const current = fileName.slice(dot + 1).toLowerCase();
  if (current !== ext) return `${fileName.slice(0, dot)}.${ext}`;
  return fileName;
}
