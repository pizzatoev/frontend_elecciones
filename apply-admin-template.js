// Script para aplicar el template de scroll a todas las secciones admin
const fs = require('fs');
const path = require('path');

const adminSections = [
  'Asistencia/AsistenciaAdmin.jsx',
  'Credenciales/CredencialesAdmin.jsx', 
  'Instituciones/InstitucionesAdmin.jsx',
  'Partidos/PartidosAdmin.jsx',
  'Personas/PersonasAdmin.jsx',
  'Ubicacion/UbicacionAdmin.jsx'
];

const templateImport = "import '../AdminSectionTemplate.css';";

adminSections.forEach(section => {
  const filePath = path.join(__dirname, 'src', 'pages', 'admin', section);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Agregar import del template si no existe
    if (!content.includes('AdminSectionTemplate.css')) {
      // Buscar la última línea de import
      const lines = content.split('\n');
      let lastImportIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ') && lines[i].includes('.css')) {
          lastImportIndex = i;
        }
      }
      
      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, templateImport);
        content = lines.join('\n');
      } else {
        // Si no hay imports de CSS, agregar después de los imports de React
        const reactImportIndex = content.indexOf("from 'react'");
        if (reactImportIndex !== -1) {
          const insertIndex = content.indexOf('\n', reactImportIndex) + 1;
          content = content.slice(0, insertIndex) + templateImport + '\n' + content.slice(insertIndex);
        }
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Template aplicado a ${section}`);
    } else {
      console.log(`⚠️  Template ya existe en ${section}`);
    }
  } else {
    console.log(`❌ Archivo no encontrado: ${section}`);
  }
});

console.log('🎉 Proceso completado');
