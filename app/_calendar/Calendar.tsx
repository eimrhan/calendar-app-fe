"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import trLocale from '@fullcalendar/core/locales/tr';
import { DateSelectArg } from '@fullcalendar/core/index.js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

type Props = {};

const Calendar = (props: Props) => {
	const [records, setRecords] = useState<any>([]);
	const [filter, setFilter] = useState('all'); // 'all', 'events', 'tasks'
	const router = useRouter();

	// Backend'den kayıtları al
	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('token');
			if (!token) return;

			try {
				const response = await axios.get('http://localhost:60805/api/users/GetFromAuth', {
					headers: { Authorization: `Bearer ${token}` }
				});

				setRecords(response.data);
			} catch (error) {
				console.error('Error fetching data', error);
			}
		};

		fetchData();
	}, []);

	// Tarih seçerek etkinlik veya görev ekleme
	function handleDateSelect(selectInfo: DateSelectArg, type: 'event' | 'task') {
		const now = new Date();
		const start = new Date(selectInfo.start);

		// Aylık görünümde tarih seçildiğinde anlık saati al ve biraz ileri al
		if (selectInfo.view.type === 'dayGridMonth') {
			start.setHours(now.getHours(), now.getMinutes() + 1, now.getSeconds(), now.getMilliseconds());
		}

		if (start < now) {
			alert('Cannot add items in the past');
			return;
		}

		const startDate = formatDateTime(start);
		router.push(`/add-${type}?start=${startDate}`);
	}

	// 'Add New Event' butonuyla etkinlik ekleme
	function handleAddEvent() {
		const startDate = formatDateTime(new Date());
		router.push(`/add-event?start=${startDate}`);
	}

	// 'Add New Task' butonuyla görev ekleme
	function handleAddTask() {
		const startDate = formatDateTime(new Date());
		router.push(`/add-task?start=${startDate}`);
	}

	// Tarih ve saati uygun formatta ayarlama
	function formatDateTime(date: Date) {
		const pad = (n: number) => (n < 10 ? '0' + n : n);
		return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
	}

	// Filtrelenmiş öğeleri al
	function getFilteredItems() {
		if (filter === 'events') {
			return records.filter((r: any) => r.type === 'event');
		} else if (filter === 'tasks') {
			return records.filter((r: any) => r.type === 'task');
		} else {
			return records;
		}
	}

	return (
		<div className="w-full">
			<Navbar
				filter={filter}
				setFilter={setFilter}
				handleAddEvent={handleAddEvent}
				handleAddTask={handleAddTask}
			/>
			<div className="flex flex-col lg:flex-row mx-auto">
				<div className="flex-grow p-5">
					<div className='max-w-7xl mx-auto'>
						<FullCalendar
							locales={[trLocale]}
							locale="tr"
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
							headerToolbar={{
								left: 'prev,next today',
								center: 'title',
								right: 'dayGridMonth,timeGridWeek,timeGridDay',
							}}
							initialView="dayGridMonth"
							editable={true}
							selectable={true}
							selectMirror={true}
							weekends={true}
							nowIndicator={true}
							events={getFilteredItems()}
							select={(info) => handleDateSelect(info, filter === 'tasks' ? 'task' : 'event')} // Tarih seçildiğinde tetiklenir
							eventContent={renderEventContent} // Etkinliklerin gösterileceği fonksiyon
							eventClick={(arg) => console.log(arg)} // Etkinliğe tıklanıldığında tetiklenir
							eventsSet={(arg) => console.log(arg)} // Ay, hafta, gün gibi seçimlerde tetiklenir
						/>
						<div className='text-end italic mt-6 text-sm'>Copyright falan filan</div>
					</div>
				</div>
				<Sidebar
					filter={filter}
					setFilter={setFilter}
					handleAddEvent={handleAddEvent}
					handleAddTask={handleAddTask}
				/>
			</div>
		</div>
	);
};

function renderEventContent(eventInfo: any) {
	return (
		<div className="event-content">
			<div className="event-time">
				<b>{eventInfo.timeText}</b>
			</div>
			<div className="event-title">
				<i>{eventInfo.event.title}</i>
			</div>
		</div>
	);
}

export default Calendar;
