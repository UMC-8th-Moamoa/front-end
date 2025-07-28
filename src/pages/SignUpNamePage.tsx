import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputBox from '../components/common/InputBox';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

const SignupNamePage = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (name.trim()) {
      navigate('/signup/birthday', { state: { name } }); // 다음 페이지로 이름 전달
    }
  };

  return (
    
    <div className="relative min-h-screen max-w-[393px] px-6 pb-6 flex flex-col justify-center">
      {/* 뒤로가기 버튼 */}
        <div className="absolute top-6 left-0 z-10">
        <BackButton />
      </div>
      
      {/* 제목 */}
      <h1 className="mb-5">
        <span className="text-3xl text-[#6282E1] font-bold">이름</span>
        <span className='text-3xl font-base'>을 입력해 주세요</span>
      </h1>
      <p className="text-lg text-[#6C6C6C] mb-20">
        친구들이 본명으로 회원님을 찾을 수 있게<br />정확한 정보를 입력해 주세요
      </p>

      {/* 입력창 */}
      <InputBox
        placeholder="본명을 입력해 주세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-[#E7EDFF] text-[#97B1FF] mb-3"
      />

      {/* 확인 버튼 */}
      <Button
        onClick={handleNext}
        disabled={!name.trim()}
        variant="primary"
        size="md"
      >
        확인
      </Button>
    </div>
  );
};

export default SignupNamePage;