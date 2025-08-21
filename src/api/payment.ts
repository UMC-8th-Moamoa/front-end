// src/api/payment.ts
import api from "./axiosInstance";

export type PackageInfo = {
  id: string;     // "MC_150"
  name: string;   // "150MC"
  mongcoin: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  discountText?: string; // "-₩3,000"
};

type Envelope<T> = {
  resultType: "SUCCESS" | "FAIL";
  error: null | { errorCode: string; reason?: string | null; data?: unknown };
  success: T | null;
};

export async function fetchBalance() {
  const { data } = await api.get<Envelope<{ balance: number; userId?: string }>>(
    "/payment/balance",
    { params: { _t: Date.now() }, headers: { "Cache-Control": "no-cache" } }
  );
  const s = (data as any)?.success ?? data;
  const core = s?.data ?? s;
  return Number(core?.balance ?? 0);
}

export async function fetchPackages() {
  // 백엔드에 패키지 조회 엔드포인트가 있다면 여기에 연결
  const { data } = await api.get<Envelope<{ packages: PackageInfo[] }>>(
    "/payment/packages",
    { params: { _t: Date.now() }, headers: { "Cache-Control": "no-cache" } }
  );
  const s = (data as any)?.success ?? data;
  return (s?.packages ?? []) as PackageInfo[];
}

export async function chargePackage(packageId: string) {
  const { data } = await api.post<
    Envelope<{
      message: string;
      packageInfo: PackageInfo;
      newBalance: number;
      chargedAmount: number; // 충전된 MC
      transaction: { id: number; createdAt: string };
    }>
  >("/payment/charge", { packageId });

  const s = (data as any)?.success ?? data;
  if (!s?.newBalance && !s?.data?.newBalance && (data as any)?.resultType === "FAIL") {
    const reason =
      (data as any)?.error?.reason ||
      "충전 처리에 실패했습니다.";
    throw new Error(reason);
  }
  return (s?.data ?? s) as {
    message: string;
    packageInfo: PackageInfo;
    newBalance: number;
    chargedAmount: number;
    transaction: { id: number; createdAt: string };
  };
}