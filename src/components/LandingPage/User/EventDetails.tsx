import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, MapPinIcon, UsersIcon, TagIcon, DollarSignIcon, LinkIcon, UserIcon, PhoneIcon, MailIcon, ArrowLeftIcon } from "lucide-react"

export interface EventDetails {
  id: number
  img: string
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
  ticketPrice: number
  availableSeats: number
  registrationLink: string
  isFeatured: boolean
  isPublic: boolean
}

interface EventDetailsProps {
  event: EventDetails
  onClose: () => void
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {

  const handleRegister = () => {
    // router.push({
    //   pathname: '/register',
    //   query: { eventId: event.id },
    // });
  };


  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      <div className="container mx-auto p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            Back to Events
          </Button>
          <div>
            {event.isFeatured && <Badge className="bg-yellow-500 text-black mr-2">Featured</Badge>}
            {!event.isPublic && <Badge variant="secondary">Private Event</Badge>}
          </div>
        </div>
        <ScrollArea className="flex-grow">
          <div className="space-y-6 pb-8">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={event.img}
                alt={event.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TagIcon className="h-5 w-5 text-muted-foreground" />
                    <span>{event.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-5 w-5 text-muted-foreground" />
                    <span>{event.availableSeats} seats available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
                    <span>Ticket Price: ${event.ticketPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p>{event.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Organizer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <span>{event.organizerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                      <span>{event.organizerContact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MailIcon className="h-5 w-5 text-muted-foreground" />
                      <span>{event.organizerEmail}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Registration</h3>
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-5 w-5 text-muted-foreground" />
                    <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline" onClick={handleRegister} > 
                      Registration Link
                    </a>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="text-white">
                    Register Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default EventDetails