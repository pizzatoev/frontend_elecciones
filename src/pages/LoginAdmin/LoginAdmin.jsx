/**SEBASTIAN FERNANDEZ**/

import "./LoginAdmin.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/UsuarioService.js';

const LoginAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Por favor, complete todos los campos');
            return;
        }

        setLoading(true);

        try {
            const response = await login(username, password);
            if (response.status === 200) {
                navigate('/dashboard-admin');
            }
        } catch (error) {
            if (
                error.response &&
                [401, 403, 404].includes(error.response.status)
            ) {
                setError('Usuario o contraseña inválidos');
            } else {
                setError('Error al iniciar sesión. Intente nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-admin-container">
            <div className="login-card">
                <div className="login-header">
                    <h2 className="header-title">Panel de Administración</h2>
                </div>
                <h3 className="login-title">Iniciar Sesión</h3>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="login-label" htmlFor="username">Administrador</label>
                    <input
                        type="text"
                        placeholder="Usuario"
                        className="login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="login-label" htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Cargando...' : 'Iniciar Sesion'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginAdmin;


