'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, UsersIcon, TagIcon, DollarSignIcon, LinkIcon, UserIcon, PhoneIcon, MailIcon, ArrowLeftIcon, ThumbsUpIcon, ShareIcon, MessageSquareIcon, EyeIcon, MousePointerIcon } from "lucide-react"

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

export interface EventDetails {
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

interface EventDetailsProps {
  event: EventDetails
  onClose: () => void
}


const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % event.gallery.length)
    }, 5000) // Change media every 5 seconds

    return () => clearInterval(interval)
  }, [event.gallery.length])

  const renderMedia = (media: Media) => {
    if (media.type === 'IMAGE') {
      return (
        <Image
          src={media.url}
          alt={event.title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      )
    } else {
      return (
        <video
          src={media.url}
          className="w-full h-full object-cover rounded-lg"
          autoPlay
          loop
          muted
        />
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      <div className="container mx-auto p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            Back to Events
          </Button>
          <div className="flex space-x-2">
            {event.isFeatured && <Badge className="bg-yellow-500 text-black">Featured</Badge>}
            {!event.isPublic && <Badge variant="secondary">Private Event</Badge>}
            {event.isCancelled && <Badge variant="destructive">Cancelled</Badge>}
          </div>
        </div>
        <ScrollArea className="flex-grow">
          <div className="space-y-6 pb-8">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <div className="relative h-64 md:h-96 w-full">
              {renderMedia(event.gallery[currentMediaIndex])}
            </div>
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <span>{event.date.slice(0, 10)}</span>
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
                        <span>Ticket Price: SOL{event.ticketPrice.toFixed(2)}</span>
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
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Payment Options</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.paymentOptions.map((option, index) => (
                          <Badge key={index} variant="secondary">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {event.instructions && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                        <p>{event.instructions}</p>
                      </div>
                    )}
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
                      <h3 className="text-lg font-semibold mb-2">Event Website Link</h3>
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="h-5 w-5 text-muted-foreground" />
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          Event Link
                        </a>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Event Statistics</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <ThumbsUpIcon className="h-5 w-5 text-muted-foreground" />
                          <span>{event.likes} Likes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ShareIcon className="h-5 w-5 text-muted-foreground" />
                          <span>{event.shares} Shares</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <EyeIcon className="h-5 w-5 text-muted-foreground" />
                          <span>{event.viewCount} Views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MousePointerIcon className="h-5 w-5 text-muted-foreground" />
                          <span>{event.clicks} Clicks</span>
                        </div>
                      </div>
                    </div>
                    {event.paymentAddress && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Payment Address</h3>
                        <p className="break-all">{event.paymentAddress}</p>
                      </div>
                    )}
                    <Button className="w-full mt-4">
                      <a href={`/register/${event.id}`} rel="noopener noreferrer" className="text-white">
                        Register Now
                      </a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="schedule">
                {event.schedule ? (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Event Schedule</h3>
                    <div dangerouslySetInnerHTML={{ __html: event.schedule }} />
                  </div>
                ) : (
                  <p>No schedule available for this event.</p>
                )}
              </TabsContent>
              <TabsContent value="sponsors">
                {event.sponsorDetails ? (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Sponsor Details</h3>
                    <div dangerouslySetInnerHTML={{ __html: event.sponsorDetails }} />
                  </div>
                ) : (
                  <p>No sponsor details available for this event.</p>
                )}
              </TabsContent>
              <TabsContent value="comments">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Comments</h3>
                  {event.comments.length > 0 ? (
                    event.comments.map((comment) => (
                      <div key={comment.id} className="bg-muted p-4 rounded-lg">
                        <p className="font-semibold">{comment.id}</p>
                        <p>{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default EventDetails