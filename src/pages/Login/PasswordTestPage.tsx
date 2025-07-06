// src/pages/PasswordTestPage.tsx

import { useState } from 'react';
import VisibilityToggle from '../../components/common/VisibilityToggle';

function PasswordTestPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div style={{ padding: '50px' }}>
      <h2>비밀번호 확인</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder="비밀번호 입력"
          style={{ padding: '8px', fontSize: '16px', marginRight: '10px' }}
        />
        <VisibilityToggle onToggle={setIsPasswordVisible} />
      </div>
    </div>
  );
}

export default PasswordTestPage;
