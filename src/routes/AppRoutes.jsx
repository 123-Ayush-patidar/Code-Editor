import React from 'react'
import Registration from '../components/Registration'
import { Route, Routes } from 'react-router-dom'
import AuthPage from '../components/Registration'

const AppRoutes = () => {
  return (
     <Routes>
      {/* Authentication Routes */}
      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} /> */}

      <Route path="/" element={<AuthPage />} />

      {/* 404 Route */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  )
}

export default AppRoutes
