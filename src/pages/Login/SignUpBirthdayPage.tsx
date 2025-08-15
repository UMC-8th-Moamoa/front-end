import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import BirthdayPicker from '../../components/signUp/BirthdayPicker';
import BackButton from '../../components/common/BackButton';
import { registerUser } from '../../api/auth';

type PrevState = {
  email: string;
  password: string;
  phone: string;
  nickname: string;
  name: string;
};

const SignupBirthdayPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prev = (location.state || {}) as Partial<PrevState>;

  const isMissingPrev = useMemo(
    () => !(prev.email && prev.password && prev.phone && prev.nickname && prev.name),
    [prev]
  );

  const [year, setYear] = useState('2000');
  const [month, setMonth] = useState('01');
  const [day, setDay] = useState('01');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const birthday = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    try {
      setLoading(true);
      const res = await registerUser({
        email: prev.email!,        
        password: prev.password!,  
        name: prev.name!,         
        phone: prev.phone!,       
        birthday,                 
        nickname: prev.nickname!, 
        user_id: prev.nickname!,
      });

      if (res.resultType === 'SUCCESS') {
        navigate('/signup/success', {
          replace: true,
          state: { name: prev.name!, user_id: prev.nickname! },
        });
      } else {
        const msg = res.error?.reason ?? '회원가입에 실패했습니다.';
        alert(msg);
      }
    } catch (e) {
      console.error(e);
      alert('서버 오류로 회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (isMissingPrev) {
    navigate('/signup', { replace: true });
    return null;
  }

  return (
    <div className="relative min-h-screen max-w-[393px] flex flex-col justify-center px-4 bg-white">
      <div className="absolute top-6 left-0 z-10">
        <BackButton />
      </div>

      <h1 className="mb-5">
        <span className="text-3xl text-[#6282E1] font-bold">생일</span>
        <span className="text-3xl font-base">을 입력해 주세요</span>
      </h1>

      <p className="text-lg text-gray-500 mb-10">
        이 정보는 추후에 수정이 불가능합니다
        <br />
        정확한 정보를 입력해 주세요
      </p>

      <BirthdayPicker
        year={year}
        month={month}
        day={day}
        onChangeYear={setYear}
        onChangeMonth={(m) => setMonth(m.padStart(2, '0'))}
        onChangeDay={(d) => setDay(d.padStart(2, '0'))}
      />

      <Button
        variant="primary"
        size="md"
        width="full"
        className="mt-8"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? '처리 중…' : '확인'}
      </Button>
    </div>
  );
};

export default SignupBirthdayPage;