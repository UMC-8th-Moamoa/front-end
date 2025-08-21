// src/components/HomePage/Participation/RecipientBanner.tsx
type RecipientBannerProps = {
  /** 수신자 이름 (예: "김민수") */
  name: string;
  /** 프로필 이미지 URL (없으면 기본 이미지 사용) */
  photo?: string | null;
  /** 서버 제공 남은 일수(폴백용). birthday가 주어지면 무시하고 로컬 계산 */
  daysRemaining: number;
  /** ✅ 옵션: ISO(YYYY-MM-DD 등)로 주면 로컬에서 정확히 계산 (추천) */
  birthday?: string | null;
};

const DEFAULT_PROFILE = "/assets/profile.svg";

// 유틸
function calcDaysUntilNext(md: { month: number; day: number }): number {
  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(today0.getFullYear(), md.month - 1, md.day);
  if (target < today0) target = new Date(today0.getFullYear() + 1, md.month - 1, md.day);
  const diff = target.getTime() - today0.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}
function monthDayFromISO(s?: string | null): { month: number; day: number } | null {
  if (!s) return null;
  const m = /^\s*\d{4}[-/.](\d{1,2})[-/.](\d{1,2})/.exec(s);
  if (m) {
    const mm = +m[1], dd = +m[2];
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) return { month: mm, day: dd };
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return { month: d.getMonth() + 1, day: d.getDate() };
  return null;
}

const RecipientBanner = ({ name, photo, daysRemaining, birthday }: RecipientBannerProps) => {
  // ✅ birthday가 있으면 로컬 계산, 없으면 서버 값 사용
  const md = monthDayFromISO(birthday ?? undefined);
  const dday = md != null
    ? calcDaysUntilNext(md)
    : Math.max(0, Math.floor(Number.isFinite(daysRemaining) ? daysRemaining : 0));

  const dText = dday === 0 ? "D-DAY" : `D-${dday}`;
  const src = (photo ?? "").trim() || DEFAULT_PROFILE;

  return (
    <div className="w-[350px] h-[152px] bg-white rounded-[20px] shadow-md flex items-center justify-center ml-[6px]">
      {/* 왼쪽 - 프로필 */}
      <div className="flex flex-col items-center justify-center w-[69px] mr-5">
        <img
          src={src}
          alt={`${name}의 프로필`}
          className="w-[69px] h-[69px] rounded-full object-cover bg-[#D9D9D9]"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src !== window.location.origin + DEFAULT_PROFILE) {
              img.src = DEFAULT_PROFILE;
            }
          }}
        />
        <div className="mt-2 text-[15px] font-medium text-black">{name}</div>
      </div>

      {/* 중앙 세로선 */}
      <div className="w-px h-[102px] bg-[#D9D9D9] mx-5" />

      {/* 오른쪽 - D-day */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-[52px] font-semibold text-transparent ml-4 bg-clip-text bg-gradient-to-b from-[#6282E1] to-[#FEC3FF]">
          {dText}
        </div>
      </div>
    </div>
  );
};

export default RecipientBanner;
