// src/components/mypage/ProfileCard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImg from '../../assets/profile.svg';
import { fetchMySelfInfo, fetchMyMerged } from '../../services/mypage';

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
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [birthday, setBirthday] = useState('');
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState('');

  const applyMerged = (m: any, fallbackUid?: string) => {
    const uid = m?.userId || fallbackUid || '';
    setUserId(uid);
    setName(m?.name || '');
    setBirthday(fmtBirthday(m?.birthday));
    setFollowers(typeof m?.followers === 'number' ? m.followers : 0);
    setFollowing(typeof m?.following === 'number' ? m.following : 0);
    setImageUrl(m?.image || null);
  };

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
        applyMerged(m, uid);
      }
    } catch {}

    // 1) 서버 새로고침 (merged → fallback selfinfo)
    (async () => {
      setLoading(true);
      setLoadErr('');
      try {
        const merged = await fetchMyMerged(uid);
        if (!mounted) return;
        applyMerged(merged, uid);
        localStorage.setItem('cached_profile', JSON.stringify(merged));
      } catch {
        try {
          const res = await fetchMySelfInfo(uid);
          if (mounted && res.resultType === 'SUCCESS' && res.success) {
            const p = res.success.profile;
            const mergedLike = {
              userId: p.userId,
              name: p.name,
              birthday: p.birthday,
              image: p.image,
              followers: p.followers,
              following: p.following,
            };
            applyMerged(mergedLike, uid);
            localStorage.setItem('cached_profile', JSON.stringify(mergedLike));
          } else if (mounted) {
            setLoadErr(res.error || '내 정보를 불러오지 못했습니다.');
          }
        } catch (err: any) {
          if (mounted) setLoadErr(err?.message || '내 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // 2) 같은 탭: 편집 페이지 전역 이벤트 구독
    const onProfileUpdated = (e: Event) => {
      const detail: any = (e as CustomEvent).detail;
      if (!detail) return;
      try {
        const cachedRaw = localStorage.getItem('cached_profile');
        const cached = cachedRaw ? JSON.parse(cachedRaw) : {};
        const merged = { ...cached, ...detail };
        localStorage.setItem('cached_profile', JSON.stringify(merged));
        applyMerged(merged, uid);
      } catch {}
    };
    window.addEventListener('my_profile_updated', onProfileUpdated as EventListener);

    // 3) 다른 탭: storage 이벤트로 캐시 변경 추적
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'cached_profile' || !e.newValue) return;
      try {
        const m = JSON.parse(e.newValue);
        applyMerged(m, uid);
      } catch {}
    };
    window.addEventListener('storage', onStorage);

    return () => {
      mounted = false;
      window.removeEventListener('my_profile_updated', onProfileUpdated as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // (선택) 기존 ID 변경 이벤트 구독 — 유지
  useEffect(() => {
    const handler = (e: any) => {
      const newId = (e?.detail ?? '').toString().trim();
      if (!newId) return;

      (async () => {
        setLoading(true);
        try {
          const merged = await fetchMyMerged(newId);
          applyMerged(merged, newId);
          localStorage.setItem('cached_profile', JSON.stringify(merged));
        } finally {
          setLoading(false);
        }
      })();
    };

    window.addEventListener('my_user_id_changed', handler as EventListener);
    return () => window.removeEventListener('my_user_id_changed', handler as EventListener);
  }, []);

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

          {/* 아이디는 읽기 전용으로만 노출 */}
          <div
            className="mt-[4px] text-[16px] font-medium text-[#1F1F1F] font-pretendard"
            style={{ fontWeight: 600 }}
          >
            <span>{userId || '—'}</span>
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
