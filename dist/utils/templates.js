"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOARD_TEMPLATES = void 0;
exports.BOARD_TEMPLATES = [
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
