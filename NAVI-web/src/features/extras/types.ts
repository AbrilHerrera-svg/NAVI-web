export interface ExtraItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export type NewExtraInput = Omit<ExtraItem, 'id'>;
export type UpdateExtraInput = Partial<NewExtraInput>;
