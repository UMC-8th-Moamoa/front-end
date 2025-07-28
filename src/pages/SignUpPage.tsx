import React, { useState } from "react";
import BackButton from "../components/common/BackButton";
import InputBox from "../components/common/InputBox";
import Button from "../components/common/Button";
import InputWithButton from "../components/signUp/InputWithButton";
import VisibilityToggle from "../components/common/VisibilityToggle";
import EmailInputWithSelect from "../components/signUp/EmailInputWithSelect";
import TermsAgreement from "../components/signUp/TermsAgreement";
import Modal from "../components/common/Modal";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const [id, setId] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showAuthInput, setShowAuthInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleCheckDuplicate = () => {
    setIsChecked(true);
    if (id === "moa123") {
        setIsDuplicate(true);
    } else {
        setIsDuplicate(false);
    }
    };

  const handleSubmit = () => {
    // 유효성 검사 후 다음 페이지로 이동
    if (pw !== confirmPw) {
      setErrors({ confirmPw: "비밀번호가 일치하지 않습니다." });
      return;
    }
    // 그 외 로직
    navigate("/next-step");
  };


const [terms, setTerms] = useState({
  service: false,
  privacy: false,
  marketing: false,
});

  return (
    <div className="relative min-h-screen max-w-[393px] mx-auto px-4 pt-10 pb-10 flex flex-col items-center justify-between overflow-auto hide-scrollbar">
      <div className="w-full flex flex-col items-center">
        <div className="absolute top-6 left-0 z-10">
        <BackButton />
      </div>
        <img src="/moaLogo.svg" alt="moa logo" className="w-40 h-20 mb-4" />

        {/* 아이디 + 중복확인 */}
        <InputWithButton
            value={id}
            onChange={(e) => {
                setId(e.target.value);
                setIsChecked(false); // 입력 변경 시 중복확인 상태 초기화
            }}
            onClickButton={handleCheckDuplicate}
            placeholder="아이디"
            buttonText="중복확인"
            error={
                isChecked && isDuplicate
                ? "중복되는 아이디입니다"
                : ""
            }
            />

        {/* 비밀번호 */}
        <div className="relative mb-3 w-full max-w-[350px] mx-auto">
        <InputBox
            type={visible ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            error={
                pw && pw.length < 8
                ? "숫자, 문자, 특수문자 포함 8자 이상"
                : ""
            }
            className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <VisibilityToggle onToggle={setVisible} />
        </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="relative mb-3 w-full max-w-[350px] mx-auto">
        <InputBox
            type={visibleConfirm ? 'text' : 'password'}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="비밀번호 확인"
            error={confirmPw && pw !== confirmPw ? '비밀번호가 일치하지 않습니다.' : ''}
            className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <VisibilityToggle onToggle={setVisibleConfirm} />
        </div>
        </div>

        {/* 전화번호 */}
        <InputBox
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="전화번호(-없이 입력)"
          className="mb-3"
        />

        {/* 이메일 + 인증 */}
        <EmailInputWithSelect
            email={email}
            onChangeEmail={(e) => setEmail(e.target.value)}
            emailDomain={emailDomain}
            onChangeEmailDomain={(e) => setEmailDomain(e.target.value)}
            onClickVerify={() => {
                // 인증 로직
            setShowAuthInput(true);
            }}
            />

        {/* 인증 코드 입력 */}
        {showAuthInput && (
        <InputWithButton
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value)}
          onClickButton={() => {
            // 인증 코드 재전송 로직
            setShowModal(true);
          }}
          placeholder="본인인증 번호 입력"
          buttonText="다시 보내기"
          disabled={!authCode}
          className="mb-4"
        />
      )}

      {showModal && (
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <p className="text-[#1F1F1F]">인증번호를 다시 전송했습니다</p>
        <Button
          variant="primary"
          size="md"
          width="fit"
          onClick={() => setShowModal(false)}
          className="mt-5 bg-[#8f8f8f] px-10"
        >
          확인
        </Button>
      </Modal>
    )}

        <div className="text-xs text-[#B7B7B7] mt-1 mb-4">
        <p>• 앱의 모든 기능을 원활하게 사용하기 위해서 정확한 정보를 입력해야 합니다</p>
        <p>• 본인확인 및 보안을 위한 정보이며, 다른 용도로 사용되지 않습니다</p>
        </div>

        {/* 약관 동의 */}
       <TermsAgreement value={terms} onChange={setTerms} />


        {/* 다음 버튼 */}
        <Button variant="primary" fontSize="xl" onClick={handleSubmit} className="w-full">
          다음
        </Button>
      </div>
    </div>
  );
}

export default SignUpPage;