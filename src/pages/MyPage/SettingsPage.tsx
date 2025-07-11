import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import ToggleSwitch from "../../components/mypage/ToggleSwitch";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [followAlert, setFollowAlert] = useState(false);
  const [birthdayAlert, setBirthdayAlert] = useState(false);
  const [birthdayTiming, setBirthdayTiming] = useState("당일");
  const [restrictJoin, setRestrictJoin] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const birthdayOptions = ["당일", "하루 전", "일주일 전"];

  return (
    <div className="bg-white text-black max-w-[430px] mx-auto min-h-screen px-5 pt-[60px] pb-[100px]">
      {/* 상단바 */}
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-xl font-bold flex-1 text-center -ml-6">설정</h1>
      </div>

      {/* 알림 설정 */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">알림 설정</h2>

        <div className="flex justify-between items-center mb-5">
          <span className="text-base">팔로워/팔로잉 알림</span>
          <ToggleSwitch checked={followAlert} onChange={setFollowAlert} />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-base">생일 알림</span>
          <ToggleSwitch checked={birthdayAlert} onChange={setBirthdayAlert} />
        </div>

        {birthdayAlert && (
          <div className="flex justify-end mt-2">
            <select
              value={birthdayTiming}
              onChange={(e) => setBirthdayTiming(e.target.value)}
              className="text-sm border border-gray-300 px-3 py-1.5 rounded bg-white"
            >
              {birthdayOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* 사용자 차단 */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">사용자 차단</h2>

        <div
          className="flex justify-between items-center mb-5 cursor-pointer"
          onClick={() => navigate("/mypage/blocked")}
        >
          <span className="text-base">차단 목록</span>
          <span className="text-xl">{'>'}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-base">나를 팔로우한 사람만 모아 참여</span>
          <ToggleSwitch checked={restrictJoin} onChange={setRestrictJoin} />
        </div>
      </section>

      {/* 로그아웃/탈퇴 */}
      <div className="flex flex-col gap-4">
        <button
          className="text-left text-sm"
          onClick={() => setShowLogoutModal(true)}
        >
          로그아웃
        </button>
        <button
          className="text-left text-sm text-[#EB3960]"
          onClick={() => setShowWithdrawModal(true)}
        >
          탈퇴하기
        </button>
      </div>

      {/* 로그아웃 모달 */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="flex flex-col items-center justify-center text-center px-6 py-5 w-full">
          <p className="font-semibold text-[17px] mb-6">로그아웃 하시겠습니까?</p>
          <div className="flex gap-4">
            <Button
              variant="gray"
              width="fixed"
              size="medium"
              onClick={() => {
                // 로그아웃 처리
                setShowLogoutModal(false);
              }}
            >
              로그아웃
            </Button>
            <Button
              variant="outline"
              width="fixed"
              size="medium"
              onClick={() => setShowLogoutModal(false)}
            >
              취소
            </Button>
          </div>
        </div>
      </Modal>

      {/* 탈퇴 모달 */}
      <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)}>
        <div className="flex flex-col items-center justify-center text-center px-6 py-5 w-full">
          <p className="font-semibold text-[17px] mb-2">회원 탈퇴하시겠습니까?</p>
          <p className="text-[13px] text-[#8F8F8F] text-center mb-5 leading-tight">
            회원 탈퇴 시, 계정 정보와 선물 내역이 모두 삭제되며<br />
            복구가 불가능합니다. 정말 탈퇴하시겠습니까?
          </p>
          <div className="flex gap-4">
            <Button
              variant="gray"
              width="fixed"
              size="medium"
              onClick={() => {
                // 탈퇴 처리
                setShowWithdrawModal(false);
              }}
            >
              탈퇴하기
            </Button>
            <Button
              variant="outline"
              width="fixed"
              size="medium"
              onClick={() => setShowWithdrawModal(false)}
            >
              취소
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
