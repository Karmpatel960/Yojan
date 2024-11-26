// 'use client'

// import Image from "next/image"
// import { FC, useState, useEffect } from "react"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { CalendarIcon, MapPinIcon, UsersIcon, TagIcon, DollarSignIcon } from "lucide-react"

// interface Media {
//   id: number
//   url: string
//   type: 'IMAGE' | 'VIDEO'
// }

// interface EventDetails {
//   id: number
//   title: string
//   description: string
//   date: string
//   time: string
//   venue: string
//   category: string
//   tags: string[]
//   organizerName: string
//   organizerContact: string
//   organizerEmail: string
//   gallery: Media[]
//   ticketPrice: number
//   availableSeats: number
//   registrationLink: string
//   paymentOptions: string[]
//   isFeatured: boolean
//   isPublic: boolean
//   isCancelled: boolean
//   viewCount: number
//   clicks: number
// }

// interface EventBoxProps {
//   event: EventDetails
//   onViewDetails: (event: EventDetails) => void
// }


// const EventBox: FC<EventBoxProps> = ({ event, onViewDetails }) => {
//   const { id, title, date, time, venue, category, tags, availableSeats, isFeatured, isPublic, isCancelled, gallery, ticketPrice } = event
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % gallery.length)
//     }, 3000) // Change media every 3 seconds

//     return () => clearInterval(interval)
//   }, [gallery.length])

//   const handleClick = () => {
//     onViewDetails(event)
//   }

//   const renderMedia = () => {
//     const media = gallery[currentMediaIndex]
//     if (media.type === 'IMAGE') {
//       return (
//         <Image
//           src={media.url}
//           alt={`${title} - Media ${currentMediaIndex + 1}`}
//           layout="fill"
//           objectFit="cover"
//           className="transition-transform duration-300 ease-in-out hover:scale-105"
//         />
//       )
//     } else {
//       return (
//         <video
//           src={media.url}
//           className="w-full h-full object-cover"
//           autoPlay
//           loop
//           muted
//         />
//       )
//     }
//   }

//   return (
//     <Card className="w-full max-w-sm overflow-hidden cursor-pointer" onClick={handleClick}>
//       <div className="relative h-48 w-full">
//         {renderMedia()}
//         <div className="absolute top-2 right-2 flex space-x-2">
//           {isFeatured && (
//             <Badge className="bg-yellow-500 text-black">
//               Featured
//             </Badge>
//           )}
//           {!isPublic && (
//             <Badge variant="secondary">
//               Private
//             </Badge>
//           )}
//           {isCancelled && (
//             <Badge variant="destructive">
//               Cancelled
//             </Badge>
//           )}
//         </div>
//       </div>
//       <CardHeader>
//         <CardTitle className="line-clamp-2">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-2 text-sm">
//           <div className="flex items-center space-x-2">
//             <CalendarIcon className="h-4 w-4 text-muted-foreground" />
//             <span>{date.slice(0, 10)} at {time}</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <MapPinIcon className="h-4 w-4 text-muted-foreground" />
//             <span>{venue}</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <TagIcon className="h-4 w-4 text-muted-foreground" />
//             <span>{category}</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <UsersIcon className="h-4 w-4 text-muted-foreground" />
//             <span>{availableSeats} seats available</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
//             <span>Ticket Price: ${ticketPrice.toFixed(2)}</span>
//           </div>
//         </div>
//         <div className="mt-4 flex flex-wrap gap-2">
//           {tags.slice(0, 3).map((tag, index) => (
//             <Badge key={index} variant="secondary">
//               {tag}
//             </Badge>
//           ))}
//           {tags.length > 3 && (
//             <Badge variant="secondary">+{tags.length - 3}</Badge>
//           )}
//         </div>
//       </CardContent>
//       <CardFooter>
//         <Button className="w-full">View Details</Button>
//       </CardFooter>
//     </Card>
//   )
// }

// export default EventBox


'use client'

import Image from "next/image"
import { FC, useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, UsersIcon, TagIcon, DollarSignIcon } from "lucide-react"

interface Media {
  id: number
  url: string
  type: 'IMAGE' | 'VIDEO'
}

interface EventDetails {
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
  gallery: Media[]
  ticketPrice: number
  availableSeats: number
  registrationLink: string
  paymentOptions: string[]
  isFeatured: boolean
  isPublic: boolean
  isCancelled: boolean
  viewCount: number
  clicks: number
}

interface EventBoxProps {
  event: EventDetails
  onViewDetails: (event: EventDetails) => void
}

const EventBox: FC<EventBoxProps> = ({ event, onViewDetails }) => {
  const { id, title, date, time, venue, category, tags, availableSeats, isFeatured, isPublic, isCancelled, gallery, ticketPrice } = event
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % gallery.length)
    }, 3000) // Change media every 3 seconds

    return () => clearInterval(interval)
  }, [gallery.length])

  const handleClick = () => {
    onViewDetails(event)
  }

  const renderMedia = () => {
    const media = gallery[currentMediaIndex]
    if (media.type === 'IMAGE') {
      return (
        <Image
          src={media.url}
          alt={`${title} - Media ${currentMediaIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 ease-in-out hover:scale-105"
        />
      )
    } else {
      return (
        <video
          src={media.url}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
        />
      )
    }
  }

  return (
    <Card className="w-full max-w-sm overflow-hidden cursor-pointer" onClick={handleClick}>
      <div className="relative h-48 w-full">
        {renderMedia()}
        <div className="absolute top-2 right-2 flex space-x-2">
          {isFeatured && (
            <Badge className="bg-yellow-500 text-black">
              Featured
            </Badge>
          )}
          {!isPublic && (
            <Badge variant="secondary">
              Private
            </Badge>
          )}
          {isCancelled && (
            <Badge variant="destructive">
              Cancelled
            </Badge>
          )}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{date.slice(0, 10)} at {time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span>{venue}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TagIcon className="h-4 w-4 text-muted-foreground" />
            <span>{category}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
            <span>{availableSeats} seats available</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            <span>Ticket Price: ${ticketPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="secondary">+{tags.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  )
}

export default EventBox