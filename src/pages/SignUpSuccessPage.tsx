import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

const SignUpSuccessPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-white px-4">
      <div className="absolute top-6 left-0 z-10">
        <BackButton />
      </div>
     <h1 className="mb-7 mx-3">
        <span className="text-3xl text-[#6282E1] font-bold">금채원님</span>
        <span className='text-3xl font-base'>의  <br/>가입을 축하합니다!</span>
      </h1>
      <p className="text-xl font- text-gray-500 mb-30 mx-3">
        마음을 모아, 기쁨을 나눠봐요!
      </p>
      <Button variant="primary" size="md" width="full" onClick={() => window.location.href = '/home'}>
        시작하기
      </Button>
    </div>
  );
};

export default SignUpSuccessPage;