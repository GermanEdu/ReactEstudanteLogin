import React, { useState } from "react";
import './styles.css';
import logoImage from '../../assets/login.png';
import { useNavigate } from 'react-router-dom';
import apiEstudante from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  async function login(event) {
    event.preventDefault();
   
    const data = {
      email, password
    };

    try 
    {
      const response = await apiEstudante.post('api/usuario/logarusuario', data);
       
      localStorage.setItem('email', email);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('expiration', response.data.expiration);

      navigate('/estudantes');

    } catch (error) {
      alert('Falha no Login' + error)
    }
  }

  return (
    <div className="login-container">
      <section className="form">
        <img src={logoImage} alt="Login" id="img1" />
        <form onSubmit={login}>
          <h1>Login do Estudante</h1>
          <input 
            placeholder="Email"
            value={email} 
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password} 
            onChange={e => setPassword(e.target.value)}
          />
          <button className="button" type="submit">Login</button>
        </form>
      </section>
    </div>
  );
}
