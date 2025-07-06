import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { gsap } from 'gsap';
import api from '../utils/api';

export default function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');

  // GSAP continuous animation for the Scorezilla title
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.fromTo(
      ".logo-text",
      { opacity: 0.7, y: -10, filter: "drop-shadow(0 0 5px rgba(100, 255, 218, 1))" },
      {
        opacity: 1,
        y: 0,
        filter: "drop-shadow(0 0 15px rgba(100, 255, 218, 1))",
        duration: 1,
        ease: "power1.inOut",
      }
    );
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login/', { email, password });
      const { access, user_id, role } = response.data;
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('user_id', user_id);
      
      history.push(role ? `/home/${role}` : '/home');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleForgotPassword = async () => {
    try {
      await api.post('/forgot-password/', { email });
      setShowOtpInput(true);
      setError('');
    } catch (error) {
      setError('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/verify-otp/', {
        email,
        otp_input: otp,
        new_password: newPassword,
      });
      setEmail('');
      setOtp('');
      setNewPassword('');
      setShowOtpInput(false);
      history.push('/');
    } catch (error) {
      setOtpError('Invalid or expired OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-900 to-black text-gray-200">
      <div className="w-full max-w-md space-y-8">
        {/* Scorezilla Animated Title */}
        <h2 className="logo-text text-center text-4xl font-bold text-teal-400">
          Scorezilla
        </h2>
        <p className="text-center text-lg text-gray-300">
          "Power up your game!"
        </p>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => history.push('/register')}
              className="text-sm font-semibold text-teal-400 hover:text-teal-300"
            >
              Sign Up
            </button>
          </div>

          {!showOtpInput ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-bold shadow-md"
              >
                Log In
              </button>

              {/* Leaderboard Button */}
              <button
                type="button"
                onClick={() => history.push('/leaderboard')}
                className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-white font-bold shadow-md mt-4"
              >
                View Leaderboard
              </button>

              {/* Forgot Password Link */}
              <div className="text-center mt-4">
                <span
                  onClick={handleForgotPassword}
                  className="text-sm text-teal-400 cursor-pointer hover:text-teal-300"
                >
                  Forgot your password? Reset it
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* New Password Input */}
              <div>
                <label className="block text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

              {/* Verify OTP Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-bold shadow-md"
              >
                Verify OTP and Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
