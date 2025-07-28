import React from 'react';
import Gmail_logo from '../../assets/Gmail_logo.svg';
import Kakaotalk_logo from '../../assets/Kakaotalk_logo.svg';
import Discord_logo from '../../assets/Discord_logo.svg';
import Instagram_logo from '../../assets/Instagram_logo.svg';
import X_logo from '../../assets/X_logo.svg';
import CopyIcon from '../../assets/Copy.svg';

interface ShareModalProps {
  onClose: () => void;
  onCopy: () => void;
}

const shareItems = [
  { icon: Gmail_logo, label: 'Gmail' },
  { icon: Kakaotalk_logo, label: '카카오톡' },
  { icon: Discord_logo, label: 'Discord' },
  { icon: Instagram_logo, label: 'Instagram' },
  { icon: X_logo, label: 'X' },
];

const ShareModal: React.FC<ShareModalProps> = ({ onClose, onCopy }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40" onClick={onClose}>
      <div
        className="w-full max-w-[393px] bg-white rounded-t-[20px] pt-4 pb-8 px-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 바 */}
        <div className="w-full mt-[12px] mb-[30px] flex justify-center mb-4">
          <div className="w-[74px] h-[6px] bg-[#B7B7B7] rounded-full" />
        </div>

        {/* 공유 아이템 리스트 (가로 스크롤) */}
        <div className="w-[393px] overflow-x-auto no-scrollbar">
          <div className="ml-[20px] flex gap-[24px] w-max px-[10px]">
            {shareItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center w-[54px] flex-shrink-0">
                <div className="w-[54px] h-[54px] rounded-full overflow-hidden">
                  <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />
                </div>
                <p className="mt-1 text-center text-[14px] text-[#1F1F1F] font-[Pretendard] font-[400]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-[350px] h-[1px] bg-[#D9D9D9] mb-[25px] mx-auto" />

        {/* 링크 복사 한 줄 + 왼쪽 정렬 */}
        <button onClick={onCopy} className="flex items-center gap-[12px] px-[10px]">
          <div className="w-[54px] h-[54px] rounded-full overflow-hidden">
            <img src={CopyIcon} alt="링크 복사" className="w-full h-full object-cover" />
          </div>
          <span className="text-[18px] text-[#6282E1] font-[500] font-[Pretendard]">
            링크 복사
          </span>
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
