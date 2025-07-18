import TIcon from "../../assets/T.svg";
import PageIcon from "../../assets/Page.svg";
import KeyboardIcon from "../../assets/Keyboard.svg";
import TIconColor from "../../assets/T_color.svg";
import PageIconColor from "../../assets/Page_color.svg";
import KeyboardIconColor from "../../assets/Keyboard_color.svg";

type ToolType = "none" | "keyboard" | "font" | "theme";

interface Props {
  activeTool: ToolType;
  onTextClick?: () => void;
  onPasteClick?: () => void;
  onKeyboardClick?: () => void;
  onFontClick?: () => void;
  onThemeClick?: () => void;
}

export default function Toolbar({
  onFontClick,
  onThemeClick,
  onKeyboardClick,
  activeTool,
}: Props) {
  return (
<div className="w-full flex justify-center mt-4 mb-[10px] overflow-x-hidden">
  <div className="flex gap-[0px]">
    {[
      {
        type: "font",
        icon: TIcon,
        iconColor: TIconColor,
        onClick: onFontClick,
      },
      {
        type: "theme",
        icon: PageIcon,
        iconColor: PageIconColor,
        onClick: onThemeClick,
      },
      {
        type: "keyboard",
        icon: KeyboardIcon,
        iconColor: KeyboardIconColor,
        onClick: onKeyboardClick,
      },
    ].map(({ type, icon, iconColor, onClick }) => {
      const isActive = activeTool === type;

      return (
<button
  key={type}
  onClick={onClick}
  className={`
    flex justify-center items-center
    rounded-full
    w-[74px] h-[40px]
    px-[30px] py-[6px]
    gap-[px]
    transition-all duration-200
    border-none outline-none
    appearance-none
  `}
  style={{
    backgroundColor: "#FFFFFF", // 내부 배경 강제 흰색
    boxShadow: isActive ? "0px 4px 4px rgba(0, 0, 0, 0.10)" : "none",
  }}
>
  <img
    src={isActive ? iconColor : icon}
    alt={`${type} 버튼`}
    className="w-5 h-5"
  />
</button>





      );
    })}
  </div>
</div>



  );
}
