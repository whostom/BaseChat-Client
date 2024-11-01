import { useState } from 'react'
import './MessagesPage.css'

function MessagesPage() {
  return (
    <>
      <div className="flex">

        <div id="peopleList">
          <div id="loggedUser">
            Zalogowano jako: juzek ogórek<br /><br /><a id="logout" href="">Wyloguj się</a>
          </div>
          <div class="card" id="card1">marek</div>
          <div class="card" id="card2">zbychu</div>
          <div class="card" id="card2">krzysiek</div>
        </div>

        <div id="chat">
          <div id="messageSend">
            <input type="text" id="messageContent" />
            <button id="sendBtn">Wyślij</button>
          </div>
          <div id="messages">
            <div class="authored">spadaj</div>
            <div class="notAuthored">podziel się</div>
            <div class="notAuthored">spoko</div>
            <div class="authored">i zamieniłem się w kazachstan</div>
            <div class="authored">zjadłem trochę tych grzybów</div>
            <div class="notAuthored">co</div>
            <div class="authored">ej, zbychu</div>
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
