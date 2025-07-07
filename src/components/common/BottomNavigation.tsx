import HomeIcon from '../../assets/Home.svg';
import MailIcon from '../../assets/Mail.svg';
import ShoppingBagIcon from '../../assets/Shopping_bag.svg';
import UserIcon from '../../assets/User.svg';
import HeartIcon from '../../assets/Heart.svg';


// 메뉴 타입 정의
type MenuType = 'shopping' | 'heart' | 'home' | 'letter' | 'mypage';

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
    width: '393px', // 아이폰 크기 고정
    margin: '0 auto', // 중앙 정렬
    left: 0, // 화면 왼쪽에서 시작
    right: 0, // 화면 오른쪽에서 끝
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
            transition: 'transform 0.2s ease', // 클릭 시 부드럽게 확대
            transform: active === menu.key ? 'scale(1.2)' : 'scale(1)', // 선택 시 확대
          }}
        >
          <img
            src={menu.icon}
            width={24}
            height={24}
            style={{
              marginBottom: '4px',
              transition: 'filter 0.2s ease', // 클릭 시 색상 부드럽게 변경
              filter: active === menu.key ? 'brightness(0)' : 'brightness(0.6)', // 진하게/연하게
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default BottomNavigation;