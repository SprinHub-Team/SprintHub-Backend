export const BOARD_TEMPLATES = [
  {
    id: 'kanban',
    name: 'Kanban',
    description: 'Visualiza el trabajo y maximiza la eficiencia.',
    columns: [
      { title: 'Por hacer', order: 1 },
      { title: 'En progreso', order: 2 },
      { title: 'Listo', order: 3 }
    ]
  },
  {
    id: 'scrum',
    name: 'Scrum',
    description: 'Trabaja hacia objetivos fijos mediante sprints.',
    columns: [
      { title: 'Backlog', order: 1 },
      { title: 'Seleccionado para Desarrollo', order: 2 },
      { title: 'En progreso', order: 3 },
      { title: 'Listo', order: 4 }
    ]
  },
  {
    id: 'bug_tracking',
    name: 'Seguimiento de Errores',
    description: 'Gestiona y haz seguimiento de bugs y problemas de software.',
    columns: [
      { title: 'Reportado', order: 1 },
      { title: 'En revisión', order: 2 },
      { title: 'En progreso', order: 3 },
      { title: 'En pruebas', order: 4 },
      { title: 'Resuelto', order: 5 }
    ]
  }
];

export const DEFAULT_BOARD_COLUMNS = ['Por hacer', 'En proceso', 'Hecho'];

function normalizeColumnName(name: string) {
  return name.trim().toLowerCase().replace('revisi�n', 'revisión');
}

export function orderBoardColumns<T extends { name: string; templateOrder?: number | null }>(columns: T[]): T[] {
  const ordered = columns.flatMap(column => column.templateOrder == null ? [] : [{ column, order: column.templateOrder }]);
  if (ordered.length) {
    ordered.sort((a, b) => a.order - b.order);
    return [...ordered.map(entry => entry.column), ...columns.filter(column => column.templateOrder == null)];
  }

  // Older boards created template columns in parallel, without saving their positions.
  const templates = [...BOARD_TEMPLATES.map(template => template.columns.map(column => column.title)), DEFAULT_BOARD_COLUMNS];
  for (const titles of templates) {
    const matches = titles.map(title => columns.filter(column => normalizeColumnName(column.name) === normalizeColumnName(title)));
    if (matches.some(group => group.length !== 1)) continue;
    const templateColumns = matches.map(([column]) => column);
    const remaining = columns.filter(column => !templateColumns.includes(column));
    return [...templateColumns, ...remaining];
  }
  return columns;
}
