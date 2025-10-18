# Validación de Roles Exclusivos - Frontend

## Descripción
Este documento describe la implementación de la validación de roles exclusivos en el frontend de la aplicación de elecciones.

## Componentes Implementados

### 1. Hook de Validación de Roles
**Archivo**: `src/hooks/useRoleValidation.js`

```javascript
import { useRoleValidation } from '../hooks/useRoleValidation';

const MyComponent = () => {
  const { error, success, handleError, handleSuccess, clearMessages } = useRoleValidation();
  
  // Usar en operaciones que pueden generar errores de roles duplicados
};
```

**Funcionalidades**:
- Manejo centralizado de errores de roles duplicados
- Detección automática de errores HTTP 409 (Conflict)
- Mensajes de error personalizados
- Gestión de estados de éxito y error

### 2. Componente de Alerta de Error
**Archivo**: `src/components/ErrorAlert.jsx`

```javascript
import ErrorAlert from '../components/ErrorAlert';

<ErrorAlert 
  error={error} 
  onClose={clearMessages}
  variant="danger"
/>
```

**Características**:
- Alertas visuales mejoradas
- Iconos específicos por tipo de error
- Dismissible y personalizable
- Soporte para diferentes variantes (danger, warning, etc.)

### 3. Componente de Información de Roles
**Archivo**: `src/components/RoleInfo.jsx`

```javascript
import RoleInfo from '../components/RoleInfo';

<RoleInfo 
  persona={persona}
  existingRole="Jurado"
  className="mb-3"
/>
```

**Funcionalidades**:
- Muestra información sobre roles existentes
- Alertas de advertencia visual
- Badges informativos

### 4. Validador de Personas
**Archivo**: `src/components/PersonaRoleValidator.jsx`

```javascript
import PersonaRoleValidator from '../components/PersonaRoleValidator';

<PersonaRoleValidator 
  personaId={personaId}
  onRoleCheck={handleRoleCheck}
  onValidationChange={handleValidationChange}
/>
```

**Características**:
- Validación previa de roles
- Callbacks para manejo de eventos
- Estados de carga y error
- Integración con servicios

## Servicios Actualizados

### 1. JuradoService
**Archivo**: `src/services/JuradoService.js`

```javascript
// Método original
export const createJurado = (jurado) => {
  return axios.post(API_URL, jurado);
};

// Método con validación
export const createJuradoWithValidation = async (jurado) => {
  try {
    const response = await axios.post(API_URL, jurado);
    return response;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error(error.response.data.message || 'Esta persona ya tiene un rol asignado y no puede ser registrada nuevamente.');
    }
    throw error;
  }
};
```

### 2. VeedorService
**Archivo**: `src/services/VeedorService.js`

```javascript
export const createVeedorWithValidation = async (veedor) => {
  try {
    const response = await axios.post(API_URL, veedor);
    return response;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error(error.response.data.message || 'Esta persona ya tiene un rol asignado y no puede ser registrada nuevamente.');
    }
    throw error;
  }
};
```

### 3. DelegadoService
**Archivo**: `src/services/DelegadoService.js`

```javascript
export const createDelegadoWithValidation = async (delegado) => {
  try {
    const response = await axios.post(API_URL, delegado);
    return response;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error(error.response.data.message || 'Esta persona ya tiene un rol asignado y no puede ser registrada nuevamente.');
    }
    throw error;
  }
};
```

## Páginas Actualizadas

### 1. JuradosAdmin
**Archivo**: `src/pages/admin/JuradosAdmin.jsx`

**Cambios implementados**:
- Uso del hook `useRoleValidation`
- Componente `ErrorAlert` para errores
- Manejo mejorado de errores en operaciones de sorteo
- Mensajes de error específicos para roles duplicados

### 2. VeedoresAdmin
**Archivo**: `src/pages/admin/VeedoresAdmin.jsx`

**Cambios implementados**:
- Integración con `useRoleValidation`
- Alertas visuales mejoradas
- Manejo de errores en aprobación/rechazo
- Validación de roles en creación

