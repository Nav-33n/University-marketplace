import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import loginImage from '../../assets/login_illustration2.png'; 
import logo from '../../assets/logo1.png';
import { useAuth } from '../../services/authContext';



const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token);
      // Optional: store user data
      navigate('/home');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className="flex min-w-screen min-h-screen items-center justify-center bg-[#f5f2f0] px-4">
<div className="w-full max-w-5xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

  {/* Left: Image */}
  <div className="bg-[#fdfaf5] flex justify-center items-center p-6">
    <img
      src={loginImage}
      alt="Students exchanging items"
      className="w-full max-h-[500px] object-contain"
    />
  </div>

  {/* Right: Login Form */}
  <div className="px-2 sm:px-2 md:px-5 lg:px-[px] py-2 flex flex-col justify-start">
    
    {/* Logo and Heading */}
    <div className="flex items-start gap-1 justify-center mb-6">
      <img src={logo} alt="UniBazaar Logo" className="w-10 h-10" />
      <h2 className="text-[22px] font-bold text-[#1f2d5a] mt-[3.5px]">UniBazaar</h2>
    </div>
    <p className="text-[22px] font-bold text-[#17285e] mb-6 text-left">
     Welcome back! Please login</p>

 {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
    {/* Form Fields */}
  <form class="space-y-4" onSubmit={handleSubmit}>
 
  <div>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="Email Address"
      value={form.email}
      onChange={handleChange}
      class="w-full block text-sm text-gray-500 mb-1 bg-gray-100  font-semibold rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400"
    />
  </div>

    <div>
    <input
      type="password"
      id="password"
      name="password"
      placeholder="Password"
      value={form.password}
      onChange={handleChange}
      class="w-full block text-sm text-gray-500 mb-1 bg-gray-100 font-semibold rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400"
      required   
    />
    </div>
  
  <div className="flex items-center justify-between mb-2">
      <div className="flex justify-start text-base">
              <Link to="/register" className="text-blue-600 mt-1">Sign Up</Link>
            </div>

  <div className="flex justify-end text-base">
              <Link to="/forgot-password" className="text-blue-600 mt-2">Forgot password?</Link>
            </div>
  </div>
         

  <div>
    <button type="submit" class="w-full bg-[#1f2d5a] text-white font-semibold py-2 px-4 rounded-xl hover:bg-[#2e4173] transition duration-300 mb-4 mt-3">
      Login
    </button>
  </div>
</form>


  </div>
  </div>
</div>
  );
};

export default LoginPage;

