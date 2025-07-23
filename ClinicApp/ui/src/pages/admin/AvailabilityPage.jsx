import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useParams } from 'react-router-dom';
import { isSameDay, addDays, startOfToday } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';

const AvailabilityPage = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [availability, setAvailability] = useState([]);


    const fetchDoctor = async () => {
        try {
            const res = await api.get(`/api/v1/admin/doctors/${id}`);
            setDoctor(res.data);
        } catch (err) {
            console.error('Failed to fetch doctor', err);
        }
    };

    const fetchAvailability = async () => {
        try {
            const res = await api.get(`/api/v1/admin/availability/by-doctor/${id}`);
            setAvailability(res.data || []);
        } catch (err) {
            console.error('Failed to fetch availability', err);
        }
    };

    const createAvailability = async () => {
        try {
            const payload = [{
                date: selectedDate.toISOString(),
                startHour: "08:00",
                endHour: "17:00",
                slotDuration: 30
            }];

            const res = await api.post(`/api/v1/admin/availability/${id}`, payload);
            setAvailability([...availability, ...res.data.availability]);
        } catch (err) {
            console.error('Failed to create availability', err);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchDoctor();
            await fetchAvailability();
            const today = startOfToday();
            const upcoming = Array.from({ length: 14 }, (_, i) => addDays(today, i));
            setDates(upcoming);
        };

        init();
    }, [id]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                Availability for Dr. {doctor ? doctor.name : 'Loading...'}
            </h2>

            <div className="flex overflow-x-auto pb-4 mb-6 -mx-2 px-2">
                {dates.map((date) => (
                    <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center justify-center p-3 mx-1 rounded-lg min-w-[70px] ${isSameDay(date, selectedDate)
                            ? 'bg-indigo-100 border-2 border-indigo-500'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <span className="text-sm font-medium">{format(date, 'EEE')}</span>
                        <span className="text-lg font-bold">{format(date, 'd')}</span>
                        <span className="text-xs text-gray-500">{format(date, 'MMM')}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={createAvailability}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
                Add Availability
            </button>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Current Availability</h3>
                <ul>
                    {availability.map((a, index) => {
                        const availabilityDate = toZonedTime(new Date(a.date), 'UTC');
                        const formattedDate = format(availabilityDate, 'EEEE, MMMM d, yyyy', {
                            timeZone: 'UTC',
                            locale: enUS
                        });

                        return (
                            <li key={index} className="bg-white shadow rounded p-4 mb-2">
                                <p className="text-indigo-700 font-semibold">
                                    {formattedDate} – {a.startHour} to {a.endHour}
                                </p>
                                <p className="text-sm text-gray-500">Slot duration: {a.slotDuration} min</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default AvailabilityPage;