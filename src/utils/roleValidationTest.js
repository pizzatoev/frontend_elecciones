// Utilidades para probar la validación de roles en el frontend

/**
 * Simula una respuesta de error del backend para roles duplicados
 */
export const mockDuplicateRoleError = (existingRole, newRole) => {
  return {
    response: {
      status: 409,
      data: {
        timestamp: new Date().toISOString(),
        status: 409,
        error: "Conflict",
        message: `Esta persona ya tiene un rol asignado (${existingRole}) y no puede ser registrada nuevamente como ${newRole}.`,
        path: "/api/delegados"
      }
    }
  };
};

/**
 * Simula una respuesta exitosa del backend
 */
export const mockSuccessResponse = (data) => {
  return {
    data: data,
    status: 200,
    statusText: 'OK'
  };
};

/**
 * Datos de prueba para personas con diferentes roles
 */
export const testPersonas = [
  {
    id: 1,
    ci: '12345678',
    nombre: 'Juan',
    apellido: 'Pérez',
    roles: [],
    status: 'available'
  },
  {
    id: 2,
    ci: '87654321',
    nombre: 'María',
    apellido: 'González',
    roles: ['Jurado'],
    status: 'has_role'
  },
  {
    id: 3,
    ci: '11223344',
    nombre: 'Carlos',
    apellido: 'López',
    roles: ['Veedor'],
    status: 'has_role'
  },
  {
    id: 4,
    ci: '44332211',
    nombre: 'Ana',
    apellido: 'Martínez',
    roles: ['Delegado'],
    status: 'has_role'
  }
];

/**
 * Datos de prueba para roles disponibles
 */
export const testRoles = [
  { value: 'Jurado', label: 'Jurado', description: 'Miembro del jurado electoral' },
  { value: 'Veedor', label: 'Veedor', description: 'Observador electoral' },
  { value: 'Delegado', label: 'Delegado', description: 'Representante de partido' }
];

/**
 * Simula la validación de roles en el frontend
 */
export const simulateRoleValidation = async (personaId, roleType) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const persona = testPersonas.find(p => p.id === personaId);
  
  if (!persona) {
    throw new Error('Persona no encontrada');
  }
  
  if (persona.roles.length > 0) {
    const existingRole = persona.roles[0];
    throw mockDuplicateRoleError(existingRole, roleType);
  }
  
  // Simular asignación exitosa
  return mockSuccessResponse({
    id: Date.now(),
    persona: persona,
    role: roleType,
    assignedAt: new Date().toISOString()
  });
};

/**
 * Valida si una persona puede recibir un rol específico
 */
export const canAssignRole = (persona, roleType) => {
  if (!persona || persona.roles.length === 0) {
    return { canAssign: true, reason: null };
  }
  
  const existingRole = persona.roles[0];
  return {
    canAssign: false,
    reason: `Esta persona ya tiene un rol asignado (${existingRole}) y no puede ser registrada nuevamente como ${roleType}.`
  };
};

/**
 * Obtiene estadísticas de roles
 */
export const getRoleStatistics = () => {
  const total = testPersonas.length;
  const withRoles = testPersonas.filter(p => p.roles.length > 0).length;
  const withoutRoles = total - withRoles;
  
  const roleDistribution = testPersonas.reduce((acc, persona) => {
    persona.roles.forEach(role => {
      acc[role] = (acc[role] || 0) + 1;
    });
    return acc;
  }, {});
  
  return {
    total,
    withRoles,
    withoutRoles,
    roleDistribution
  };
};

/**
 * Casos de prueba para la validación de roles
 */
export const testCases = [
  {
    name: 'Persona sin roles - Asignación exitosa',
    persona: testPersonas[0], // Juan Pérez
    role: 'Jurado',
    expectedResult: 'success',
    description: 'Una persona sin roles puede recibir cualquier rol'
  },
  {
    name: 'Persona con rol - Error de conflicto',
    persona: testPersonas[1], // María González (Jurado)
    role: 'Veedor',
    expectedResult: 'error',
    description: 'Una persona con rol no puede recibir otro rol'
  },
  {
    name: 'Persona con rol - Mismo rol',
    persona: testPersonas[2], // Carlos López (Veedor)
    role: 'Veedor',
    expectedResult: 'error',
    description: 'Una persona no puede recibir el mismo rol dos veces'
  }
];

/**
 * Ejecuta todos los casos de prueba
 */
export const runAllTests = async () => {
  const results = [];
  
  for (const testCase of testCases) {
    try {
      const result = await simulateRoleValidation(testCase.persona.id, testCase.role);
      results.push({
        ...testCase,
        actualResult: 'success',
        passed: testCase.expectedResult === 'success',
        result: result
      });
    } catch (error) {
      results.push({
        ...testCase,
        actualResult: 'error',
        passed: testCase.expectedResult === 'error',
        error: error
      });
    }
  }
  
  return results;
};

/**
 * Utilidades para logging y debugging
 */
export const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data),
  debug: (message, data) => console.debug(`[DEBUG] ${message}`, data)
};

/**
 * Configuración para las pruebas
 */
export const testConfig = {
  apiDelay: 1000, // Simular delay de red
  maxRetries: 3,
  timeout: 5000,
  logLevel: 'info'
};

export default {
  mockDuplicateRoleError,
  mockSuccessResponse,
  testPersonas,
  testRoles,
  simulateRoleValidation,
  canAssignRole,
  getRoleStatistics,
  testCases,
  runAllTests,
  logger,
  testConfig
};
