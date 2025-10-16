# 📋 Checklist de Pruebas de Integración - Sistema de Elecciones

## 🚀 **Fase 1: Preparación del Entorno**

### ✅ Backend (Spring Boot - Puerto 9090)
- [ ] **1.1** Levantar el backend Spring Boot en puerto 9090
- [ ] **1.2** Verificar que la base de datos MySQL esté conectada
- [ ] **1.3** Ejecutar migraciones/scripts de base de datos
- [ ] **1.4** Verificar logs del backend sin errores críticos

### ✅ Frontend (React + Vite)
- [ ] **1.5** Instalar dependencias: `npm install`
- [ ] **1.6** Levantar el frontend: `npm run dev`
- [ ] **1.7** Verificar que el frontend esté en puerto 5173 (o el configurado)
- [ ] **1.8** Abrir navegador en `http://localhost:5173`

---

## 🔍 **Fase 2: Verificación de Endpoints Backend**

### ✅ Endpoints Básicos
- [ ] **2.1** `GET http://localhost:9090/` - Health check
- [ ] **2.2** `GET http://localhost:9090/api/personas` - Lista personas
- [ ] **2.3** `GET http://localhost:9090/api/jurados` - Lista jurados
- [ ] **2.4** `GET http://localhost:9090/api/delegados` - Lista delegados
- [ ] **2.5** `GET http://localhost:9090/api/veedores` - Lista veedores

### ✅ Endpoints de Ubicación
- [ ] **2.6** `GET http://localhost:9090/api/departamentos` - Lista departamentos
- [ ] **2.7** `GET http://localhost:9090/api/provincias` - Lista provincias
- [ ] **2.8** `GET http://localhost:9090/api/municipios` - Lista municipios
- [ ] **2.9** `GET http://localhost:9090/api/mesas` - Lista mesas
- [ ] **2.10** `GET http://localhost:9090/api/recintos` - Lista recintos
- [ ] **2.11** `GET http://localhost:9090/api/asientos` - Lista asientos

### ✅ Endpoints de Gestión
- [ ] **2.12** `GET http://localhost:9090/api/partidos` - Lista partidos
- [ ] **2.13** `GET http://localhost:9090/api/veedores/instituciones` - Lista instituciones
- [ ] **2.14** `GET http://localhost:9090/api/credenciales` - Lista credenciales
- [ ] **2.15** `GET http://localhost:9090/api/veedores/solicitudes` - Lista solicitudes

### ✅ Endpoints por CI (Nuevos)
- [ ] **2.16** `GET http://localhost:9090/api/personas/by-ci/{ci}` - Persona por CI
- [ ] **2.17** `GET http://localhost:9090/api/jurados/by-ci/{ci}` - Jurado por CI
- [ ] **2.18** `GET http://localhost:9090/api/delegados/by-ci/{ci}` - Delegado por CI

### ✅ Endpoints de Credenciales (Nuevos)
- [ ] **2.19** `POST http://localhost:9090/api/credenciales/generate` - Generar credencial
- [ ] **2.20** `GET http://localhost:9090/api/credenciales/{id}/download` - Descargar credencial
- [ ] **2.21** `GET http://localhost:9090/api/credenciales/{id}/download-qr` - Descargar QR
- [ ] **2.22** `GET http://localhost:9090/api/credenciales/download-by-role-ci` - Descargar por rol y CI

---

## 🖥️ **Fase 3: Pruebas del Frontend**

### ✅ Pantalla Principal
- [ ] **3.1** Verificar que Home.jsx muestre la pantalla correcta (no template Vite)
- [ ] **3.2** Probar botón "Acceso Administrativo" → debe ir a `/admin/dashboard`
- [ ] **3.3** Probar botón "Acceso Voluntario" → debe ir a `/login-voluntario`
- [ ] **3.4** Verificar que los iconos y estilos se muestren correctamente

### ✅ Funcionalidad de Backend Check
- [ ] **3.5** Abrir consola del navegador
- [ ] **3.6** Ejecutar `checkBackendConnection()` - debe mostrar ✅
- [ ] **3.7** Ejecutar `checkEndpoints()` - debe mostrar ✅ para todos los endpoints
- [ ] **3.8** Verificar que no haya errores 404 o 500

---

## 👨‍💼 **Fase 4: Pruebas de Acceso Administrativo**

