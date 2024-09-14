import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './shared/Navbar.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/products" element={<Products />} />

      </Routes>
    </Router>
  );
}

export default App;
