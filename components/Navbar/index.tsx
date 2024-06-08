"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type NavbarProps = {
	filter: string;
	setFilter: (filter: string) => void;
	handleAddEvent: () => void;
	handleAddTask: () => void;
};

export default function Navbar({ filter, setFilter, handleAddEvent, handleAddTask }: NavbarProps) {
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem('token');
		toast.error("Logged Out!")
		router.push('/login');
	};

	return (
		<div className="flex flex-col lg:hidden p-4 bg-[#0D1B2A66]">
			<div className="flex justify-between mb-4 gap-2">
				<button onClick={handleAddEvent} className="w-full p-2 bg-blue-800 rounded">+ Add New Event</button>
				<button onClick={handleAddTask} className="w-full p-2 bg-green-800 rounded">+ Add New Task</button>
			</div>
			<div className="flex justify-between gap-2">
				<select onChange={(e) => setFilter(e.target.value)} value={filter} className="w-full border rounded bg-[#415A77] text-[#E0E1DD]">
					<option value="all">All</option>
					<option value="events">Events</option>
					<option value="tasks">Tasks</option>
				</select>
				<button onClick={handleLogout} className="w-full bg-red-800 rounded p-2">Logout</button>
			</div>
		</div>
	);
}
