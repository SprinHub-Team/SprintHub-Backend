export interface SprintResponse {
  id: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status: 'planificado' | 'activo' | 'completado';
  groupId: string;
  createdAt: string;
  updatedAt: string;
}
