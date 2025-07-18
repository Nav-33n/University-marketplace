import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../services/authContext";
import API from "../../services/api";
import logo from "../../assets/logo1.png"
import loginImage from '../../assets/login_illustration2.png'; 


function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]  = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const isStrongPassword = (password) => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  return strongRegex.test(password);
  };


  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  

  //validated the password in the frontend
  if(form.password !== form.confirmPassword) {
    return setError("Passwords don't match.")
  }

   if (!isStrongPassword(form.password)) {
    return setError(
      'Use 8+ chars incl. A-Z, a-z, 0-9 & symbol.'
    );
  }

  try {
    const res = await API.post('/auth/register', {
      username: form.username,
      email: form.email,
      password: form.password,
    })

    //Auto-login after signup
    login(res.data.token)
    navigate('/home'); 
  } catch (err) {
    setError(err.response?.data?.message || 'Signup Failed');
  }
}

  return(
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
    
      {/* Right: Register Form */}
      <div className="px-2 sm:px-2 md:px-5 lg:px-[px] py-2 flex flex-col justify-start">
        
        {/* Logo and Heading */}
        <div className="flex items-start gap-1 justify-center mb-6">
          <img src={logo} alt="UniBazaar Logo" className="w-10 h-10" />
          <h2 className="text-[22px] font-bold text-[#1f2d5a] mt-[3.5px]">UniBazaar</h2>
        </div>
        <p className="text-[22px] font-bold text-[#17285e] mb-6 text-left">
         Become a UniBazaar member</p>
    
     {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {/* Form Fields */}
      <form class="space-y-4" onSubmit={handleSubmit}>
     
     <div>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          class="w-full block text-sm text-gray-500 mb-1 bg-gray-100  font-semibold rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400"
        />
      </div>
      
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

        <div>
        <input
          type="password"
          id="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          class="w-full block text-sm text-gray-500 mb-1 bg-gray-100 font-semibold rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400"
          required   
        />
        </div>
      
       <div className="flex justify-end text-sm mb-4">
              <Link to="/login" className="text-blue-600 mt-0.5">Already have an account?</Link>
            </div>

  
    
      <div>
        <button type="submit" class="w-full bg-[#1f2d5a] text-white font-semibold py-2 px-4 rounded-xl hover:bg-[#2e4173] transition duration-300 mb-4 mt-3">
          Sign Up
        </button>
      </div>
    </form>
    
    
      </div>
      </div>
    </div>
  );
};


export default Register;