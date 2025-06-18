import { Routes, Route } from 'react-router-dom';

// Page components
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import ItemDetails from './pages/itemDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="font-sans min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
