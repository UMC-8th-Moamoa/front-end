import { useState } from "react";
import BackButton from "../../components/common/BackButton";
import ToggleSwitch from "../../components/mypage/ToggleSwitch";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate(); 

  const [followAlert, setFollowAlert] = useState(false);
  const [birthdayAlert, setBirthdayAlert] = useState(false);
  const [birthdayTiming, setBirthdayTiming] = useState("당일");
  const birthdayOptions = ["당일", "하루 전", "일주일 전"];
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <>
{/* 오버레이 모달 */}
{(showLogoutModal || showWithdrawModal) && (
  <div
    className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[393px] h-[844px] z-[9998] bg-[rgba(0,0,0,0.25)] flex justify-center items-center"
    onClick={() => {
      setShowLogoutModal(false);
      setShowWithdrawModal(false);
    }}
  >
    <div
      className="z-[9999] px-[37px] pt-[px] pb-[31px] rounded-[20px] bg-[#FFFFFF] text-center shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {showLogoutModal && (
        <>
          <p className="font-semibold text-[18px] mt-[31px] mb-[20px] "style={{ fontWeight: 500 }}
>
            로그아웃 하시겠습니까?
          </p>
          <div className="flex gap-[12px] justify-center">
                  <button
                    onClick={() => {
                      setShowLogoutModal(false);
                      navigate("/login"); // 로그아웃 → 로그인 페이지로 이동
                    }}
                    className="h-[40px] px-[50px] rounded-[10px] bg-[#6282E1] text-[#FFF] text-[18px] font-medium"
                  >
              확인
            </button>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="h-[40px] px-[50px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] text-[18px] font-medium"
            >
              취소
            </button>
          </div>
        </>
      )}

      {showWithdrawModal && (
        <>
          <p className="font-semibold text-[17px] mb-[8px] mt-[32px]"style={{ fontWeight: 700 }}>
            회원 탈퇴하시겠습니까?
          </p>
          <p className="text-[14px] text-[#8F8F8F] leading-tight mb-[20px]"style={{ fontWeight: 500 }}>
            회원 탈퇴 시, 계정 정보와 선물 내역이 모두 삭제되며<br />
            복구가 불가능합니다. 정말 탈퇴하시겠습니까?
          </p>
          <div className="flex gap-[12px] justify-center">
            <button
                    onClick={() => {
                      setShowWithdrawModal(false);
                      navigate("/login"); //  탈퇴 → 로그인 페이지로 이동
                    }}
                    className="h-[40px] px-[50px] rounded-[10px] bg-[#6282E1] text-[#FFF] text-[18px] font-medium"
                  >
              확인
            </button>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="h-[40px] px-[50px] rounded-[10px] border border-[#6282E1] bg-white text-[#6282E1] text-[18px] font-medium"
            >
              취소
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}


      {/* 본문 */}
      <div className="bg-white text-black max-w-[350px] mx-auto min-h-screen px-5 pb-[100px]">
        <div className="max-w-[393px] flex items-center mb-[16px]">
          <BackButton />
          <h1 className="text-[18px] font-bold flex-1 text-center -ml-6">설정</h1>
        </div>

        <section className="mt-[20px]">
          <h2 className="text-[20px] font-bold mb-4">알림 설정</h2>

          <div className="flex justify-between items-center mb-5">
            <span className="text-[18px]">팔로워/팔로잉 알림</span>
            <ToggleSwitch checked={followAlert} onChange={setFollowAlert} />
          </div>

          <div className="border-t border-[#E1E1E1] my-[16.5px]" />

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-[8px]">
              <span className="text-[18px]">생일 알림</span>
              <div className="relative w-[72px]">
                <button
                  className="w-full text-[14px] font-medium text-[#1F1F1F] text-center  py-[6px] rounded-[8px] bg-[#F2F2F2]"
                  onClick={() => setOpenDropdown(!openDropdown)}
                >
                  {birthdayTiming}
                </button>
                {openDropdown && (
                  <div className="absolute top-full left-0 mt-[7.5px] w-full z-50 rounded-[8px] bg-[#F2F2F2] shadow-md flex flex-col items-center gap-[7.5px] px-[9px] py-[6px]">
                    {birthdayOptions.filter(option => option !== birthdayTiming).map(option => (
                      <button
                        key={option}
                        className="w-full text-[14px] font-medium text-[#1F1F1F] text-center"
                        onClick={() => {
                          setBirthdayTiming(option);
                          setOpenDropdown(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <ToggleSwitch checked={birthdayAlert} onChange={setBirthdayAlert} />
          </div>

          <div className="border-t border-[#E1E1E1] my-[16.5px]" />
        </section>

        <div className="flex flex-col gap-4">
          <button className="text-left text-[18px] mt-[30px]" onClick={() => setShowLogoutModal(true)}>
            로그아웃
          </button>
          <button className="text-left text-[18px] text-[#E20938] mt-[24px]" onClick={() => setShowWithdrawModal(true)}>
            탈퇴하기
          </button>
        </div>
      </div>
    </>
  );
}
