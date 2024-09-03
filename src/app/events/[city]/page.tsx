'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EventBox from '@/components/LandingPage/User/EventBox';
import EventDetails, { EventDetails as EventDetailsType } from "@/components/LandingPage/User/EventDetails";

const Events = () => {
  const { city } = useParams();
  const [events, setEvents] = useState<EventDetailsType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events/${city}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        const formattedEvents = data.map((event: any) => ({
          ...event,
          img: event.images[0]?.url || '/placeholder.svg?height=400&width=800',
          location: event.location,
          time: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setEvents(formattedEvents);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [city]);

  const handleViewDetails = (event: EventDetailsType) => {
    setSelectedEvent(event);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventBox key={event.id} event={event} onViewDetails={handleViewDetails} />
        ))}
      </div>
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Events;
