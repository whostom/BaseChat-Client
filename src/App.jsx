import { useState } from 'react'
import './App.css'

function App() {

  const [hasAccount, setHasAccount] = useState(true)

  return (
    <>
      <div className="flex">
        <div className="loginRegister">
          <label htmlFor="">{hasAccount ? "Login" : "Nazwa użytkownika"}</label>
          <input type="text" name="login" id="login" />
          {hasAccount && <div>Podaj nazwę użytkownika lub email.<br /> <br /></div>}
          {!hasAccount && <div><label htmlFor="">Email</label><br/><input type="text" name="email" id="email" /></div>}
          <label htmlFor="">Hasło</label>
          <input type="password" name="pass" id="pass" />
          {!hasAccount && <div><label htmlFor="">Powtórz hasło</label><br/><input type="password" name="passRepeat" id="passRepeat" /></div>}
          <button id="submit">{hasAccount ? "Zaloguj" : "Zarejestruj"}</button>
          {/* <button id="submitR">Zarejestruj</button> */}
          <div>
            <span id="loginInfo"></span><br /><br />
          </div>
          <div>
            {hasAccount ? "Nie masz jeszcze u nas konta?" : "Masz już u nas założone konto?"}
            <span className="btn" onClick={() => { setHasAccount(!hasAccount) }}> {hasAccount ? "Zarejestruj!" : "Zaloguj!"}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
