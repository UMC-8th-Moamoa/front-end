// // src/pages/ResetPasswordPage.tsx
// import React, { useEffect, useState } from "react";
// import Button from "../../components/common/Button";
// import InputBox from "../../components/common/InputBox";
// import BackButton from "../../components/common/BackButton";
// import VisibilityToggle from "../../components/common/VisibilityToggle";
// import { Link, useNavigate, useLocation } from "react-router-dom";

// function ResetPasswordPage() {
//   const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState(""); // 이메일 입력
//   const [code, setCode] = useState("");
//   const [newPw, setNewPw] = useState("");
//   const [confirmPw, setConfirmPw] = useState("");
//   const [resetToken, setResetToken] = useState(""); // ✅ 백엔드 토큰 저장
//   const [error, setError] = useState("");
//   const [visibleNewPw, setVisibleNewPw] = useState(false);
//   const [visibleConfirmPw, setVisibleConfirmPw] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ 이메일 링크(?token=...)로 복귀 시 자동 수집 → 3단계로 점프
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const t = params.get("token");
//     if (t) {
//       setResetToken(t);
//       setStep(3);
//     }
//   }, [location.search]);

//   // STEP 1: 재설정 코드(토큰) 전송
//   const handleStep1 = async () => {
//     const trimmedEmail = email.trim();
//     if (!name.trim() || !trimmedEmail) {
//       setError("* 이름과 이메일을 입력해 주세요");
//       return;
//     }

//     try {
//       setError("");
//       const res = await fetch("/api/auth/find-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: trimmedEmail, purpose: "reset" }),
//       });

//       const data = await res.json().catch(() => ({}));
//       const ok =
//         res.ok &&
//         (data?.resultType === "SUCCESS" ||
//           data?.success?.success === true ||
//           data?.success === true);

//       if (ok) {
//         setResetToken(""); // 메일 링크/코드 기반으로 2단계 진행
//         setStep(2);
//       } else {
//         const reason =
//           data?.error?.reason ||
//           data?.message ||
//           "인증코드 전송에 실패했습니다";
//         setError(`* ${reason}`);
//       }
//     } catch (e) {
//       console.error(e);
//       setError("* 서버 오류로 전송에 실패했습니다");
//     }
//   };

//   // STEP 2: 메일로 받은 코드 검증 (POST /api/auth/verify-reset-code, purpose=reset)
//   const handleStep2 = async () => {
//     const trimmedEmail = email.trim();
//     if (!code.trim()) {
//       setError("본인인증 번호(코드/토큰)를 입력해 주세요");
//       return;
//     }

//     try {
//       setError("");
//       const res = await fetch("/api/auth/verify-reset-code", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: trimmedEmail,
//           code: code.trim(),
//           purpose: "reset",
//         }),
//       });

//       const data = await res.json().catch(() => ({}));
//       const ok =
//         res.ok &&
//         (data?.resultType === "SUCCESS" ||
//           data?.success?.success === true ||
//           data?.success === true);

//       if (ok) {
//         // 서버가 토큰을 응답에 주면 사용, 없으면 입력한 code를 토큰으로 사용
//         const tokenFromApi =
//           data?.success?.token ||
//           data?.token ||
//           data?.success?.resetToken ||
//           "";
//         setResetToken(String(tokenFromApi || code.trim()));
//         setStep(3);
//       } else {
//         const reason =
//           data?.error?.reason ||
//           data?.message ||
//           "본인인증 번호가 일치하지 않습니다";
//         setError(reason);
//       }
//     } catch (e) {
//       console.error(e);
//       setError("서버 오류로 인증에 실패했습니다");
//     }
//   };

//   // STEP 3: 비밀번호 변경
//     const handleStep3 = async () => {
//     if (!newPw || !confirmPw) {
//       setError("• 비밀번호를 입력해 주세요");
//       return;
//     }
//     if (newPw.length < 8) {
//       setError("• 숫자, 문자, 특수문자 포함 8자 이상");
//       return;
//     }
//     if (newPw !== confirmPw) {
//       setError("• 비밀번호가 일치하지 않습니다");
//       return;
//     }
//     if (!resetToken) {
//       setError("• 토큰이 없습니다. 이메일 링크로 접속하거나 코드를 입력해 주세요");
//       return;
//     }

//     try {
//       setError("");
//       const res = await fetch("/api/auth/reset-password", {
//         method: "POST", // 스펙상 POST
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           token: resetToken,
//           newPassword: newPw,
//           confirmPassword: confirmPw,
//         }),
//       });

//       const data = await res.json().catch(() => ({}));
//       const ok =
//         res.ok &&
//         (data?.resultType === "SUCCESS" ||
//           data?.success?.success === true ||
//           data?.success === true);

