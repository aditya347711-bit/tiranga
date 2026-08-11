export interface CardData {
  id?: string;
  photo: string | null; // Data URL or Blob URL
  name: string;
  idNo: string;
  address: string;
  phone?: string;
  createdAt?: string;
}

export interface SavedCard extends CardData {
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

export const DEFAULT_CARD_DATA: CardData = {
  photo: null,
  name: "",
  idNo: "IND-2026-7890",
  address: "",
  phone: "",
};

