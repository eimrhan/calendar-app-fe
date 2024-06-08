"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function AddRecord() {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('event'); // Varsayılan olarak 'event' yapabiliriz.
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const start = searchParams.get('start');
    const recordType = searchParams.get('type') || 'event';
    setType(recordType);
    if (start) {
      setStartDate(start);
      setEndDate(start);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    if (new Date(startDate) < now || new Date(endDate) < now) {
      alert(`Cannot add ${type}s in the past`);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post('http://localhost:60805/records/add_record', {
        title,
        startDate,
        endDate,
        type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/');
    } catch (error) {
      console.error(`Error adding ${type}`, error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto min-h-screen justify-center p-4">
      <h1 className='header'>Add {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      <textarea
        placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} Title`}
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
      <button type="submit" className={`p-2 text-white rounded ${type === 'event' ? 'bg-blue-800' : 'bg-green-800'}`}>
        Add {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    </form>
  );
}
