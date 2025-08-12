import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

type SuccessState = {
  name?: string;
  user_id?: string; // 로그인 아이디(선택) - 로그인 화면 프리필용
};

const SignUpSuccessPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: SuccessState | null };

  const displayName = (state?.name ?? '').trim() || '회원';

  const goLogin = () => {
    if (state?.user_id) {
      navigate('/login', { replace: true, state: { user_id: state.user_id } });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-white px-4">
      <h1 className="mb-7 mx-3 leading-tight">
        <span className="text-3xl text-[#6282E1] font-bold">{displayName}님</span>
        <span className="block text-3xl font-base">가입을 축하합니다!</span>
      </h1>

      <p className="text-xl text-gray-500 mb-10 mx-3">
        마음을 모아, 기쁨을 나눠봐요!
      </p>

      <Button variant="primary" size="md" width="full" onClick={goLogin}>
        시작하기
      </Button>
    </div>
  );
};

export default SignUpSuccessPage;