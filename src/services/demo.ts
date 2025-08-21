import instance from "../api/axiosInstance";

// 데모 이벤트 타입
export type DemoEvent = {
  id: number;
  userId: number;
  shareLink: string;
  shareUrl: string;
  title: string;
  isActive: boolean;
  createdAt: string;
};

// 데모 편지 타입
export type DemoLetter = {
  id: number;
  writerName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

// 데모 이벤트 공개 정보 타입
export type DemoEventPublic = {
  id: number;
  title: string;
  userName: string;
};

// 데모데이용 이벤트 생성
export async function createDemoEvent(): Promise<DemoEvent> {
  const { data } = await instance.post("/demo/events");
  return data;
}

// 내 데모 이벤트 조회
export async function getMyDemoEvent(): Promise<DemoEvent> {
  const { data } = await instance.get("/demo/events/my");
  return data;
}

// 공유 링크로 데모 이벤트 조회 (비회원 접근 가능)
export async function getDemoEventByShareLink(shareLink: string): Promise<DemoEventPublic> {
  const { data } = await instance.get(`/demo/events/${shareLink}/public`);
  return data;
}

// 데모 편지 작성 (비회원 접근 가능)
export async function createDemoLetter(shareLink: string, writerName: string, content: string): Promise<DemoLetter> {
  const { data } = await instance.post(`/demo/events/${shareLink}/letters`, {
    writerName,
    content
  });
  return data;
}

// 내 데모 편지들 조회
export async function getMyDemoLetters(page = 1, size = 10) {
  const { data } = await instance.get("/demo/letters/my", {
    params: { page, size }
  });
  return data;
}

// 편지 읽음 처리
export async function markDemoLetterAsRead(letterId: number): Promise<void> {
  await instance.patch(`/demo/letters/${letterId}/read`);
}

// 데모 편지 상세 조회
export async function getDemoLetterById(letterId: number): Promise<DemoLetter> {
  const { data } = await instance.get(`/demo/letters/${letterId}`);
  return data;
}
