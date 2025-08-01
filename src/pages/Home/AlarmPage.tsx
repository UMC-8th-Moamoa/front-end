import AlarmList from "../../components/HomePage/Alarm/AlarmList";
import BackButton from "../../components/common/BackButton"; 

const AlarmPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full max-w-[393px] mx-auto pt-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 pb-3">
          <BackButton />
          <h1 className="text-[19px] mr-1 font-semibold">알림</h1>
          <div className="w-4" /> {/* placeholder for spacing */}
        </div>

        {/* 알림 리스트 */}
        <AlarmList />
      </div>
    </main>
  );
};

export default AlarmPage;
