/**JOSUE PADILLA**/
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Table, 
  Button, 
  Alert,
  Badge,
  Modal,
  Form,
  Spinner,
  Card
} from 'react-bootstrap';
import { 
  getAllCredenciales, 
  generarCredencial,
  descargarPdf,
  verQr
} from '../../../services/CredencialService.js';
import jsPDF from 'jspdf';

const CredencialesAdmin = () => {
  const [credenciales, setCredenciales] = useState([]);
  const [credencialesFiltradas, setCredencialesFiltradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para el modal de QR
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [qrTitle, setQrTitle] = useState('');
  
  // Estado para filtro
  const [filtroRol, setFiltroRol] = useState('TODOS');

  // Cargar credenciales al montar el componente
  useEffect(() => {
    loadCredenciales();
  }, []);

  // Aplicar filtro cuando cambien las credenciales o el filtro
  useEffect(() => {
    aplicarFiltro();
  }, [credenciales, filtroRol]);

  const loadCredenciales = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Datos mock para demostración
      const mockCredenciales = [
        {
          id: 1,
          idPersona: 1,
          rol: 'JURADO',
          qrCode: 'QR_1_JURADO_1234567890',
          pdfPath: '/credenciales/pdf/1_JURADO.pdf',
          emitidoEn: new Date('2024-01-15T10:30:00'),
          persona: {
            ci: 'LP-100001',
            nombre: 'Carlos',
            apellido: 'Pérez'
          }
        },
        {
          id: 2,
          idPersona: 2,
          rol: 'VEEDOR',
          qrCode: 'QR_2_VEEDOR_1234567891',
          pdfPath: '/credenciales/pdf/2_VEEDOR.pdf',
          emitidoEn: new Date('2024-01-16T14:20:00'),
          persona: {
            ci: 'LP-100002',
            nombre: 'María',
            apellido: 'Gutiérrez'
          }
        },
        {
          id: 3,
          idPersona: 3,
          rol: 'DELEGADO',
          qrCode: 'QR_3_DELEGADO_1234567892',
          pdfPath: '/credenciales/pdf/3_DELEGADO.pdf',
          emitidoEn: new Date('2024-01-17T09:15:00'),
          persona: {
            ci: 'LP-100003',
            nombre: 'Juan',
            apellido: 'Flores'
          }
        },
        {
          id: 4,
          idPersona: 4,
          rol: 'JURADO',
          qrCode: 'QR_4_JURADO_1234567893',
          pdfPath: '/credenciales/pdf/4_JURADO.pdf',
          emitidoEn: new Date('2024-01-18T16:45:00'),
          persona: {
            ci: 'LP-100004',
            nombre: 'Ana',
            apellido: 'Rodríguez'
          }
        },
        {
          id: 5,
          idPersona: 5,
          rol: 'VEEDOR',
          qrCode: 'QR_5_VEEDOR_1234567894',
          pdfPath: '/credenciales/pdf/5_VEEDOR.pdf',
          emitidoEn: new Date('2024-01-19T11:30:00'),
          persona: {
            ci: 'LP-100005',
            nombre: 'Luis',
            apellido: 'Quispe'
          }
        }
      ];
      
      // Intentar cargar del backend primero
      try {
        const response = await getAllCredenciales();
        if (response.data && response.data.length > 0) {
          setCredenciales(response.data);
        } else {
          // Si no hay datos del backend, usar datos mock
          setCredenciales(mockCredenciales);
        }
      } catch (backendError) {
        // Si hay error del backend, usar datos mock
        console.log('Usando datos mock debido a error del backend:', backendError.message);
        setCredenciales(mockCredenciales);
      }
    } catch (error) {
      setError('Error al cargar las credenciales: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltro = () => {
    if (filtroRol === 'TODOS') {
      setCredencialesFiltradas(credenciales);
    } else {
      const filtradas = credenciales.filter(credencial => 
        credencial.rol === filtroRol
      );
      setCredencialesFiltradas(filtradas);
    }
  };

  const handleGenerarCredencial = async (idPersona, rol, nombre) => {
    if (window.confirm(`¿Está seguro de generar una nueva credencial para ${nombre} con rol ${rol}?`)) {
      try {
        setError('');
        setSuccess('');
        
        // Simular generación de credencial
        setSuccess(`Credencial generada exitosamente para ${nombre} (simulado)`);
        
        // Recargar datos
        loadCredenciales();
      } catch (error) {
        setError('Error al generar credencial: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleVerQr = (idCredencial, nombre, rol) => {
    // Simular URL de QR
    const url = `https://via.placeholder.com/200x200/0066CC/FFFFFF?text=QR+${idCredencial}`;
    setQrUrl(url);
    setQrTitle(`QR Code - ${nombre} (${rol})`);
    setShowQrModal(true);
  };

  const handleDescargarPdf = (idCredencial, nombre, rol, ci) => {
    try {
      // Crear PDF real usando jsPDF
      const doc = new jsPDF();
      
      // Configurar fuente y colores
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      
      // Título principal
      doc.text('CREDENCIAL ELECTORAL', 105, 30, { align: 'center' });
      
      // Línea decorativa
      doc.setDrawColor(0, 0, 0);
      doc.line(20, 35, 190, 35);
      
      // Información de la credencial
      doc.setFontSize(14);
      doc.text('Nombre:', 30, 50);
      doc.text(nombre, 80, 50);
      
      doc.text('CI:', 30, 60);
      doc.text(ci, 80, 60);
      
      doc.text('Rol:', 30, 70);
      doc.text(rol, 80, 70);
      
      doc.text('Fecha de Emisión:', 30, 80);
      doc.text(new Date().toLocaleDateString('es-ES'), 80, 80);
      
      // Código QR simulado
      doc.setFontSize(12);
      doc.text('Código QR:', 30, 100);
      doc.text(`QR_${idCredencial}_${rol}_${Date.now()}`, 30, 110);
      
      // Marco decorativo
      doc.setDrawColor(0, 0, 0);
      doc.rect(15, 15, 180, 120);
      
      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Sistema de Elecciones - Credencial Digital', 105, 150, { align: 'center' });
      doc.text('Este documento es válido para el proceso electoral', 105, 160, { align: 'center' });
      
      // Descargar el PDF
      doc.save(`credencial_${ci}_${rol}.pdf`);
      
      setSuccess(`PDF generado exitosamente para ${nombre}`);
    } catch (error) {
      setError('Error al generar PDF: ' + (error.message || 'Error desconocido'));
    }
  };

  const getRolBadge = (rol) => {
    const badgeConfig = {
      'JURADO': { bg: 'primary', text: 'Jurado' },
      'VEEDOR': { bg: 'success', text: 'Veedor' },
      'DELEGADO': { bg: 'info', text: 'Delegado' },
      'ADMIN': { bg: 'danger', text: 'Admin' }
    };
    
    const config = badgeConfig[rol] || { bg: 'secondary', text: rol };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getEstadisticas = () => {
    const total = credencialesFiltradas.length;
    const jurados = credencialesFiltradas.filter(c => c.rol === 'JURADO').length;
    const veedores = credencialesFiltradas.filter(c => c.rol === 'VEEDOR').length;
    const delegados = credencialesFiltradas.filter(c => c.rol === 'DELEGADO').length;
    const admins = credencialesFiltradas.filter(c => c.rol === 'ADMIN').length;
    
    return { total, jurados, veedores, delegados, admins };
  };

  const estadisticas = getEstadisticas();

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Credenciales</h2>
        </Col>
      </Row>

      {/* Filtro por rol */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Filtrar por Rol</h6>
            </Card.Header>
            <Card.Body>
              <Form.Select
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
              >
                <option value="TODOS">Todos los roles</option>
                <option value="JURADO">Jurados</option>
                <option value="VEEDOR">Veedores</option>
                <option value="DELEGADO">Delegados</option>
                <option value="ADMIN">Administradores</option>
              </Form.Select>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estadísticas */}
      {credencialesFiltradas.length > 0 && (
        <Row className="mb-4">
          <Col md={2}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">{estadisticas.total}</h5>
                <p className="card-text">Total</p>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">{estadisticas.jurados}</h5>
                <p className="card-text">Jurados</p>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">{estadisticas.veedores}</h5>
                <p className="card-text">Veedores</p>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-info">{estadisticas.delegados}</h5>
                <p className="card-text">Delegados</p>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-danger">{estadisticas.admins}</h5>
                <p className="card-text">Admins</p>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabla de credenciales */}
      <Row>
        <Col>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {credencialesFiltradas.length === 0 ? (
                <Alert variant="info">
                  {filtroRol === 'TODOS' 
                    ? 'No hay credenciales registradas.' 
                    : `No hay credenciales de tipo ${filtroRol.toLowerCase()}.`
                  }
                </Alert>
              ) : (
                <Table striped hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>CI</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Rol</th>
                      <th>Fecha Emisión</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credencialesFiltradas.map((credencial) => (
                      <tr key={credencial.id}>
                        <td><strong>{credencial.persona?.ci || '-'}</strong></td>
                        <td>{credencial.persona?.nombre || '-'}</td>
                        <td>{credencial.persona?.apellido || '-'}</td>
                        <td>{getRolBadge(credencial.rol)}</td>
                        <td>{formatFecha(credencial.fechaEmision)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => handleVerQr(
                                credencial.id, 
                                `${credencial.persona?.nombre} ${credencial.persona?.apellido}`,
                                credencial.rol
                              )}
                            >
                              Ver QR
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleDescargarPdf(
                                credencial.id, 
                                `${credencial.persona?.nombre} ${credencial.persona?.apellido}`,
                                credencial.rol,
                                credencial.persona?.ci
                              )}
                            >
                              Descargar PDF
                            </Button>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleGenerarCredencial(
                                credencial.persona?.id,
                                credencial.rol,
                                `${credencial.persona?.nombre} ${credencial.persona?.apellido}`
                              )}
                            >
                              Generar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Modal para mostrar QR */}
      <Modal show={showQrModal} onHide={() => setShowQrModal(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>{qrTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img 
            src={qrUrl} 
            alt="QR Code" 
            className="img-fluid"
            style={{ maxWidth: '100%', height: 'auto' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none' }}>
            <Alert variant="warning">
              No se pudo cargar la imagen QR
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQrModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CredencialesAdmin;
