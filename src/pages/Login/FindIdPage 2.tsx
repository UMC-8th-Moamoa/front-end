import React, { useState } from "react";
import Button from "../../components/common/Button";
import InputBox from "../../components/common/InputBox";
import BackButton from "../../components/common/BackButton";
import { Link, useNavigate } from "react-router-dom";
import { findUserId } from "../../api/auth";

function FindIdPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const value = email.trim();
    if (!value) {
      alert("이메일을 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);
      setStatus("idle");
      setServerMsg("");

      const res = await findUserId(value);

      if (res.resultType === "SUCCESS") {
        setStatus("success");
        setServerMsg(res.success?.message || "아이디 찾기가 완료되었습니다.");
      } else {
        setStatus("error");
        setServerMsg(res.error?.reason || "가입 이력이 없거나 정보가 일치하지 않습니다.");
      }
    } catch (e: any) {
      setStatus("error");
      setServerMsg(
        e?.response?.data?.error?.reason ||
          e?.message ||
          "서버 오류로 아이디 찾기에 실패했습니다."
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen max-w-[393px] mx-auto px-4 pt-20 pb-10 flex flex-col items-center justify-between">
      {/* 상단: 뒤로가기 & 로고 */}
      <div className="w-full flex flex-col items-center">
        <div className="absolute top-6 left-0 z-10">
          <BackButton />
        </div>

        <img
          src="/assets/MoamoaLogo.svg"
          alt="moa logo"
          className="w-40 h-20 mb-2 mt-10"
        />
        <h1 className="text-xl text-[#6282E1] font-semibold mb-25">아이디 찾기</h1>

        {status === "success" ? (
          <>
            <p className="text-sm text-center mt-8 mb-15">
              {serverMsg || "회원님의 이메일로 아이디를 전송했습니다"}
            </p>
            <Button
              variant="primary"
              fontSize="xl"
              onClick={() => navigate("/login")}
            >
              로그인하러 가기
            </Button>
          </>
        ) : (
          <>
            <div className="h-5 mb-1 w-full text-left text-sm text-red-500">
              {status === "error" ? `* ${serverMsg}` : <>&nbsp;</>}
            </div>

            <InputBox
              type="email"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) handleSubmit();
              }}
              className={`mb-4 ${
                status === "error"
                  ? "border border-red-500 text-black"
                  : "text-black"
              }`}
              hasBorder={false}
            />

            <Button
              variant="primary"
              fontSize="xl"
              width="full"
              disabled={loading || !email.trim()}
              onClick={handleSubmit}
            >
              {loading ? "확인 중..." : "확인"}
            </Button>
          </>
        )}
      </div>

      {/* 하단 */}
      <div className="flex justify-center items-center text-xs text-[#6282E1] mb-55">
        <Link to="/find-id">
          <Button
            variant="text"
            size="sm"
            fontSize="sm"
            fontWeight="medium"
            width="fit"
            className="text-[#6282E1]"
          >
            아이디 찾기
          </Button>
        </Link>

        <span>|</span>

        <Link to="/reset-password">
          <Button
            variant="text"
            size="sm"
            fontSize="sm"
            fontWeight="medium"
            width="fit"
            className="text-[#6282E1]"
          >
            비밀번호 변경
          </Button>
        </Link>

        <span>|</span>

        <Link to="/signup">
          <Button
            variant="text"
            size="sm"
            fontSize="sm"
            fontWeight="medium"
            width="fit"
            className="text-[#6282E1]"
          >
            회원가입
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default FindIdPage;