### ✅ Dashboard Admin
- [ ] **4.1** Navegar a `/admin/dashboard`
- [ ] **4.2** Verificar que se cargue el dashboard administrativo
- [ ] **4.3** Probar navegación entre pestañas (Personas, Ubicación, etc.)

### ✅ Gestión de Personas
- [ ] **4.4** Ir a pestaña "Gestión de Personas"
- [ ] **4.5** Verificar que se carguen las personas desde el backend
- [ ] **4.6** Probar crear nueva persona
- [ ] **4.7** Probar editar persona existente
- [ ] **4.8** Probar eliminar persona

### ✅ Gestión de Ubicación
- [ ] **4.9** Ir a pestaña "Ubicación Electoral"
- [ ] **4.10** Verificar carga de departamentos
- [ ] **4.11** Probar filtrado de provincias por departamento
- [ ] **4.12** Probar filtrado de municipios por provincia
- [ ] **4.13** Probar CRUD de mesas, recintos, asientos

### ✅ Gestión de Partidos/Instituciones
- [ ] **4.14** Ir a pestaña "Partidos/Instituciones"
- [ ] **4.15** Verificar carga de partidos
- [ ] **4.16** Verificar carga de instituciones
- [ ] **4.17** Probar CRUD de partidos
- [ ] **4.18** Probar CRUD de instituciones

### ✅ Gestión de Credenciales
- [ ] **4.19** Ir a pestaña "Credenciales"
- [ ] **4.20** Verificar carga de credenciales existentes
- [ ] **4.21** Probar generar credencial para jurado
- [ ] **4.22** Probar generar credencial para delegado
- [ ] **4.23** Probar generar credencial para veedor
- [ ] **4.24** Probar descargar credencial en PDF
- [ ] **4.25** Probar descargar credencial en QR

---

## 👥 **Fase 5: Pruebas de Acceso Voluntario**

### ✅ Login Voluntario
- [ ] **5.1** Navegar a `/login-voluntario`
- [ ] **5.2** Verificar que se cargue el formulario de login
- [ ] **5.3** Probar con CI válido de jurado
- [ ] **5.4** Probar con CI válido de delegado
- [ ] **5.5** Probar con CI válido de veedor
- [ ] **5.6** Probar con CI no válido (debe mostrar error)

### ✅ Dashboard de Jurado
- [ ] **5.7** Login con CI de jurado válido
- [ ] **5.8** Verificar que se carguen datos de la persona
- [ ] **5.9** Verificar que se carguen datos del jurado
- [ ] **5.10** Verificar que se carguen datos de la mesa asignada
- [ ] **5.11** Probar descarga de credencial PDF
- [ ] **5.12** Verificar que el archivo se descargue correctamente

### ✅ Dashboard de Delegado
- [ ] **5.13** Login con CI de delegado válido
- [ ] **5.14** Verificar que se carguen datos de la persona
- [ ] **5.15** Verificar que se carguen datos del delegado
- [ ] **5.16** Verificar que se carguen datos del partido
- [ ] **5.17** Verificar que se carguen datos de la mesa asignada
- [ ] **5.18** Probar descarga de credencial PDF
- [ ] **5.19** Verificar que el archivo se descargue correctamente

### ✅ Dashboard de Veedor
- [ ] **5.20** Login con CI de veedor válido
- [ ] **5.21** Verificar que se carguen datos de la persona
- [ ] **5.22** Verificar que se carguen datos del veedor
- [ ] **5.23** Verificar que se carguen datos de la institución
- [ ] **5.24** Verificar que se carguen datos de la mesa asignada
- [ ] **5.25** Probar descarga de credencial PDF

---

## 🔧 **Fase 6: Pruebas de Servicios Axios**

### ✅ Servicios Básicos
- [ ] **6.1** Probar `personaService.getByCi(ci)` con CI válido
- [ ] **6.2** Probar `juradoService.getByCi(ci)` con CI válido
- [ ] **6.3** Probar `delegadoService.getByCi(ci)` con CI válido
- [ ] **6.4** Probar `mesaService.getById(id)` con ID válido

### ✅ Servicios de Credenciales
- [ ] **6.5** Probar `credencialService.generateCredencial(data)`
- [ ] **6.6** Probar `credencialService.downloadCredencial(id, 'PDF')`
- [ ] **6.7** Probar `credencialService.downloadCredencialQR(id)`
- [ ] **6.8** Probar `credencialService.downloadPdfByRoleAndCi(rol, ci)`

