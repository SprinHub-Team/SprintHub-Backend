export type BoardResponse = {
  id: string;
  title: string;
  description: string;
  groupId: string;
  ownerId: string;
};

export type BoardDetailsResponse = Omit<BoardResponse, 'ownerId'> & {
  columns: {
    id: string;
    name: string;
    cards: {
      id: string;
      title: string;
      priority: 'alta' | 'media' | 'baja';
      dueDate: string | null;
      filesCount: number;
    }[];
  }[];
};
