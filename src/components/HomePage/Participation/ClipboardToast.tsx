interface ClipboardToastProps {
    message: string;
  }
  
  const ClipboardToast = ({ message }: ClipboardToastProps) => {
    return (
      <div
        className="fixed top-[20px] left-1/2 transform -translate-x-1/2 z-[9999] flex items-center justify-center"
        style={{
          width: "350px",
          height: "77px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <span className="text-[18px] font-medium text-black">{message}</span>
      </div>
    );
  };
  
  export default ClipboardToast;
  