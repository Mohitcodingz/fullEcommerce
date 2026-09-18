import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthProvider from './context/AuthContext'


export default function App() {
  return (
    <div className="app-shell">
      <AuthProvider  >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
      </AuthProvider>
    </div>
  )
}