### 3. DelegadosAdmin
**Archivo**: `src/pages/admin/DelegadosAdmin.jsx`

**Cambios implementados**:
- Uso de `createDelegadoWithValidation`
- Hook de validación de roles
- Componente de alerta de error
- Validación previa de roles

## Componente de Demostración

### RoleValidationDemo
**Archivo**: `src/components/RoleValidationDemo.jsx`

**Funcionalidades**:
- Demostración interactiva de la validación
- Simulación de asignación de roles
- Casos de prueba con personas que tienen roles
- Interfaz visual para entender el flujo

## Flujo de Validación en Frontend

### 1. Usuario intenta asignar rol
```javascript
// En el componente
const handleSubmit = async (formData) => {
  try {
    await createDelegadoWithValidation(formData);
    handleSuccess('Delegado creado exitosamente');
  } catch (error) {
    handleError(error); // Maneja automáticamente errores 409
  }
};
```

### 2. Detección de error HTTP 409
```javascript
// En useRoleValidation
const handleError = (error) => {
  if (error.response?.status === 409) {
    setError(error.response.data.message || 'Esta persona ya tiene un rol asignado...');
  }
};
```

### 3. Mostrar alerta visual
```javascript
// En el JSX
<ErrorAlert 
  error={error} 
  onClose={clearMessages}
  variant="danger"
/>
```

## Casos de Uso

### 1. Asignación Exitosa
- Usuario selecciona persona sin roles
- Asigna rol (Jurado, Veedor, Delegado)
- Sistema permite la asignación
- Muestra mensaje de éxito

### 2. Conflicto de Roles
- Usuario selecciona persona con rol existente
- Intenta asignar nuevo rol
- Sistema detecta conflicto
- Muestra alerta de error específica

### 3. Validación Previa
- Usuario selecciona persona
- Sistema verifica roles existentes
- Muestra información de roles actuales
- Previene asignación si hay conflicto

## Mensajes de Error

### Errores HTTP 409 (Conflict)
```
"Esta persona ya tiene un rol asignado (Jurado) y no puede ser registrada nuevamente como Veedor."
```

### Errores de Validación
```
"Debe seleccionar una persona"
"Debe seleccionar un partido"
"Debe seleccionar una mesa"
```

## Estilos y UX

### Alertas de Error
- Color rojo para errores críticos
- Iconos de advertencia
- Mensajes descriptivos
- Botón de cierre

### Alertas de Éxito
- Color verde para operaciones exitosas
- Mensajes confirmatorios
- Auto-dismissible

### Estados de Carga
- Spinners durante operaciones
- Botones deshabilitados
- Indicadores visuales

## Próximas Mejoras

### 1. Validación en Tiempo Real
- Verificar roles mientras el usuario escribe
- Sugerencias automáticas
- Validación instantánea

### 2. Historial de Roles
- Mostrar historial de cambios
- Auditoría de asignaciones
- Trazabilidad completa

### 3. Notificaciones Push
- Alertas en tiempo real
- Notificaciones de conflictos
- Sistema de alertas avanzado

### 4. Dashboard de Roles
- Vista general de asignaciones
- Estadísticas de roles
- Métricas de uso

## Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

### 3. Usar componentes
```javascript
import { useRoleValidation } from './hooks/useRoleValidation';
import ErrorAlert from './components/ErrorAlert';
import RoleInfo from './components/RoleInfo';
```

## Testing

### 1. Pruebas Unitarias
```bash
npm test
```

### 2. Pruebas de Integración
```bash
npm run test:integration
```

### 3. Pruebas E2E
```bash
npm run test:e2e
```

## Consideraciones Técnicas

### 1. Performance
- Lazy loading de componentes
- Memoización de validaciones
- Optimización de re-renders

### 2. Accesibilidad
- Navegación por teclado
- Screen readers
- Contraste de colores

### 3. Responsive Design
- Adaptación a móviles
- Layouts flexibles
- Componentes escalables

La implementación del frontend está completa y proporciona una experiencia de usuario fluida para la validación de roles exclusivos.
