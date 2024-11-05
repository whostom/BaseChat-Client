import "./LoginRegister.css"
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

function LoginRegister() {

  const [hasAccount, setHasAccount] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [message, setMessage] = useState("");

  const socket = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      console.log("Succesfully connected with the server!");
    });

    socket.current.on("register-success", (data) => {
      setMessage("Pomyślnie zarejestrowano! Możesz się zalogować.");
    });

    socket.current.on("register-failure", (error) => {
      setMessage("Podczas rejestracji wystąpił problem...");
    });

    socket.current.on("login-success", ({ user, token }) => {
      localStorage.setItem("token", token);
      navigate("/MessagesPage");
    });

    socket.current.on("login-failure", (error) => {
      setMessage("Niepoprawne dane logowania!");
    });

    return () => {
      socket.current.disconnect();
      socket.current.off("register-success");
      socket.current.off("register-failure");
      socket.current.off("login-success");
      socket.current.off("login-failure");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const hashedPassword = CryptoJS.SHA256(password).toString();

    if (!hasAccount) socket.current.emit("register-user", { username, password, email });
    else socket.current.emit("login-user", { username, hashedPassword, email });

    setUsername("");
    setEmail("");
    setPassword("");
    setRepeatedPassword("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      navigate("/MessagesPage");
    }
  }, [navigate]);

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
            <span className="btn" onClick={() => { setHasAccount(!hasAccount); setMessage("") }}> {hasAccount ? "Zarejestruj!" : "Zaloguj!"}</span><br /><br />
            <span id="info">{message}</span>
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginRegister
