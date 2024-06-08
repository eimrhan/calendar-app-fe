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

type CalendarProps = {
	filter: string;
	setFilter: (filter: string) => void;
};

const Calendar = ({ filter, setFilter }: CalendarProps) => {
	const [records, setRecords] = useState<any>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('token');

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

	function handleDateSelect(selectInfo: DateSelectArg, type: 'event' | 'task') {
		const now = new Date();
		const start = new Date(selectInfo.start);

		if (selectInfo.view.type === 'dayGridMonth') {
			start.setHours(now.getHours(), now.getMinutes() + 1, now.getSeconds(), now.getMilliseconds());
		}

		if (start < now) {
			alert('Cannot add items in the past');
			return;
		}

		const startDate = formatDateTime(start);
		router.push(`/add-record?start=${startDate}&type=${type}`);
	}

	function handleAddEvent() {
		const startDate = formatDateTime(new Date());
		router.push(`/add-record?start=${startDate}&type=event`);
	}

	function handleAddTask() {
		const startDate = formatDateTime(new Date());
		router.push(`/add-record?start=${startDate}&type=task`);
	}

	function formatDateTime(date: Date) {
		const pad = (n: number) => (n < 10 ? '0' + n : n);
		return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
	}

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
				select={(info) => handleDateSelect(info, filter === 'tasks' ? 'task' : 'event')}
				eventContent={renderEventContent}
				eventClick={(arg) => console.log(arg)}
				eventsSet={(arg) => console.log(arg)}
			/>
			<div className='text-end italic mt-6 text-sm hidden lg:block'>Copyright falan filan</div>
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
