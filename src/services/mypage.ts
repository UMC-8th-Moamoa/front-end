// src/services/mypage.ts
import instance from "../api/axiosInstance";

// 래퍼/맨바디 모두 대응: {resultType, success} 또는 그냥 {success: true, ...} 혹은 필드 직렬
function normalizeSuccess<T>(data: any): { ok: boolean; payload?: T; reason?: string } {
  // 1) Envelope 형태인 경우
  if (data && typeof data === "object" && "resultType" in data) {
    if (data.resultType === "SUCCESS" && data.success) {
      return { ok: true, payload: data.success as T };
    }
    const reason = data?.error ?? data?.message ?? "UNKNOWN_ERROR";
    return { ok: false, reason: typeof reason === "string" ? reason : JSON.stringify(reason) };
  }

  // 2) 맨바디 성공: { success: true, ... } 또는 필드가 바로 오는 경우
  if (data && typeof data === "object") {
    if (data.success === true) {
      // 일부 서버는 {success:true, user_id:..., ...} 같이 바로 내려줌
      return { ok: true, payload: data as T };
    }
    // user_id 등 핵심 키가 있으면 성공으로 간주
    if ("user_id" in data || "followers_num" in data || "name" in data) {
      return { ok: true, payload: data as T };
    }
  }

  // 3) 알 수 없는 형태
  return { ok: false, reason: "UNKNOWN_ERROR" };
}

