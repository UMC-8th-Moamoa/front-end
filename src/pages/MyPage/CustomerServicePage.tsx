import React, { useState } from 'react';
import CustomerCard from '../../components/mypage/CustomerCard';
import TopBar from '../../components/common/TopBar';
import BottomNavigation from '../../components/common/BottomNavigation';
import BackButton from '../../components/common/BackButton';
import Modal from '../../components/common/Modal';
import InputBox from '../../components/common/InputBox';
import { useNavigate } from 'react-router-dom';
import Plus from '../../assets/Plus.svg';


const inquiries = [
  {
    id: 1,
    title: '비밀글입니다',
    content: '잠김',
    date: '2025.04.06',
    username: '아이디',
    isLocked: true,
    status: '접수 완료',
  },
  {
    id: 2,
    title: '비밀글입니다',
    content: '잠김',
    date: '2025.04.06',
    username: '아이디',
    isLocked: true,
    status: '답변 보기',
  },
  {
    id: 3,
    title: '제목',
    content: '내용',
    date: '2025.04.01',
    username: '아이디',
    isLocked: false,
    status: '접수 완료',
  },
  {
    id: 4,
    title: '제목',
    content: '내용',
    date: '2025.04.01',
    username: '아이디',
    isLocked: false,
    status: '답변 보기',
  },
];

export default function CustomerServicePage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<'shopping' | 'heart' | 'home' | 'letter' | 'mypage'>('mypage');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCardClick = (item: typeof inquiries[0]) => {
    if (item.isLocked && item.status === '답변 보기') {
      setSelectedId(item.id);
      setIsModalOpen(true);
    } else {
      navigate(`/mypage/customer-service/${item.id}`);
    }
  };

  return (
    <div className="flex flex-col bg-white max-w-[393px] mx-auto text-black pb-[80px] relative">
      <TopBar />
      <div className="flex items-center mb-6 ml-5">
        <BackButton />
        <span className="text-lg font-bold ml-3">고객센터</span>
      </div>

      <div className="flex flex-col gap-4 px-5">
        {inquiries.map((item) => (
          <CustomerCard
            key={item.id}
            title={item.title}
            content={item.content}
            date={item.date}
            status={item.status as '접수 완료' | '답변 보기'}
            isLocked={item.isLocked}
            username={item.username}
            onClick={() => handleCardClick(item)}
          />
        ))}
      </div>

      <div className="flex justify-center my-6">
        <div className="flex space-x-2 text-sm">
          {[1, 2, 3, 4, 5].map((page) => (
            <button key={page} className="w-6 h-6 rounded-full text-center hover:font-bold">{page}</button>
          ))}
        </div>
      </div>

{/* floating plus 버튼 */}
<button
  onClick={() => navigate('/mypage/customer-service/write')}
  className="w-[70px] h-[70px] bg-[#8F8F8F] rounded-full shadow-md flex items-center justify-center 
             absolute right-5 bottom-20 z-10"
>
  <img src={Plus} alt="문의하기" className="w-[30px] h-[30px]" />
</button>


      <BottomNavigation
        active={activeMenu}
        onNavigate={(menu) => {
          setActiveMenu(menu);
          switch (menu) {
            case 'home':
              navigate('/home');
              break;
            case 'shopping':
              navigate('/shop');
              break;
            case 'heart':
              navigate('/likes');
              break;
            case 'letter':
              navigate('/letters');
              break;
            case 'mypage':
              navigate('/mypage');
              break;
          }
        }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-3 w-full px-5">
          <p className="text-center text-sm font-semibold">잠겨있는 비밀글입니다</p>
          <InputBox
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-around mt-1">
            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 text-sm">취소</button>
            <button
              className="text-black text-sm font-bold"
              onClick={() => {
                // 비밀번호 검증 로직 필요시 여기에 추가
                setIsModalOpen(false);
                navigate(`/mypage/customer-service/${selectedId}`);
              }}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}