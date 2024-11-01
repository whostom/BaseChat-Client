import './MessagesPage.css'
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react'

function MessagesPage() {

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Succesfully connected with the server!');
    });

    // Dodaj tutaj inne obsługiwane zdarzenia
    socket.on('message', (data) => {
      console.log('Otrzymano wiadomość:', data);
    });

    // Czyszczenie połączenia po zakończeniu
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="flex">

        <div id="peopleList">
          <div id="loggedUser">
            Zalogowano jako: juzek ogórek<br /><br /><a id="logout" href="">Wyloguj się</a>
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
