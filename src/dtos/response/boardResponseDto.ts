export type BoardResponse = {
  id: string;
  title: string;
  description: string;
  groupId: string;
};

export type BoardDetailsResponse = BoardResponse & {
  columns: {
    id: string;
    cards: {
      id: string;
      title: string;
      priority: 'alta' | 'media' | 'baja';
      dueDate: string | null;
      filesCount: number;
    }[];
  }[];
};
