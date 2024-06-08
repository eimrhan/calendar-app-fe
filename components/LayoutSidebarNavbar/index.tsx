"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type LayoutSidebarNavbarProps = {
	filter: string;
	setFilter: (filter: string) => void;
	handleAddEvent: () => void;
	handleAddTask: () => void;
};

export default function LayoutSidebarNavbar({ filter, setFilter, handleAddEvent, handleAddTask }: LayoutSidebarNavbarProps) {
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem('token');
		toast.success("Logged Out!");
		router.push('/login');
	};

	return (
		<div className="flex flex-col p-4 lg:pt-6 bg-[#0D1B2A66] lg:min-w-40 lg:max-w-60 !right-0 lg:h-dvh">
			<div className="lg:block flex justify-between mb-4 gap-2">
				<button onClick={handleAddEvent} className="w-full p-2 lg:mb-2 bg-blue-800 rounded">+ Add New Event</button>
				<button onClick={handleAddTask} className="w-full p-2 bg-green-800 rounded">+ Add New Task</button>
			</div>
			<div className="flex lg:block">
				<div className='flex flex-row w-full lg:mb-6 mr-2 lg:mr-0'>
					<span className='mr-2 my-auto'>Filter:</span>
					<select onChange={(e) => setFilter(e.target.value)} value={filter} className="p-2 border rounded lg:flex w-full bg-[#415A77] text-[#E0E1DD]">
						<option value="all">All</option>
						<option value="events">Events</option>
						<option value="tasks">Tasks</option>
					</select>
				</div>
				<div className='flex lg:block justify-between'>
					<div className='text-center lg:mb-1 my-auto mr-2 lg:mr-0 underline hidden lg:block'>@username</div>
					<button onClick={handleLogout} className="lg:w-full p-2 bg-red-800 rounded">Logout</button>
				</div>
			</div>
		</div>
	);
}
