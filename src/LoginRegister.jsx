import './LoginRegister.css'
import { io } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

function LoginRegister() {

  const [hasAccount, setHasAccount] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [message, setMessage] = useState("");

  const socket = useRef(null);

  // const navigate = useNavigate();

  useEffect(() => {
    socket.current = io('http://localhost:3000');

    socket.current.on('connect', () => {
      console.log('Succesfully connected with the server!');
    });

    // Dodaj tutaj inne obsługiwane zdarzenia
    socket.current.on('register-success', (data) => {
      setMessage(data);
    });
  
    socket.current.on('register-failure', (error) => {
      setMessage(error);
    });

    // Czyszczenie połączenia po zakończeniu
    return () => {
      socket.current.disconnect();
      socket.current.off('register-success');
      socket.current.off('register-failure');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.current.emit('register-user', { username, password, email });
    setUsername("");
    setEmail('');
    setPassword("");
    setRepeatedPassword("");

    // navigate('/MessagesPage');
  };

  return (
    <>
      <div className="flex">
        <form className="loginRegisterForm" style={hasAccount ? { height: "35rem" } : { height: "50rem" }} onSubmit={handleSubmit}>
          <label>{hasAccount ? "Login" : "Nazwa użytkownika"}</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          {hasAccount && <div>Podaj nazwę użytkownika lub email.<br /><br /></div>}

          {!hasAccount && <label>Email</label>}
          {!hasAccount && <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />}

          <label>Hasło</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {!hasAccount && <label>Powtórz hasło</label>}
          {!hasAccount && <input type="password" value={repeatedPassword} onChange={(e) => setRepeatedPassword(e.target.value)} />}

          <button id="submitBtn" type="submit">{hasAccount ? "Zaloguj" : "Zarejestruj"}</button><br /><br />

          <div>
            {hasAccount ? "Nie masz jeszcze u nas konta?" : "Masz już u nas założone konto?"}
            <span className="btn" onClick={() => { setHasAccount(!hasAccount) }}> {hasAccount ? "Zarejestruj!" : "Zaloguj!"}</span><br />
            {message && <span id="loginInfo">{message}</span>}
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginRegister
