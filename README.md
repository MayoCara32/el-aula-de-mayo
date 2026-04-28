# El aula de Mayo

Aplicación web profesional para la gestión de calificaciones y opiniones de los cursos impartidos por Castrejón Ramírez Marcos Guillermo.

## Características Principales

*   **Página Pública Minimalista:** Un diseño moderno y elegante con soporte para modo oscuro.
*   **Gestor de Cursos:** Listado de cursos activos e información detallada.
*   **Sistema de Reseñas:** Formulario de calificación con sistema de estrellas y bloqueo inteligente para evitar que un mismo alumno califique dos veces el mismo curso (usando \`visitorId\`).
*   **Panel de Administrador (Dashboard):** Espacio seguro para moderar las opiniones (aprobar, rechazar o eliminar) y administrar los cursos (crear, editar, activar).
*   **Exportación de Datos:** Botón para exportar directamente todas las opiniones recibidas a un archivo \`.csv\`.

## Tecnologías Utilizadas

*   **Next.js 14 (App Router)** - Framework de React.
*   **TypeScript** - Para tipado estático seguro.
*   **Tailwind CSS** - Estilos rápidos, modernos y responsive.
*   **Supabase** - Base de datos PostgreSQL alojada en la nube.
*   **jose / bcryptjs** - Para seguridad en la autenticación de administradores.

---

## 🚀 Guía Rápida de Instalación (Local)

### 1. Clonar e Instalar
Abre tu terminal y ejecuta:
\`\`\`bash
npm install
\`\`\`

### 2. Configuración de Base de Datos (Supabase)
1. Ve a [Supabase](https://supabase.com/) y crea un nuevo proyecto.
2. Abre la sección de **SQL Editor** en tu panel de Supabase.
3. Copia el contenido del archivo \`supabase/schema.sql\` que se encuentra en la raíz de este proyecto y ejecútalo para crear las tablas.
4. Opcionalmente, ejecuta \`supabase/seed.sql\` para cargar cursos y opiniones de prueba.

### 3. Variables de Entorno
Crea o edita el archivo \`.env.local\` en la raíz de tu proyecto e incluye las claves de tu proyecto de Supabase (las encuentras en **Project Settings** -> **API**):

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://[TU_PROYECTO].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[TU_ANON_KEY]
ADMIN_SESSION_SECRET=una_cadena_secreta_para_sesiones
\`\`\`

### 4. Crear Usuario Administrador Inicial
Para crear automáticamente tu usuario de acceso, con el servidor local en ejecución, visita en tu navegador la ruta secreta de instalación:
**\`http://localhost:3000/api/setup\`**

### 5. Iniciar Servidor de Desarrollo
\`\`\`bash
npm run dev
\`\`\`
Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

---

## 🌐 Despliegue en Vercel

Este proyecto está preparado al 100% para ser desplegado de manera gratuita en Vercel.

1. Sube tu código a un repositorio en **GitHub**.
2. Ingresa a [Vercel](https://vercel.com/) y selecciona "Add New Project".
3. Conecta tu repositorio de GitHub.
4. Antes de hacer click en "Deploy", asegúrate de abrir la sección **Environment Variables** en Vercel y agregar las tres variables de entorno usadas en tu \`.env.local\`.
5. ¡Haz click en Deploy y tu sitio estará en línea en un par de minutos!

---

## Estructura de Rutas

*   \`/ \` -> Landing Page
*   \`/courses\` -> Lista de cursos disponibles
*   \`/courses/[slug]\` -> Detalle del curso y opiniones aprobadas
*   \`/courses/[slug]/review\` -> Formulario para calificar el curso
*   \`/admin/login\` -> Acceso Administrador
*   \`/admin/\` -> Dashboard estadístico
*   \`/admin/courses\` -> Administración de cursos (CRUD)
*   \`/admin/reviews\` -> Moderación de opiniones
