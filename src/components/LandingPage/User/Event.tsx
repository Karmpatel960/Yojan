'use client'
import React, { useState, useEffect,useRef } from "react"
import EventBox from "./EventBox"
import EventDetails from "./EventDetails"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, parseISO, isToday, isSameDay } from "date-fns"

interface Media {
  id: number
  url: string
  type: 'IMAGE' | 'VIDEO'
}

interface Comment {
  id: number
  content: string
  createdAt: string
}

interface NFTTicket {
  id: number
  mintAddress: string
  ownerPublicKey: string
  ownerEmail: string
  metadata: string
}

interface Transaction {
  id: number
  amount: number
  description: string
  date: string
}

interface EventDetailsType {
  id: number
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  tags: string[]
  organizerName: string
  organizerContact: string
  organizerEmail: string
  images: { id: number; url: string }[]
  videos: { id: number; url: string }[]
  poster: string | null
  gallery: Media[]
  ticketPrice: number
  availableSeats: number
  registrationLink: string
  paymentOptions: string[]
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string[]
  likes: number
  shares: number
  comments: Comment[]
  instructions: string | null
  schedule: string | null
  sponsorDetails: string | null
  isFeatured: boolean
  isPublic: boolean
  isCancelled: boolean
  viewCount: number
  clicks: number
  createdAt: string
  updatedAt: string
  createdBy: {
    id: number
    name: string | null
    email: string
  }
  city: {
    id: number
    name: string
  }
  paymentAddress: string | null
  nftTickets: NFTTicket[]
  transactions: Transaction[]
}

const EventPage: React.FC = () => {
  const [events, setEvents] = useState<EventDetailsType[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [groupedEvents, setGroupedEvents] = useState<{ [key: string]: EventDetailsType[] }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        console.log('response', response)
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        console.log('data', data)
        setEvents(data)
        groupEventsByDate(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const groupEventsByDate = (eventList: EventDetailsType[]) => {
    const grouped = eventList.reduce((acc, event) => {
      const date = event.date.slice(0, 10)
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(event)
      return acc
    }, {} as { [key: string]: EventDetailsType[] })
    setGroupedEvents(grouped)
  }

  const handleViewDetails = (event: EventDetailsType) => {
    setSelectedEvent(event)
  }

  const handleCloseDetails = () => {
    setSelectedEvent(null)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(parseISO(date))
  }

  const scrollDates = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    )
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
    )
  }

  const dateButtons = Object.keys(groupedEvents).sort()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
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
            <EventBox key={event.id} event={event} onViewDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Events</AlertTitle>
          <AlertDescription>There are no events scheduled for this date.</AlertDescription>
        </Alert>
      )}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  )
}

export default EventPage