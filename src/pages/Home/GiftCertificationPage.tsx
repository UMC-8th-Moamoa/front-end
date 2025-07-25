import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import BottomNavigation from "../../components/common/BottomNavigation";
import InputBox from "../../components/common/InputBox";
import ParticipantList from "../../components/HomePage/Participation/ParticipantList";
import WhitePhoto from "../../assets/WhitePhoto.svg";

const GiftCertificationPage = () => {

    const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white relative pb-[84px]">
      {/* 상단 헤더 */}
      <div className="w-full max-w-[393px] px-4 pt-4 flex items-center">
        <BackButton />
        <h1 className="flex-1 text-center text-[24px] font-bold mr-10">
          선물 인증하기
        </h1>
      </div>

      {/* 참가자 리스트 */}
      <div className="w-full max-w-[393px] px-4 mt-3">
        <ParticipantList />
      </div>

      {/* 구분선 */}
      <div className="w-[345px] h-px bg-[#D3D3D3] mt-4 mb-4" />

      {/* 이미지 업로드 영역 */}
      <div className="w-[350px] h-[201px] bg-[#D9D9D9] rounded-[20px] flex items-center justify-center mb-4">
        <img src={WhitePhoto} alt="사진 업로드 아이콘" className="w-10 h-10" />
      </div>

      {/* 소감 입력 */}
      <InputBox
        placeholder="소감을 입력해주세요"
        className="w-[350px] h-[108px] text-[16px] bg-[#EAEAEA] rounded-xl placeholder:text-gray-400"
        hasBorder={false}
      />

      {/* 안내 문구 */}
      <p className="w-[350px] text-[14px] text-gray-400 mt-4 leading-relaxed">
        ※ 선물 인증을 등록하면 즉시 참여자들에게 전달되기 때문에 수정이 불가능합니다
        <br />
        사진이나 글 둘 중 하나만 채워도 선물인증을 등록할 수 있습니다
      </p>

      {/* 등록하기 버튼 */}
      <div className="absolute bottom-[65px] w-full flex justify-center">
        <button className="w-[350px] h-[50px] bg-black text-white text-[16px] font-semibold rounded-xl"
                onClick={() => navigate("/")}>
          등록하기
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default GiftCertificationPage;
