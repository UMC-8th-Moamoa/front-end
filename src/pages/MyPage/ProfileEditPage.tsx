// src/pages/ProfileEditPage.tsx
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import BackButton from '../../components/common/BackButton';
import ProfilePhotoModal from '../../components/mypage/ProfilePhotoModal';
import PencilIcon from '../../assets/pencil_line.svg';
import ProfileIcon from '../../assets/profile.svg';
import { fetchMyMerged, changeMyUserId, setMyUserId } from '../../services/mypage';

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

  // 닉네임(=userId) 편집용 상태
  const [editingNickname, setEditingNickname] = useState(''); // 입력 중
  const [savedNickname, setSavedNickname] = useState('');     // 저장된 값(표시용)
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  // 프로필 상세(이름/생일/전화/이메일/이미지)
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(''); // 표시용: YYYY.MM.DD
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 로딩/에러
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState<string>('');

  const goResetPassword = () => navigate('/reset-password');

  // ===== 부트스트랩: localStorage.my_user_id -> 합성 유틸 한 번 호출 =====
  useEffect(() => {
    const uid = localStorage.getItem('my_user_id');
    if (!uid) {
      setLoadErr('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      return;
    }

    let mounted = true;
     // 0) 캐시가 있으면 먼저 반영 (로딩 중에도 즉시 표시)
 try {
   const cached = localStorage.getItem('cached_profile');
   if (cached) {
     const m = JSON.parse(cached);
     const userId = m.userId || uid;
     setEditingNickname(userId);
     setSavedNickname(userId);
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

        // 닉네임(=userId)
        const userId = merged.userId || uid;
        setEditingNickname(userId);
        setSavedNickname(userId);

        // 기본 정보
        setName(merged.name || '');
        setEmail(merged.email || '');
        setPhone(merged.phone || '');

        // 생일은 YYYY-MM-DD -> YYYY.MM.DD 로 화면 표기
        setBirthday(fmtBirthday(merged.birthday));

        // 이미지
        setImageUrl(merged.image || null);
        // 최신값으로 캐시 갱신
     localStorage.setItem('cached_profile', JSON.stringify(merged));

      } catch (err: any) {
        if (mounted) setLoadErr(err?.message || '프로필 정보를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // 중복 체크(예시 규칙 유지)
  const isDuplicate = editingNickname === 'moa123';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditingNickname(value);
    if (value === 'moa123') setError('중복되는 아이디입니다.');
    else setError('');
  };

    // 저장 토글: 아이디 변경 API 연동
  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // 입력값 검증 (스웨거의 V001 규칙: 4-20자, 영문/숫자/언더스코어)
    const candidate = editingNickname.trim();
    const valid = /^[A-Za-z0-9_]{4,20}$/.test(candidate);
    if (!valid) {
      setError('새로운 사용자 ID는 4-20자의 영문, 숫자, 언더스코어만 허용됩니다');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // 1) 서버 반영
      const res = await changeMyUserId({ newUserId: candidate });
      if (res.resultType !== 'SUCCESS' || !res.success) {
        // 409 등: "이미 사용 중" 메시지 그대로 표시
        setError(res.error || '아이디 변경에 실패했습니다.');
        return;
      }

      const newId = res.success.newUserId;

      // 2) 로컬/전역 반영
   setSavedNickname(newId);
   setMyUserId(newId);                              //  전역 이벤트 발생
   localStorage.setItem('savedNickname', newId); // 팀에서 쓰던 키 유지

      // 3) 최신 프로필 재조회 (새 ID 기준)
      const merged = await fetchMyMerged(newId);
      setEditingNickname(merged.userId || newId);
      setName(merged.name || '');
      setEmail(merged.email || '');
      setBirthday(fmtBirthday(merged.birthday));
      setImageUrl(merged.image || null);
      localStorage.setItem('cached_profile', JSON.stringify(merged));

      // 4) 편집 종료
      setIsEditing(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.error?.reason ||
        err?.response?.data?.message ||
        err?.message ||
        '아이디 변경 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

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
        {/* 이미지 + 닉네임 */}
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

          {/* 닉네임 라인 */}
          <div className="flex flex-col flex-grow">
            <div
              style={{
                position: 'relative',
                width: '204px',
                paddingBottom: '8px',
                fontWeight: 600,
              }}
            >
              {isEditing ? (
                <input
                  value={editingNickname}
                  onChange={handleChange}
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    width: '100%',
                    color: error ? '#E20938' : '#000',
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    display: 'inline-block',
                    width: '100%',
                    color: error ? '#E20938' : '#000',
                  }}
                >
                  {editingNickname || '—'}
                </span>
              )}

              {/* 연필 아이콘(우측 고정) */}
              <img
                src={PencilIcon}
                alt="닉네임 수정"
                onClick={handleEditToggle}
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: 0,
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                }}
              />

              {/* 밑줄 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '1px',
                  backgroundColor: error ? '#E20938' : '#B7B7B7',
                }}
              />
            </div>

            {error && <div style={{ color: '#E20938', fontSize: '14px' }}>{error}</div>}
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

          {/* 여기서 ‘id 기준으로’ 받은 name/phone/email/birthday를 표기 */}
          <Row label="이름" value={name || ''} />
          <Row label="사용자 ID" value={savedNickname || ''} />
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

// 공통 Row (동일)
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
