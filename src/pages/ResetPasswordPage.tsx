import React, { useState } from "react";
import Button from "../components/common/Button";
import InputBox from "../components/common/InputBox";
import BackButton from "../components/common/BackButton";
import VisibilityToggle from "../components/common/VisibilityToggle";
import { Link, useNavigate } from "react-router-dom";

function ResetPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [visibleNewPw, setVisibleNewPw] = useState(false);
  const [visibleConfirmPw, setVisibleConfirmPw] = useState(false);

  const navigate = useNavigate();

  const handleStep1 = () => {
    if (name === "금채원" && phone === "01011111111") {
      setStep(2);
      setError("");
    } else {
      setError("* 가입 이력이 없는 정보입니다");
    }
  };

  const handleStep2 = () => {
    if (code !== "11111") {
      setError("본인인증 번호가 일치하지 않습니다");
    } else {
      setError("");
      setStep(3);
    }
  };

  const handleStep3 = () => {
    if (!newPw || !confirmPw) {
      setError("• 비밀번호를 입력해 주세요");
    } else if (newPw.length < 6) {
      setError("• 숫자, 문자, 특수문자 포함 8자 이상");
    } else if (newPw !== confirmPw) {
      setError("• 비밀번호가 일치하지 않습니다");
    } else {
      setError("");
      setStep(4);
    }
  };

  return (
    <div className="relative min-h-screen max-w-[393px] mx-auto px-4 pt-20 pb-10 flex flex-col items-center justify-between">
      <div className="w-full flex flex-col items-center">
        <div className="absolute top-6 left-0 z-10">
          <BackButton />
        </div>
        <img src="/moaLogo.svg" alt="moa logo" className="w-40 h-20 mb-2 mt-10" />
        <h1 className="text-xl text-[#6282E1] font-semibold mb-20">비밀번호 변경</h1>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="h-5 mb-1 w-full text-left text-sm text-red-500">
              {error ? error : <>&nbsp;</>}
            </div>
            <InputBox
              type="text"
              placeholder="이름을 입력해 주세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="mb-2 bg-gray-200"
            />
            <InputBox
              type="text"
              placeholder="전화번호를 입력해 주세요"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
              className="mb-4 bg-gray-200"
            />
            <Button variant="primary" fontSize="xl" onClick={handleStep1} disabled={!name || !phone}>
              확인
            </Button>
            <div className="text-sm text-[#6282E1] mt-3 mb-4 text-start w-full">
              <p>• 이메일로 본인인증 번호가 전달됩니다</p>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="h-5 mb-1 w-full text-left text-sm text-red-500">
              {error ? `• ${error}` : <>&nbsp;</>}
            </div>

            <div className="relative flex gap-2 mb-4 justify-center">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                  setCode(val);
                  setError("");
                }}
                maxLength={5}
                className="absolute w-full h-full opacity-0 z-10"
                autoFocus
              />

              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-13 h-17 flex items-center justify-center rounded-md text-3xl font-bold mb-3
                    ${error ? 'text-red-500 bg-[#E7EDFF]' : 'text-black bg-[#E7EDFF]'}
                  `}
                >
                  {code[i] ?? ""}
                </div>
              ))}
            </div>

            <Button variant="primary" fontSize="xl" onClick={handleStep2} disabled={code.length !== 5}>
              확인
            </Button>

            <div className="text-sm text-[#6282E1] mt-3 mb-4 text-start w-full">
              • 이메일로 본인인증 번호가 전달됩니다
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="h-5 mb-1 w-full text-left text-sm text-red-500">
              {error ? error : <>&nbsp;</>}
            </div>
            <div className="relative mb-2 w-full max-w-[350px] mx-auto">
              <InputBox
                type={visibleNewPw ? 'text' : 'password'}
                placeholder="새로운 비밀번호를 입력해 주세요"
                value={newPw}
                onChange={(e) => {
                  setNewPw(e.target.value);
                  setError("");
                }}
                className="bg-gray-200 pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <VisibilityToggle onToggle={setVisibleNewPw} />
              </div>
            </div>

            <div className="relative mb-4 w-full max-w-[350px] mx-auto">
              <InputBox
                type={visibleConfirmPw ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력해 주세요"
                value={confirmPw}
                onChange={(e) => {
                  setConfirmPw(e.target.value);
                  setError("");
                }}
                className="bg-gray-200 pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <VisibilityToggle onToggle={setVisibleConfirmPw} />
              </div>
            </div>

            <Button variant="primary" fontSize="xl" onClick={handleStep3}>
              확인
            </Button>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <p className="text-md text-center mt-8 mb-10">
              비밀번호가 변경되었습니다<br />다시 로그인해 주세요
            </p>
            <Button variant="primary" fontSize="xl" onClick={() => navigate("/login")}>
              로그인하러 가기
            </Button>
          </>
        )}
      </div>

      {/* 하단 */}
      <div className="flex justify-center items-center text-xs text-[#6282E1] mb-55">
        <Link to="/find-id">
          <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="text-[#6282E1]">
          아이디 찾기
          </Button>
        </Link>

        <span>|</span>

        <Link to="/reset-password">
          <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="text-[#6282E1]">
            비밀번호 변경
          </Button>
        </Link>

        <span>|</span>

        <Link to="/signup">
          <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="text-[#6282E1]">
            회원가입
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordPage;