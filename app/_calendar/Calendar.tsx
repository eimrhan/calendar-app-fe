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
import Modal from 'react-modal';

type CalendarProps = {
  filter: string;
  setFilter: (filter: string) => void;
};

const Calendar = ({ filter, setFilter }: CalendarProps) => {
  const [records, setRecords] = useState<any>([]);
  const [filteredRecords, setFilteredRecords] = useState<any>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [type, setType] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:60805/api/users/GetFromAuth', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const fetchedRecords = response.data.enrollments.map((record: any) => ({
          id: record.id,
          title: record.title,
          start: new Date(record.startDate),
          end: record.endDate ? new Date(record.endDate) : new Date(record.startDate), // Eğer endDate yoksa startDate kullan
          type: record.type, // 0 for events and 1 for tasks
          userId: response.data.id, // Assume user ID is in the response
        }));

        setRecords(fetchedRecords);
        localStorage.setItem("username", response.data.userName)
        setUserId(response.data.id); // Set user ID

      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredRecords(getFilteredItems());
  }, [filter, records]);

  function handleDateSelect(selectInfo: DateSelectArg) {
    const type = filter === 'tasks' ? 1 : 0;
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

  function handleEventClick(clickInfo: any) {
    setSelectedEvent(clickInfo.event);
    setTitle(clickInfo.event.title);
    setStart(formatDateTime(clickInfo.event.start));
    setEnd(formatDateTime(clickInfo.event.end ?? clickInfo.event.start)); // Eğer end yoksa start kullan
    setType(clickInfo.event.extendedProps.type);		
    setModalIsOpen(true);
  }

  async function handleEventUpdate() {
    if (!selectedEvent) return;

    const updatedRecord = {
      id: selectedEvent.id,
      userId: userId,
      type: type,
      title,
      startDate: new Date(start).toISOString(),
      endDate: new Date(end).toISOString(), // EndDate must be provided
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:60805/api/enrollments`, updatedRecord, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedRecords = records.map((record: any) => (record.id === updatedRecord.id ? { ...record, ...updatedRecord } : record));
      setRecords(updatedRecords);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error updating event', error);
    }
  }

  async function handleEventDelete() {
    if (!selectedEvent) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:60805/api/enrollments/${selectedEvent.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const remainingRecords = records.filter((record: any) => record.id !== selectedEvent.id);
      setRecords(remainingRecords);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error deleting event', error);
    }
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function formatDateTime(date: Date | null) {
    if (!date) return '';
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return date ? date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) : '';
  }

  function getFilteredItems() {
    if (filter === 'events') {
      return records.filter((r: any) => r.type === 0);
    } else if (filter === 'tasks') {
      return records.filter((r: any) => r.type === 1);
    } else {
      return records;
    }
  }

  return (
    <div className='container mx-auto'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView='dayGridMonth'
        selectable
        select={handleDateSelect}
        events={filteredRecords}
        eventClick={handleEventClick}
        locale="tr"
        locales={[trLocale]}
        nowIndicator
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />

      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel={
            selectedEvent && selectedEvent.extendedProps
              ? selectedEvent.extendedProps.type === 1
                ? 'Edit Task'
                : 'Edit Event'
              : 'Edit'
          }
          ariaHideApp={false}
          className='bg-[#0D1B2AEE] rounded-lg p-6 max-w-lg w-full mx-auto my-8 z-50'
          overlayClassName='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40'
        >
          <h2 className='text-xl mb-4'>
            {selectedEvent && selectedEvent.extendedProps
              ? selectedEvent.extendedProps.type === 1
                ? 'Edit Task'
                : 'Edit Event'
              : 'Edit'}
          </h2>
          {selectedEvent && (
            <div className='flex flex-col gap-4'>
              <label className='flex flex-col'>
                Title:
                <input
                  type='text'
                  className='border rounded p-2'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label className='flex flex-col'>
                Start Date:
                <input
                  type='datetime-local'
                  className='border rounded p-2'
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </label>
              <label className='flex flex-col'>
                End Date:
                <input
                  type='datetime-local'
                  className='border rounded p-2'
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </label>
              <div className='flex justify-between gap-4'>
                <button onClick={handleEventUpdate} className='bg-green-800 rounded px-4 py-2'>
                  Update
                </button>
                <button onClick={handleEventDelete} className='bg-red-800 rounded px-4 py-2'>
                  Delete
                </button>
                <button onClick={closeModal} className='bg-gray-800 rounded px-4 py-2'>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Calendar;
