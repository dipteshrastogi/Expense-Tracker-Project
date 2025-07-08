// src/components/SignInPage.jsx
import React, { useState } from 'react';
import { auth, provider, signInWithPopup } from '../firebase';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required.');
      return;
    }
    setSuccess('Signed in successfully!');
    setError('');
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setSuccess(`Welcome, ${result.user.displayName}`);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Google Sign-in failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
      <form onSubmit={handleSignIn} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full border px-4 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full border px-4 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Sign In</button>
      </form>

      <div className="text-center my-4 text-gray-500">or</div>

      <button onClick={handleGoogleSignIn} className="w-full bg-red-500 text-white py-2 rounded">Sign in with Google</button>

      {success && <p className="text-green-600 mt-4">{success}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default SignInPage;
