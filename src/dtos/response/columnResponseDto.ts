import { IColumn } from '../../models/Column';
import { ICard } from '../../models/Card';
import { CardResponse } from './cardResponseDto';

export type ColumnWithDetails = IColumn & {
  cards: ICard[];
};


export type ColumnResponse = {
  id: string;
  name: string;
  boardId: string;
};

export type ColumnDetailsResponse = ColumnResponse & {
  cards: CardResponse[];
};
