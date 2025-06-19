import { Routes, Route, Navigate } from 'react-router-dom';

// Page components
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import ItemDetails from './pages/itemDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import PrivateRoute from './utils/PrivateRoute'
import AppLayout from './pages/components/AppLayout';

function App() {
  return (
    <div className="font-sans min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*Private Section*/}
        <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/profile" element={<Profile />} />
        </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
