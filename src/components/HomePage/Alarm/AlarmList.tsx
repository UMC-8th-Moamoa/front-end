import AlarmItem from "./AlarmItem";
import { alarmData } from "./AlarmDummy";

const AlarmList = () => {
  return (
    <div className="w-full">
      {alarmData.map((alarm, idx) => (
        <AlarmItem key={idx} date={alarm.date} content={alarm.content} />
      ))}
    </div>
  );
};

export default AlarmList;
