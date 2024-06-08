"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type SidebarProps = {
	filter: string;
	setFilter: (filter: string) => void;
	handleAddEvent: () => void;
	handleAddTask: () => void;
};

export default function Sidebar({ filter, setFilter, handleAddEvent, handleAddTask }: SidebarProps) {
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem('token');		
		toast.error("Logged Out!")
		router.push('/login');
	};

	return (
		<div className="hidden lg:flex flex-col p-4 pt-6 bg-[#0D1B2A66] min-w-40 max-w-60 right-0 h-dvh">
			<div className="mb-6">
				<button onClick={handleAddEvent} className="w-full p-2 mb-2 bg-blue-800 rounded">+ Add New Event</button>
				<button onClick={handleAddTask} className="w-full p-2 bg-green-800 rounded">+ Add New Task</button>
			</div>
			<div className="flex flex-col">
				<div className='flex flex-row w-full mb-6'>
					<span className='mr-3 my-auto'>Filter:</span>
					<select onChange={(e) => setFilter(e.target.value)} value={filter} className="p-2 border rounded flex w-full bg-[#415A77] text-[#E0E1DD]">
						<option value="all">All</option>
						<option value="events">Events</option>
						<option value="tasks">Tasks</option>
					</select>
				</div>
				<div className=''>
					<div className='text-center mb-1 underline'>@username</div>
					<button onClick={handleLogout} className="w-full p-2 bg-red-800 rounded">Logout</button>
				</div>
			</div>
		</div>
	);
}
