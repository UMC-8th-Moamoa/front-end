import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import {
  getDonationOrganizations,
  type DonationOrganization,
} from "../../../services/money/moamoney";
import axios from "axios";

const DonationSelectPage = () => {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<DonationOrganization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const list = await getDonationOrganizations(ac.signal);
        setOrgs(list);
      } catch (e) {
        // 취소는 무시
        if (axios.isAxiosError(e) && e.code === "ERR_CANCELED") return;
        console.error("[donations] fetch error", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const handleClick = (org: DonationOrganization) => {
    navigate("/donation-complete", {
      state: { organizationId: org.id, organizationName: org.name },
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <span className="text-gray-400">불러오는 중…</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white pb-[84px]">
      {/* 상단 뒤로가기 */}
      <div className="w-full max-w-[393px] px-4 pt-4">
        <BackButton />
      </div>

      {/* 본문 중앙 정렬 */}
      <main className="w-full flex-grow flex flex-col items-start justify-center px-6">
        <div className="w-full max-w-[393px] flex flex-col items-start">
          <h1 className="text-[32px] font-normal text-black mb-2 ml-1">
            좋은 곳에 <span className="font-bold text-[#6282E1]">기부</span>해요!
          </h1>
          <p className="text-[20px] text-gray-400 mb-10 leading-relaxed ml-1 mt-2">
            골드님의 따뜻한 손길이 누군가에게 큰<br />위로가 됩니다
          </p>

          {/* 동적 버튼: API 리스트 길이만큼 생성, 스타일은 동일 */}
          <div className="w-full flex flex-col gap-3 mt-8">
            {orgs.map((org) => (
              <button
                key={org.id}
                className="w-full h-[50px] bg-white border border-[#6282E1] text-[#6282E1] rounded-xl text-[20px] font-semibold"
                onClick={() => handleClick(org)}
              >
                {org.name}
              </button>
            ))}
            {orgs.length === 0 && (
              <div className="text-gray-400">기부 가능한 단체가 없습니다.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonationSelectPage;
