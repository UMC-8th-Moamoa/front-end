import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import CameraIcon from "../../assets/camera.svg";

interface AlbumItemProps {
  title: string;
  count: number;
  onClick?: () => void;
}

const AlbumItem = ({ title, count, onClick }: AlbumItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center w-full cursor-pointer"
    >
      <div className="flex w-[370px] gap-[16px]">
        <div className="w-[80px] h-[80px] rounded-[4px] bg-[#F2F2F2]" />
        <div className="flex flex-col justify-center gap-[6px]">
          <div className="text-[16px] font-semibold text-[#1F1F1F] font-pretendard"style={{ fontWeight: 600 }}
>
            {title}
          </div>
          <div className="text-[14px] font-normal text-[#B7B7B7] font-pretendard">
            {count}
          </div>
        </div>
      </div>
      <div className="h-[10px]" />
<div className="w-[370px] h-[1px] bg-[#E1E1E1] scale-y-50" />
      <div className="h-[10px]" />
    </div>
  );
};

export default function SelectPhotoPage() {
  const navigate = useNavigate();

  const albums = [
    { title: "전체보기", count: 3000 },
    { title: "앨범명1", count: 100 },
    { title: "앨범명2", count: 100 },
    { title: "앨범명3", count: 100 },
    { title: "앨범명4", count: 100 },
    { title: "앨범명4", count: 100 },
    { title: "앨범명5", count: 100 },

  ];

  return (
    <div className="flex flex-col  items-center px-4 pb-10 pt-[20px]">
      <div className=" flex items-center justify-between w-[393px] mb-[21px]">
        <BackButton />
        <h1 className="text-[18px] font-bold text-black font-pretendard">
          앨범 선택
        </h1>
        <div className="w-6" />
      </div>

      {/* 카메라 촬영 */}
      <div className="flex flex-col items-center w-full cursor-pointer">
        <div className="flex w-[370px] gap-[16px]">
          <div className="w-[80px] h-[80px] rounded-[4px] bg-[#F2F2F2] flex justify-center items-center">
            <img src={CameraIcon} alt="카메라 아이콘" className="w-[40px] h-[40px]" />
          </div>
          <div className="flex items-center font-pretendard text-[16px] font-semibold text-[#1F1F1F]"style={{ fontWeight: 600 }}
>
            카메라 촬영
          </div>
        </div>
        <div className="h-[10px]" />
        <div className="w-[370px] h-[1px] bg-[#E1E1E1]" />
        <div className="h-[10px]" />
      </div>

      {/* 앨범 리스트 */}
      {albums.map((album, index) => (
        <AlbumItem
          key={index}
          title={album.title}
          count={album.count}
          onClick={() => navigate(`/moaletter/album/${album.title}`)}
        />
      ))}
    </div>
  );
}