//       if (ok) {
//         setStep(4);
//       } else {
//         const reason =
//           res?.error?.reason ||
//           res?.message ||
//           "비밀번호 변경에 실패했습니다";
//         setError(reason);
//       }
//     } catch (e: any) {
//       const msg =
//         e?.response?.data?.error?.reason ||
//         e?.message ||
//         "서버 오류로 비밀번호 변경에 실패했습니다";
//       console.error(e);
//       setError(msg);
//     }
//   };
//       if (ok) {
//         setStep(4);
//       } else {
//         const reason =
//           res?.error?.reason ||
//           res?.message ||
//           "비밀번호 변경에 실패했습니다";
//         setError(reason);
//       }
//     } catch (e: any) {
//       const msg =
//         e?.response?.data?.error?.reason ||
//         e?.message ||
//         "서버 오류로 비밀번호 변경에 실패했습니다";
//       console.error(e);
//       setError(msg);
//     }
//   };

//   return (
//     <div className="relative min-h-screen max-w-[393px] mx-auto px-4 pt-20 pb-10 flex flex-col items-center justify-between">
//       <div className="w-full flex flex-col items-center">
//         <div className="absolute top-6 left-0 z-10">
//           <BackButton />
//         </div>
//         <img src="/assets/MoamoaLogo.svg" alt="moa logo" className="w-40 h-20 mb-2 mt-10" />
//         <h1 className="text-xl text-[#6282E1] font-semibold mb-20">비밀번호 변경</h1>
//   return (
//     <div className="relative min-h-screen max-w-[393px] mx-auto px-4 pt-20 pb-10 flex flex-col items-center justify-between">
//       <div className="w-full flex flex-col items-center">
//         <div className="absolute top-6 left-0 z-10">
//           <BackButton />
//         </div>
//         <img src="/assets/MoamoaLogo.svg" alt="moa logo" className="w-40 h-20 mb-2 mt-10" />
//         <h1 className="text-xl text-[#6282E1] font-semibold mb-20">비밀번호 변경</h1>

//         {/* STEP 1 */}
//         {step === 1 && (
//           <>
//             <div className="h-5 mb-1 w-full text-left text-sm text-red-500">
//               {error ? error : <>&nbsp;</>}
//             </div>
//             <InputBox
//               type="text"
//               placeholder="이름을 입력해 주세요"
//               value={name}
//               hasBorder={false}
//               onChange={(e) => {
//                 setName(e.target.value);
//                 setError("");
//               }}
//               className="mb-2"
//             />
//             <InputBox
//               type="text"
//               placeholder="이메일을 입력해 주세요"
//               value={email}
//               hasBorder={false}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 setError("");
//               }}
//               className="mb-4"
//             />
//             <Button variant="primary" fontSize="xl" onClick={handleStep1} disabled={!name || !email}>
//               확인
//             </Button>
//             <div className="text-sm text-[#6282E1] mt-3 mb-4 text-start w-full">
//               <p>• 이메일로 비밀번호 재설정 링크/코드가 전송됩니다</p>
//             </div>
//           </>
//         )}

//         {/* STEP 2 */}
//         {step === 2 && (
//           <>
//             <div className="h-5 mb-1 w-full text-left text-sm text-red-500">
//               {error ? `• ${error}` : <>&nbsp;</>}
//             </div>
//         {/* STEP 2 */}
//         {step === 2 && (
//           <>
//             <div className="h-5 mb-1 w-full text-left text-sm text-red-500">
//               {error ? `• ${error}` : <>&nbsp;</>}
//             </div>

//             <div className="relative flex gap-2 mb-4 justify-center">
//               {/* 숨은 실제 입력 */}
//               <input
//                 type="text"
//                 inputMode="text"
//                 value={code}
//                 onChange={(e) => {
//                   const val = e.target.value.trim().slice(0, 100);
//                   setCode(val);
//                   setError("");
//                 }}
//                 className="absolute w-full h-full opacity-0 z-10"
//                 autoFocus
//               />

//               {/* UI는 6칸 프리뷰이지만 실제로는 더 길 수 있음 */}
//               {[...Array(6)].map((_, i) => (
//                 <div
//                   key={i}
//                   className={`
//                     w-12 h-15 flex items-center justify-center rounded-md text-3xl font-bold mb-1
//                     ${error ? 'text-red-500 bg-[#E7EDFF]' : 'text-black bg-[#E7EDFF]'}
//                   `}
//                 >
//                   {code[i] ?? ""}
//                 </div>
//               ))}
//             </div>

