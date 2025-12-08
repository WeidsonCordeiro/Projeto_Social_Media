//Components
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

//Css
import './App.css'

//Pages
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Profile from './pages/Profile/Profile'

function App() {

  return (
    <>
      {/* <LoadingSpinner /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
