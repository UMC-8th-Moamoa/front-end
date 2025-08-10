import { useState } from 'react';
import BackButton from '../../components/common/BackButton';
import DownIcon from '../../assets/Down_color.svg';
import UpIcon from '../../assets/Up_color.svg';


const history = [
  { date: '2025.07.16 00:00:00', label: '카카오페이', amount: '8,500원', desc: '몽코인', value: '100MC' },
  { date: '2025.07.16 00:00:00', label: '무통장 입금', amount: '8,500원', desc: '몽코인', value: '100MC' },
  { date: '2025.07.16 00:00:00', label: '광고 시청', amount: '무료', desc: '몽코인', value: '1MC' },
  { date: '2025.07.16 00:00:00', label: '', desc: '아이템 구매', value: '-100MC' },
];

const filters = ['모두 보기', '몽코인 사용', '몽코인 충전'];

export default function PurchaseHistoryPage() {
  const [selected, setSelected] = useState('모두 보기');
  const [open, setOpen] = useState(false);

  // 필터링된 리스트 반환
const filteredHistory = history.filter(item => {
  if (selected === '모두 보기') return true;
  if (selected === '몽코인 사용') return item.value?.startsWith('-');
  if (selected === '몽코인 충전') return item.value && !item.value.startsWith('-');
  return true;
});




  return (
    <div className="w-full max-w-[350px] mt-[9px] mx-auto bg-white min-h-screen font-pretendard">
      {/* 상단 헤더 */}
      <div className="flex items-center px-4 pt-5 pb-3">
        <BackButton />
        <h1 className="flex-1 text-center text-[18px] font-bold leading-[22px] text-[#1F1F1F]">구매 내역</h1>
        <div className="w-5" />
      </div>


      {/* 드롭다운 */}
      <div className="flex justify-end  relative z-10">
        {/* 드롭다운 전체 박스 */}
        <div
          className="absolute text-[14px] w-full max-w-[108px] right-4 z-20 inline-flex flex-col items-center border border-[#C7D5FF] rounded-[8px] bg-white shadow-md"
          style={{ padding: '6px 9px 6px 9px', gap: '17px', backgroundColor: '#FFF' }}
        >


          {/* 항상 보여지는 버튼 */}
          <div
            className="flex items-center gap-1 cursor-pointer text-[#6282E1]"
            onClick={() => setOpen(!open)}
          >
            <span className="text-sm">{selected}</span>
            <img
              src={open ? UpIcon : DownIcon}
              alt="화살표"
              className=" w-[20px] h-[20px]"
            />
          </div>

          {/* 펼쳤을 때만 보이는 옵션들 */}
          {open &&
            filters
              .filter(label => label !== selected)
              .map(label => (
                <div
                  key={label}
                  onClick={() => {
                    setSelected(label);
                    setOpen(false);
                  }}
                  className="text-sm text-[#6282E1] cursor-pointer"
                >
                  {label}
                </div>
              ))}
        </div>
      </div>


      {/* 리스트 렌더링 */}
      <div className="px-4 mt-[61px] space-y-[8px]">
  {filteredHistory.map((item, index) => (
    <div
      key={index}
      className={`pb-2 ${index !== filteredHistory.length - 1 ? 'border-b border-[#E1E1E1]' : ''}`}
    >
              {/* 첫 줄: 날짜 + 수단 | 금액 */}
<div className="flex justify-between items-center text-xs text-[#B7B7B7] font-pretendard font-bold mt-[20px]">
          <span>{item.date}</span>
          {item.label && item.amount && (
            <span className="text-[#6C6C6C] text-[12px] font-pretendard font-bold">
              <span>{item.label}</span>
              <span className="mx-[4px] text-[#E1E1E1]">|</span>
              <span>{item.amount}</span>
            </span>
          )}
        </div>


              {/* 둘째 줄: 몽코인 + 값 */}
              <div className="flex justify-between mt-[8px] mb-[10px] items-center">
                <span className="text-[20px] font-pretendard font-bold text-[#1F1F1F]"style={{ fontWeight: 700 }}
>{item.desc}</span>
                <span
                  className={`text-[24px] font-pretendard font-bold ${
                    item.value?.startsWith('-')
                      ? 'text-[#1F1F1F]'
                      : 'text-[#6282E1]'
                  }`}
                style={{ fontWeight: 700 }}
>
                  {item.value}
                </span>
              </div>
            </div>

            
          ))}
      </div>
<div className="w-[350px] h-0 border-t border-[#E1E1E1] mt-[16.5px] mb-[16.5px]" />

    </div>
  );
}
