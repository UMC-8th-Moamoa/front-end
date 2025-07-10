import { useState } from 'react';
import Modal from '../../../common/Modal';

interface PopularItemProps {
  imageUrl: string;
  title: string;
}

const PopularItem = ({ imageUrl, title }: PopularItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-w-[119px] mr-[16px]">
      <div className="relative w-[119px] h-[119px] rounded-[16px] bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-[16px]"
        />
        <img
          src="/assets/WhitePlus.svg"
          alt="추가"
          className="absolute bottom-2 right-2 w-[24px] h-[24px] cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <p className="mt-[8px] text-[12px] text-black">{title}</p>

      {/* 모달 */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-[350px] h-[130px] bg-white rounded-[20px] flex flex-col items-center justify-center">
          <p className="text-[20px] font-medium text-center mb-[16px]">
            위시리스트에 추가하시겠습니까?
          </p>
          <div className="flex space-x-[12px]">
            <button
              className="w-[132px] h-[39px] rounded-[12px] border border-gray-400 text-[16px] text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              취소
            </button>
            <button className="w-[132px] h-[39px] rounded-[12px] bg-gray-400 text-[16px] text-white">
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PopularItem;
