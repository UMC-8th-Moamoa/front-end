interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "password" | "email" | "number" | "search";
  className?: string;
  hasBorder?: boolean; 
}

const InputBox = ({
  type = "text",
  className = "",
  hasBorder = true,
  ...props
}: InputBoxProps) => {
  return (
    <input
      type={type}
      className={`w-[350px] h-[50px] px-4 py-2 rounded-[12px] text-sm placeholder-[gray-400]
        ${hasBorder
          ? "border border-red-500"
          : "appearance-none outline-none border-none"} 
        ${className}`}
      {...props}
    />
  );
};

export default InputBox;
