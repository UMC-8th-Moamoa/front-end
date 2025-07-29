// src/pages/payment/PaymentMethodPage.tsx
import { useState } from 'react';
import PaymentSelector from '../../components/Purchase/PaymentSelector';
import Button from '../../components/common/Button';
import KakaoIcon from '../../assets/payment_kakao.svg';
import BackButton from '../../components/common/BackButton';
import BankTransferSection from '../../components/Purchase/BankTransferSection';

const PaymentMethodPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<'kakao' | 'bank'>('kakao');

  // 실시간으로 유동적으로 달라지는 값들
  const [depositName, setDepositName] = useState('');
  const price = 30000; // ← 서버에서 받아온 값이라고 가정
  const depositDeadline = '7월 10일 23:59'; // ← 이 값도 props나 fetch로 받아와야 함

  return (
    <div className="min-h-screen bg-white px-4 pt-6 pb-10 relative">
      {/* 상단 뒤로가기 */}
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      {/* 로고 + 타이틀 */}
      <div className="mt-20 mb-10 mx-2 text-left">
        <img
          src="/assets/MoamoaLogo.svg"
          alt="MOA MOA"
          className="h-5 mb-3"
        />
        <h2 className="text-mb text-[#6C6C6C] font-base">결제 수단을 선택해 주세요</h2>
      </div>

      {/* 결제 수단 선택 */}
      <PaymentSelector
        selectedOption={selectedMethod}
        onSelect={setSelectedMethod}
      />

      {/* 하단 UI: 결제 금액 또는 무통장입금 정보 */}
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
            >
              <img src={KakaoIcon} alt="Kakao Icon" className="w-5 h-5" />
              카카오페이로 결제하기
            </Button>

            <p className="text-xs text-gray-400 mt-2 ml-2">• 카카오페이 앱으로 이동</p>
          </>
        ) : (
          <>
            <BankTransferSection
              depositName={depositName}
              onChange={setDepositName}
              price={price}
              deadline={depositDeadline}
              onConfirm={() => {
                if (!depositName.trim()) {
                  alert('입금자명을 입력해주세요.');
                  return;
                }
                console.log('입금 확인 요청', depositName);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodPage;