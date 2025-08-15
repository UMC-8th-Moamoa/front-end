// PaymentMethodPage.tsx
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentSelector from '../../components/Purchase/PaymentSelector';
import Button from '../../components/common/Button';
import KakaoIcon from '../../assets/payment_kakao.svg';
import BackButton from '../../components/common/BackButton';
import BankTransferSection from '../../components/Purchase/BankTransferSection';
import { Toaster, toast } from 'react-hot-toast';

const PaymentMethodPage = () => {
  const location = useLocation();
  const { price: priceFromState } = (location.state as { price?: number }) || {};

  const [selectedMethod, setSelectedMethod] = useState<'kakao' | 'bank'>('kakao');
  const [depositName, setDepositName] = useState('');

  // ✅ 금액을 state에서 가져오고, 없으면 기본값 0
  const price = priceFromState ?? 0;
  const depositDeadline = '7월 10일 23:59';

  const handleKakaoPay = async () => {
    try {
      // 여기에 실제 결제 API 연동
      // 예시: POST /api/payments
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,          // ✅ 선택한 금액 전달
          method: 'kakao',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('카카오페이 결제 요청 성공');
        // 필요 시 결제 페이지로 이동
        window.location.href = data.redirectUrl;
      } else {
        toast.error(data.error?.reason || '결제 요청 실패');
      }
    } catch (err) {
      toast.error('결제 요청 중 오류 발생');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen max-w-[393px] mx-auto bg-white px-4 pt-6 pb-10 relative">

      {/* 상단 뒤로가기 */}
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      <div className="mt-20 mb-10 mx-2 text-left">
        <img src="/assets/MoamoaLogo.svg" alt="MOA MOA" className="h-5 mb-3" />
        <h2 className="text-mb text-[#6C6C6C] font-base">결제 수단을 선택해 주세요</h2>
      </div>

      <PaymentSelector selectedOption={selectedMethod} onSelect={setSelectedMethod} />

      <div className="mt-14 px-3">
        {selectedMethod === 'kakao' ? (
          <>
            <div className="h-80" />
            <p className="text-lg font-semibold text-gray-900">
              결제 금액: {price.toLocaleString()}원
            </p>

            <Button
              variant="kakao"
              fontSize="md"
              fontWeight="normal"
              size="md"
              width="full"
              className="flex items-center justify-center gap-3 mt-3"
              onClick={handleKakaoPay} // ✅ 결제 요청 실행
            >
              <img src={KakaoIcon} alt="Kakao Icon" className="w-5 h-5" />
              카카오페이로 결제하기
            </Button>

            <p className="text-xs text-gray-400 mt-2 ml-2">• 카카오페이 앱으로 이동</p>
          </>
        ) : (
          <BankTransferSection
            depositName={depositName}
            onChange={setDepositName}
            price={price}
            deadline={depositDeadline}
            onConfirm={() => {
              console.log('입금 확인 요청', depositName, price);
            }}
          />
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default PaymentMethodPage;