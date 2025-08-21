// services/money/moamoney.ts
import instance from "../../api/axiosInstance";

export type ResultType = "SUCCESS" | "FAIL";

// 완료 상태 조회 (이전에 쓰던 타입)
export interface EventCompletionStatus {
  totalReceivedAmount: number;
  selectedItemsAmount: number;
  remainingAmount: number;
  status: "EXACT_MATCH" | "UNDER" | "OVER" | "PENDING" | string;
  message: string;
  canViewLetters: boolean;
}

export type OptionType = "DONATE" | "CONVERT_TO_COIN" | string;

export interface RemainingOption {
  type: OptionType;
  label: string;
}

export interface RemainingSelection {
  totalReceivedAmount: number;
  selectedItemsAmount: number;
  remainingAmount: number;
  message: string;       // e.g. "10,000원이 남았어요"
  description: string;   // e.g. "어떤 용도로 사용할지 선택해주세요"
  options: RemainingOption[];
}

interface ApiEnvelope<T> {
  resultType: ResultType;
  error: unknown | null;
  success?: T;
}

// 이벤트 완료 후 처리 상태 조회
export async function getEventCompletionStatus(signal?: AbortSignal) {
  const { data } = await instance.get<ApiEnvelope<EventCompletionStatus>>(
    "/birthdays/me/event/status",
    { signal }
  );
  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error("이벤트 상태 조회 실패");
  }
  return data.success;
}

// 남은 금액 선택 화면 조회
export async function getEventRemainingSelection(signal?: AbortSignal) {
  const { data } = await instance.get<ApiEnvelope<RemainingSelection>>(
    "/birthdays/me/event/remaining",
    { signal }
  );
  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error("남은 금액 선택 조회 실패");
  }
  return data.success;
}


export interface DonationOrganization {
  id: number;
  name: string;
}
export interface DonationOrganizationList {
  organizations: DonationOrganization[];
}

interface ApiEnvelope<T> {
  resultType: ResultType;
  error: unknown | null;
  success?: T;
}

/** 기부 가능한 단체 목록 조회 */
export async function getDonationOrganizations(signal?: AbortSignal) {
  const { data } = await instance.get<ApiEnvelope<DonationOrganizationList>>(
    "/donations/organizations",
    { signal }
  );
  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error("기부 단체 목록 조회 실패");
  }
  return data.success.organizations;
}


export interface DonateResult {
  organizationName: string;
  donatedAmount: number;
  message: string;      // ex) "굿네이버스에 기부했어요"
  description: string;  // ex) "기부금을 전달하고 있어요"
  donatedAt: string;    // ISO
}

interface ApiEnvelope<T> {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success?: T;
}

/** 기부 처리 */
export async function donateToOrganization(
  organizationId: number,
  signal?: AbortSignal
) {
  const { data } = await instance.post<ApiEnvelope<DonateResult>>(
    "/birthdays/me/event/donate",
    { organizationId },
    { signal }
  );

  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error("기부 처리 실패");
  }
  return data.success;
}

export interface MongPreview {
  conversionRate: number; // 예: 1.2
  message: string;        // 예: "전환되는 몽코인은 100원 단위..."
  description: string;    // 예: "15,000원 = 18MC"
  minimumUnit: number;    // 예: 100
}

interface ApiEnvelope<T> {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success?: T;
}

export async function getMongPreview(signal?: AbortSignal) {
  const { data } = await instance.get<ApiEnvelope<MongPreview>>(
    "/birthdays/me/event/preview",
    { signal }
  );
  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error("몽코인 전환 미리보기 조회 실패");
  }
  return data.success;
}


export interface ConvertResult {
  convertedAmount: number; // 전환된 원화 금액
  convertedCoins: number;  // 전환된 코인 수
  message: string;         // "12MC로 전환되었습니다"
  description: string;     // "상점에서 원하는 아이템으로 교환해 보세요"
  convertedAt: string;     // ISO
}

interface ApiEnvelope<T> {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success?: T;
}

export async function convertToMong(signal?: AbortSignal) {
  const { data } = await instance.post<ApiEnvelope<ConvertResult>>(
    "/birthdays/me/event/convert",
    {},                         // 바디 없음
    { signal }
  );
  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error("몽코인 전환 실패");
  }
  return data.success;
}