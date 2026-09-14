import React from 'react'
import { BrowserRouter as Routes, Route, Router } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


export default function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}
