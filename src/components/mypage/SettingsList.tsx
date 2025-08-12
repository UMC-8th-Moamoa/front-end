import { useNavigate } from "react-router-dom";
import GrayButtonIcon from "../../assets/gray_button.svg";

function SettingsList() {
  const navigate = useNavigate();
const settings = [
  { label: "설정", route: "/settings" },
  { label: "구매 내역", route: "/purchase-history" },
  { label: "공지사항", route: "/notice" },
  { label: "고객센터", route: "/customer-service" },
];


  return (
    <div
      style={{
        width: "350px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#FFFFFF",
      }}
    >
      {settings.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.route)}
          style={{
            width: "110%",
            height: "55px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            cursor: "pointer",
            borderBottom: index !== settings.length - 1 ? "1px solid #EAEAEA" : "none",
          }}
        >
          <span
            style={{
              marginLeft :"8px",
              fontSize: "18px",
              fontWeight: 500,
              color: "#1F1F1F",
              fontFamily: "Pretendard",
            }}
          >
            {item.label}
          </span>
          <img
            src={GrayButtonIcon}
            alt="화살표"
            style={{ width: "30px", height: "30px" }}
          />
        </div>
      ))}
    </div>
  );
}

export default SettingsList;
