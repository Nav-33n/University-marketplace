import { Routes, Route, Navigate } from 'react-router-dom';

// Page components
import AddItem from './pages/AddItem/AddItem';
import UserProducts from './pages/UserItems/UserProducts';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/HomeLayout/Profile/Profile';
import PrivateRoute from './utils/PrivateRoute'
import Layout from './pages/HomeLayout/Home/Layout';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProductList from './pages/HomeLayout/ProductContent/ProductList';
import { useAuth } from './services/authContext';
import { getToken } from './utils/tokenStorage';
import ProductInfo from './pages/ProductLayout/ProductInfo';

function App() {
    const { user } = useAuth();
    const userToken = getToken();

  return (
    <div className="font-helvetica min-h-screen bg-white relative">
      <div  className="absolute inset-0 z-0 pointer-events-none"
        style={{
      backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
      `,
    }}
      ></div>
      <div className='relative z-20'>
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
        <Route path="/product/:id" element={<ProductInfo />} />
        </Route>
        </Route>
      </Routes>
      </div>
    </div>
  );
}

export default App;
