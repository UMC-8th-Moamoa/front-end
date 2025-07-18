import HomeIcon from '../../assets/Home.svg';
import HomeIconActive from '../../assets/Home_color.svg';
import MailIcon from '../../assets/Mail.svg';
import MailIconActive from '../../assets/Mail_color.svg';
import ShoppingBagIcon from '../../assets/Shopping_bag.svg';
import ShoppingBagIconActive from '../../assets/Shopping_bag_color.svg';
import UserIcon from '../../assets/User.svg';
import UserIconActive from '../../assets/User_color.svg';
import HeartIcon from '../../assets/Heart.svg';
import HeartIconActive from '../../assets/Heart_color.svg';


// 각 메뉴의 키 타입을 정의함
export type MenuType = 'shopping' | 'heart' | 'home' | 'letter' | 'mypage';

interface BottomNavigationProps {
  active: MenuType; // 현재 선택된 메뉴
  onNavigate: (menu: MenuType) => void; // 메뉴 클릭 시 실행할 함수
}

function BottomNavigation({ active, onNavigate }: BottomNavigationProps) {
  // 하단바에 표시할 메뉴 아이콘 목록 정의 
  const menuList = [
    { key: 'shopping', icon: ShoppingBagIcon, activeIcon: ShoppingBagIconActive },
    { key: 'heart', icon: HeartIcon, activeIcon: HeartIconActive },
    { key: 'home', icon: HomeIcon, activeIcon: HomeIconActive },
    { key: 'letter', icon: MailIcon, activeIcon: MailIconActive },
    { key: 'mypage', icon: UserIcon, activeIcon: UserIconActive },
  ];


  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px', // 아이콘 간 간격
        width: '393px',
        height: '70px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        margin: '0 auto', // 화면 중앙 정렬
        borderTop: '1px solid #ddd', // 상단 테두리
        borderRadius: '20px 20px 0 0', // 상단 모서리 둥글게
        background: '#FFF',
        zIndex: 1000, // 다른 요소보다 위에 배치
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
          }}
        >
          <img
            // 선택된 메뉴일 경우 별도 색상 아이콘 사용
            src={active === menu.key && menu.activeIcon ? menu.activeIcon : menu.icon}
            width={30}
            height={30}
            style={{
              transition: 'filter 0.2s ease',
            }}
            alt={`${menu.key} icon`}
          />
        </div>
      ))}
    </div>
  );
}

export default BottomNavigation;
