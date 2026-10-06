# SprintHub-Backend

API REST para manejo de servidor **SprintHub** — plataforma de gestión de proyectos tipo Trello/Jira (grupos, tableros, columnas, tarjetas, comentarios) con tiempo real vía WebSockets.

> Repositorio: https://github.com/SprinHub-Team/SprintHub-Backend
> Equipo: SprinHub-Team
> Versión: 1.0.0
> Licencia: ISC

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación y arranque](#instalación-y-arranque)
4. [Variables de entorno](#variables-de-entorno)
5. [Arquitectura (Clean Architecture)](#arquitectura-clean-architecture)
6. [Estructura de carpetas](#estructura-de-carpetas)
7. [Modelos de Mongoose](#modelos-de-mongoose)
8. [Repositories](#repositories)
9. [Services](#services)
10. [Controllers](#controllers)
11. [Routes (API REST)](#routes-api-rest)
12. [Middlewares](#middlewares)
13. [Sockets (Socket.io 4)](#sockets-socketio-4)
14. [Mappers y DTOs](#mappers-y-dtos)
15. [Dependency injection manual](#dependency-injection-manual)
16. [Scripts disponibles](#scripts-disponibles)
17. [Endpoints REST](#endpoints-rest)
18. [Eventos Socket.io](#eventos-socketio)
19. [Flujo de autenticación](#flujo-de-autenticación)
20. [Despliegue a producción](#despliegue-a-producción)

---

## Stack tecnológico

| Capa | Tecnología | Versión | Uso |
|---|---|---|---|
| Runtime | Node.js | >=20.0.0 | Servidor HTTP + WebSockets |
| Framework | Express | ^5.2.1 | API REST + middlewares |
| Lenguaje | TypeScript | ^7.0.2 | Tipado estático |
| ODM | Mongoose | ^9.9.3 | Modelos de MongoDB con hooks pre/post |
| Base de datos | MongoDB Atlas | cloud | 9 colecciones |
| Tiempo real | Socket.io | ^4.8.3 | 4 handlers (board, column, card, comment) |
| Auth | JSON Web Tokens (jsonwebtoken) | ^9.0.3 | authMiddleware + socketAuthMiddleware |
| Hashing | bcrypt | ^6.0.0 | password hashing |
| Uploads | multer + file-type | ^2.4.0 + ^22.1.1 | Subida de archivos con validación por mime type |
| Archivos | Cloudinary | ^2.11.0 | Storage de imágenes y archivos |
| Validación | Zod | ^4.4.3 | DTOs de entrada |
| CORS | cors | ^2.8.6 | Cross-origin requests |
| Auth adicional | @supabase/supabase-js | ^2.116.0 | Integración con Supabase |
| Variables | dotenv | ^17.4.2 | Carga de .env |
| Dev tooling | tsx + ts-node-dev + typescript | ^4.23 / ^2.0 / ^7.0 | Hot reload + build |

---

## Requisitos previos

- **Node.js** v20+ (verifica con `node -v`)
- **MongoDB Atlas** account (free tier OK) — obtén `MONGODB_URI`
- **Cloudinary** account — obtén `CLOUD_NAME`, `API_KEY`, `API_SECRET`
- **npm** o **pnpm** gestor de paquetes
- **Git** y cuenta GitHub con acceso al repo
- **Postman** o **Insomnia** para probar endpoints

---

## Instalación y arranque

```bash
# 1. Clonar el repo
git clone https://github.com/SprinHub-Team/SprintHub-Backend.git
cd SprintHub-Backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver Variables de entorno)

# 4. Verificar que TypeScript compila
npm run check

# 5. Arrancar en modo desarrollo (hot reload)
npm run dev

# 6. Build de producción
npm run build

# 7. Arrancar producción
npm start
```

El servidor levanta en `http://localhost:<PORT>` (ver `.env`). Verifica con:

```bash
curl http://localhost:<PORT>/api/health
# {"status":"ok"}
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```bash
# Servidor
PORT=3001
SERVER_URL=http://localhost:3001

# Base de datos
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sprinthub

# JWT
JWT_SECRET=<tu-secreto-super-largo-y-aleatorio>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<tu-cloud-name>
CLOUDINARY_API_KEY=<tu-api-key>
CLOUDINARY_API_SECRET=<tu-api-secret>

# CORS (origen del frontend en producción)
CORS_ORIGIN=http://localhost:3000

# Supabase (opcional)
SUPABASE_URL=<tu-supabase-url>
SUPABASE_ANON_KEY=<tu-anon-key>
```

> ⚠️ **IMPORTANTE**: nunca commitear `.env`. El archivo `.env.example` debe estar en el repo como plantilla.

---

## Arquitectura (Clean Architecture)

El backend sigue una arquitectura por capas con **inyección de dependencias manual**. Cada capa solo conoce la inmediatamente inferior:

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTTP / WebSocket                          │
└──────────────┬───────────────────────────────┬─────────────────┘
               │                               │
   ┌───────────▼──────────┐      ┌────────────▼────────────┐
   │   routes/ (Express)  │      │   sockets/handlers/     │
   │   requireAuth         │      │   socketAuthMiddleware  │
   └───────────┬──────────┘      └────────────┬────────────┘
               │                               │
               └───────────────┬───────────────┘
                               │
                ┌──────────────▼──────────────┐
                │   controllers/ (HTTP logic) │
                │   · auth, user, group, board│
                │   · column, card, comment   │
                │   · sprint, projectDocument │
                │   · cardPB, report, template│
                └──────────────┬──────────────┘
                               │
                ┌──────────────▼──────────────┐
                │   service/ (business logic) │
                │   12 services + storage     │
                └──────────────┬──────────────┘
                               │
                ┌──────────────▼──────────────┐
                │   repository/ (data access) │
                │   10 repositories          │
                └──────────────┬──────────────┘
                               │
                ┌──────────────▼──────────────┐
                │   models/ (Mongoose schemas)│
                │   9 modelos                 │
                └──────────────┬──────────────┘
                               │
                ┌──────────────▼──────────────┐
                │      MongoDB Atlas          │
                └─────────────────────────────┘
```

**Inyección manual**: `dependencies/` contiene 3 archivos que instancian y cablean las dependencias:

```
dependencies/
├── repositoryDependency.ts   → exporta { userRepository, groupRepository, ... }
├── serviceDependency.ts     → importa repositories + exporta { authService, groupService, ... }
└── controllerDependency.ts  → importa services + exporta { controllers: { authController, groupController, ... } }
```

Los routers y sockets importan `controllers` desde `controllerDependency.ts`, evitando circular imports.

---

## Estructura de carpetas

```
SprintHub-Backend/
├── src/
│   ├── app.ts                       # Express app (CORS, JSON, routes mount)
│   ├── server.ts                    # HTTP server + Socket.io setup
│   ├── config/
│   │   ├── env.ts                   # Variables de entorno tipadas
│   │   └── database.ts              # connectDatabase() con Mongoose
│   ├── models/                      # 9 modelos Mongoose (ver más abajo)
│   ├── repository/                  # 10 repositories (CRUD genérico)
│   ├── service/                     # 12 services + storage/
│   │   └── storage/                 # Subida a Cloudinary
│   ├── controllers/                # 9 controllers HTTP
│   ├── routes/                     # 9 routers Express
│   ├── sockets/
│   │   ├── socket.ts                # configureSockets(httpServer) + getIo()
│   │   ├── socketAuthMiddleware.ts  # JWT auth para sockets
│   │   └── handlers/                # 4 handlers (board, column, card, comment)
│   ├── middlewares/
│   │   ├── authMiddleware.ts        # requireAuth (JWT)
│   │   ├── errorMiddleware.ts        # Manejo centralizado de errores
│   │   └── uploadMiddleware.ts       # multer + file-type
│   ├── mappers/                    # 11 mappers entity → DTO response
│   ├── dtos/
│   │   ├── input/                   # 11 DTOs de entrada con Zod
│   │   └── response/                # DTOs de respuesta
│   ├── dependencies/                # Inyección manual (ver arriba)
│   ├── errors/                      # Custom error classes
│   ├── utils/                       # Helpers (logger, token, etc.)
│   └── types/                       # Tipos compartidos
├── package.json
├── tsconfig.json
└── README.md
```

---

## Modelos de Mongoose

Ubicación: `src/models/`

| Modelo | Archivo | Campos principales | Hooks pre('findOneAndDelete') |
|---|---|---|---|
| **User** | `User.ts` | name, email (unique), document (unique), passwordHash, profilePicture{path, fileName, url} | Borra referencias en `Group.members.user` |
| **Group** | `Group.ts` | name, description, profilePicture, members[{user ref→User, role enum[admin\|collaborator]}] | Borra Boards hijos |
| **Board** | `Board.ts` | title, description, groupId ref→Group | Borra Columns hijos |
| **Column** | `Column.ts` | name, boardId ref→Board | Borra Cards hijos |
| **Card** | `Card.ts` | title, description, columnId ref→Column, assignedTo ref→User, dueDate, priority enum[alta\|media\|baja], files[] | Borra Comments hijos |
| **Comment** | `Comment.ts` | name, description, cardId ref→Card, createdBy ref→User | — |
| **Sprint** | `Sprint.ts` | (consultar schema) | — |
| **ProjectDocument** | `ProjectDocument.ts` | (consultar schema) | — |
| **CardPB** | `CardPB.ts` | (consultar schema) | — |

### Cadena principal (hooks en cascada)

```
User  ←───  Group.members.user
                ↓
              Group  ───┐ borra Boards hijos
                        ↓
                      Board  ───┐ borra Columns hijos
                                ↓
                              Column  ───┐ borra Cards hijos
                                          ↓
                                        Card  ───┐ borra Comments hijos
                                                  ↓
                                                Comment
```

### Ejemplo de modelo (User.ts)

```typescript
import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { GroupModel } from './Group';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    document: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePicture: {
      path: { type: String },
      fileName: { type: String },
      url: { type: String },
    },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre('findOneAndDelete', async function () {
  const userId = this.getQuery()._id;
  if (!userId) return;
  await GroupModel.updateMany(
    { 'members.user': userId },
    { $pull: { members: { user: userId } } }
  );
});

export type IUser = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);
```

---

## Repositories

Ubicación: `src/repository/` (singular, ojo)

| Repository | Modelo asociado |
|---|---|
| userRepository.ts | User |
| groupRepository.ts | Group |
| boardRepository.ts | Board |
| columnRepository.ts | Column |
| cardRepository.ts | Card |
| commentRepository.ts | Comment |
| sprintRepository.ts | Sprint |
| projectDocumentRepository.ts | ProjectDocument |
| cardPBRepository.ts | CardPB |
| reportRepository.ts | (agregaciones, no modelo directo) |

### API genérica de cada repository

```typescript
class GenericRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: FilterQuery<T>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
```

---

## Services

Ubicación: `src/service/` (singular)

| Service | Responsabilidad |
|---|---|
| authService.ts | login, register, profile, JWT generation, bcrypt hashing |
| userService.ts | CRUD users + validaciones |
| groupService.ts | CRUD groups + gestión de miembros (admin/collaborator) |
| boardService.ts | CRUD boards + agregaciones con columns y cards |
| columnService.ts | CRUD columns + validación de boardId |
| cardService.ts | CRUD cards + asignación de User + archivos |
| commentService.ts | CRUD comments + validación de cardId y createdBy |
| sprintService.ts | (no explicado en curso, existe en repo) |
| projectDocumentService.ts | (no explicado en curso, existe en repo) |
| cardPbService.ts | (no explicado en curso, existe en repo) |
| reportService.ts | Reportes con agregaciones Mongoose |
| **storage/** | `storageService.ts` - subida a Cloudinary con multer + file-type |

### Patrón Service

```typescript
class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async create(input: GroupInputDto): Promise<GroupResponseDto> {
    // 1. Validar input con Zod
    // 2. Verificar reglas de negocio (ej: usuario existe)
    // 3. Delegar al repository
    // 4. Mapear entity → DTO response
  }
}
```

---

## Controllers

Ubicación: `src/controllers/`

| Controller | Responsabilidad HTTP |
|---|---|
| authController.ts | POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile |
| userController.ts | CRUD /api/users |
| groupController.ts | CRUD /api/groups + addMember/removeMember |
| boardController.ts | CRUD /api/groups/:groupId/boards, applyTemplate |
| (columnController implícito) | vía cardController + columnSocket |
| cardController.ts | CRUD /api/cards + assignTo + fileAdd/fileRemove |
| (commentController implícito) | vía commentSocket |
| cardPBController.ts | (no explicado en curso, existe en repo) |
| projectDocumentController.ts | (no explicado en curso, existe en repo) |
| reportController.ts | Reportes PDF/Excel |
| sprintController.ts | (no explicado en curso, existe en repo) |
| templateController.ts | Plantillas de board |

### Patrón Controller

```typescript
class GroupController {
  constructor(private groupService: GroupService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = groupInputDto.parse(req.body); // Zod
      const group = await this.groupService.create(input);
      res.status(201).json(group);
    } catch (error) {
      next(error); // errorMiddleware
    }
  }
}
```

---

## Routes (API REST)

Ubicación: `src/routes/`

| Router | Base path | Endpoints típicos | Middleware |
|---|---|---|---|
| authRoutes.ts | /api/auth | POST /register, POST /login, GET /profile | público + requireAuth para /profile |
| userRoutes.ts | /api/users | GET, POST, PUT, DELETE /:id | requireAuth |
| groupRoutes.ts | /api/groups | GET, POST, PUT, DELETE /:id + /:id/members | requireAuth |
| boardRoutes.ts | /api/boards | GET /group/:groupId, POST, PUT, DELETE /:id + /:id/apply-template | requireAuth |
| cardPBRoutes.ts | /api/card-pbs | CRUD | requireAuth |
| projectDocumentRoutes.ts | /api/project-documents | CRUD | requireAuth |
| reportRoutes.ts | /api/reports | GET + /export/pdf + /export/excel | requireAuth |
| sprintRoutes.ts | /api/sprints | CRUD | requireAuth |
| templateRoutes.ts | /api/templates | CRUD + apply | requireAuth |

### Ejemplo de router

```typescript
import { Router } from 'express';
import { controllers } from '../dependencies/controllerDependency';
import { requireAuth } from '../middlewares/authMiddleware';

const boardController = controllers.board;
const router = Router();

router.use(requireAuth);

router.get('/group/:groupId', boardController.findByGroupId.bind(boardController));
router.post('/', boardController.create.bind(boardController));
router.put('/:id', boardController.update.bind(boardController));
router.post('/:id/apply-template', boardController.applyTemplate.bind(boardController));
router.delete('/:id', boardController.delete.bind(boardController));

export default router;
```

---

## Middlewares

Ubicación: `src/middlewares/`

| Middleware | Archivo | Función |
|---|---|---|
| authMiddleware | authMiddleware.ts | `requireAuth` — verifica JWT en header `Authorization: Bearer <token>` y guarda `req.user` |
| errorMiddleware | errorMiddleware.ts | Captura errores en cola de Express, devuelve JSON con `{ error: { code, message } }` |
| uploadMiddleware | uploadMiddleware.ts | multer memoryStorage + file-type para validar mime type antes de subir a Cloudinary |

---

## Sockets (Socket.io 4)

### Configuración (`src/sockets/socket.ts`)

```typescript
import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { socketAuthMiddleware, AuthSocket } from './socketAuthMiddleware';
import { registerBoardHandlers } from './handlers/boardSocket';
import { registerColumnsHandlers } from './handlers/columnSocket';
import { registerCardHandlers } from './handlers/cardSocket';
import { registerCommentHandlers } from './handlers/commentSocket';

export function configureSockets(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: { origin: env.corsOrigin, methods: ['GET', 'POST'] },
  });

  io.use(socketAuthMiddleware); // JWT en conexión

  io.on('connection', (socket: AuthSocket) => {
    registerBoardHandlers(io, socket);
    registerColumnsHandlers(io, socket);
    registerCardHandlers(io, socket);
    registerCommentHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`[Socket] Usuario ${socket.data.userId} desconectado`);
    });
  });

  ioInstance = io;
  return io;
}

export function getIo(): SocketServer { /* singleton */ }
```

### socketAuthMiddleware.ts

```typescript
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export interface AuthSocket extends Socket {
  data: { userId: string; email: string };
}

export function socketAuthMiddleware(socket: AuthSocket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No token provided'));

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.data.userId = payload.userId;
    socket.data.email = payload.email;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
}
```

### Handlers

Ubicación: `src/sockets/handlers/`

| Handler | Eventos que escucha (emit) | Eventos que emite (broadcast) |
|---|---|---|
| boardSocket.ts | board:join, board:leave | (state updates) |
| columnSocket.ts | column:create, column:update, column:delete | column:created, column:updated, column:deleted |
| cardSocket.ts | card:create, card:update, card:delete, card:fileAdd, card:fileRemove | card:created, card:updated, card:deleted, card:fileAdded, card:fileRemoved |
| commentSocket.ts | comment:create, comment:update, comment:delete | comment:created, comment:updated, comment:deleted |

---

## Mappers y DTOs

### Mappers (`src/mappers/`)

11 archivos, uno por entidad. Patrón:

```typescript
// groupMapper.ts
export function toGroupResponseDto(group: IGroup): GroupResponseDto {
  return {
    id: group._id.toString(),
    name: group.name,
    description: group.description,
    members: group.members.map(m => ({
      user: m.user.toString(),
      role: m.role,
    })),
  };
}
```

### DTOs de entrada (`src/dtos/input/`)

Validados con **Zod 4.0**:

```typescript
// groupInputDto.ts
import { z } from 'zod';

export const groupInputDto = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  profilePicture: z.object({
    path: z.string(),
    fileName: z.string(),
    url: z.string().url(),
  }).optional(),
});

export type GroupInputDto = z.infer<typeof groupInputDto>;
```

11 DTOs:

- authInputDto.ts
- userInputDto.ts
- groupInputDto.ts
- boardInputDto.ts
- columnInputDto.ts
- cardInputDto.ts
- commentInputDto.ts
- sprintInputDto.ts
- projectDocumentInputDto.ts
- cardPbInputDto.ts
- reportInputDto.ts

### DTOs de respuesta (`src/dtos/response/`)

Estructuras planas para serializar entidades antes de enviarlas al cliente.

---

## Dependency injection manual

Ubicación: `src/dependencies/`

### repositoryDependency.ts

```typescript
import { UserModel } from '../models/User';
import { GroupModel } from '../models/Group';
// ... importar todos los modelos
import { UserRepository } from '../repository/userRepository';
import { GroupRepository } from '../repository/groupRepository';
// ...

export const repositories = {
  userRepository: new UserRepository(UserModel),
  groupRepository: new Repository(GroupModel),
  // ... 10 repositories
};
```

### serviceDependency.ts

```typescript
import { repositories } from './repositoryDependency';
import { AuthService } from '../service/authService';
import { GroupService } from '../service/groupService';
// ...

export const services = {
  authService: new AuthService(repositories.userRepository),
  groupService: new GroupService(repositories.groupRepository),
  // ... 12 services
};
```

### controllerDependency.ts

```typescript
import { services } from './serviceDependency';
import { AuthController } from '../controllers/authController';
import { GroupController } from '../controllers/groupController';
// ...

export const controllers = {
  auth: new AuthController(services.authService),
  group: new GroupController(services.groupService),
  // ... 9 controllers
};
```

---

## Scripts disponibles

```json
{
  "scripts": {
    "check": "tsc --noEmit",
    "dev": "tsx watch src/server.ts",
    "dev:debug": "tsx watch --inspect=9229 src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

| Script | Uso |
|---|---|
| `npm run check` | Verifica que TypeScript compila sin errores |
| `npm run dev` | Arranca en desarrollo con hot reload (tsx watch) |
| `npm run dev:debug` | Hot reload con inspector de Node en puerto 9229 |
| `npm run build` | Compila a `dist/` para producción |
| `npm start` | Arranca el bundle de producción desde `dist/server.js` |

---

## Endpoints REST

### Auth

| Método | Path | Auth | Body | Respuesta |
|---|---|---|---|---|
| POST | /api/auth/register | ❌ | `{ name, email, document, password }` | `{ token, user }` |
| POST | /api/auth/login | ❌ | `{ email, password }` | `{ token, user }` |
| GET | /api/auth/profile | ✅ | — | `{ user }` |

### Groups (todos requieren `requireAuth`)

| Método | Path | Descripción |
|---|---|---|
| GET | /api/groups | Lista mis grupos |
| POST | /api/groups | Crea grupo (yo soy admin) |
| GET | /api/groups/:id | Detalle de un grupo |
| PUT | /api/groups/:id | Edita nombre/description/profilePicture |
| DELETE | /api/groups/:id | Elimina grupo (cascade Boards) |
| POST | /api/groups/:id/members | Añade miembro `{ email, role }` |
| DELETE | /api/groups/:id/members/:userId | Elimina miembro |

### Boards

| Método | Path | Descripción |
|---|---|---|
| GET | /api/boards/group/:groupId | Boards de un grupo |
| POST | /api/boards | Crea board en un grupo |
| PUT | /api/boards/:id | Edita board |
| DELETE | /api/boards/:id | Elimina board (cascade Columns) |
| POST | /api/boards/:id/apply-template | Aplica plantilla |

### Cards / Columns / Comments

> Las columnas, cards y comentarios se manejan principalmente vía **Sockets** (ver sección siguiente). Los endpoints REST existen pero los sockets son el camino principal para CRUD en tiempo real.

---

## Eventos Socket.io

### Emit (cliente → server, 13 eventos)

```typescript
// Frontend emite:
socket.emit('board:join', { boardId });
socket.emit('board:leave', { boardId });

socket.emit('column:create', { boardId, name });
socket.emit('column:update', { columnId, name });
socket.emit('column:delete', { columnId });

socket.emit('card:create', { columnId, title, description, assignedTo, dueDate, priority });
socket.emit('card:update', { cardId, ...campos });
socket.emit('card:delete', { cardId });
socket.emit('card:fileAdd', { cardId, file });
socket.emit('card:fileRemove', { cardId, fileId });

socket.emit('comment:create', { cardId, name, description });
socket.emit('comment:update', { commentId, ...campos });
socket.emit('comment:delete', { commentId });
```

### Broadcast (server → clientes conectados al board, 11 eventos)

```typescript
// Server emite a todos los sockets en la room del board:
io.to(`board:${boardId}`).emit('column:created', column);
io.to(`board:${boardId}`).emit('column:updated', column);
io.to(`board:${boardId}`).emit('column:deleted', { columnId });

io.to(`board:${boardId}`).emit('card:created', card);
io.to(`board:${boardId}`).emit('card:updated', card);
io.to(`board:${boardId}`).emit('card:deleted', { cardId });
io.to(`board:${boardId}`).emit('card:fileAdded', { cardId, file });
io.to(`board:${boardId}`).emit('card:fileRemoved', { cardId, fileId });

io.to(`board:${boardId}`).emit('comment:created', comment);
io.to(`board:${boardId}`).emit('comment:updated', comment);
io.to(`board:${boardId}`).emit('comment:deleted', { commentId });
```

---

## Flujo de autenticación

```
┌──────────┐   POST /api/auth/register    ┌──────────────┐
│ Frontend │ ─────────────────────────►   │ authController │
│          │   { name, email, document,    │              │
│          │     password }                │              │
│          │                              │              │
│          │   ◄─────────────────────────  │              │
│          │   { token: JWT, user: {...} } │              │
└──────────┘                              └──────────────┘
```

1. **Register**: el frontend envía los datos al backend, el `authService.register` valida con Zod (`authInputDto`), hashea el password con `bcrypt.hash(password, 10)`, crea el `UserModel` y devuelve `{ token, user }`.
2. **Login**: `authService.login` verifica el password con `bcrypt.compare`, genera un JWT con `jsonwebtoken.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' })`.
3. **Profile**: `GET /api/auth/profile` con header `Authorization: Bearer <token>`. El `requireAuth` middleware valida el token y popula `req.user`.
4. **Sockets**: el frontend conecta con `socket.auth = { token }`. El `socketAuthMiddleware` verifica el JWT y guarda `socket.data.userId`.

---

## Despliegue a producción

### Opción 1: Render

1. Fork del repo a tu cuenta
2. En Render: New → Web Service → conectar repo
3. Configurar:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: ver [Variables de entorno](#variables-de-entorno)
4. Deploy

### Opción 2: Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Variables de entorno en producción

```bash
PORT=3001  # Railway/Render asigna automáticamente, sobreescribir si es necesario
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<secreto-largo-y-aleatorio-de-64-chars>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CORS_ORIGIN=https://sprinthub.vercel.app  # URL del frontend
```

### Health check

```bash
curl https://sprinthub-api.onrender.com/api/health
# {"status":"ok","uptime":...}
```

---

## Contribución

1. Fork del repo
2. Crea una rama: `git checkout -b feature/nueva-feature`
3. Commit con conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
4. Push: `git push origin feature/nueva-feature`
5. Abre un Pull Request contra `main`

### Reglas

- ✅ Pasa `npm run check` antes de commitear
- ✅ Usa TypeScript estricto (no `any` sin justificación)
- ✅ Valida todos los inputs con Zod
- ✅ Maneja errores en `errorMiddleware`, no en controllers
- ✅ Sigue el patrón de capas (no instanciar repositories en controllers)

---

## Equipo

**SprinHub-Team**: https://github.com/SprinHub-Team

---

## Licencia

ISC — ver [LICENSE](LICENSE)
