// src/pages/ProfileEditPage.tsx
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import BackButton from '../../components/common/BackButton';
import ProfilePhotoModal from '../../components/mypage/ProfilePhotoModal';
import PencilIcon from '../../assets/pencil_line.svg';
import ProfileIcon from '../../assets/profile.svg';
import { fetchMyMerged } from '../../services/mypage';

// YYYY-MM-DD -> YYYY.MM.DD
function fmtBirthday(iso?: string | null) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

function ProfileEditPage() {
  const navigate = useNavigate();

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 사용자 ID (읽기 전용)
  const [userId, setUserId] = useState('');

  // 프로필 상세
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 로딩/에러
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState<string>('');

  const goResetPassword = () => navigate('/reset-password');

  // ===== 프로필 데이터 로드 =====
  useEffect(() => {
    const uid = localStorage.getItem('my_user_id');
    if (!uid) {
      setLoadErr('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      return;
    }

    let mounted = true;

    // 캐시 선반영
    try {
      const cached = localStorage.getItem('cached_profile');
      if (cached) {
        const m = JSON.parse(cached);
        setUserId(m.userId || uid);
        setName(m.name || '');
        setEmail(m.email || '');
        setPhone(m.phone || '');
        setBirthday(fmtBirthday(m.birthday));
        setImageUrl(m.image || null);
      }
    } catch {}

    (async () => {
      setLoading(true);
      setLoadErr('');
      try {
        const merged = await fetchMyMerged(uid);
        if (!mounted) return;

        setUserId(merged.userId || uid);
        setName(merged.name || '');
        setEmail(merged.email || '');
        setPhone(merged.phone || '');
        setBirthday(fmtBirthday(merged.birthday));
        setImageUrl(merged.image || null);

        localStorage.setItem('cached_profile', JSON.stringify(merged));
      } catch (err: any) {
        if (mounted) setLoadErr(err?.message || '프로필 정보를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  return (
    <div className="w-full max-w-[350px] mx-auto bg-white text-black pt-[9px] pb-[40px] min-h-screen">
      {/* 상단 바 */}
      <div className="flex items-center mb-4 px-4">
        <BackButton />
        <div className="flex-1 text-center text-[18px] font-bold" style={{ fontWeight: 700 }}>
          프로필 편집
        </div>
        <div className="w-6" />
      </div>

      {/* 경고/에러 */}
      {loadErr && (
        <div className="px-4 mb-2 text-[14px]" style={{ color: '#E20938' }}>
          {loadErr}
        </div>
      )}

      {/* 프로필 사진 + 폼 박스 */}
      <div
        style={{
          margin: '0 auto',
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '20px',
          maxWidth: '350px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '40px',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {/* 이미지 + ID + 이름 */}
        <div className="flex px-[8px]">
          <div
            style={{
              width: '85px',
              height: '85px',
              position: 'relative',
              flexShrink: 0,
              marginRight: '16px',
              cursor: 'pointer',
            }}
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={imageUrl || ProfileIcon}
              alt="프로필 이미지"
              style={{
                width: '85px',
                height: '85px',
                borderRadius: '50%',
                objectFit: 'cover',
                backgroundColor: '#B6B6B6',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '100px',
                background: '#FFF',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              }}
            >
              <img src={PencilIcon} alt="이미지 수정" style={{ width: '20px', height: '20px' }} />
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className="flex flex-col flex-grow">
            <span style={{ fontSize: '24px', fontWeight: 600, color: '#000' }}>
              {userId || '—'}
            </span>
            <span style={{ fontSize: '16px', color: '#B7B7B7' }}>
              {birthday || (loading ? '불러오는 중…' : '')}
            </span>
          </div>
        </div>

        {/* 계정 정보 */}
        <div className="flex flex-col gap-[20px] w-full">
          <div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>계정 정보</span>
          </div>

          <Row label="이름" value={name || ''} />
          <Row label="사용자 ID" value={userId || ''} />
          <Row label="전화번호" value={phone || ''} />
          <Row label="이메일" value={email || ''} />
          <Row label="비밀번호" value="" actionLabel="변경" onActionClick={goResetPassword} />
        </div>
      </div>

      {/* 프로필 사진 모달 */}
      {isModalOpen && (
        <ProfilePhotoModal
          onClose={() => setIsModalOpen(false)}
          onSelect={(imgUrl) => {
            setImageUrl(imgUrl || imageUrl);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// 공통 Row
function Row({ label, value, actionLabel, onActionClick }: {
  label: string;
  value: string;
  actionLabel?: string;
  onActionClick?: () => void;
}) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%' }}>
      <span style={{ color:'#B7B7B7', fontSize:'16px', minWidth:'80px', flexShrink:0 }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', flex:1, overflow:'hidden' }}>
        <span style={{ color:'#1F1F1F', fontSize:'18px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {value}
        </span>
        {actionLabel && (
          <span onClick={onActionClick} style={{ color:'#B6B6B6', fontSize:'16px', cursor:'pointer', whiteSpace:'nowrap', marginLeft:'8px', flexShrink:0 }}>
            {actionLabel}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProfileEditPage;