function pick<T = string>(obj: any, ...keys: string[]): T | "" {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null) return v as T;
  }
  return "" as T;
}
function normalizeBirthday(v: any): string {
  if (!v) return "";
  const s = String(v).trim().replace(/[./]/g, "-");
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

// ===== Endpoints (Swagger 기준) =====
const EP_SELF_INFO = "/mypage/mypage_info";               // GET ?user_id=
const EP_SELF_EDIT = "/mypage/mypagechange_info";          // GET ?user_id=
const EP_OTHER_INFO = "/mypage/otherpage_info";            // GET ?user_id=
const EP_FOLLOW_REQ = "/mypage/follow/request";            // POST { user_id, target_id }
const EP_CS_WRITE = "/mypage/customer_service";
const EP_CHANGE_USER_ID = "/mypage/change_id";
const EP_UPLOAD_USER_URL = "/upload/user-image/upload-url"; // POST
const EP_UPLOAD_CONFIRM  = "/upload/confirm";               // POST
const EP_UPLOAD_AUTO     = "/upload/user-image/auto";       // POST (multipart)
const EP_UPLOAD_DELETE   = "/upload/image";                 // DELETE  

// ===== 공통 Envelope =====
export type ResultType = "SUCCESS" | "FAIL";

export interface Envelope<T> {
  resultType: ResultType;
  error: string | null;
  success?: T;
}

// ====== Success 페이로드 스키마(스웨거 예시 기반) ======
export interface SelfInfoSuccess {
  success: true;
  user_id: string;
  name: string;
  birthday: string; // "YYYY-MM-DD"
  followers_num: number;
  following_num: number;
  image: string;
}

export interface SelfEditSuccess {
  success: true;
  user_id: string;
  name: string;
  birthday: string;
  email: string;
  phone: string;
  image: string;
}

export interface OtherInfoSuccess {
  success: true;
  user_id: string;
  name: string;
  birthday: string;
  followers_num: number;
  following_num: number;
  followers: boolean;   // 내가 그 사람을 팔로우 중인지
  following: boolean;  // 그 사람이 나를 팔로우 중인지
  image: string;
}

export interface FollowRequestBody {
  user_id: string;   // 내 아이디
  target_id: string; // 대상 아이디
}

export interface FollowSuccess {
  success: boolean;
  message: string;
  data: {
    user_id: string;
    target_id: string;
    isFollowing: boolean;
  };
}

// ====== 클라이언트에서 쓰기 좋은 Normalized 타입 ======
export interface MyProfile {
  userId: string;
  name: string;
  birthday: string;
  followers: number;
  following: number;
  image: string;
}

export interface MyEditProfile extends MyProfile {
  email: string;
  phone: string;
}

export interface OtherProfile extends MyProfile {
  iFollowHim: boolean;  // 내가 그 사람을 팔로우 중인지
  heFollowsMe: boolean; // 그 사람이 나를 팔로우 중인지
}

// ====== 서비스 반환 타입(notifications.ts 패턴) ======
export interface MySelfInfoResponse {
  resultType: ResultType;
  error: string | null;
  success?: {
    profile: MyProfile;
  };
}

export interface MySelfEditResponse {
  resultType: ResultType;
  error: string | null;
  success?: {
    edit: MyEditProfile;
  };
}

export interface OtherInfoResponse {
  resultType: ResultType;
  error: string | null;
  success?: {
    profile: OtherProfile;
  };
}

export interface FollowRequestResponse {
  resultType: ResultType;
  error: string | null;
  success?: {
    ok: boolean;
    message: string;
    isFollowing: boolean;
    userId: string;
    targetId: string;
  };
}

// ====== 기본값 유틸 ======
const emptyProfile = (userId = ""): MyProfile => ({
  userId,
  name: "",
  birthday: "",
  followers: 0,
  following: 0,
  image: "",
});

const toMyProfile = (s: SelfInfoSuccess): MyProfile => ({
  userId: s.user_id,
  name: s.name,
  birthday: s.birthday,
  followers: s.followers_num,
  following: s.following_num,
  image: s.image,
});

const toMyEditProfile = (s: SelfEditSuccess): MyEditProfile => ({
  userId: s.user_id,
  name: s.name,
  birthday: s.birthday,
  followers: 0,     // 수정용 페이로드엔 팔로워 수 없음 → 0으로 통일
  following: 0,
  image: s.image,
  email: s.email,
  phone: s.phone,
});

const toOtherProfile = (s: OtherInfoSuccess): OtherProfile => ({
  userId: s.user_id,
  name: s.name,
  birthday: s.birthday,
  followers: s.followers_num,
  following: s.following_num,
  image: s.image,
  iFollowHim: !!s.followers,
  heFollowsMe: !!s.following,
});

// === 프로필/에딧 공통 매퍼 (서버 키에 상관없이 주워담기) ===
function toMyProfileAny(src: any): MyProfile {
  const s = src?.MyInfo ?? src; // 서버가 MyInfo로 감싸서 주면 풀기

  const userId    = pick(s, "user_id", "userId");
  const name      = pick(s, "name");
  const birthday  = normalizeBirthday(pick(s, "birthday", "birth", "birth_date"));

  // followers
  const followers = Number(pick(s, "followers_num", "follower_num", "followers") || 0);

  // following (단수/복수, *_num 모두 수용)
  const following = Number(
    pick(s, "following_num", "followings_num", "following", "followings") || 0
  );

  // 이미지: image/photo 등 다양성 수용
  const image     = pick(s, "image", "photo", "image_url", "avatar") || "";

  return { userId, name, birthday, followers, following, image };
}

function toMyEditProfileAny(src: any): MyEditProfile {
  const s = src?.MyInfo ?? src; // 서버가 MyInfo로 감싸면 풀기

  const userId   = pick(s, "user_id", "userId");
  const name     = pick(s, "name");
  const birthday = normalizeBirthday(pick(s, "birthday", "birth", "birth_date"));
  const email    = pick(s, "email", "email_address", "mail");
  const phone    = pick(s, "phone", "phone_number", "tel", "mobile");
  const image    = pick(s, "image", "photo", "image_url", "avatar") || "";

  // edit 응답엔 보통 팔로잉 수가 없지만 혹시 있으면 수용
  const followers = Number(pick(s, "followers_num", "followers") || 0);
  const following = Number(
    pick(s, "following_num", "followings_num", "following", "followings") || 0
  );

  return { userId, name, birthday, followers, following, image, email, phone };
}

const nonEmpty = (v: any) => v !== undefined && v !== null && String(v).trim() !== "";

// ====== API 함수 (notifications.ts와 동일한 사용 패턴) ======

/** 마이페이지 본인정보 확인 */
export async function fetchMySelfInfo(userId: string): Promise<MySelfInfoResponse> {
  try {
    // ✅ 가드: 파라미터 비면 localStorage 보정, 그래도 없으면 API 호출 안 함
    let uid = (userId ?? "").trim();
    if (!uid && typeof window !== "undefined") {
      uid = (localStorage.getItem("my_user_id") || "").trim();
    }
    if (!uid) {
      return {
        resultType: "FAIL",
        error: "EMPTY_USER_ID",
        success: { profile: emptyProfile("") },
      };
    }

    const { data } = await instance.get(EP_SELF_INFO, { params: { user_id: uid } });
    console.log('[INFO][RAW]', JSON.stringify(data, null, 2)); // 디버그

    // ① 래퍼 + success.MyInfo
    if (data && data.resultType === "SUCCESS" && (data.success?.MyInfo || data.success?.profile)) {
      const raw = data.success.MyInfo ?? data.success.profile;
      return { resultType: "SUCCESS", error: null, success: { profile: toMyProfileAny(raw) } };
    }

    // ② 맨바디: { success:true, MyInfo:{...} } 또는 { success:true, profile:{...} }
    if (data?.success === true && (data.MyInfo || data.profile)) {
      const raw = data.MyInfo ?? data.profile;
      return { resultType: "SUCCESS", error: null, success: { profile: toMyProfileAny(raw) } };
    }

    // ③ 맨바디: 바로 필드가 최상위
    if (data && typeof data === "object") {
      return { resultType: "SUCCESS", error: null, success: { profile: toMyProfileAny(data) } };
    }

    return {
      resultType: "FAIL",
      error: "UNKNOWN_ERROR",
      success: { profile: emptyProfile(userId) },
    };
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || "NETWORK_ERROR";
    return { resultType: "FAIL", error: msg, success: { profile: emptyProfile(userId) } };
  }
}

/** 사용자 수정 페이지 확인(기본값) */
export async function fetchMySelfEdit(userId: string): Promise<MySelfEditResponse> {
  try {
    const { data } = await instance.get(EP_SELF_EDIT, { params: { user_id: userId } });
    console.log('[EDIT][RAW]', JSON.stringify(data, null, 2)); // 디버그

    // ① 래퍼 + success.MyInfo / success.edit
    if (data && data.resultType === "SUCCESS" && (data.success?.MyInfo || data.success?.edit)) {
      const raw = data.success.MyInfo ?? data.success.edit;
      return { resultType: "SUCCESS", error: null, success: { edit: toMyEditProfileAny(raw) } };
    }

    // ② 맨바디: { success:true, MyInfo:{...} } 또는 { success:true, edit:{...} }
    if (data?.success === true && (data.MyInfo || data.edit)) {
      const raw = data.MyInfo ?? data.edit;
      return { resultType: "SUCCESS", error: null, success: { edit: toMyEditProfileAny(raw) } };
    }

    // ③ 맨바디: 바로 필드가 최상위
    if (data && typeof data === "object") {
      return { resultType: "SUCCESS", error: null, success: { edit: toMyEditProfileAny(data) } };
    }

    // ④ 레거시 normalize 호환
    const norm = normalizeSuccess<SelfEditSuccess>(data);
    if (norm.ok && norm.payload) {
      const raw: any = (norm.payload as any).MyInfo ?? (norm.payload as any).edit ?? norm.payload;
      return { resultType: "SUCCESS", error: null, success: { edit: toMyEditProfileAny(raw) } };
    }

    return {
      resultType: "FAIL",
      error: "UNKNOWN_ERROR",
      success: { edit: { ...emptyProfile(userId), email: "", phone: "" } },
    };
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || "NETWORK_ERROR";
    return { resultType: "FAIL", error: msg, success: { edit: { ...emptyProfile(userId), email: "", phone: "" } } };
  }
}

/** 마이페이지 다른사람 확인 */
export async function fetchOtherInfo(userId: string): Promise<OtherInfoResponse> {
  try {
    const { data } = await instance.get(EP_OTHER_INFO, { params: { user_id: userId } });

    // 🔽 래퍼/맨바디 모두 수용
    const norm = normalizeSuccess<OtherInfoSuccess>(data);
    if (norm.ok && norm.payload) {
      return {
        resultType: "SUCCESS",
        error: null,
        success: { profile: toOtherProfile(norm.payload) },
      };
    }

    return {
      resultType: "FAIL",
      error: norm.reason ?? "UNKNOWN_ERROR",
      success: {
        profile: { ...emptyProfile(userId), iFollowHim: false, heFollowsMe: false },
      },
    };
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || "NETWORK_ERROR";
    return {
      resultType: "FAIL",
      error: msg,
      success: {
        profile: { ...emptyProfile(userId), iFollowHim: false, heFollowsMe: false },
      },
    };
  }
}

/** 팔로우 요청 */
export async function requestFollow(body: FollowRequestBody): Promise<FollowRequestResponse> {
  try {
    const { data } = await instance.post<Envelope<FollowSuccess>>(EP_FOLLOW_REQ, body);

    if (data.resultType === "SUCCESS" && data.success) {
      return {
        resultType: "SUCCESS",
        error: null,
        success: {
          ok: !!data.success.success,
          message: data.success.message,
          isFollowing: data.success.data.isFollowing,
          userId: data.success.data.user_id,
          targetId: data.success.data.target_id,
        },
      };
    }

    return {
      resultType: "FAIL",
      error: data.error ?? "UNKNOWN_ERROR",
    };
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || "NETWORK_ERROR";
    return {
      resultType: "FAIL",
      error: msg,
    };
  }
}

// === [ADD] Info + Edit 합쳐서 한 번에 반환하는 헬퍼 ===
export type MyMerged = {
  userId: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  email?: string;
  phone?: string;
  image?: string;
  followers?: number;
  following?: number;
};

export async function fetchMyMerged(userId: string): Promise<MyMerged> {
  const base: MyMerged = {
    userId,
    name: "",
    birthday: "",
    email: "",
    phone: "",
    image: "",
    followers: 0,
    following: 0,
  };

  const [info, edit] = await Promise.allSettled([
    fetchMySelfInfo(userId),
    fetchMySelfEdit(userId),
  ]);

  // 1) info 우선: 팔로워/팔로잉은 여기서만 설정
  if (info.status === "fulfilled" && info.value.resultType === "SUCCESS" && info.value.success) {
    const p = info.value.success.profile;
    if (nonEmpty(p.userId))   base.userId   = p.userId;
    if (nonEmpty(p.name))     base.name     = p.name;
    if (nonEmpty(p.birthday)) base.birthday = p.birthday;
    if (nonEmpty(p.image))    base.image    = p.image;
    // followers/following: edit 응답으로 절대 덮지 않음
    if (typeof p.followers === "number") base.followers = p.followers;
    if (typeof p.following === "number") base.following = p.following;
  }

  // 2) edit는 보조 정보만 “비어있지 않으면” 덮기
  if (edit.status === "fulfilled" && edit.value.resultType === "SUCCESS" && edit.value.success) {
    const e = edit.value.success.edit;
    if (nonEmpty(e.userId))   base.userId   = e.userId;
    if (nonEmpty(e.name))     base.name     = e.name;
    if (nonEmpty(e.birthday)) base.birthday = e.birthday;
    if (nonEmpty(e.image))    base.image    = e.image;
    if (nonEmpty(e.email))    base.email    = e.email;
    if (nonEmpty(e.phone))    base.phone    = e.phone;
    // ⚠ followers/following은 여기서 건드리지 않음
  }

  console.log('[MERGED][FINAL]', base);
  return base;
}

// ==================== 고객센터====================

const EP_CS_LIST   = "/customer-service/list";    // GET, (opt) ?page=&size=
const EP_CS_DETAIL = "/customer-service/detail";  // GET, (예) ?id= 또는 /:id (지금은 ?id=로 구현)

// === [고객센터 타입] ===
export type InquiryItem = {
  id: number;
  title: string;
  content: string;
  username: string;   // = userId
  date: string;       // ISO or YYYY-MM-DD HH:mm 형태 문자열
  status: "답변 대기" | "답변 보기";
  isLocked?: boolean; // 추후 비공개 여부 등 표시용(없으면 무시)
};

export type InquiryDetailResponse = {
  inquiry: InquiryItem;
  responses?: Array<{
    id: number;
    content: string;
    isAdminResponse: boolean;
    adminName?: string | null;
    createdAt: string;
  }>;
};

// === [서버 → 프론트 매핑 유틸] ===
function mapInquiryFromServer(raw: any): InquiryItem {
  return {
    id: raw?.id,
    title: raw?.title ?? "",
    content: raw?.content ?? "",
    username: raw?.userId ?? "",
    date: raw?.createdAt ?? "",
    status: raw?.hasResponse ? "답변 보기" : "답변 대기",
    // 서버 스펙에 비공개 여부가 있으면 isLocked에 매핑
    isLocked: typeof raw?.private === "boolean" ? raw.private : undefined,
  };
}

// === [목록 조회] GET /api/mypage/customer_service?page=&limit= ===
export async function fetchCustomerInquiries(
  page = 1,
  limit = 10
): Promise<{ inquiries: InquiryItem[]; total: number; currentPage: number; totalPages: number; limit: number }> {
  const res = await instance.get("/mypage/customer_service", { params: { page, limit } });
  const norm = normalizeSuccess<any>(res.data);
  if (!norm.ok) throw new Error(norm.reason ?? "FAILED_TO_FETCH_INQUIRIES");

  const body = norm.payload; // = data.success
  const inquiries = Array.isArray(body?.inquiries) ? body.inquiries.map(mapInquiryFromServer) : [];
  const pagination = body?.pagination ?? {};

  return {
    inquiries,
    total: Number(pagination.totalCount ?? inquiries.length) || 0,
    currentPage: Number(pagination.currentPage ?? page) || 1,
    totalPages: Number(pagination.totalPages ?? 1) || 1,
    limit: Number(pagination.limit ?? limit) || limit,
  };
}

// === [상세 조회] GET /api/mypage/customer_service/{inquiryId} ===
export async function fetchCustomerInquiryDetail(inquiryId: number): Promise<InquiryDetailResponse> {
  const res = await instance.get(`/mypage/customer_service/${inquiryId}`);
  const norm = normalizeSuccess<any>(res.data);
  if (!norm.ok) throw new Error(norm.reason ?? "FAILED_TO_FETCH_INQUIRY_DETAIL");

  const body = norm.payload; // = data.success
  const inquiry = mapInquiryFromServer(body?.inquiry);
  const responses = Array.isArray(body?.responses)
    ? body.responses.map((r: any) => ({
        id: r?.id,
        content: r?.content ?? "",
        isAdminResponse: !!r?.isAdminResponse,
        adminName: r?.adminName ?? null,
        createdAt: r?.createdAt ?? "",
      }))
    : [];

  return { inquiry, responses };
}

// === [작성] POST /api/mypage/customer_service  (스펙 다르면 path/body 키만 바꿔줘) ===
// 서버가 토큰으로 유저 식별하는 케이스까지 커버
type CreateInquiryInput = {
  title: string;
  content: string;
  private?: boolean;
  user_id?: string; // 필요하면 넣고, 아니면 제외
};

export async function createCustomerInquiry(
  input: CreateInquiryInput
): Promise<{ success: boolean; message?: string; id?: number }> {
  // body를 최소 필수 필드로 구성하고, user_id가 있으면 넣는 방식
  const { user_id, ...rest } = input;
  const body = { ...rest, ...(user_id ? { user_id } : {}) };

  const res = await instance.post("/mypage/customer_service", body);
  const norm = normalizeSuccess<any>(res.data);
  if (!norm.ok) return { success: false, message: norm.reason };

  const id = norm.payload?.inquiry?.id ?? norm.payload?.id;
  return { success: true, id };
}

// ====== ID 변경 타입 ======
export interface ChangeUserIdBody {
  newUserId: string;
}

export interface ChangeUserIdSuccess {
  previousUserId: string;
  newUserId: string;
  message: string;
  changedAt: string; // ISO
}

export interface ChangeUserIdResponse {
  resultType: ResultType;
  error: string | null;
  success?: ChangeUserIdSuccess;
}

/** 내 로그인용 user_id 변경 */
export async function changeMyUserId(body: ChangeUserIdBody): Promise<ChangeUserIdResponse> {
  try {
    const { data } = await instance.put(EP_CHANGE_USER_ID, body);
    // 스웨거 예시: { resultType, error, success: {...} }
    if (data?.resultType === "SUCCESS" && data?.success) {
      return {
        resultType: "SUCCESS",
        error: null,
        success: {
          previousUserId: data.success.previousUserId,
          newUserId: data.success.newUserId,
          message: data.success.message,
          changedAt: data.success.changedAt,
        },
      };
    }
    // FAIL 케이스: reason을 그대로 전달
    const reason =
      data?.error?.reason || data?.message || "UNKNOWN_ERROR";
    return { resultType: "FAIL", error: reason };
  } catch (e: any) {
    const msg =
      e?.response?.data?.error?.reason ||
      e?.response?.data?.message ||
      e?.message ||
      "NETWORK_ERROR";
    return { resultType: "FAIL", error: msg };
  }
}

export const getMyUserId = (): string =>
  (localStorage.getItem("my_user_id") || "").trim();

export const setMyUserId = (id: string) => {
  const uid = (id || "").trim();
  localStorage.setItem("my_user_id", uid);
  // 앱 전역에 변경 알림
  window.dispatchEvent(new CustomEvent("my_user_id_changed", { detail: uid }));
};

// ==================== 프로필 이미지 업로드/프리셋 유틸 ====================

// Presigned URL 발급 Request/Response (스웨거 매핑)
export type GetUploadUrlBody = {
  fileName: string;
  fileType: string;   // ← 스웨거는 fileType 사용 (contentType 아님)
  size?: number;
};

export type GetUploadUrlSuccess = {
  uploadUrl: string;
  fileUrl: string;    // ← S3 최종 접근 URL (확정 시 바디로 넣음)
  key: string;        // ← S3 object key
  expires?: string;   // ISO
};

// Confirm Request/Response (스웨거 매핑)
export type ConfirmUploadBody = {
  fileUrl: string;
  fileName: string;
  fileSize: number;
};

export type ConfirmUploadSuccess = {
  fileUrl: string;    // 서버가 돌려주는 최종 URL (UI에 바로 사용)
  uploadedAt?: string;
};

// 1) 업로드 URL 발급 (/api/upload/user-image/upload-url)
export async function createUserImageUploadUrl(
  body: GetUploadUrlBody
): Promise<{ resultType: ResultType; error: string | null; success?: GetUploadUrlSuccess }> {
  try {
    const { data } = await instance.post(EP_UPLOAD_USER_URL, body);

    // 스펙: { success: true, data: { uploadUrl, fileUrl, key, expires } }
    if (data?.success && data?.data) {
      const d = data.data || {};
      const uploadUrl = d.uploadUrl || d.url || d.putUrl;
      const fileUrl   = d.fileUrl   || d.publicUrl || d.imageUrl;
      const key       = d.key       || d.fileKey   || d.path;
      const expires   = d.expires   || d.expiresAt;

      if (uploadUrl && fileUrl && key) {
        return { resultType: "SUCCESS", error: null, success: { uploadUrl, fileUrl, key, expires } };
      }
    }
    return { resultType: "FAIL", error: data?.message || "FAILED_TO_GET_UPLOAD_URL" };
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || "NETWORK_ERROR";
    return { resultType: "FAIL", error: msg };
  }
}

// 2) S3 Presigned PUT 업로드
export async function uploadFileToS3Presigned(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`S3_UPLOAD_FAILED: ${res.status} ${text}`);
  }
}

