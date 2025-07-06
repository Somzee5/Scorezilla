import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { gsap } from 'gsap';
import api from '../utils/api';

const TypingText = () => {
  const phrases = [
    "Power up your game!",
    "Join a community of champions!",
    "Unleash your true potential!",
  ];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[index];

    const typingInterval = setInterval(() => {
      if (charIndex < currentPhrase.length) {
        setText((prev) => prev + currentPhrase[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setText("");
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % phrases.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [charIndex, index]);

  return <div className="text-center text-xl text-gray-400 mt-4">{text}</div>;
};

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState('Player'); // Default role
  const [error, setError] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const history = useHistory();

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

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }

    if (!role) {
      setError('Please select a role.');
      return;
    }

    const termsAcceptedValue = termsAccepted ? true : false;

    try {
      const response = await api.post('register/', {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        password2,
        role,
        tc: termsAcceptedValue,
      });

      const { access, user_id, role: userRole } = response.data;
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('user_id', user_id);
      sessionStorage.setItem('role', userRole);

      history.push(`/home/${role}`);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data); // Display specific error messages
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-gray-200">
      <div className="flex flex-col justify-center items-center w-1/2 p-8">
        {/* Centered Scorezilla Animated Title */}
        <h2 className="logo-text text-center text-6xl font-bold text-teal-400 mb-4">
          ScoreZilla
        </h2>
        <TypingText />
      </div>

      <div className="flex justify-center items-center w-1/2">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => history.push('/login')}
              className="text-sm font-semibold text-teal-400 hover:text-teal-300"
            >
              Log In
            </button>
          </div>

          <h2 className="text-center text-2xl font-semibold text-gray-100">
            Create your account
          </h2>

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}

            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="mt-2 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Select Role</label>
              <select
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-500"
              >
                <option value="Admin">Admin</option>
                <option value="Judge">Judge</option>
                <option value="Leader">Leader</option>
                <option value="Player">Player</option>
              </select>
            </div>

            <div>
              <input
                type="checkbox"
                id="termsAccepted"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="termsAccepted" className="ml-2 text-sm">
                Accept Terms and Conditions
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-bold shadow-md"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
