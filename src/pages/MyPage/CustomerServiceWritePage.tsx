import { useState } from 'react';
import BackIcon from '../../assets/backbutton.svg';
import { useNavigate } from 'react-router-dom';
import { fetchMyMerged, createCustomerInquiry } from "../../services/mypage";



export default function CustomerServiceWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async () => {
    if (!agreed) {
      alert("개인정보 수집·이용에 동의해야 문의를 등록할 수 있습니다.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // 현재 로그인 사용자 id 가져오기
      const my = await fetchMyMerged(""); // "" 대신 현재 로그인한 userId
      const res = await createCustomerInquiry({
        user_id: my.userId,
        title,
        content,
        private: true,
      });

      if (res.success) {
        alert("문의가 등록되었습니다.");
        navigate("/customer-service");
      } else {
        alert(res.message || "등록에 실패했습니다.");
      }
    } catch (err: any) {
      alert(err.message || "등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="relative flex flex-col items-center bg-white max-w-[393px] min-w-[350px] min-h-screen mx-auto text-black pb-[120px]">
      {/* 상단바 */}
    <div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[393px] h-[60px] flex items-center justify-center z-50 border-b border-[#EAEAEA]"
      style={{ backgroundColor: '#FFF' }}
    >
      {/* BackButton - 왼쪽 고정 */}
      <img
        src={BackIcon}
        alt="back"
        className="absolute left-[20px] cursor-pointer w-[40px] h-[40px]"
        onClick={() => window.history.back()}
      />
      {/* 중앙 고객센터 텍스트 */}
      <h1 className="text-center font-pretendard text-[18px] font-bold leading-[22px] text-[#1F1F1F]">
        문의하기
      </h1>
    </div>

    {/* 상단바 높이만큼 패딩 추가 */}
    <div className="h-[60px]" />


      {/* 입력 필드 */}
      <div className="w-[350px] flex flex-col gap-4 mt-6">
        <div>
          <label className="mt-[17px] block mb-[8px] text-[18px] font-bold font-pretendard text-[#1F1F1F]"style={{ fontWeight: 700 }}
>제목</label>
<input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="h-[50px] w-full border border-[#E1E1E1] rounded-[10px] pl-[15px] pr-[15px] 
             text-[18px] font-normal font-pretendard text-[#1F1F1F] leading-normal
             focus:outline-none focus:border-[#E1E1E1]"
/>

        </div>

        <div>
          <label className="mt-[14px] block mb-[8px] text-[18px] font-bold font-pretendard text-[#1F1F1F]"style={{ fontWeight: 700 }}
>내용</label>


<textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  className="w-[350px] h-[199px] border border-[#E1E1E1] rounded-[10px] pl-[15px]  pr-4 py-[16px]
             resize-none text-[18px] font-normal font-pretendard text-[#1F1F1F] leading-normal
             focus:outline-none focus:border-[#E1E1E1]"
/>

        </div>
      </div>

      {/* 개인정보 동의 */}
      <div className="w-[350px] flex flex-col gap-[4px] mt-6">
        <span className="mt-[18px] text-[#B7B7B7] text-[14px] font-bold font-pretendard leading-[22px]">
          ✱ 개인정보 수집 · 이용 동의
        </span>
        <p className="text-[#B7B7B7] text-[12px] leading-[20px] font-pretendard">
          고객님의 요청을 확인하고 정보 파악을 위해 이름, 이메일 주소, 연락처 등의 개인정보를 수집하는데 동의하십니까?<br />
          이용자는 개인정보 수집 및 이용에 동의하지 않을 권리가 있으며, 동의하지 않을 경우 문의 접수 및 답변이 제한될 수 있습니다.
        </p>
          {/* 체크 버튼 */}
 {/* 체크박스 */}
  <label className="flex items-center gap-2 mt-2 cursor-pointer">
    <input
      type="checkbox"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
      className="w-4 h-4 accent-[#6282E1] cursor-pointer"
    />
    <span className="text-[14px] font-pretendard text-[#B7B7B7]">
      동의합니다
    </span>
  </label>
      </div>

      {/* 하단 버튼 */}
      <div className="w-[350px] flex justify-between mt-[48px] mb-10">
        <button
          className="mt-[100px] flex w-[80px] h-[50px] justify-center items-center border border-[#6282E1] bg-white rounded-[10px] text-[#6282E1] text-[14px] font-bold font-pretendard"
          onClick={() => window.history.back()}
        >
          취소
        </button>

<button
  className="mt-[100px] ml-[10px] flex w-[260px] h-[50px] justify-center items-center bg-[#6282E1] rounded-[10px] text-[#FFFFFF] text-[18px] font-bold font-pretendard"
  onClick={handleSubmit}
>
  제출하기
</button>

      </div>
    </div>
  );
}