// 3) 확정 호출 (/api/upload/confirm) — 선택적
export async function confirmUserImageUpload(
  body: ConfirmUploadBody
): Promise<{ resultType: ResultType; error: string | null; success?: ConfirmUploadSuccess }> {
  try {
    const { data } = await instance.post(EP_UPLOAD_CONFIRM, body);

    // 스펙: { success: true, data: { fileUrl, fileName, fileSize, uploadedAt } }
    if (data?.success && data?.data) {
      const d = data.data || {};
      const fileUrl = d.fileUrl || d.url || d.imageUrl;
      if (fileUrl) return { resultType: "SUCCESS", error: null, success: { fileUrl, uploadedAt: d.uploadedAt } };
    }
    return { resultType: "FAIL", error: data?.message || "FAILED_TO_CONFIRM_UPLOAD" };
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || "NETWORK_ERROR";
    return { resultType: "FAIL", error: msg };
  }
}

// (옵션) 4) 자동 업로드(멀티파트 한 방에) — 파일 있으면 이걸로도 가능
// src/services/mypage.ts

export async function uploadUserImageAuto(
  file: File
): Promise<{ resultType: ResultType; error: string | null; success?: { fileUrl: string } }> {
  try {
    const fd = new FormData();
    // filename까지 넣어주면 백엔드가 더 안정적으로 처리
    fd.append("image", file, file.name);

    const { data } = await instance.post(EP_UPLOAD_AUTO, fd, {
      // ✅ 절대 Content-Type을 직접 지정하지 마!
      // axios가 브라우저에게 맡겨서 boundary가 들어가게 해야 함.
      headers: {},

      // 혹시 인터셉터가 JSON으로 바꾸는 경우를 방지
      transformRequest: [(d, h) => d],
      withCredentials: true, // 쿠키 쓰면 유지
    });

    const fileUrl = data?.data?.fileUrl || data?.fileUrl || data?.url || data?.imageUrl;
    if (data?.success !== false && fileUrl) {
      return { resultType: "SUCCESS", error: null, success: { fileUrl } };
    }
    return { resultType: "FAIL", error: data?.message || "FAILED_TO_AUTO_UPLOAD" };
  } catch (e: any) {
    const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || "NETWORK_ERROR";
    return { resultType: "FAIL", error: msg };
  }
}

