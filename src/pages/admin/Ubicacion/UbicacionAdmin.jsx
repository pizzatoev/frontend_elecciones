/**SEBASTIAN FERNANDEZ**/

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Table, 
  Button, 
  Alert,
  Modal,
  Form,
  Card,
  Spinner
} from 'react-bootstrap';
import './UbicacionAdmin.css';
import '../AdminSectionTemplate.css';
import { 
  getAllDepartamentos, createDepartamento, updateDepartamento, deleteDepartamento 
} from '../../../services/DepartamentoService.js';
import { 
  getAllProvincias, getProvinciasByDepartamento, createProvincia, updateProvincia, deleteProvincia 
} from '../../../services/ProvinciaService.js';
import { 
  getAllMunicipios, getMunicipiosByProvincia, createMunicipio, updateMunicipio, deleteMunicipio 
} from '../../../services/MunicipioService.js';
import { 
  getAllAsientos, getAsientosByMunicipio, createAsiento, updateAsiento, deleteAsiento 
} from '../../../services/AsientoService.js';
import { 
  getAllRecintos, getRecintosByAsiento, createRecinto, updateRecinto, deleteRecinto 
} from '../../../services/RecintoService.js';
import { 
  getAllMesas, getMesasByRecinto, createMesa, updateMesa, deleteMesa 
} from '../../../services/MesaService.js';

