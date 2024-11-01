import "./MessagesPage.css"
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function MessagesPage() {

  const [loggedUser, setLoggedUser] = useState(null);

  const socket = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setLoggedUser(decodedToken.login);
    }
    catch (error) {
      console.error("Invalid token:", error);
      navigate("/");
      return;
    }

    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      console.log("Succesfully connected with the server!");
    });

    return () => {
      socket.current.disconnect();
    };
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  }

  // socket.current.emit("request-user-list", { loggedUser });

  return (
    <>
      <div className="flex">

        <div id="peopleList">
          <div id="loggedUser">
            Zalogowano jako: {loggedUser || "Nieznany użytkownik"}<br /><br />
            <a id="logout" onClick={logout}>Wyloguj się</a>
          </div>
          <div className="card" id="card1">marek</div>
          <div className="card" id="card2">zbychu</div>
          <div className="card" id="card2">krzysiek</div>
        </div>

        <div id="chat">
          <div id="messageSend">
            <input type="text" id="messageContent" />
            <button id="sendBtn">Wyślij</button>
          </div>
          <div id="messages">
            <div className="authored">spadaj</div>
            <div className="notAuthored">podziel się</div>
            <div className="notAuthored">spoko</div>
            <div className="authored">i zamieniłem się w kazachstan</div>
            <div className="authored">zjadłem trochę tych grzybów</div>
            <div className="notAuthored">co</div>
            <div className="authored">ej, zbychu</div>
          </div>
          <div id="selectedUser">
            Aktualnie piszesz z użytkownikiem: zbychu
          </div>
        </div>

      </div>
    </>
  )
}

export default MessagesPage
