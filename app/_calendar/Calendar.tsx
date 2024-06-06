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

type Props = {};

const Calendar = (props: Props) => {
	const [events, setEvents] = useState<any>([]);
	const router = useRouter();

	// Backend'den etkinlikleri al
	useEffect(() => {
		const fetchEvents = async () => {
			const token = localStorage.getItem('token');
			if (!token) return;
			
			try {
				const response = await axios.get('http://localhost:5000/events', {
					headers: { Authorization: `Bearer ${token}` }
				});
				setEvents(response.data);
			} catch (error) {
				console.error('Error fetching events', error);
			}
		};

		fetchEvents();
	}, []);

	// Tarih seçerek etkinlik ekleme
	function handleDateSelect(selectInfo: DateSelectArg) {
		const now = new Date();
		const start = new Date(selectInfo.start);

		// Aylık görünümde tarih seçildiğinde anlık saati al ve biraz ileri al
		if (selectInfo.view.type === 'dayGridMonth') {
			start.setHours(now.getHours(), now.getMinutes() + 1, now.getSeconds(), now.getMilliseconds());
		}

		if (start < now) {
			alert('Cannot add events in the past');
			return;
		}

		const startDate = formatDateTime(start);
		router.push(`/add-event?start=${startDate}`);
	}

	// 'Add New Event' butonuyla etkinlik ekleme
	function handleAddEvent() {
		const startDate = formatDateTime(new Date());
		router.push(`/add-event?start=${startDate}`);
	}

	// Tarih ve saati uygun formatta ayarlama fonksiyonu
	function formatDateTime(date: Date) {
		const pad = (n: number) => (n < 10 ? '0' + n : n);
		return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
	}

	return (
		<div className="container mt-5 mx-auto">
			<div className="card p-5">
				<FullCalendar
					locales={[trLocale]}
					locale="tr"
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					headerToolbar={{
						left: 'prev,next today logout',
						center: 'title',
						right: 'addEvent dayGridMonth,timeGridWeek,timeGridDay',
					}}
					initialView="dayGridMonth"
					editable={true}
					selectable={true}
					selectMirror={true}
					weekends={true}
					nowIndicator={true}
					events={events}
					select={handleDateSelect} // Tarih seçildiğinde tetiklenir
					eventContent={renderEventContent} // Etkinliklerin gösterileceği fonksiyon
					eventClick={(arg) => console.log(arg)} // Etkinliğe tıklanıldığında tetiklenir
					eventsSet={(arg) => console.log(arg)} // Ay, hafta, gün gibi seçimlerde tetiklenir
					customButtons={{
						addEvent: {
							text: '+ Add New Event',
							click: handleAddEvent
						},
						logout: {
							text: 'Logout'
						}
					}}
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