### ✅ Servicios de Ubicación
- [ ] **6.9** Probar `departamentoService.listDepartamentos()`
- [ ] **6.10** Probar `provinciaService.listProvincias(departamentoId)`
- [ ] **6.11** Probar `municipioService.listMunicipios(provinciaId)`
- [ ] **6.12** Probar `mesaService.listMesas()`

---

## 🐛 **Fase 7: Pruebas de Manejo de Errores**

### ✅ Errores de Conexión
- [ ] **7.1** Detener el backend y probar frontend
- [ ] **7.2** Verificar que se muestren mensajes de error apropiados
- [ ] **7.3** Reiniciar backend y verificar que se recupere la conexión

### ✅ Errores de Datos
- [ ] **7.4** Probar con CI inexistente
- [ ] **7.5** Probar con ID de mesa inexistente
- [ ] **7.6** Probar descarga de credencial inexistente
- [ ] **7.7** Verificar que se muestren mensajes de error claros

### ✅ Validaciones
- [ ] **7.8** Probar formularios con datos inválidos
- [ ] **7.9** Probar campos requeridos vacíos
- [ ] **7.10** Probar formatos de CI incorrectos

---

## 📊 **Fase 8: Pruebas de Rendimiento**

### ✅ Carga de Datos
- [ ] **8.1** Medir tiempo de carga del dashboard admin
- [ ] **8.2** Medir tiempo de carga de listas grandes (100+ registros)
- [ ] **8.3** Probar filtros y búsquedas con datasets grandes
- [ ] **8.4** Verificar que no haya timeouts

### ✅ Descarga de Archivos
- [ ] **8.5** Medir tiempo de generación de credenciales
- [ ] **8.6** Medir tiempo de descarga de PDFs
- [ ] **8.7** Probar descarga de múltiples archivos simultáneos

---

## ✅ **Fase 9: Validación Final**

### ✅ Integración Completa
- [ ] **9.1** Flujo completo: Admin crea persona → Asigna rol → Genera credencial
- [ ] **9.2** Flujo completo: Voluntario consulta → Descarga credencial
- [ ] **9.3** Verificar que todos los datos se persistan correctamente
- [ ] **9.4** Verificar que las relaciones entre entidades funcionen

### ✅ Documentación
- [ ] **9.5** Documentar cualquier endpoint faltante en el backend
- [ ] **9.6** Documentar diferencias de campos encontradas
- [ ] **9.7** Documentar problemas encontrados y soluciones aplicadas

---

## 🚨 **Problemas Conocidos y Soluciones**

### ⚠️ **Endpoints que deben implementarse en el Backend:**
1. `GET /api/personas/by-ci/{ci}` - Alternativa a `/api/personas/ci?ci={ci}`
2. `GET /api/jurados/by-ci/{ci}` - Para buscar jurado por CI
3. `GET /api/delegados/by-ci/{ci}` - Para buscar delegado por CI
4. `POST /api/credenciales/generate` - Para generar credenciales
5. `GET /api/credenciales/{id}/download` - Para descargar credenciales
6. `GET /api/credenciales/{id}/download-qr` - Para descargar QR
7. `GET /api/credenciales/download-by-role-ci` - Para descargar por rol y CI

### ⚠️ **Diferencias de Campos a Resolver:**
1. **Persona**: `nombres` vs `nombre`, `apellidos` vs `apellidoPaterno`
2. **Mesa**: `numero` vs `nombre` vs `codigo`
3. **Delegado**: `habilitado` vs `estado`
4. **Recinto**: `recinto.nombre` vs `recintoNombre`

### ⚠️ **Configuraciones Necesarias:**
1. CORS configurado en backend para puerto 5173
2. Headers apropiados para descarga de archivos
3. Manejo de errores consistente entre frontend y backend

---

## 📝 **Notas de Implementación**

- Todos los servicios ahora apuntan al puerto 9090
- Se agregaron funciones faltantes en los servicios
- Se corrigieron las diferencias de campos con fallbacks
- Se actualizó backendCheck.js con endpoints correctos
- Se reemplazó Home.jsx con pantalla inicial real

**Fecha de creación:** $(date)
**Versión:** 1.0
**Estado:** Listo para pruebas
