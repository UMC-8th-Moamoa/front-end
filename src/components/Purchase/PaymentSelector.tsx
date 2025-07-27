// src/components/Purchase/PaymentSelector.tsx
import React from 'react';
import KakaoIcon from '../../assets/payment_kakao.svg';
import BankIcon from '../../assets/payment_Bank.svg';

type PaymentOption = 'kakao' | 'bank';

interface PaymentSelectorProps {
  selectedOption: PaymentOption;
  onSelect: (option: PaymentOption) => void;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedOption,
  onSelect,
}) => {
  const isSelected = (option: PaymentOption) => selectedOption === option;

  const renderRadioCircle = (selected: boolean) => (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        selected ? 'border-[#6282E1] bg-[#6282E1]' : 'border-[#E1E1E1] bg-white'
      }`}
    >
      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  );

  return (
    <div className="flex gap-4 px-2">
      {/* 카카오페이 */}
      <button
        onClick={() => onSelect('kakao')}
        className={`flex-1 border rounded-xl px-3 py-2 transition-all flex flex-col justify-between items-start ${
          isSelected('kakao') ? 'border-[#6282E1]' : 'border-[#E1E1E1]'
        }`}
      >
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center">
            <img src={KakaoIcon} alt="카카오페이" className="w-14 h-8 mb-5" />
          </div>
          {renderRadioCircle(isSelected('kakao'))}
        </div>
        <div className="mt-2 text-left">
          <p className="text-base font-bold text-black mb-1">카카오페이</p>
          <p className="text-xs text-[#B7B7B7]">카카오톡으로 간편결제</p>
        </div>
      </button>

      {/* 무통장 입금 */}
      <button
        onClick={() => onSelect('bank')}
        className={`flex-1 border rounded-xl px-3 py-2 transition-all flex flex-col justify-between items-start ${
          isSelected('bank') ? 'border-[#6282E1]' : 'border-[#E1E1E1]'
        }`}
      >
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center">
            <img src={BankIcon} alt="무통장 입금" className="w-8 h-8" />
          </div>
          {renderRadioCircle(isSelected('bank'))}
        </div>
        <div className="mt-2 text-left">
          <p className="text-base font-bold text-black mb-1">무통장 입금</p>
          <p className="text-xs text-[#B7B7B7]">계좌로 직접 송금</p>
        </div>
      </button>
    </div>
  );
};

export default PaymentSelector;