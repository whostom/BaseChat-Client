import { createRoot } from 'react-dom/client'
import './index.css'
import LoginRegister from './LoginRegister'
import MessagesPage from './MessagesPage'

createRoot(document.getElementById('root')).render(
    // <LoginRegister />
    <MessagesPage />
)
