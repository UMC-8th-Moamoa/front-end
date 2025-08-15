// components/Purchase/PaidChargeSection.tsx
import ChangeOptionList from "./ChargeOptionList";
import QuantityCounter from "./QuantityCounter";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";



type Option = {
  id: number;
  label: string;
  price: number;
  discount?: number;
};

type Props = {
  options: Option[];
  selectedId: number;
  onSelect: (id: number) => void;
  quantity: number;
  onChangeQuantity: (val: number) => void;
  totalPrice: number;
};

export default function PaidChargeSection({
  options,
  selectedId,
  onSelect,
  quantity,
  onChangeQuantity,
  totalPrice,
}: Props) {
  const navigate = useNavigate();
  return (
    <>
      <div className="px-5 py-4">
        <h2 className="text-base text-[#6282E1] font-semibold mb-3">
          몽코인 충전하기
        </h2>
        <ChangeOptionList
          options={options}
          selectedId={selectedId}
          onSelect={onSelect}
        />

        {/* 안내 문구 */}
        <ul className="mt-6 text-[11px] text-[#B7B7B7] font-base leading-5 list-disc pl-4">
            <li>몽코인은 앱 내에서만 사용 가능한 전용 재화입니다.</li>
            <li>충전한 몽코인은 현금으로 환불 또는 현금화할 수 없습니다.</li>
            <li>결제 완료 후에는 충전 취소 및 환불이 불가하니, 충전 금액을 꼭 확인해 주세요.</li>
            <li>몽코인은 선물 참여, 꾸미기 아이템 구매 등 앱 내 서비스에만 사용할 수 있습니다.</li>
            <li>본 서비스의 이용 약관 및 결제 정책을 반드시 확인해 주세요.</li>
        </ul>
      </div>

      <div className="px-5 py-4 mt-auto fixed bottom-0 bg-white w-full max-w-[393px]">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xl font-semibold">₩ {totalPrice.toLocaleString()}</p>
          <QuantityCounter value={quantity} onChange={onChangeQuantity} />
        </div>
        <Button
          variant="primary"
          className="w-full mb-4"
          onClick={() => {
            navigate('/purchase/payment', {
              state: { price: totalPrice }, 
            });
          }}
        >
          결제하기
        </Button>
      </div>
    </>
  );
}