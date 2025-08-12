// src/components/mypage/SettingsSection.tsx

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="border-t border-gray-200 pt-6 space-y-4">
      <h2 className="text-sm font-semibold font-pretendard text-gray-500">{title}</h2>
      {children}
    </div>
  );
}
