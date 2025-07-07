import type { SubBannerProps, MainBannerProps } from "../../../types/banner";

// SubBanner 더미 데이터
export const dummySubBanners: SubBannerProps[] = [
  {
    imageSrc: "/assets/user.png",
    content: '유민님의 모아모아 참여 중',
    buttonText: '진행도 보러 가기',
    variant: "default"
  },
  {
    imageSrc: "/assets/money.png" ,
    content: '채원님 모아에서\n 잔액이 돌아왔습니다',
    variant: "highlight"
  },
];

// MainBanner 더미 데이터
export const dummyMainBanner: MainBannerProps = {
  title: "채원님을 위한\n모아가 진행 중이에요!",
  buttonText: "모아모아 보러가기",
  onClick: () => console.log("메인배너 클릭!"),
  imageSrc: "/assets/Moa.png"

};
