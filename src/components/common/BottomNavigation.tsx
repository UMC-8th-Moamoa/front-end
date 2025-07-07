import HomeIcon from '../../assets/Home.svg';
import MailIcon from '../../assets/Mail.svg';
import ShoppingBagIcon from '../../assets/Shopping_bag.svg';
import UserIcon from '../../assets/User.svg';
import HeartIcon from '../../assets/Heart.svg';

// ✅ 메뉴 타입 정의
export type MenuType = 'shopping' | 'heart' | 'home' | 'letter' | 'mypage';

interface BottomNavigationProps {
  active: MenuType;
  onNavigate: (menu: MenuType) => void;
}

function BottomNavigation({ active, onNavigate }: BottomNavigationProps) {
  const menuList = [
    { key: 'shopping', icon: ShoppingBagIcon },
    { key: 'heart', icon: HeartIcon },
    { key: 'home', icon: HomeIcon },
    { key: 'letter', icon: MailIcon },
    { key: 'mypage', icon: UserIcon },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        borderTop: '1px solid #ddd',
        position: 'fixed',
        bottom: 0,
        width: '393px',
        margin: '0 auto',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
      }}
    >
      {menuList.map((menu) => (
        <div
          key={menu.key}
          onClick={() => onNavigate(menu.key as MenuType)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            transform: active === menu.key ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <img
            src={menu.icon}
            width={24}
            height={24}
            style={{
              marginBottom: '4px',
              transition: 'filter 0.2s ease',
              filter: active === menu.key ? 'brightness(0)' : 'brightness(0.6)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default BottomNavigation;
