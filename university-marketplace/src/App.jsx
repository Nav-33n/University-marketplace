import { Routes, Route } from 'react-router-dom';

// Page components
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import ItemDetails from './pages/itemDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BackendConnection from '../backendConnection';

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
      <BackendConnection />
    </div>
  );
}

export default App;
