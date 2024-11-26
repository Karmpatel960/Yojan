"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EventDetailsType {
  id: number;
  title: string;
  description: string;
  date: string;
  venue: string;
  images: { id: number; url: string }[];
}

const EventPage: React.FC = () => {
  const [events, setEvents] = useState<EventDetailsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        const limitedEvents = data.slice(0, 3).map((event: EventDetailsType) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          venue: event.venue,
          images: event.images,
        }));
        setEvents(limitedEvents);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="mt-4" variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {events.map((event) => (
        <div key={event.id} className="border rounded-lg p-4">
          <img
            src={event.images[0]?.url || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          <p className="text-gray-500 mb-4">{`${event.date} • ${event.venue}`}</p>
          <Button className="w-full">Book Now</Button>
        </div>
      ))}
    </div>
  );
};

export default EventPage;
