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
      }}
    >
      <img src={BackIcon} alt="뒤로가기" style={{ width: '24px', height: '24px' }} />
    </button>
  );
}

export default BackButton;
