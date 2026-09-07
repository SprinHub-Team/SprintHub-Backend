# SprintHub Backend

Backend de **SprintHub**, una plataforma de gestión y seguimiento de proyectos orientada al trabajo colaborativo. El sistema busca simplificar la planificación y ejecución de proyectos mediante una experiencia contextual, reduciendo la curva de aprendizaje y proporcionando herramientas que facilitan la organización del trabajo.

El backend proporciona la lógica de negocio, persistencia de datos, autenticación y comunicación mediante una API REST desacoplada del cliente.

## Características

* Gestión de proyectos y equipos de trabajo.
* Organización y seguimiento de tareas.
* Gestión de usuarios y roles.
* Autenticación y autorización.
* Comunicación mediante API REST.
* Persistencia de información utilizando MongoDB.
* Arquitectura desacoplada entre cliente y servidor.
* Implementación completamente tipada con TypeScript.
* Separación de responsabilidades mediante una estructura MVC.
* Diseño orientado a facilitar la evolución y mantenimiento del sistema.

## Arquitectura

El proyecto utiliza una arquitectura **MVC desacoplada**, donde cada componente posee una responsabilidad específica dentro del flujo de la aplicación.

```text
Cliente
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Models
   │
   ▼
MongoDB
```

### Capas principales

**Controllers**

Reciben las solicitudes HTTP, validan la información necesaria y coordinan la ejecución de los casos de uso correspondientes.

**Services**

Contienen la lógica de negocio de la aplicación, evitando concentrar responsabilidades dentro de los controladores.

**Models**

Representan las estructuras de datos utilizadas por la aplicación y su interacción con MongoDB.

**Routes**

Definen los endpoints disponibles y conectan las solicitudes HTTP con los controladores correspondientes.

**Middlewares**

Implementan procesos transversales como autenticación, autorización, validaciones y manejo de solicitudes.

## Stack tecnológico

| Tecnología | Uso                         |
| ---------- | --------------------------- |
| Node.js    | Entorno de ejecución        |
| Express    | Framework para la API       |
| TypeScript | Lenguaje principal          |
| MongoDB    | Base de datos               |
| Mongoose   | Modelado y acceso a MongoDB |

## Estructura general

```text
src/
├── controllers/
├── models/
├── services/
├── routes/
├── middlewares/
├── ...
```

La estructura puede evolucionar conforme se incorporen nuevos módulos y funcionalidades al sistema.

## Instalación

### Requisitos

* Node.js
* npm
* MongoDB

### Clonar el repositorio

```bash
git clone https://github.com/SprinHub-Team/SprintHub-Backend.git
cd SprintHub-Backend
```

### Instalar dependencias

```bash
npm install
```

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las variables requeridas por la aplicación.

```env
PORT=3000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret
```

Los nombres y valores concretos de las variables deben corresponder a la configuración utilizada por el proyecto.

### Ejecutar en desarrollo

```bash
npm run dev
```

### Compilar

```bash
npm run build
```

### Ejecutar producción

```bash
npm start
```

## API

El backend expone una API REST consumida por el cliente web.

La separación entre frontend y backend permite que los servicios puedan evolucionar independientemente y facilita futuras integraciones con otros clientes o servicios.

## Principios de desarrollo

SprintHub Backend busca mantener:

* Separación clara de responsabilidades.
* Bajo acoplamiento entre componentes.
* Reutilización de lógica de negocio.
* Tipado estático mediante TypeScript.
* Código mantenible y escalable.
* Validación de datos en los puntos correspondientes.
* Interfaces claras entre las diferentes capas de la aplicación.

## Estado del proyecto

El proyecto se encuentra en desarrollo activo. Las funcionalidades, endpoints y estructuras internas pueden evolucionar a medida que se incorporen nuevos módulos.

## Equipo

**SprintHub Team**

Repositorio:

https://github.com/SprinHub-Team/SprintHub-Backend
