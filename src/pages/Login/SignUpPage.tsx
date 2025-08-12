// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import BackButton from "../../components/common/BackButton";
import InputBox from "../../components/common/InputBox";
import Button from "../../components/common/Button";
import InputWithButton from "../../components/signUp/InputWithButton";
import VisibilityToggle from "../../components/common/VisibilityToggle";
import EmailInputWithSelect from "../../components/signUp/EmailInputWithSelect";
import TermsAgreement from "../../components/signUp/TermsAgreement";
import { Modal } from "../../components/common/Modal";
import { useNavigate } from "react-router-dom";
import { checkNicknameDuplicate, sendEmailCode, verifyEmailCode } from "../../api/auth";

// 숫자만 남기기
const onlyDigits = (v: string) => v.replace(/\D/g, "");

// 010-0000-0000 형태로 포맷
function formatPhone(input: string) {
  const d = onlyDigits(input).slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
}

// 서버 요구 포맷 검증 (010-0000-0000)
function isValidPhoneDash(v: string) {
  return /^010-\d{4}-\d{4}$/.test(v);
}

// 아이디 허용 문자 & 길이
const sanitizeUserId = (v: string) => v.replace(/[^\w]/g, "").slice(0, 50); // \w = [A-Za-z0-9_]
const isValidUserId = (v: string) => /^[A-Za-z0-9_]{4,50}$/.test(v);

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
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [terms, setTerms] = useState({ service: false, privacy: false, marketing: false });

  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const navigate = useNavigate();

  // 닉네임 입력 핸들러: 허용문자만 남기고 자동 정리
  const onChangeNickname: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const cleaned = sanitizeUserId(e.target.value);
    setNickname(cleaned);
    setIsChecked(false);
    setIsDuplicate(false);
    setErrors((prev) => ({ ...prev, id: "" }));
  };

  // 닉네임 중복확인
  const abortRef = React.useRef<AbortController | null>(null);

const handleCheckDuplicate = async () => {
  const id = sanitizeUserId(nickname.trim()); // 서버에 보낼 최종 문자열
  if (!isValidUserId(id)) {
    alert('아이디는 4~50자의 영문/숫자/언더스코어만 가능합니다.');
    return;
  }

  // 이전 요청 취소
  abortRef.current?.abort();
  const ctrl = new AbortController();
  abortRef.current = ctrl;

  // 이 버튼을 눌렀을 때의 아이디(스냅샷)
  const queriedId = id;

  try {
    const res = await checkNicknameDuplicate(queriedId, ctrl.signal);

    // 응답이 왔을 때 입력값이 바뀌었으면 무시
    if (sanitizeUserId(nickname.trim()) !== queriedId) return;

    const isAvailable = res.success?.available === true;
    setIsDuplicate(!isAvailable);
    setIsChecked(true);
    alert(isAvailable ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.');
  } catch (e: any) {
    if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return;
    console.error(e);
    alert('닉네임 중복 확인 중 오류가 발생했습니다.');
  }
};

  // 이메일 인증코드 전송
  const handleSendAuthCode = async () => {
    const fullEmail = `${emailId}${emailDomain}`;
    if (!emailId.trim()) {
      alert("이메일을 입력해 주세요.");
      return;
    }
    try {
      setSendingEmail(true);
      const res = await sendEmailCode(fullEmail, "signup");
      console.log('sendEmailCode returned:', res);

      // 상태코드별 UX
      if (res.resultType === 'SUCCESS') {
        alert(res.success?.message || '인증코드를 전송했습니다.');
        setShowAuthInput(true);
        setIsEmailVerified(false);
      } else {
        // 서버가 FAIL일 때만 여기로
        alert(res.error?.reason || '인증코드 전송 실패');
      }
    } catch (e: any) {
      const msg = e?.response?.data?.error?.reason || e.message || "서버 오류로 전송 실패";
      console.error(e);
      alert(msg);
    } finally {
      setSendingEmail(false);
    }
  };

  // 인증코드 확인 (쿠키에 담긴 토큰으로 검증)
  const handleVerifyCode = async () => {
    const fullEmail = `${emailId}${emailDomain}`;
    if (!authCode.trim()) {
      alert("인증코드를 입력해 주세요.");
      return;
    }
    try {
      setVerifyingCode(true);
      const res = await verifyEmailCode(fullEmail, authCode.trim(), "signup");
      if (res.resultType === "SUCCESS") {
        setIsEmailVerified(true);
        setShowModal(true);
      } else {
        alert(res.error?.reason || "인증 실패. 코드를 확인해 주세요.");
        setIsEmailVerified(false);
      }
    } catch (e: any) {
      const msg = e?.response?.data?.error?.reason || e.message || "서버 오류로 인증 실패";
      console.error(e);
      alert(msg);
      setIsEmailVerified(false);
    } finally {
      setVerifyingCode(false);
    }
  };

  // 다음 스텝으로 이동 (회원가입 API는 다음 페이지에서)
  const handleNext = () => {
    const id = nickname; // sanitize 되어 있음

    if (!isValidUserId(id)) return alert("아이디는 4~50자의 영문/숫자/언더스코어만 가능합니다.");
    if (!isChecked) return alert("아이디 중복확인을 해주세요.");
    if (isDuplicate) return alert("이미 사용 중인 아이디입니다.");

    if (!pw || pw.length < 8) return alert("비밀번호는 8자 이상으로 입력해 주세요.");
    if (pw !== confirmPw) return alert("비밀번호가 일치하지 않습니다.");

    if (!emailId.trim()) return alert("이메일을 입력해 주세요.");
    if (!isEmailVerified) return alert("이메일 본인인증을 완료해 주세요.");

    const phoneFormatted = formatPhone(phone);
    if (!isValidPhoneDash(phoneFormatted)) {
      return alert("휴대폰 번호를 010-0000-0000 형식으로 입력해 주세요.");
    }

    const fullEmail = `${emailId}${emailDomain}`;

    navigate("/signup/name", {
      state: {
        email: fullEmail,
        password: pw,
        phone: phoneFormatted,
        nickname: id,
      },
    });
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
          onChange={onChangeNickname}
          onClickButton={handleCheckDuplicate}
          placeholder="아이디 (영문/숫자/_ 4~50자)"
          buttonText={isChecked ? "다시확인" : "중복확인"}
          error={
            nickname && !isValidUserId(nickname)
              ? "영문/숫자/언더스코어만 가능, 4~50자"
              : errors.id
          }
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

        {/* 전화번호 (자동 포맷) */}
        <InputBox
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="전화번호"
          className="mb-3"
          hasBorder={false}
        />

        {/* 이메일 입력 + 인증 */}
        <EmailInputWithSelect
          emailId={emailId}
          onChangeEmailId={(e) => {
            setEmail(e.target.value);
            setIsEmailVerified(false);
          }}
          emailDomain={emailDomain}
          onChangeEmailDomain={(e) => {
            setEmailDomain(e.target.value);
            setIsEmailVerified(false);
          }}
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

        <Button
          variant="primary"
          fontSize="xl"
          onClick={handleNext}
          className="w-full"
          disabled={sendingEmail || verifyingCode}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default SignUpPage;