// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import BackButton from "../components/common/BackButton";
import InputBox from "../components/common/InputBox";
import Button from "../components/common/Button";
import InputWithButton from "../components/signUp/InputWithButton";
import VisibilityToggle from "../components/common/VisibilityToggle";
import EmailInputWithSelect from "../components/signUp/EmailInputWithSelect";
import TermsAgreement from "../components/signUp/TermsAgreement";
import { Modal } from "../components/common/Modal";
import { useNavigate } from "react-router-dom";
import {
  registerUser,
  checkNicknameDuplicate,
  sendEmailCode,
  verifyEmailCode,
} from "../api/auth";

function SignUpPage() {
  const [nickname, setNickname] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  const [phone, setPhone] = useState("");
  const [emailId, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("@gmail.com");

  const [authCode, setAuthCode] = useState("");
  const [showAuthInput, setShowAuthInput] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [terms, setTerms] = useState({ service: false, privacy: false, marketing: false });

  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const navigate = useNavigate();

  // 닉네임 중복확인
  const handleCheckDuplicate = async () => {
    try {
      const res = await checkNicknameDuplicate(nickname);
      const isAvailable = res.success?.available;

      setIsDuplicate(!isAvailable);
      setIsChecked(true);

      if (isAvailable) {
        alert("사용 가능한 닉네임입니다.");
      } else {
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (e) {
      alert("닉네임 중복 확인 중 오류가 발생했습니다.");
      console.error(e);
    }
  };

  // 이메일 인증코드 전송
  const handleSendAuthCode = async () => {
  const fullEmail = `${emailId}${emailDomain}`;
  try {
    const res = await sendEmailCode(fullEmail, 'signup');
    if (res.resultType === 'SUCCESS') {
      alert(res.success.message);
      setShowAuthInput(true);
    } else {
      alert(res.error?.message || '인증코드 전송 실패');
    }
  } catch (err) {
    console.error(err);
    alert('서버 오류로 인증코드 전송에 실패했습니다.');
  }
};

  // 인증코드 확인
  const handleVerifyCode = async () => {
    const fullEmail = `${emailId}${emailDomain}`;
    if (!authCode) {
      alert("인증코드를 입력해 주세요.");
      return;
    }
    try {
      setVerifyingCode(true);
      const res = await verifyEmailCode(fullEmail, authCode, 'signup');
      if (res.resultType === "SUCCESS") {
        alert(res.success?.message ?? "이메일 인증이 완료되었습니다.");
        setShowModal(true);
      } else {
        const msg = res.error?.reason ?? (res as any).error?.message ?? "인증 실패. 코드를 확인해 주세요.";
        alert(msg);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류로 인증에 실패했습니다.");
    } finally {
      setVerifyingCode(false);
    }
  };

  // 다음(회원가입 진행)
  const handleSubmit = async () => {
    if (pw !== confirmPw) {
      setErrors({ confirmPw: "비밀번호가 일치하지 않습니다." });
      return;
    }
    const fullEmail = `${emailId}${emailDomain}`;
    try {
      const res = await registerUser({
        email: fullEmail,
        password: pw,
        name: "", // 다음 페이지에서 입력
        phone,
        birthday: "", // 다음 페이지에서 입력
      });

      if (res.resultType === "SUCCESS") {
        navigate("/signup/name");
      } else {
        const msg = res.error?.reason ?? (res as any).error?.message ?? "회원가입 실패";
        alert(msg);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류로 회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="relative min-h-screen max-w-[393px] mx-auto px-4 pt-10 pb-10 flex flex-col items-center justify-between overflow-auto hide-scrollbar">
      <div className="w-full flex flex-col items-center">
        <div className="absolute top-6 left-0 z-10">
          <BackButton />
        </div>

        <img src="/assets/MoamoaLogo.svg" alt="moa logo" className="w-40 h-20 mb-4" />

        {/* 아이디 + 중복확인 */}
        <InputWithButton
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setIsChecked(false);
            setErrors((prev) => ({ ...prev, id: "" }));
          }}
          onClickButton={handleCheckDuplicate}
          placeholder="아이디"
          buttonText="중복확인"
          error={errors.id}
        />

        {/* 비밀번호 */}
        <div className="mb-3 w-full max-w-[350px] mx-auto">
          <div className="relative flex items-center">
            <InputBox
              type={visible ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호"
              hasBorder={false}
              error={pw && pw.length < 8 ? "숫자, 문자, 특수문자 포함 8자 이상" : ""}
              className="pr-10"
            />
            <div className="absolute right-3">
              <VisibilityToggle onToggle={setVisible} />
            </div>
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-3 w-full max-w-[350px] mx-auto">
          <div className="relative flex items-center">
            <InputBox
              type={visibleConfirm ? "text" : "password"}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="비밀번호 확인"
              hasBorder={false}
              error={confirmPw && pw !== confirmPw ? "비밀번호가 일치하지 않습니다." : ""}
              className="pr-10"
            />
            <div className="absolute right-3">
              <VisibilityToggle onToggle={setVisibleConfirm} />
            </div>
          </div>
        </div>

        {/* 전화번호 */}
        <InputBox
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="전화번호(-없이 입력)"
          className="mb-3"
          hasBorder={false}
        />

        {/* 이메일 입력 + 인증 */}
        <EmailInputWithSelect
          emailId={emailId}
          onChangeEmailId={(e) => setEmail(e.target.value)}
          emailDomain={emailDomain}
          onChangeEmailDomain={(e) => setEmailDomain(e.target.value)}
          onClickVerify={handleSendAuthCode}
        />

        {/* 인증 코드 입력 */}
        {showAuthInput && (
          <InputWithButton
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            onClickButton={handleVerifyCode}
            placeholder="본인인증 번호 입력"
            buttonText={verifyingCode ? "확인 중..." : "인증하기"}
            disabled={!authCode || verifyingCode}
            className="mb-4"
          />
        )}

        {/* 인증 성공 모달 */}
        {showModal && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <p className="text-[#1F1F1F]">이메일 인증이 완료되었습니다</p>
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

        <TermsAgreement value={terms} onChange={setTerms} />

        <Button variant="primary" fontSize="xl" onClick={handleSubmit} className="w-full">
          다음
        </Button>
      </div>
    </div>
  );
}

export default SignUpPage;