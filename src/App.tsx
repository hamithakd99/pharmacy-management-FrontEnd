import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import AdminPage from './pages/admin.page'
import TestPage from './pages/test.page'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  return (
    <BrowserRouter>
    <Toaster position='top-right'/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<AdminPage />} />
        </Route>
        <Route path="/testing" element={<TestPage />} />
        <Route path="/*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
