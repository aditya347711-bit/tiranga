export interface CardData {
  photo: string | null; // Data URL or Blob URL
  name: string;
  idNo: string;
  phone: string;
  address: string;
}

export const DEFAULT_CARD_DATA: CardData = {
  photo: null,
  name: "Anil Kumar",
  idNo: "IND-2026-7890",
  phone: "+91 98765 43210",
  address: "123, Bharat Marg, New Delhi - 110001",
};
