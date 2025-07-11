// src/components/mypage/SettingsRow.tsx

type SettingsRowProps = {
  label: string;
  rightElement: React.ReactNode;
  onClick?: () => void;
};

export default function SettingsRow({ label, rightElement, onClick }: SettingsRowProps) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center border-b border-gray-200 pb-3 cursor-pointer"
    >
      <span className="text-sm">{label}</span>
      {rightElement}
    </div>
  );
}
