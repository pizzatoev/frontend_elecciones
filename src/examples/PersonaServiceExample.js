// Ejemplo de uso del PersonaService
import { getPersonaByCi, getAllPersonas, createPersona, updatePersona, deletePersona } from '../services/PersonaService';

// Ejemplo de cómo usar las funciones exportadas
export const ejemploUsoPersonaService = async () => {
  try {
    // Obtener persona por CI
    const persona = await getPersonaByCi('12345678');
    console.log('Persona encontrada:', persona.data);

    // Obtener todas las personas
    const todasLasPersonas = await getAllPersonas();
    console.log('Todas las personas:', todasLasPersonas.data);

    // Crear nueva persona
    const nuevaPersona = {
      ci: '87654321',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@email.com'
    };
    const personaCreada = await createPersona(nuevaPersona);
    console.log('Persona creada:', personaCreada.data);

    // Actualizar persona
    const personaActualizada = await updatePersona(1, {
      nombre: 'Juan Carlos',
      apellido: 'Pérez García'
    });
    console.log('Persona actualizada:', personaActualizada.data);

    // Eliminar persona
    const personaEliminada = await deletePersona(1);
    console.log('Persona eliminada:', personaEliminada.data);

  } catch (error) {
    console.error('Error en el ejemplo:', error);
  }
};

// Ejemplo de uso en un componente React
export const usePersonaService = () => {
  const consultarPersonaPorCI = async (ci) => {
    try {
      const response = await getPersonaByCi(ci);
      return response.data;
    } catch (error) {
      console.error('Error al consultar persona:', error);
      throw error;
    }
  };

  return {
    consultarPersonaPorCI
  };
};