//             <Button variant="primary" fontSize="xl" onClick={handleStep2} disabled={!code}>
//               확인
//             </Button>

//             <div className="text-sm text-[#6282E1] mt-3 mb-4 text-start w-full">
//               • 이메일에 도착한 코드를 입력하세요
//             </div>
//           </>
//         )}

//         {/* STEP 3 */}
//         {step === 3 && (
//           <>
//             <div className="h-5 mb-1 w-full text-left text-sm text-red-500">
//               {error ? error : <>&nbsp;</>}
//             </div>
//             <div className="relative mb-2 w-full max-w-[350px] mx-auto">
//               <InputBox
//                 type={visibleNewPw ? 'text' : 'password'}
//                 placeholder="새로운 비밀번호를 입력해 주세요"
//                 hasBorder={false}
//                 value={newPw}
//                 onChange={(e) => {
//                   setNewPw(e.target.value);
//                   setError("");
//                 }}
//                 className="pr-10"
//               />
//               <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                 <VisibilityToggle onToggle={setVisibleNewPw} />
//               </div>
//             </div>
//         {/* STEP 3 */}
//         {step === 3 && (
//           <>
//             <div className="h-5 mb-1 w-full text-left text-sm text-red-500">
//               {error ? error : <>&nbsp;</>}
//             </div>
//             <div className="relative mb-2 w-full max-w-[350px] mx-auto">
//               <InputBox
//                 type={visibleNewPw ? 'text' : 'password'}
//                 placeholder="새로운 비밀번호를 입력해 주세요"
//                 hasBorder={false}
//                 value={newPw}
//                 onChange={(e) => {
//                   setNewPw(e.target.value);
//                   setError("");
//                 }}
//                 className="pr-10"
//               />
//               <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                 <VisibilityToggle onToggle={setVisibleNewPw} />
//               </div>
//             </div>

//             <div className="relative mb-4 w-full max-w-[350px] mx-auto">
//               <InputBox
//                 type={visibleConfirmPw ? 'text' : 'password'}
//                 placeholder="비밀번호를 다시 입력해 주세요"
//                 hasBorder={false}
//                 value={confirmPw}
//                 onChange={(e) => {
//                   setConfirmPw(e.target.value);
//                   setError("");
//                 }}
//                 className="pr-10"
//               />
//               <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                 <VisibilityToggle onToggle={setVisibleConfirmPw} />
//               </div>
//             </div>
//             <div className="relative mb-4 w-full max-w-[350px] mx-auto">
//               <InputBox
//                 type={visibleConfirmPw ? 'text' : 'password'}
//                 placeholder="비밀번호를 다시 입력해 주세요"
//                 hasBorder={false}
//                 value={confirmPw}
//                 onChange={(e) => {
//                   setConfirmPw(e.target.value);
//                   setError("");
//                 }}
//                 className="pr-10"
//               />
//               <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                 <VisibilityToggle onToggle={setVisibleConfirmPw} />
//               </div>
//             </div>

//             <Button variant="primary" fontSize="xl" onClick={handleStep3}>
//               확인
//             </Button>
//           </>
//         )}
//             <Button variant="primary" fontSize="xl" onClick={handleStep3}>
//               확인
//             </Button>
//           </>
//         )}

//         {/* STEP 4 */}
//         {step === 4 && (
//           <>
//             <p className="text-md text-center mt-8 mb-10">
//               비밀번호가 변경되었습니다<br />다시 로그인해 주세요
//             </p>
//             <Button variant="primary" fontSize="xl" onClick={() => navigate("/login")}>
//               로그인하러 가기
//             </Button>
//           </>
//         )}
//       </div>
//         {/* STEP 4 */}
//         {step === 4 && (
//           <>
//             <p className="text-md text-center mt-8 mb-10">
//               비밀번호가 변경되었습니다<br />다시 로그인해 주세요
//             </p>
//             <Button variant="primary" fontSize="xl" onClick={() => navigate("/login")}>
//               로그인하러 가기
//             </Button>
//           </>
//         )}
//       </div>

//       {/* 하단 */}
//       <div className="flex justify-center items-center text-xs text-[#6282E1] mb-55">
//         <Link to="/find-id">
//           <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="text-[#6282E1]">
//             아이디 찾기
//           </Button>
//         </Link>
//         <span>|</span>
//         <Link to="/reset-password">
//           <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="text-[#6282E1]">
//             비밀번호 변경
//           </Button>
//         </Link>
//         <span>|</span>
//         <Link to="/signup">
//           <Button variant="text" size="sm" fontSize="sm" fontWeight="medium" width="fit" className="text-[#6282E1]">
//             회원가입
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default ResetPasswordPage;
// export default ResetPasswordPage;