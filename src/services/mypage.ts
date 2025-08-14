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
    const { data } = await instance.get(EP_SELF_INFO, { params: { user_id: userId } });
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


// ==================== 고객센터: 목록/상세 ====================

const EP_CS_LIST   = "/customer-service/list";    // GET, (opt) ?page=&size=
const EP_CS_DETAIL = "/customer-service/detail";  // GET, (예) ?id= 또는 /:id (지금은 ?id=로 구현)

// 공통 스키마(유연 매핑)
export type InquiryItem = {
  id: number;
  title: string;
  content: string;
  date: string;                    // YYYY-MM-DD or YYYY.MM.DD 등 문자열
  status: "답변 보기" | "답변 대기";  // UI에서 쓰는 그대로
  isLocked: boolean;               // private 여부
  username: string;                // 작성자 user_id
};

// 목록 응답 (유연 수용)
export interface InquiryListResponse {
  success: boolean;
  total: number;
  inquiries: InquiryItem[];
}

// 상세 응답 (유연 수용)
export interface InquiryDetailResponse {
  success: boolean;
  inquiry: InquiryItem | null;
}

// 키 추출 유틸 재사용
// pick, normalizeSuccess 등은 이미 파일 상단에 정의되어 있으므로 그대로 사용.

// 내부 매퍼: 서버 필드명 다양성 흡수
function toInquiryItemAny(src: any): InquiryItem {
  const id       = Number(pick(src, "id", "inquiryId", "cs_id") || 0);
  const title    = pick<string>(src, "title") || "";
  const content  = pick<string>(src, "content") || "";
  const isLocked = Boolean(pick(src, "private", "isPrivate", "locked") || false);
  const username = pick<string>(src, "user_id", "username", "writer") || "";

  // date: createdAt / created_at / date 등 다양한 키 수용
  const rawDate  = pick<string>(src, "createdAt", "created_at", "date", "written_at") || "";
  // 단순 문자열 통과 (서버 포맷을 그대로 UI에 보여줌)
  const date     = String(rawDate);

  // status: 서버가 answered / status로 줄 수도 있고, 없으면 '답변 대기'
  const answered = pick<any>(src, "answered", "hasAnswer", "isAnswered");
  const rawStatus = pick<string>(src, "status") || (answered ? "답변 보기" : "답변 대기");
  const status: "답변 보기" | "답변 대기" = rawStatus === "답변 보기" ? "답변 보기" : "답변 대기";

  return { id, title, content, date, status, isLocked, username };
}

/** 고객센터 목록 조회 */
export async function fetchCustomerInquiries(params?: { page?: number; size?: number }): Promise<InquiryListResponse> {
  try {
    const { data } = await instance.get(EP_CS_LIST, { params });
    // 가능한 키들에서 리스트 꺼내기: service[], inquiries[], items[], content[]
    const list = (data?.service || data?.inquiries || data?.items || data?.content || []) as any[];
    const total =
      Number(pick(data, "total", "totalElements", "count") || (Array.isArray(list) ? list.length : 0));

    const mapped: InquiryItem[] = Array.isArray(list) ? list.map(toInquiryItemAny) : [];

    return { success: true, total, inquiries: mapped };
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "고객센터 목록 조회 실패";
    console.error("[CS][LIST] error:", msg);
    return { success: false, total: 0, inquiries: [] };
  }
}

/** 고객센터 상세 조회 */
export async function fetchCustomerInquiryDetail(id: number): Promise<InquiryDetailResponse> {
  try {
    // ?id= 방식. 서버가 /detail/:id 라우팅이면 EP를 바꾸세요.
    const { data } = await instance.get(EP_CS_DETAIL, { params: { id } });

    // 가능한 키에서 단건 꺼내기: service[0], inquiry, item, content
    const raw =
      (Array.isArray(data?.service) && data.service[0]) ||
      data?.inquiry ||
      data?.item ||
      data?.content ||
      data;

    const inquiry = raw ? toInquiryItemAny(raw) : null;
    return { success: true, inquiry };
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "고객센터 상세 조회 실패";
    console.error("[CS][DETAIL] error:", msg);
    return { success: false, inquiry: null };
  }
}


// ===== 고객센터 글 등록 =====
export interface CreateInquiryBody {
  user_id: string;
  title: string;
  content: string;
  private: boolean;
}
export interface CreateInquiryResponse {
  success: boolean;
  message: string;
  service?: {
    user_id: string;
    title: string;
    content: string;
    category?: string;
    private: boolean;
  }[];
}

// [ADD] 고객센터 글 등록 함수
export async function createCustomerInquiry(
  body: CreateInquiryBody
): Promise<CreateInquiryResponse> {
  try {
    const { data } = await instance.post<CreateInquiryResponse>(EP_CS_WRITE, body);
    return data;
  } catch (e: any) {
    // 서버 에러 메시지 우선 노출
    const msg = e?.response?.data?.message || e?.message || "고객센터 글 등록 실패";
    throw new Error(msg);
  }
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
