
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from 'react-router'
import AppRoutes from './config/routes.jsx'
import { ToastBar, Toaster } from 'react-hot-toast'
import { ChatProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <Toaster />
    <ChatProvider>
      <AppRoutes />
    </ChatProvider>
    </BrowserRouter>
)
