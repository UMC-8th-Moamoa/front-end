type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        w-[51px] h-[31px] flex items-center
        ${checked ? 'justify-end bg-[#00C851]' : 'justify-start bg-[#8F8F8F]'}
        rounded-full px-[2px] py-[2px] transition-colors duration-200
      `}
      style={{ aspectRatio: '51/31' }}
    >
      <div
        className="w-[27px] h-[27px] bg-white rounded-full shadow-md transition-all duration-200"
      />
    </button>
  );
}
