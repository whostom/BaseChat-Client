import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MessagesPage from './MessagesPage';
import LoginRegister from './LoginRegister';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/LoginRegister" element={<LoginRegister />} />
          <Route path="/MessagesPage" element={<MessagesPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
