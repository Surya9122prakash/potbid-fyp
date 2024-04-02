import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import Contact from './components/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import { UserProvider } from './context/UserContext'
import Company from './pages/Company'
import Complaints from './pages/Complaints'
import Complaint from './pages/Complaint'
import User from './pages/User'
import AdminComplaint from './pages/AdminComplaint'
import AdminContract from './pages/AdminContract'
import AdminEditContract from './pages/AdminEditContract'
import AllContracts from './pages/AllContracts'
import ComplaintForm from './pages/ComplaintForm'
import Users from './pages/Users'
import { useUser } from './context/UserContext'
import AdminComplaints from './pages/AdminComplaints'
import AdminContracts from './pages/AdminContracts'
import MyContracts from './pages/MyContract'
import PricePrediction from './pages/PricePrediction'
import ForgotPassword from './pages/ForgotPassword'
import PasswordReset from './pages/PasswordReset'
import EmailSent from './pages/EmailSent'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/contact' element={<Contact />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path='/public' element={<Profile />} />
          <Route exact path='/company' element={<Company />} />
          <Route exact path='/admin' element={<Dashboard />} />
          <Route exact path='/complaints' element={<Complaints />}/>
          <Route exact path='/complaints/:id' element={<Complaint />} />
          <Route exact path='/user/:id' element={<User />} />
          <Route exact path='/complaint/:id' element={<AdminComplaint />} />
          <Route exact path='/contract/:id' element={<AdminContract />} />
          <Route exact path='/contract/edit/:id' element={<AdminEditContract />} />
          <Route exact path='/contracts/' element={<AllContracts />} />
          <Route exact path='/complaintform/' element={<ComplaintForm />} />
          <Route exact path='/allusers/' element={<Users />} />
          <Route exact path='/admincomplaints/' element={<AdminComplaints />} />
          <Route exact path='/admincontracts/' element={<AdminContracts />} />
          <Route exact path='/mycontracts/' element={<MyContracts />} />
          <Route exact path='/price/' element={<PricePrediction />} />
          <Route exact path='/forgotpassword/' element={<ForgotPassword />} />
          <Route exact path='/emailsent/:userEmail?/:reset?' element={<EmailSent />} />
          <Route exact path='/passwordreset/:userId/:resetString' element={<PasswordReset/>} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
