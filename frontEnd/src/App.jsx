import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Register from './Register'
import Login from './Login'
import QRGenerator from './QRGenerator'; // Import your PrintQR component
import Payment from './Payment';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path="/print-qr" element={<QRGenerator />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
        
      </BrowserRouter>
    </div>
  )
}

export default App