"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function AddRecord() {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const start = searchParams.get('start');
    const recordType = searchParams.get('type') || '0';
    setType(Number(recordType));
    if (start) {
      setStartDate(start);
      setEndDate(start);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    if (new Date(startDate) < now || new Date(endDate) < now) {
      alert(`Cannot add ${type === 0 ? 'event' : 'task'}s in the past`);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post('http://localhost:60805/api/enrollments', {
        title,
        startDate,
        endDate,
        type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/');
    } catch (error) {
      console.error(`Error adding ${type === 0 ? 'event' : 'task'}`, error);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(Number(e.target.value));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto min-h-screen justify-center p-4">
      <div className="flex header">
        <h1 className=''>Add</h1>
        <select value={type} onChange={handleTypeChange} className="p-2 bg-[#1b263b] text-[#e0e1dd]">
          <option value={0}>Event</option>
          <option value={1}>Task</option>
        </select>
      </div>
      <textarea
        placeholder={`${type === 0 ? 'Event' : 'Task'} Title`}
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
      <button type="submit" className={`p-2 text-white rounded ${type === 0 ? 'bg-blue-800' : 'bg-green-800'}`}>
        Add {type === 0 ? 'Event' : 'Task'}
      </button>
    </form>
  );
}
