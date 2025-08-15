import type { SubBannerProps, MainBannerProps } from "../../../types/banner";
import DefaultProfile from "../../../assets/DefaultProfile.svg";


// SubBanner 더미 데이터
export const dummySubBanners: SubBannerProps[] = [
  {
    imageSrc: DefaultProfile,
    content: '유민님의 모아모아 참여 중',
    buttonText: '진행도 보러 가기',
    variant: "default"
  },
  {
    imageSrc: "/assets/GiftCertificationBanner.svg",
    variant: "imageOnly" // 텍스트 없는 이미지 배너
  },
];

// MainBanner 더미 데이터
export const dummyMainBanner: MainBannerProps = {
  title: "채원님을 위한\n모아가 완성됐어요!",
  buttonText: "모아모아 보러가기",
  onClick: () => console.log("메인배너 클릭!"),
  imageSrc: "/assets/Moa.png"

};




