import React, { useState } from 'react';
import Button from '../components/common/Button';
import BirthdayPicker from '../components/signUp/BirthdayPicker';
import { useNavigate } from 'react-router-dom';

const SignupBirthdayPage = () => {
  const [year, setYear] = useState('2000');
  const [month, setMonth] = useState('01');
  const [day, setDay] = useState('01');
  const navigate = useNavigate();

  const handleNext = () => {
    if (!year || !month || !day) {
      alert("생년월일을 모두 입력해 주세요.");
      return;
    }
    navigate('/signup/success');
  };

  return (
    <div className="min-h-screen max-w-[393px] flex flex-col justify-center pt-20 px-4 bg-white">
     {/* 제목 */}
      <h1 className="mb-5">
        <span className="text-3xl font-bold">생일</span>
        <span className='text-3xl font-light'>을 입력해 주세요</span>
      </h1>
      <p className="text-lg text-gray-500 mb-10">
        이 정보는 추후에 수정이 불가능합니다<br />정확한 정보를 입력해 주세요
      </p>
      <BirthdayPicker
        year={year}
        month={month}
        day={day}
        onChangeYear={setYear}
        onChangeMonth={setMonth}
        onChangeDay={setDay}
        
      />

      <Button variant="primary" size="medium" width="full" className="mt-8" onClick={handleNext}>
        확인
      </Button>
    </div>
  );
};

export default SignupBirthdayPage;