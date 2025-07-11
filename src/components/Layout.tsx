import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        maxWidth: '430px',
        margin: '0 auto',
        padding: '0 16px',
        overflowX: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default Layout;