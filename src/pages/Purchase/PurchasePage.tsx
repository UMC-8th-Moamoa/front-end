import { useState } from "react";
import PurchaseTopBar from "../../components/Purchase/PurchaseTopbar";
import PurchaseTabMenu from "../../components/Purchase/PurchaseTabMenu";
import PaidChargeSection from "../../components/Purchase/PaidChargeSection";
import FreeChargeSection from "../../components/Purchase/FreeChargeSection";

export default function PurchasePage() {
  const [selectedTab, setSelectedTab] = useState<"유료 충전" | "무료 충전">("유료 충전");
  const [selectedOption, setSelectedOption] = useState(10);
  const [quantity, setQuantity] = useState(1);

  const options = [
    { id: 10, label: "10MC", price: 1000 },
    { id: 50, label: "50MC", price: 4500, discount: 500 },
    { id: 100, label: "100MC", price: 8500, discount: 1500 },
    { id: 150, label: "150MC", price: 12000, discount: 3000 },
    { id: 200, label: "200MC", price: 15000, discount: 5000 },
  ];

  const selected = options.find((opt) => opt.id === selectedOption);
  const unitPrice = selected?.price || 0;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="max-w-[393px] mx-auto min-h-screen bg-white flex flex-col">
      <PurchaseTopBar userMC={20} />
      <PurchaseTabMenu selected={selectedTab} onChange={setSelectedTab} />

      {selectedTab === "유료 충전" && (
        <PaidChargeSection
          options={options}
          selectedId={selectedOption}
          onSelect={setSelectedOption}
          quantity={quantity}
          onChangeQuantity={setQuantity}
          totalPrice={totalPrice}
        />
      )}

      {selectedTab === "무료 충전" && <FreeChargeSection />}
    </div>
  );
}