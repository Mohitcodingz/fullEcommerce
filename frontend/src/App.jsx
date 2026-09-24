import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Disclaimer from './pages/Disclaimer'
import ReturnPolicy from './pages/ReturnPolicy'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
 


export default function App() {
  return (
    <div className="app-shell">
    
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/disclaimer' element={<Disclaimer/>} />
          <Route path='/returns' element={<ReturnPolicy/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
       
    </div>
  )
}