/** 고수준: 파일로 프사 한 번에 변경(Presigned 플로우) */
export async function setMyProfileImageFromFile(
  file: File,
  opts?: { refreshUserId?: string; doRefresh?: boolean; strategy?: "presigned" | "auto" }
): Promise<{ ok: boolean; imageUrl?: string; reason?: string; merged?: MyMerged }> {
  try {
    const strategy = opts?.strategy || "presigned";

    if (strategy === "auto") {
      // 1단계: 멀티파트로 곧장 업로드
      const au = await uploadUserImageAuto(file);
      if (au.resultType !== "SUCCESS" || !au.success) {
        return { ok: false, reason: au.error || "FAILED_TO_AUTO_UPLOAD" };
      }
      const imageUrl = au.success.fileUrl;

      // (선택) confirm 호출로 로그/후처리
      await confirmUserImageUpload({ fileUrl: imageUrl, fileName: file.name, fileSize: file.size });

      if (opts?.doRefresh && opts?.refreshUserId) {
        const merged = await fetchMyMerged(opts.refreshUserId);
        return { ok: true, imageUrl, merged };
      }
      return { ok: true, imageUrl };
    }

    // === Presigned 전략 ===
    // 1) URL 발급 (fileType!)
    const r1 = await createUserImageUploadUrl({
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      size: file.size,
    });
    if (r1.resultType !== "SUCCESS" || !r1.success) {
      return { ok: false, reason: r1.error ?? "FAILED_TO_GET_UPLOAD_URL" };
    }

    // 2) S3 PUT
    await uploadFileToS3Presigned(r1.success.uploadUrl, file);

    // 3) 확정(선택) — 스펙에 맞는 바디 사용
    const r3 = await confirmUserImageUpload({
      fileUrl: r1.success.fileUrl,
      fileName: file.name,
      fileSize: file.size,
    });
    // confirm은 선택이지만, 성공 시 서버가 최종 URL을 보낼 수 있으므로 우선 사용
    const imageUrl = (r3.resultType === "SUCCESS" && r3.success?.fileUrl) ? r3.success.fileUrl : r1.success.fileUrl;

    // 4) 리프레시
    if (opts?.doRefresh && opts?.refreshUserId) {
      const merged = await fetchMyMerged(opts.refreshUserId);
      return { ok: true, imageUrl, merged };
    }
    return { ok: true, imageUrl };
  } catch (e: any) {
    return { ok: false, reason: e?.message || "UNKNOWN_ERROR" };
  }
}
