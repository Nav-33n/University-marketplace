import { useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import API from '../../services/api';
import logo from "../../assets/logo1.png"

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    
     const isStrongPassword = (password) => {
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
      return strongRegex.test(password);
      };
     

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if(password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

   if (!isStrongPassword(confirmPassword)) {
    return setError(
      'Use 8+ chars incl. A-Z, a-z, 0-9 & symbol.'
    );
  }
    try {
        const res = await API.post(`/auth/reset-password/${token}`, { password: confirmPassword });
        setMessage(res.data.message || 'Password reset successful');

        setTimeout(() => {
            navigate('/login');
        }, 2000); // Redirect after 2 seconds
    } catch (err) {
        setError(err.response?.data?.message || 'Password reset failed. Please try again');
    }
    }

    return (
        <div className="flex min-w-screen min-h-screen items-center justify-center bg-[#f5f2f0] px-4">
     <div className="bg-opacity-75 relative h-full overflow-hidden rounded-lg bg-gray-100 px-8 pt-16 pb-24 text-center">
          <div className="px-2 sm:px-2 md:px-5 lg:px-[px] py-2 flex flex-col justify-start">
            <div className="flex items-center justify-center mb-4">
                <img src={logo} alt="Logo" className="w-14 h-14" />
            </div>


            <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl text-cyan-600 font-bold text-center mb-6">Let’s Get You Back In</h2>

        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border  text-gray-500  border-gray-300 rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border  text-gray-500  border-gray-300 rounded-md"
          required
        />


        <button
          type="submit"
          className="w-full bg-[#1f2d5a] text-white py-2 rounded hover:bg-blue-900 transition"
        >
          Reset Password
        </button>
      </form>
    
        </div>

            
           
        </div>
    </div>
    )
}

export default ResetPassword;