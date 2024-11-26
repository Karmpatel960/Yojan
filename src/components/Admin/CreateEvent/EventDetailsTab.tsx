import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, MapPin, Tag, X } from "lucide-react"
import CitySelect from "@/components/Admin/CreateEvent/City"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format, isBefore, startOfDay } from "date-fns"

interface EventFormState {
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  tags: string[]
  images: string[]
  videos: string[]
  instructions: string
  organizerName: string
  organizerContact: string
  organizerEmail: string
  ticketPrice: number
  availableSeats: number
  registrationLink: string
  isFeatured: boolean
  isPublic: boolean
  poster?: string
  gallery: string[]
  createdById: number
  cityId: number
}

interface InfoTabProps {
  formState: EventFormState
  updateField: (field: keyof EventFormState, value: any) => void
}

const EventDetailsTab: React.FC<InfoTabProps> = ({ formState, updateField }) => {
  const [currentTag, setCurrentTag] = useState("")

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && currentTag.trim() !== '') {
      event.preventDefault()
      updateField('tags', [...formState.tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateField('tags', formState.tags.filter(tag => tag !== tagToRemove))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      updateField('date', format(date, 'yyyy-MM-dd'))
    }
  }

  const handleTimeChange = (value: string) => {
    updateField('time', value)
  }

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date()))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
        <CardDescription>Enter the main details of your event</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            placeholder="Enter event title"
            value={formState.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter event description"
            value={formState.description}
            onChange={(e) => updateField('description', e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formState.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formState.date ? format(new Date(formState.date), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formState.date ? new Date(formState.date) : undefined}
                  onSelect={handleDateChange}
                  disabled={isDateDisabled}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={formState.time} onValueChange={handleTimeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 * 4 }).map((_, index) => {
                  const hour = Math.floor(index / 4)
                  const minute = (index % 4) * 15
                  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                  return <SelectItem key={time} value={time}>{time}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <div className="relative">
            <Input
              id="venue"
              placeholder="Enter event venue"
              value={formState.venue}
              onChange={(e) => updateField('venue', e.target.value)}
              required
            />
            <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formState.category}
              onValueChange={(value) => updateField('category', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="networking">MeetUp</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <CitySelect formState={formState} updateField={updateField}/>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="relative">
            <Input
              id="tags"
              placeholder="Enter tags and press Enter"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagInput}
            />
            <Tag className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formState.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1">
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="instruction">Instructions</Label>
          <Textarea
            id="instruction"
            placeholder="Enter event Instructions"
            value={formState.instructions}
            onChange={(e) => updateField('instructions', e.target.value)}
            required
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default EventDetailsTab


