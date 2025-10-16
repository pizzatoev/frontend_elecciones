import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { createAdminUsuario } from "../services/UsuarioService";

const CreateUsuario = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("ADMIN");
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const usuario = { username, password, rol };
            await createAdminUsuario(usuario);
            setMessage({ type: "success", text: "Usuario creado con éxito ✅" });
            setUsername("");
            setPassword("");
        } catch (error) {
            console.error(error);
            setMessage({ type: "danger", text: "Error al crear usuario ❌" });
        }
    };

    return (
        <Card className="p-4 mt-4 shadow">
            <h3 className="text-center mb-3">Crear Usuario</h3>
            {message && <Alert variant={message.type}>{message.text}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="ADMIN">ADMIN</option>
                        <option value="VOLUNTARIO">VOLUNTARIO</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Crear Usuario
                </Button>
            </Form>
        </Card>
    );
};

export default CreateUsuario;
