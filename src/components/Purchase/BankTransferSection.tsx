import React from 'react';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import InputBox from '../common/InputBox';

interface Props {
  depositName: string;
  onChange: (value: string) => void;
  price: number;
  deadline: string;
  onConfirm: () => void; 
}

const BankTransferSection: React.FC<Props> = ({
  depositName,
  onChange,
  price,
  deadline,
  onConfirm,
}) => {
  const handleConfirm = () => {
    if (!depositName.trim()) {
      toast.error('입금자명을 입력해 주세요');
      return;
    }

    // 확인 로직 수행
    onConfirm?.();
    toast.success('입금 확인 요청이 완료되었습니다.');
  };

  return (
    <>
      <div className="text-sm text-gray-600 mb-6 divide-y divide-[#E1E1E1]">
        {[
          { label: '은행명', value: '국민은행' },
          { label: '계좌번호', value: '123-456-78900' },
          { label: '예금주명', value: '모아모아' },
          { label: '입금 금액', value: `${price.toLocaleString()}원` },
          { label: '입금 기한', value: deadline },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="grid grid-cols-[150px_1fr] py-3 items-center"
          >
            <span className="text-[#B7B7B7]">{label}</span>
            <span className="text-black font-medium text-left">{value}</span>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label
          htmlFor="depositor"
          className="text-sm text-[#1F1F1F] font-semibold"
        >
          입금자명
        </label>
        <InputBox
          id="depositor"
          type="text"
          placeholder="입금자명을 입력해 주세요"
          value={depositName}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full bg-[#F2F2F2] placeholder:text-[#B7B7B7]"
          hasBorder={false}
        />
        <ul className="text-xs text-[#B7B7B7] mt-2 list-disc ml-4 space-y-1">
          <li>입금자명 동일 필수</li>
          <li>입금 금액이 정확하지 않을 시 결제가 취소됩니다</li>
        </ul>
      </div>

      <Button
        variant="primary"
        width="full"
        size="md"
        className="mt-4"
        onClick={handleConfirm}
      >
        확인
      </Button>
    </>
  );
};

export default BankTransferSection;