"use client";

import { useEffect, useState } from 'react';
import Calendar from './_calendar/Calendar';
import LayoutSidebarNavbar from '../components/LayoutSidebarNavbar';
import { useRouter } from 'next/navigation';

export default function Home() {
	const [filter, setFilter] = useState('all');
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.push("/login");
		} else {
			setLoading(false);
		}
	}, []);

	if (loading) {
		return null;
	}

	return (
		<div className="w-full">
			<div className="flex flex-col lg:flex-row mx-auto">
				<LayoutSidebarNavbar
					filter={filter}
					setFilter={setFilter}
				/>
				<div className="flex-grow p-5">
					<Calendar filter={filter} setFilter={setFilter} />
				</div>
			</div>
		</div>
	);
}
