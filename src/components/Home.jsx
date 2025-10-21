import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
  const [ci, setCi] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCiChange = (e) => {
    setCi(e.target.value);
    setError(''); // Limpiar error cuando el usuario escriba
  };

  const validateCi = () => {
    if (!ci || ci.trim() === '') {
      setError('Debe ingresar un CI válido');
      return false;
    }
    return true;
  };

  const cleanCi = (ci) => {
    // Remover prefijos como LP-, SC-, etc. y dejar solo números
    return ci.replace(/^[A-Z]{2}-/, '').replace(/[^0-9]/g, '');
  };

  const handleJurado = () => {
    if (validateCi()) {
      const cleanCiValue = cleanCi(ci);
      navigate(`/dashboard-jurado/${encodeURIComponent(cleanCiValue)}`);
    }
  };

  const handleVeedor = () => {
    if (validateCi()) {
      const cleanCiValue = cleanCi(ci);
      navigate(`/dashboard-veedor/${encodeURIComponent(cleanCiValue)}`);
    }
  };

  const handleDelegado = () => {
    if (validateCi()) {
      const cleanCiValue = cleanCi(ci);
      navigate(`/dashboard-delegado/${encodeURIComponent(cleanCiValue)}`);
    }
  };

  const handleSolicitar = () => {
    if (validateCi()) {
      const cleanCiValue = cleanCi(ci);
      navigate(`/registro-veedor/${encodeURIComponent(cleanCiValue)}`);
    }
  };

  const handleAcademico = () => {
    navigate('/academia/content');
  };

  return (
    <div className="container-principal">
      <h1>Sistema Electoral</h1>
      <p>Consulta tu rol en las elecciones</p>

      {error && <div className="error-message">{error}</div>}

      <input 
        type="text" 
        placeholder="Ingrese su CI (Ej: LP-1234567 o 1234567)" 
        value={ci}
        onChange={handleCiChange}
      />

      <div className="grid-botones">
        <button className="boton" onClick={handleJurado}>🧾 Jurado</button>
        <button className="boton" onClick={handleVeedor}>👁️ Veedor</button>
        <button className="boton" onClick={handleDelegado}>🧍‍♂️ Delegado</button>
        <button className="boton" onClick={handleSolicitar}>📨 Solicitar</button>
      </div>

      <div className="boton-academico">
        <button className="boton" onClick={handleAcademico}>🎓 Académico</button>
      </div>
    </div>
  );
};

export default Home;
