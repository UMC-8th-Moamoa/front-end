export interface SubBannerProps {
  icon?: React.ReactNode;
  content: string;
  buttonText?: string;
  onClick?: () => void;
}


export interface MainBannerProps {
  title: string;
  buttonText: string;
  onClick: () => void;
  imageSrc?: string;
}