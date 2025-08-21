// src/pages/Purchase/BankTransferPage.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import BackButton from "../../../components/common/BackButton";
import Button from "../../../components/common/Button";

type LocationState = {
  price?: number;
  deadline?: string;
  receiverName?: string;
};

const BankTransferPage = () => {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const location = useLocation() as { state?: LocationState };

  const price = useMemo(() => {
    if (typeof location.state?.price === "number") return location.state!.price;
    const qsAmount = Number(sp.get("amount"));
    return Number.isFinite(qsAmount) && qsAmount > 0 ? qsAmount : 0;
  }, [location.state?.price, sp]);

  const deadline =
    location.state?.deadline ?? sp.get("deadline") ?? "입금 요청 후 24시간 이내";

  const receiverName = location.state?.receiverName ?? sp.get("name") ?? "친구";

  const [depositName, setDepositName] = useState("");

  const bankName = "카카오뱅크";
  const accountNumber = "3333-12-3456789";
  const accountHolder = "(주)모아모아";

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} 복사됨`);
    } catch {
      toast.error("복사에 실패했어");
    }
  };

  const onConfirm = () => {
    if (!price || price <= 0) {
      toast.error("결제 금액이 없어요.");
      return;
    }
    if (!depositName.trim()) {
      toast.error("입금자명을 입력해주세요.");
      return;
    }
    toast.success("입금 확인 후 알림을 전송해드릴게요");
    navigate("/home");
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex justify-center">
      <div className="w-full max-w-[393px] h-full relative px-4 pt-4 pb-28 overflow-hidden">
        {/* 상단 바 */}
        <div className="flex items-center">
          <BackButton />
          <h1 className="flex-1 text-center text-lg font-semibold text-[#1F1F1F] -ml-5">
            무통장 입금
          </h1>
        </div>

        {/* 헤더 텍스트 */}
        <div className="mt-10 px-2 text-left">
          <img src="/assets/MoamoaLogo.svg" alt="MOA MOA" className="h-5 mb-2" />
          <h2 className="text-[14px] text-[#6C6C6C]">아래 계좌로 입금해 주세요</h2>
          <p className="text-[20px] mt-10">
            <span className="font-semibold text-[#6282E1]">{receiverName}</span>님의 모아모아 참여
          </p>
        </div>

        {/* 정보 카드 */}
        <div className="mt-5 bg-[[#F7F9FF]] border border-[#C7D5FF] rounded-2xl p-4 shadow-sm">
          {/* 금액 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6C6C6C]">결제 금액</span>
            <span className="text-lg font-semibold">{price.toLocaleString()}원</span>
          </div>
          <div className="h-px bg-[#E6ECFF] my-3" />
          {/* 은행/계좌 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#6C6C6C]">입금 은행</div>
              <div className="text-base font-medium">{bankName}</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-[#6C6C6C]">계좌 번호</div>
              <div className="flex items-center gap-2">
                <div className="text-base font-semibold">{accountNumber}</div>
                <button
                  className="text-xs px-2 py-1 border border-[#7090ED] text-[#7090ED] rounded-lg hover:bg-white"
                  onClick={() => copy(accountNumber, "계좌 번호")}
                >
                  복사
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-[#6C6C6C]">예금주</div>
              <div className="flex items-center gap-2">
                <div className="text-base">{accountHolder}</div>
                <button
                  className="text-xs px-2 py-1 border border-[#7090ED] text-[#7090ED] rounded-lg hover:bg-white"
                  onClick={() => copy(accountHolder, "예금주")}
                >
                  복사
                </button>
              </div>
            </div>
          </div>

          {/* 입금자명 입력 */}
          <div className="mt-4">
            <label className="text-sm text-[#6C6C6C]">입금자명</label>
            <input
              type="text"
              placeholder="송금자명을 입력해 주세요"
              value={depositName}
              onChange={(e) => setDepositName(e.target.value)}
              className="mt-2 w-full h-[46px] rounded-xl border border-[#C7D5FF] bg-white px-4 outline-none focus:border-[#97B1FF]"
            />
            <p className="mt-2 text-xs text-[#9AA7CC]">
              • 입금자명이 다르면 확인이 지연될 수 있어요
            </p>
          </div>

          {/* 마감 안내 */}
          <div className="mt-4 p-3 rounded-xl bg-white border border-[#C7D5FF] text-[13px] text-[#6C6C6C]">
            입금 마감 : <span className="font-medium text-[#1F1F1F]">{deadline}</span>
          </div>
        </div>

        {/* 하단 고정 버튼 영역 */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <Button
            variant="primary"
            width="full"
            size="md"
            disabled={!depositName.trim() || !price}
            onClick={onConfirm}
            className="w-[350px] mx-auto"
          >
            입금 확인 요청하기
          </Button>
          <p className="text-xs text-center text-[#9AA7CC] mt-2">
            입금 확인 후 참여가 완료돼요
          </p>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default BankTransferPage;
