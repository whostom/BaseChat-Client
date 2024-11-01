import { useState } from 'react'
import './LoginRegister.css'

function LoginRegister() {

  const [hasAccount, setHasAccount] = useState(true)

  return (
    <>
      <div className="flex">
        <div className="loginRegister" style = {hasAccount ?  { height: "35rem" } : { height: "50rem" }}>
          <label>{hasAccount ? "Login" : "Nazwa użytkownika"}</label>
          <input type="text" name="login" id="login" />
          {hasAccount && <div>Podaj nazwę użytkownika lub email.<br /><br /></div>}

          {!hasAccount && <label>Email</label>}
          {!hasAccount && <input type="text" name="email" id="email" />}

          <label>Hasło</label>
          <input type="password" name="pass" id="pass" />

          {!hasAccount && <label>Powtórz hasło</label>}
          {!hasAccount && <input type="password" name="passRepeat" id="passRepeat" />}
          
          <button id="submit">{hasAccount ? "Zaloguj" : "Zarejestruj"}</button><br /><br />

          <div>
            {hasAccount ? "Nie masz jeszcze u nas konta?" : "Masz już u nas założone konto?"}
            <span className="btn" onClick={() => { setHasAccount(!hasAccount) }}> {hasAccount ? "Zarejestruj!" : "Zaloguj!"}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginRegister
