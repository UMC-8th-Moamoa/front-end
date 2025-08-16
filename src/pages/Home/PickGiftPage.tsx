// src/pages/PickGiftPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { PickGiftList } from "../../components/HomePage/PickGift/PickGiftList";
import { Modal } from "../../components/common/Modal";

// ✅ 서비스 헬퍼 (경로 확인: birthday 디렉터리)
import {
  getMyWishlists,
  selectMyWishlistItems,          // 선택 일괄 저장 API
  type WishlistUiItem,
  type WishlistSortBy,
} from "../../services/user/mybirthday";

const sortOptions = ["친구 추천순", "등록순", "높은 가격순", "낮은 가격순"] as const;
type SortOption = typeof sortOptions[number];

// UI → API enum 매핑
const sortMap: Record<SortOption, WishlistSortBy> = {
  "친구 추천순": "VOTE_COUNT",
  "등록순": "CREATED_AT",
  "높은 가격순": "PRICE_DESC",
  "낮은 가격순": "PRICE_ASC",
};

const PickGiftPage = () => {
  const navigate = useNavigate();

  // 서버 데이터
  const [list, setList] = useState<WishlistUiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);

  // 서버 제공 금액
  const [currentAmount, setCurrentAmount] = useState(0);

  // UI 상태
  const [withMyMoney, setWithMyMoney] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("등록순");
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false); // ✅ 선택 저장 중

  // 데이터 불러오기 (정렬 변경 시 새로 로드)
  const load = async (reset = true, nextCursor: string | null = null) => {
    try {
      setLoading(true);
      setErr(null);
      const page = await getMyWishlists({
        size: 20,
        sortBy: sortMap[sortOption],
        cursor: reset ? null : nextCursor,
      });

      setCurrentAmount(page.currentAmount);
      setCursor(page.nextCursor);
      setHasNext(!!page.hasNext);

      if (reset) {
        setList(page.items);
        // 서버에 이미 선택된 항목이 있다면 반영
        setCheckedItems(page.selectedItems ?? []);
      } else {
        // 중복 없는 병합
        setList((prev) => {
          const exist = new Set(prev.map((i) => i.id));
          const add = page.items.filter((i) => !exist.has(i.id));
          return [...prev, ...add];
        });
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || "위시리스트를 불러오지 못했어요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(true, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  // 체크 토글
  const handleCheckboxChange = (id: number) => {
    setCheckedItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // 정렬 적용 후(또는 체크 변경 후) 합계 금액
  const sortedList = useMemo(() => {
    // 서버 정렬을 쓰므로 여기서는 보정 정도만
    if (sortOption === "높은 가격순") return [...list].sort((a, b) => b.price - a.price);
    if (sortOption === "낮은 가격순") return [...list].sort((a, b) => a.price - b.price);
    if (sortOption === "등록순") return [...list].sort((a, b) => a.id - b.id);
    return list; // 친구 추천순은 서버 정렬 사용
  }, [list, sortOption]);

  const totalPrice = useMemo(() => {
    const set = new Set(checkedItems);
    return sortedList.filter((it) => set.has(it.id)).reduce((sum, it) => sum + (it.price ?? 0), 0);
  }, [sortedList, checkedItems]);

  // 상단 “나의 모아모아” 표시: 현재 모인 금액 - 내가 고른 합계
  const myMoamoaMoney = currentAmount - totalPrice;
  const isWarning = !withMyMoney && myMoamoaMoney < 0;

  // 정산 버튼 클릭 → 서버에 선택 저장 후 다음 단계
  const handleSettlementClick = async () => {
    if (!withMyMoney && myMoamoaMoney < 0) {
      setIsModalOpen(true);
      return;
    }

    try {
      setSaving(true);
      // ✅ 서버에 선택 목록 저장
      await selectMyWishlistItems(checkedItems);

      navigate("/before-transfer", {
        state: {
          amount: totalPrice,
          items: checkedItems,
          withMyMoney,
        },
      });
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "선택 내역을 저장하지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmMyMoney = () => {
    setWithMyMoney(true);
    setIsModalOpen(false);
  };

  // 무한 스크롤(선택): 바닥 근처에서 다음 페이지
  useEffect(() => {
    const onScroll = () => {
      if (!hasNext || loading) return;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom) load(false, cursor);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [cursor, hasNext, loading]);

  // 페이지 진입 시 전체 스크롤 잠금 (디자인 유지용)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 로딩/에러/빈 상태
  if (loading && list.length === 0)
    return (
      <div className="w-full h-screen flex items-center justify-center">불러오는 중…</div>
    );
  if (err)
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        {err}
      </div>
    );

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#6282E1] to-[#FEC3FF] overflow-hidden flex flex-col items-center relative">
      {/* 상단 제목/잔액 */}
      <div className="w-full mt-5 max-w-[393px] px-4 pt-[12px]">
        <h2 className="text-center text-[16px] font-medium text-white">나의 모아모아</h2>
        <p className={`text-center text-[40px] font-medium ${isWarning ? "text-[#CB1919]" : "text-white"}`}>
          {myMoamoaMoney.toLocaleString()}원
        </p>

        <label className="flex items-center gap-2 ml-4 mt-2">
          <input
            className="w-[20px] h-[20px] mr-1 appearance-none rounded-sm bg-white checked:bg-[url('/assets/GrayCheck.svg')] checked:bg-center checked:bg-no-repeat"
            type="checkbox"
            checked={withMyMoney}
            onChange={() => setWithMyMoney(!withMyMoney)}
          />
          <span className="text-[15px] font-medium text.white">내 돈 보태기</span>
        </label>
      </div>

      {/* 선물 리스트 */}
      <div className="bg-white mt-3 w-full max-w-[393px] rounded-t-[40px] px-4 pt-6 pb-[120px] overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-[20px] text-[#6282E1] font-semibold px-3">내 선물 고르기</h3>
            <p className="text-[14px] px-3 mb-2 text-[#B7B7B7] mt-1">체크박스를 눌러 선물을 담으세요!</p>
          </div>

          {/* 정렬 드롭다운 */}
          <div className="relative w-[108px]">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`border border-[#C7D5FF] rounded-[8px] px-[9px] py-[8px] text-sm text-[#6282E1] w-full h-[32px] flex items-center justify-between ${
                isDropdownOpen ? "rounded-b-none" : ""
              }`}
            >
              {sortOption}
              <img
                src={isDropdownOpen ? "/assets/ChevronUp.svg" : "/assets/ChevronDown.svg"}
                className="w-[20px] h-[20px]"
                alt="toggle dropdown"
              />
            </button>
            {isDropdownOpen && (
              <ul className="absolute top-[32px] left-0 w-full bg-white border-x border-b border-[#C7D5FF] rounded-b-[8px] z-10">
                {sortOptions.map((option) => (
                  <li
                    key={option}
                    className="px-[9px] py-[8px] text-[#6282E1] text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortOption(option);
                      setIsDropdownOpen(false);
                      // 선택 즉시 새로 로드(효과 훅에서도 다시 로드됨)
                      load(true, null);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <PickGiftList
          items={sortedList}
          checkedItems={checkedItems}
          onChange={handleCheckboxChange}
        />
      </div>

      {/* 정산하기 버튼 */}
      <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 z-50 w-[350px] h-[50px]">
        <Button className="bg-[#6282E1]" onClick={handleSettlementClick} disabled={saving}>
          <div className="flex justify-between items-center w-full">
            <span className="text-[16px] font-medium text-white ml-33">
              {saving ? "저장 중..." : "정산하기"}
            </span>
            <span className="text-[12px] font-medium text-white">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
        </Button>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="w-[350px] h-[191px] py-6 px-4"
        >
          <div className="text-center w-full">
            <h3 className="text-[18px] font-bold mb-1">예산이 초과되었어요!</h3>
            <p className="text-[14px] text-[#6C6C6C] mb-4 py-2 leading-relaxed">
              선물 금액이 모인 금액을 초과했어요. <br />
              내 돈을 보태거나 선물을 다시 골라주세요.
            </p>
            <div className="flex justify-between w-full px-3 gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-[92px] h-[40px] rounded-[8px] border border-[#6282E1] text-[#6282E1] text-[18px]"
              >
                취소
              </button>
              <button
                onClick={handleConfirmMyMoney}
                className="w-[187px] h-[40px] rounded-[8px] bg-[#6282E1] text-white text-[18px]"
              >
                내 돈 보태기
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PickGiftPage;
