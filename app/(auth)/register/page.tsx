"use client";

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
	const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        username,
        email,
        password
      });
			router.push('/login');
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl min-w-md mx-auto mt-48 backdrop-blur-xl">
			<h1 className='header'>Sign Up</h1>
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        className="p-2 border rounded"
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="p-2 border rounded"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">Register</button>
			<p className='mx-auto'>
				You already have an account? Go to <button className='text-[#98adc5] font-semibold underline' onClick={() => router.push('/login')}> Login</button>
			</p>
    </form>
  );
}
