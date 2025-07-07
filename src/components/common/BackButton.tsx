// src/components/common/BackButton.tsx
import { useNavigate } from 'react-router-dom';
import BackIcon from '../../assets/backbutton.svg';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
       style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        width: '40px',
        height: '40px',
        flexShrink: 0,
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img src={BackIcon} alt="뒤로가기" style={{ width: '40px', height: '40px' }} />
    </button>
  );
}

export default BackButton;
