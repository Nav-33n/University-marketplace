import { Routes, Route, Navigate } from 'react-router-dom';

// Page components
import AddItem from './pages/AddItem';
import UserProducts from './pages/components/homePage/UserProducts';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/components/homePage/Profile';
import PrivateRoute from './utils/PrivateRoute'
import Layout from './pages/components/homePage/Layout';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProductList from './pages/components/homePage/ProductList';
import { useAuth } from './services/authContext';
import { getToken } from './utils/tokenStorage';

function App() {
    const { user } = useAuth();
    const userToken = getToken();

  return (
    <div className="font-sans min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />


        {/*Private Section*/}
        <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
        <Route path="/home" element={<ProductList />} />
        <Route path="/add-item" element={<AddItem userToken={userToken}/>} />
        <Route path="/my-items" element={<UserProducts />} />
        <Route path="/profile" element={<Profile />} />
        </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
