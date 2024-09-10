 import {Outlet} from "react-router-dom";
//  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import './App.css'
 import Navbar from "./components/Navbar.jsx";
 import Home from "./pages/home/Home.jsx";

function App() {

  return (
    <>
        <Navbar/>
        <Home/>

        {/* <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes> */}
      <Outlet/>
    </>
  )
}

export default App
