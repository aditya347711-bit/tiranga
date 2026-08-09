export interface CardData {
  photo: string | null; // Data URL or Blob URL
  name: string;
  idNo: string;
  address: string;
}

export const DEFAULT_CARD_DATA: CardData = {
  photo: null,
  name: "Anil Kumar",
  idNo: "IND-2026-7890",
  address: "Garhwa, Jharkhand",
};
