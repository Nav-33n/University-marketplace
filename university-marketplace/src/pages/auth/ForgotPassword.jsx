import { useState } from 'react';
import API from '../../services/api';
import keyLogo from '../../assets/keylogo1.png';


const ForgotPassword = () => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Reset link sent. Please check your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };  


   return (
          <div className="flex min-w-screen min-h-screen items-center justify-center bg-[#f5f2f0] px-4">
       <div className="bg-opacity-75 relative h-full overflow-hidden rounded-lg bg-gray-100 px-8 pt-16 pb-24 text-center">
            <div className="px-2 sm:px-2 md:px-5 lg:px-[px] py-2 flex flex-col justify-start">
              <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
            <div className="flex items-center justify-center mb-0.5">
                  <img src={keyLogo} alt="Logo" className="w-10 h-10" />
              </div>
          <h2 className="text-2xl text-cyan-800 font-semibold text-center mb-6">Forget Password?</h2>
  
          {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
  
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border text-[#0a082e] border-gray-300 rounded-md"
        />
  
  
          <button
            type="submit"
            className="w-full bg-[#1f2d5a] text-white py-2 rounded hover:bg-blue-900 transition"
          >
            Send Reset Link
          </button>
        </form>
    
          </div>
          </div>
      </div>
      )

}

export default ForgotPassword;