'use client';

import { useState } from 'react';
import RegisterModal from './RegisterModal';

const RegisterForm = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsVerifying(true);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ correo: email, password, usuario: user }),
    });

    const data = await response.json();

    if (data.message === 'Se ha enviado un correo de verificación.') {
      setMessage('Se ha enviado un correo de verificación.');
      setEmailVerified(true);
    } else {
      setMessage(data.message);
    }

    setIsVerifying(false);
  };

  return (
    <div>
      <RegisterModal isVerifying={isVerifying} />
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Usuario"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Crear cuenta</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterForm;
