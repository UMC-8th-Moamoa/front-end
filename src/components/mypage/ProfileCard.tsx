// src/components/mypage/ProfileCard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImg from '../../assets/profile.svg';
import { fetchMySelfInfo } from '../../services/mypage';
import { fetchMyMerged } from '../../services/mypage';

// YYYY-MM-DD -> YYYY.MM.DD
function fmtBirthday(iso?: string | null) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

function ProfileCard() {
  const navigate = useNavigate();

  // 화면 표시용 상태
  const [name, setName] = useState('');             // 표시명
  const [userId, setUserId] = useState('');         // @아이디
  const [birthday, setBirthday] = useState('');     // YYYY.MM.DD
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);    // followings → following
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState('');

 useEffect(() => {
  const uid = localStorage.getItem('my_user_id');
  if (!uid) {
    setLoadErr('로그인 정보가 없습니다. 다시 로그인해 주세요.');
    return;
  }

  let mounted = true;

  // 0) 캐시 선반영
  try {
    const cached = localStorage.getItem('cached_profile');
    if (cached) {
      const m = JSON.parse(cached);
      setUserId(m.userId || uid);
      setName(m.name || '');
      setBirthday(fmtBirthday(m.birthday));
      setFollowers(m.followers ?? 0);
      setFollowing(m.following ?? 0);
      setImageUrl(m.image || null);
    }
  } catch {}

  (async () => {
    setLoading(true);
    setLoadErr('');
    try {
      const res = await fetchMySelfInfo(uid);
      if (mounted && res.resultType === 'SUCCESS' && res.success) {
        const p = res.success.profile;
        setUserId(p.userId || uid);
        setName(p.name || '');
        setBirthday(fmtBirthday(p.birthday));
        setFollowers(p.followers || 0);
        setFollowing(p.following || 0);
        setImageUrl(p.image || null);
      } else if (mounted) {
        setLoadErr(res.error || '내 정보를 불러오지 못했습니다.');
      }
    } catch (err: any) {
      if (mounted) setLoadErr(err?.message || '내 정보를 불러오지 못했습니다.');
    } finally {
      if (mounted) setLoading(false);
    }
  })();

  return () => { mounted = false; };
}, []);

// ✅ 전역 ID 변경 이벤트 구독 — 반드시 별도 useEffect!
useEffect(() => {
  const handler = (e: any) => {
    const newId = (e?.detail ?? '').toString().trim();
    if (!newId) return;

    (async () => {
      setLoading(true);
      try {
        const merged = await fetchMyMerged(newId);
        setUserId(merged.userId || newId);
        setName(merged.name || '');
        setBirthday(fmtBirthday(merged.birthday));
        setFollowers(merged.followers ?? 0);
        setFollowing(merged.following ?? 0);
        setImageUrl(merged.image || null);
        localStorage.setItem('cached_profile', JSON.stringify(merged));
      } finally {
        setLoading(false);
      }
    })();
  };

  window.addEventListener('my_user_id_changed', handler as EventListener);
  return () => window.removeEventListener('my_user_id_changed', handler as EventListener);
}, []);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };
  const handleSave = () => setIsEditing(false);

  const goToFollowList = (tab: 'follower' | 'followings') => {
    navigate(`/mypage/follow-list?tab=${tab}`);
  };

  return (
    <div className="px-[20px] mt-[10px]">
      {loadErr && (
        <div className="mb-2 text-[14px]" style={{ color: '#E20938' }}>
          {loadErr}
        </div>
      )}

      <div className="flex items-start gap-[12px]" style={{ opacity: loading ? 0.6 : 1 }}>
        <div className="flex flex-col items-center gap-[8px]">
          <img
            src={imageUrl || ProfileImg}
            alt="프로필 이미지"
            className="w-[80px] h-[80px] rounded-full object-cover bg-[#B6B6B6]"
          />
        </div>

        <div className="flex-1 mt-[10px] ml-[16px]">
          <div className="flex items-center gap-[110px]">
            <span
              className="text-[18px] font-semibold text-[#1F1F1F] font-pretendard"
              style={{ fontWeight: 600 }}
            >
              {name || '—'}
            </span>
            <span className="text-[16px] font-normal text-[#B7B7B7] font-pretendard">
              {birthday || (loading ? '불러오는 중…' : '')}
            </span>
          </div>

          <div
            className="mt-[4px] text-[16px] font-medium text-[#1F1F1F] font-pretendard"
            style={{ fontWeight: 600 }}
          >
            {isEditing ? (
              <input
                value={userId}
                onChange={handleChange}
                onBlur={handleSave}
                className="text-[14px] border border-[#ddd] rounded px-2 py-1 font-pretendard"
              />
            ) : (
              <span>{userId || '—'}</span>
            )}
          </div>

          <div className="flex gap-[20px] mt-[8px]">
            <div
              className="flex items-center gap-[6px] cursor-pointer"
              onClick={() => goToFollowList('follower')}
            >
              <span className="text-[18px] font-medium text-[#B7B7B7] font-pretendard">팔로워</span>
              <span
                className="text-[18px] font-medium text-[#1F1F1F] font-pretendard"
                style={{ fontWeight: 500 }}
              >
                {followers}
              </span>
            </div>

            <div
              className="flex items-center gap-[6px] cursor-pointer"
              onClick={() => goToFollowList('followings')}
            >
              <span className="text-[18px] font-medium text-[#B7B7B7] font-pretendard">팔로잉</span>
              <span
                className="text-[18px] font-medium text-[#1F1F1F] font-pretendard"
                style={{ fontWeight: 500 }}
              >
                {following}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/profile/edit')}
        className="flex justify-center items-center gap-[8px] w-[350px] h-[35px] mt-[11px] rounded-[10px] border-[1px] border-[#6282E1] bg-white text-[#6282E1] text-[16px] font-pretendard"
        style={{ fontWeight: 600 }}
      >
        개인정보 편집
      </button>
    </div>
  );
}

export default ProfileCard;
