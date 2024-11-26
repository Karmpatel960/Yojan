'use client';
import React, { useState, useEffect, useRef } from "react";
import EventBox from "./TicketsDetails"; // Ensure this component shows ticket details
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO, isToday, isSameDay } from "date-fns";

interface NFTTicket {
  id: number;
  mintAddress: string;
  ownerPublicKey: string;
  ownerEmail: string;
  metadata: string;
}

interface EventDetailsType {
  id: number;
  title: string;
  date: string;
  nftTickets: NFTTicket[]; // Add NFT tickets here
}

const Tickets: React.FC = () => {
  const [events, setEvents] = useState<EventDetailsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [groupedEvents, setGroupedEvents] = useState<{ [key: string]: EventDetailsType[] }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {

        const userId = localStorage.getItem('userId');

        if (!userId) {
          throw new Error('User ID not found in local storage');
        }

        
        const response = await fetch(`/api/tickets?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data);
        groupEventsByDate(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const groupEventsByDate = (eventList: EventDetailsType[]) => {
    const grouped = eventList.reduce((acc, event) => {
      const date = event.date.slice(0, 10);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as { [key: string]: EventDetailsType[] });
    setGroupedEvents(grouped);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(parseISO(date));
  };

  const scrollDates = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const dateButtons = Object.keys(groupedEvents).sort();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollDates('left')}
          aria-label="Scroll dates left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide mx-2"
        >
          <div className="inline-flex gap-2">
            {dateButtons.map((date) => (
              <Button
                key={date}
                onClick={() => handleDateSelect(date)}
                variant={isSameDay(parseISO(date), selectedDate) ? "default" : "outline"}
                className={`${isToday(parseISO(date)) ? "border-2 border-primary" : ""} flex-shrink-0`}
              >
                {format(parseISO(date), "MMM d")}
              </Button>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollDates('right')}
          aria-label="Scroll dates right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {groupedEvents[format(selectedDate, "yyyy-MM-dd")] ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedEvents[format(selectedDate, "yyyy-MM-dd")].map((event) => (
            <EventBox key={event.id} event={event} /> // Adjust EventBox to show NFT tickets directly
          ))}
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Tickets Found</AlertTitle>
          <AlertDescription>There are no events scheduled for this date.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Tickets;
