import { useState } from 'react';

interface VisibilityToggleProps {
  onToggle: (visible: boolean) => void;
}

import EyeIcon from '../../assets/Eye.svg';
import EyeOffIcon from '../../assets/Eye_off.svg';


function VisibilityToggle({ onToggle }: VisibilityToggleProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressStart = () => {
    setIsPressed(true);
    onToggle(true); // 비밀번호 나타내기
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    onToggle(false); // 비밀번호 숨기기
  };

  return (
    <div
      style={{
        cursor: 'pointer',
        display: 'inline-block',
        width: '24px',
        height: '24px',
      }}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      <img
        src={isPressed ? EyeIcon : EyeOffIcon}
        alt="eye toggle"
        width={24}
        height={24}
        style={{
          transition: 'opacity 0.2s ease',
        }}
      />
    </div>
  );
}

export default VisibilityToggle;
