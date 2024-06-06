"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function AddEvent() {
	const [title, setTitle] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const start = searchParams.get('start');
		if (start) {
			setStartDate(start);
			setEndDate(start);
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const now = new Date();
		if (new Date(startDate) < now || new Date(endDate) < now) {
			alert('Cannot add events in the past');
			return;
		}

		const token = localStorage.getItem('token');
		if (!token) return;

		try {
			await axios.post('http://localhost:5000/events/add_event', {
				title,
				startDate,
				endDate
			}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			router.push('/');
		} catch (error) {
			console.error('Error adding event', error);
		}
	};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto min-h-screen justify-center ">
			<h1 className='header'>Add Event</h1>
      <textarea
        placeholder="Event Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="p-2 border rounded"
      />
      <input 
        type="datetime-local" 
        placeholder="Start Date" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)} 
        className="p-2 border rounded"
      />
      <input 
        type="datetime-local" 
        placeholder="End Date" 
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)} 
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add Event</button>
    </form>
  );
}
