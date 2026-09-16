import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


export default function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}
