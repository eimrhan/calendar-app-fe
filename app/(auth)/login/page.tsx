"use client";

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post('http://localhost:5000/auth/login', {
				email,
				password
			});
			localStorage.setItem('token', response.data.token);
			router.push('/');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl min-w-md mx-auto mt-48 backdrop-blur-xl">
			<h1 className='header'>Log In</h1>
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
			<button type="submit" className="p-2 bg-green-500 text-white rounded">Login</button>
			<p className='mx-auto'>
				Don't have account? Go to <button className='text-[#98adc5] font-semibold underline' onClick={() => router.push('/register')}> Register</button>
			</p>

		</form>
	);
}
