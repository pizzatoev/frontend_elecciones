# Sistema de Elecciones - Frontend

## Estructura del Proyecto

Este proyecto frontend está construido con React + Vite y incluye todas las dependencias necesarias para el sistema de elecciones.

### Tecnologías Utilizadas

- **React** (con JSX)
- **Vite** (herramienta de construcción)
- **Axios** (para consumir APIs REST)
- **React Router DOM** (para navegación)
- **Bootstrap 5** + **React-Bootstrap** (para estilos y componentes)

### Estructura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Barra de navegación
│   ├── Sidebar.jsx     # Barra lateral
│   └── Modal.jsx       # Componente modal
├── pages/              # Páginas principales
│   ├── Home.jsx        # Página de inicio
│   ├── LoginAdmin.jsx  # Login de administrador
│   ├── LoginVoluntario.jsx # Login de voluntarios
│   ├── DashboardAdmin.jsx  # Dashboard administrador
│   ├── DashboardJurado.jsx # Dashboard jurado
│   ├── DashboardVeedor.jsx # Dashboard veedor
│   ├── DashboardDelegado.jsx # Dashboard delegado
│   └── RegistroVeedor.jsx # Registro de veedor
├── services/           # Servicios para API
│   ├── PersonaService.js # Servicio para personas
│   └── UsuarioService.js # Servicio para usuarios
├── App.jsx            # Componente principal con rutas
├── main.jsx          # Punto de entrada
└── index.css         # Estilos globales
```

### Configuración de la API

El proyecto está configurado para consumir la API del backend en:
- **URL Base**: `http://localhost:9090/api`

### Rutas Configuradas

- `/` - Página de inicio
- `/login-admin` - Login de administrador
- `/login-voluntario` - Login de voluntarios (Jurado, Veedor, Delegado)
- `/registro-veedor` - Registro de veedor
- `/dashboard-admin` - Dashboard administrador
- `/dashboard-jurado` - Dashboard jurado
- `/dashboard-veedor` - Dashboard veedor
- `/dashboard-delegado` - Dashboard delegado

### Funcionalidades Implementadas

#### Servicios de API
- **PersonaService**: CRUD completo para personas
- **UsuarioService**: Autenticación y gestión de usuarios

#### Páginas de Login
- Login diferenciado para administradores
- Login con pestañas para diferentes tipos de voluntarios
- Validación de credenciales
- Redirección automática según tipo de usuario

#### Dashboards
- Dashboard específico para cada tipo de usuario
- Verificación de autenticación
- Funcionalidades según el rol del usuario

#### Componentes Reutilizables
- **Navbar**: Navegación adaptativa según el estado de autenticación
- **Sidebar**: Menú lateral con opciones según el tipo de usuario
- **Modal**: Componente modal reutilizable

### Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

3. **Construir para producción**:
   ```bash
   npm run build
   ```

### Características del Sistema

- **Autenticación**: Sistema de login con diferentes roles
- **Navegación**: Enrutamiento completo con React Router
- **UI/UX**: Interfaz moderna con Bootstrap 5
- **Responsive**: Diseño adaptable a diferentes dispositivos
- **API Integration**: Conexión completa con el backend
- **Seguridad**: Verificación de autenticación en rutas protegidas

### Próximos Pasos

1. Conectar con el backend real
2. Implementar funcionalidades específicas de cada dashboard
3. Añadir validaciones adicionales
4. Implementar manejo de errores más robusto
5. Añadir tests unitarios

### Notas de Desarrollo

- El proyecto usa localStorage para manejar la autenticación
- Los tokens se almacenan localmente para mantener la sesión
- Cada dashboard verifica el tipo de usuario antes de mostrar contenido
- La navegación se adapta automáticamente según el estado de autenticación

