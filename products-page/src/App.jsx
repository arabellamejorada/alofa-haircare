//  import {Outlet} from "react-router-dom";
//  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import './App.css'
 import Navbar from "./shared/Navbar.jsx";
//  import Home from "./pages/home/Home.jsx";
// import ProductCard from "./components/ProductCard.jsx";
import Products from "./components/Products.jsx"

function App() {

  return (
    <>
        <Navbar/>
        {/* <Home/> */}
        <Products/>
        {/* <ProductCard/> */}

        {/* <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes> */}
      {/* <Outlet/> */}
    </>
  )
}

export default App
