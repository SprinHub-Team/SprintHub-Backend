export interface CardPbResponse {
  id: string;
  title: string;
  description?: string;
  groupId: string;
  sprintId?: string | null;
  assignedTo?: string | null;
  dueDate?: string | null;
  priority: 'alta' | 'media' | 'baja';
  createdAt: string;
  updatedAt: string;
}
