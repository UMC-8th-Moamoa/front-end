import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InputBox from '../../components/common/InputBox';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

type PrevState = {
  email: string;
  password: string;
  phone: string;
  nickname: string;
};

const SignupNamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prev = (location.state || {}) as Partial<PrevState>;

  // prev가 없으면 첫 단계로 되돌리기
  const isMissingPrev = useMemo(
    () => !(prev.email && prev.password && prev.phone && prev.nickname),
    [prev]
  );

  const [name, setName] = useState('');

  const handleNext = () => {
    if (!name.trim()) return;
    // 다음 페이지로 이전 단계 값 + name 함께 전달
    navigate('/signup/birthday', {
      state: {
        ...prev,
        name: name.trim(),
      },
    });
  };

  if (isMissingPrev) {
    // 직접 진입 방지: 필요시 토스트/알림 추가 가능
    navigate('/signup');
    return null;
  }

  return (
    <div className="relative min-h-screen max-w-[393px] px-6 pb-6 flex flex-col justify-center">
      <div className="absolute top-6 left-0 z-10">
        <BackButton />
      </div>

      <h1 className="mb-5">
        <span className="text-3xl text-[#6282E1] font-bold">이름</span>
        <span className="text-3xl font-base">을 입력해 주세요</span>
      </h1>

      <p className="text-lg text-[#6C6C6C] mb-20">
        친구들이 본명으로 회원님을 찾을 수 있게
        <br />
        정확한 정보를 입력해 주세요
      </p>

      <InputBox
        placeholder="본명을 입력해 주세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        hasBorder={false}
        className="bg-[#E7EDFF] text-[#1F1F1F] mb-3"
      />

      <Button onClick={handleNext} disabled={!name.trim()} variant="primary" size="md">
        확인
      </Button>
    </div>
  );
};

export default SignupNamePage;