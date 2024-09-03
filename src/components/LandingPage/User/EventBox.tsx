import Image from "next/image"
import { FC } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, UsersIcon, TagIcon } from "lucide-react"
import { EventDetails } from "@/components/LandingPage/User/EventDetails"

interface EventBoxProps {
  event: EventDetails
  onViewDetails: (event: EventDetails) => void
}

const EventBox: FC<EventBoxProps> = ({ event, onViewDetails }) => {
  const { img, title, date, time, venue, category, tags, availableSeats, isFeatured } = event

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={img}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 ease-in-out hover:scale-105"
        />
        {isFeatured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
            Featured
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{date} at {time}</span>
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
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag : any, index : any) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onViewDetails(event)}>View Details</Button>
      </CardFooter>
    </Card>
  )
}

export default EventBox