const UbicacionAdmin = () => {
  // Estados para los datos
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [asientos, setAsientos] = useState([]);
  const [recintos, setRecintos] = useState([]);
  const [mesas, setMesas] = useState([]);
  
  // Estados para la selección en cascada
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [selectedAsiento, setSelectedAsiento] = useState('');
  const [selectedRecinto, setSelectedRecinto] = useState('');
  
  // Estados para la tabla actual
  const [currentData, setCurrentData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState('departamentos');
  const [currentColumns, setCurrentColumns] = useState([]);
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Estados generales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Configuración de niveles
  const levels = {
    departamentos: {
      name: 'Departamentos',
      service: { getAll: getAllDepartamentos, create: createDepartamento, update: updateDepartamento, delete: deleteDepartamento },
      columns: [{ key: 'nombre', label: 'Nombre' }],
      formFields: [{ name: 'nombre', label: 'Nombre', type: 'text', required: true }]
    },
    provincias: {
      name: 'Provincias',
      service: { getAll: getProvinciasByDepartamento, create: createProvincia, update: updateProvincia, delete: deleteProvincia },
      columns: [{ key: 'nombre', label: 'Nombre' }, { key: 'departamentoNombre', label: 'Departamento' }],
      formFields: [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'idDepartamento', label: 'Departamento', type: 'select', required: true, options: departamentos }
      ]
    },
    municipios: {
      name: 'Municipios',
      service: { getAll: getMunicipiosByProvincia, create: createMunicipio, update: updateMunicipio, delete: deleteMunicipio },
      columns: [{ key: 'nombre', label: 'Nombre' }, { key: 'provinciaNombre', label: 'Provincia' }],
      formFields: [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'idProvincia', label: 'Provincia', type: 'select', required: true, options: provincias }
      ]
    },
    asientos: {
      name: 'Asientos',
      service: { getAll: getAsientosByMunicipio, create: createAsiento, update: updateAsiento, delete: deleteAsiento },
      columns: [{ key: 'nombre', label: 'Nombre' }, { key: 'municipioNombre', label: 'Municipio' }],
      formFields: [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'idMunicipio', label: 'Municipio', type: 'select', required: true, options: municipios }
      ]
    },
    recintos: {
      name: 'Recintos',
      service: { getAll: getRecintosByAsiento, create: createRecinto, update: updateRecinto, delete: deleteRecinto },
      columns: [{ key: 'nombre', label: 'Nombre' }, { key: 'direccion', label: 'Dirección' }, { key: 'asientoNombre', label: 'Asiento' }],
      formFields: [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'direccion', label: 'Dirección', type: 'text', required: false },
        { name: 'idAsiento', label: 'Asiento', type: 'select', required: true, options: asientos }
      ]
    },
    mesas: {
      name: 'Mesas',
      service: { getAll: getMesasByRecinto, create: createMesa, update: updateMesa, delete: deleteMesa },
      columns: [{ key: 'numero', label: 'Número' }, { key: 'recintoNombre', label: 'Recinto' }],
      formFields: [
        { name: 'numero', label: 'Número', type: 'number', required: true },
        { name: 'idRecinto', label: 'Recinto', type: 'select', required: true, options: recintos }
      ]
    }
  };

  // Cargar todos los datos al montar
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadDepartamentos(),
        loadAllProvincias(),
        loadAllMunicipios(),
        loadAllAsientos(),
        loadAllRecintos(),
        loadAllMesas()
      ]);
    } catch (error) {
      setError('Error al cargar datos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadAllProvincias = async () => {
    try {
      const response = await getAllProvincias();
      setProvincias(response.data);
    } catch (error) {
      console.error('Error al cargar provincias:', error);
    }
  };

  const loadAllMunicipios = async () => {
    try {
      const response = await getAllMunicipios();
      setMunicipios(response.data);
    } catch (error) {
      console.error('Error al cargar municipios:', error);
    }
  };

  const loadAllAsientos = async () => {
    try {
      const response = await getAllAsientos();
      setAsientos(response.data);
    } catch (error) {
      console.error('Error al cargar asientos:', error);
    }
  };

  const loadAllRecintos = async () => {
    try {
      const response = await getAllRecintos();
      setRecintos(response.data);
    } catch (error) {
      console.error('Error al cargar recintos:', error);
    }
  };

  const loadAllMesas = async () => {
    try {
      const response = await getAllMesas();
      setMesas(response.data);
    } catch (error) {
      console.error('Error al cargar mesas:', error);
    }
  };

  // Cargar datos cuando cambie la selección
  useEffect(() => {
    if (selectedDepartamento) {
      loadProvincias();
      setCurrentLevel('provincias');
    }
  }, [selectedDepartamento]);

  useEffect(() => {
    if (selectedProvincia) {
      loadMunicipios();
      setCurrentLevel('municipios');
    }
  }, [selectedProvincia]);

  useEffect(() => {
    if (selectedMunicipio) {
      loadAsientos();
      setCurrentLevel('asientos');
    }
  }, [selectedMunicipio]);

  useEffect(() => {
    if (selectedAsiento) {
      loadRecintos();
      setCurrentLevel('recintos');
    }
  }, [selectedAsiento]);

  useEffect(() => {
    if (selectedRecinto) {
      loadMesas();
      setCurrentLevel('mesas');
    }
  }, [selectedRecinto]);

  // Cargar datos iniciales
  const loadDepartamentos = async () => {
    try {
      setLoading(true);
      const response = await getAllDepartamentos();
      setDepartamentos(response.data);
      setCurrentData(response.data);
      setCurrentLevel('departamentos');
      setCurrentColumns(levels.departamentos.columns);
    } catch (error) {
      setError('Error al cargar departamentos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadProvincias = async () => {
    try {
      setLoading(true);
      const response = await getProvinciasByDepartamento(selectedDepartamento);
      setProvincias(response.data);
      setCurrentData(response.data);
      setCurrentColumns(levels.provincias.columns);
    } catch (error) {
      setError('Error al cargar provincias: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadMunicipios = async () => {
    try {
      setLoading(true);
      const response = await getMunicipiosByProvincia(selectedProvincia);
      setMunicipios(response.data);
      setCurrentData(response.data);
      setCurrentColumns(levels.municipios.columns);
    } catch (error) {
      setError('Error al cargar municipios: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadAsientos = async () => {
    try {
      setLoading(true);
      const response = await getAsientosByMunicipio(selectedMunicipio);
      setAsientos(response.data);
      setCurrentData(response.data);
      setCurrentColumns(levels.asientos.columns);
    } catch (error) {
      setError('Error al cargar asientos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadRecintos = async () => {
    try {
      setLoading(true);
      const response = await getRecintosByAsiento(selectedAsiento);
      setRecintos(response.data);
      setCurrentData(response.data);
      setCurrentColumns(levels.recintos.columns);
    } catch (error) {
      setError('Error al cargar recintos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadMesas = async () => {
    try {
      setLoading(true);
      const response = await getMesasByRecinto(selectedRecinto);
      setMesas(response.data);
      setCurrentData(response.data);
      setCurrentColumns(levels.mesas.columns);
    } catch (error) {
      setError('Error al cargar mesas: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Manejo de selecciones en cascada
  const handleDepartamentoChange = (e) => {
    const value = e.target.value;
    setSelectedDepartamento(value);
    setSelectedProvincia('');
    setSelectedMunicipio('');
    setSelectedAsiento('');
    setSelectedRecinto('');
  };

  const handleProvinciaChange = (e) => {
    const value = e.target.value;
    setSelectedProvincia(value);
    setSelectedMunicipio('');
    setSelectedAsiento('');
    setSelectedRecinto('');
  };

  const handleMunicipioChange = (e) => {
    const value = e.target.value;
    setSelectedMunicipio(value);
    setSelectedAsiento('');
    setSelectedRecinto('');
  };

  const handleAsientoChange = (e) => {
    const value = e.target.value;
    setSelectedAsiento(value);
    setSelectedRecinto('');
  };

  const handleRecintoChange = (e) => {
    const value = e.target.value;
    setSelectedRecinto(value);
  };

  // Modal CRUD
  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setEditingId(item.id);
      setFormData(item);
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({});
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleOpenModalForLevel = (levelKey, item = null) => {
    setCurrentLevel(levelKey);
    handleOpenModal(item);
  };

  const handleDeleteForLevel = async (levelKey, id, nombre) => {
    setCurrentLevel(levelKey);
    await handleDelete(id, nombre);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      
      const level = levels[currentLevel];
      
      if (isEditing) {
        await level.service.update(editingId, formData);
        setSuccess(`${level.name.slice(0, -1)} actualizado exitosamente`);
      } else {
        await level.service.create(formData);
        setSuccess(`${level.name.slice(0, -1)} creado exitosamente`);
      }
      
      handleCloseModal();
      
      // Recargar datos según el nivel actual
      if (currentLevel === 'departamentos') {
        loadDepartamentos();
      } else if (currentLevel === 'provincias') {
        loadAllProvincias();
      } else if (currentLevel === 'municipios') {
        loadAllMunicipios();
      } else if (currentLevel === 'asientos') {
        loadAllAsientos();
      } else if (currentLevel === 'recintos') {
        loadAllRecintos();
      } else if (currentLevel === 'mesas') {
        loadAllMesas();
      }
    } catch (error) {
      setError('Error al guardar: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar ${nombre}?`)) {
      try {
        setError('');
        const level = levels[currentLevel];
        await level.service.delete(id);
        setSuccess(`${level.name.slice(0, -1)} eliminado exitosamente`);
        
        // Recargar datos según el nivel actual
        if (currentLevel === 'departamentos') {
          loadDepartamentos();
        } else if (currentLevel === 'provincias') {
          loadAllProvincias();
        } else if (currentLevel === 'municipios') {
          loadAllMunicipios();
        } else if (currentLevel === 'asientos') {
          loadAllAsientos();
        } else if (currentLevel === 'recintos') {
          loadAllRecintos();
        } else if (currentLevel === 'mesas') {
          loadAllMesas();
        }
      } catch (error) {
        setError('Error al eliminar: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getDisplayValue = (item, column) => {
    if (column.key.includes('.')) {
      const keys = column.key.split('.');
      let value = item;
      for (const key of keys) {
        value = value?.[key];
      }
      return value || '-';
    }
    return item[column.key] || '-';
  };

  return (
    <div className="admin-section-container">
      <div className="admin-section-content">
        <div className="admin-section-card">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Gestión de Ubicación Electoral</h2>
          </div>
          <div className="admin-section-body">

      {/* Panel de selección en cascada */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Navegación por Ubicación</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Departamento</Form.Label>
                    <Form.Select
                      value={selectedDepartamento}
                      onChange={handleDepartamentoChange}
                    >
                      <option value="">Seleccionar...</option>
                      {departamentos.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Provincia</Form.Label>
                    <Form.Select
                      value={selectedProvincia}
                      onChange={handleProvinciaChange}
                      disabled={!selectedDepartamento}
                    >
                      <option value="">Seleccionar...</option>
                      {provincias.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Municipio</Form.Label>
                    <Form.Select
                      value={selectedMunicipio}
                      onChange={handleMunicipioChange}
                      disabled={!selectedProvincia}
                    >
                      <option value="">Seleccionar...</option>
                      {municipios.map((mun) => (
                        <option key={mun.id} value={mun.id}>
                          {mun.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Asiento</Form.Label>
                    <Form.Select
                      value={selectedAsiento}
                      onChange={handleAsientoChange}
                      disabled={!selectedMunicipio}
                    >
                      <option value="">Seleccionar...</option>
                      {asientos.map((asiento) => (
                        <option key={asiento.id} value={asiento.id}>
                          {asiento.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Recinto</Form.Label>
                    <Form.Select
                      value={selectedRecinto}
                      onChange={handleRecintoChange}
                      disabled={!selectedAsiento}
                    >
                      <option value="">Seleccionar...</option>
                      {recintos.map((recinto) => (
                        <option key={recinto.id} value={recinto.id}>
                          {recinto.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Mesa</Form.Label>
                    <Form.Select
                      disabled={!selectedRecinto}
                    >
                      <option value="">Seleccionar...</option>
                      {mesas.map((mesa) => (
                        <option key={mesa.id} value={mesa.id}>
                          Mesa {mesa.numero}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Todas las tablas */}
      {Object.keys(levels).map((levelKey) => {
        const level = levels[levelKey];
        const data = levelKey === 'departamentos' ? departamentos :
                    levelKey === 'provincias' ? provincias :
                    levelKey === 'municipios' ? municipios :
                    levelKey === 'asientos' ? asientos :
                    levelKey === 'recintos' ? recintos :
                    levelKey === 'mesas' ? mesas : [];
        
        return (
          <Row key={levelKey} className="mb-4">
            <Col>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{level.name}</h5>
                  <Button 
                    variant="primary" 
                    onClick={() => handleOpenModalForLevel(levelKey)}
                    disabled={loading}
                  >
                    Nuevo {level.name.slice(0, -1)}
                  </Button>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <Table bordered responsive>
                      <thead className="table-dark">
                        <tr>
                          {level.columns.map((column, index) => (
                            <th key={index}>{column.label}</th>
                          ))}
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length === 0 ? (
                          <tr>
                            <td colSpan={level.columns.length + 1} className="text-center">
                              No hay datos disponibles
                            </td>
                          </tr>
                        ) : (
                          data.map((item) => (
                            <tr key={item.id}>
                              {level.columns.map((column, index) => (
                                <td key={index}>
                                  {getDisplayValue(item, column)}
                                </td>
                              ))}
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleOpenModalForLevel(levelKey, item)}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteForLevel(levelKey, item.id, item.nombre || `Item ${item.id}`)}
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      })}

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Modal para crear/editar */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? `Editar ${levels[currentLevel].name.slice(0, -1)}` : `Nuevo ${levels[currentLevel].name.slice(0, -1)}`}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
                {levels[currentLevel].formFields.map((field, index) => {
                  let options = [];
                  if (field.name === 'idDepartamento') options = departamentos;
                  else if (field.name === 'idProvincia') options = provincias;
                  else if (field.name === 'idMunicipio') options = municipios;
                  else if (field.name === 'idAsiento') options = asientos;
                  else if (field.name === 'idRecinto') options = recintos;
                  
                  return (
                    <Form.Group key={index} className="mb-3">
                      <Form.Label>{field.label} {field.required && '*'}</Form.Label>
                      {field.type === 'select' ? (
                        <Form.Select
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          required={field.required}
                        >
                          <option value="">Seleccionar...</option>
                          {options.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.nombre}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          required={field.required}
                        />
                      )}
                    </Form.Group>
                  );
                })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UbicacionAdmin;
