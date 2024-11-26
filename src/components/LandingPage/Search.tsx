import { useState, useEffect } from "react"
import {
  Calendar,
  CreditCard,
  Settings,
  Ticket,
  User,
  X,
} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation" // Import useRouter

interface Event {
  id: string
  title: string
  date: string
  availableSeats: number
}

interface CommandDemoProps {
  onClose: () => void
}

export default function CommandDemo({ onClose }: CommandDemoProps) {
  const [input, setInput] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter() // Initialize useRouter

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/events")
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(input.toLowerCase())
  )

  const handleBooking = (eventId: string) => {
    router.push(`/register/${eventId}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <Command className="border-none">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Search Events</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="px-3 pt-3">
            <CommandInput
              placeholder="Search for events..."
              value={input}
              onValueChange={setInput}
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ScrollArea className="h-[300px] overflow-auto">
            <CommandList>
              {loading ? (
                <CommandItem>
                  <div className="flex items-center justify-center w-full py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </CommandItem>
              ) : filteredEvents.length === 0 && input.length > 0 ? (
                <CommandEmpty className="py-6 text-center text-gray-500">No events found.</CommandEmpty>
              ) : (
                <CommandGroup heading="Events" className="px-2">
                  {filteredEvents.map((event) => (
                    <CommandItem key={event.id} className="px-2 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <Calendar className="mr-3 h-5 w-5 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                      <span className="text-xs text-gray-500 mr-3">
                        {event.availableSeats} seats left
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleBooking(event.id)} // Call handleBooking with the event ID
                        disabled={event.availableSeats === 0}
                        className={`min-w-[80px] ${event.availableSeats === 0 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'}`}
                      >
                        <Ticket className="mr-2 h-4 w-4" />
                        Book
                      </Button>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandSeparator className="my-2" />
              <CommandGroup heading="Quick Actions" className="px-2">
                {['View My Tickets', 'My Profile', 'Settings'].map((action, index) => (
                  <CommandItem key={action} className="px-2 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                    {index === 0 ? <CreditCard className="mr-3 h-5 w-5 text-gray-500" /> :
                     index === 1 ? <User className="mr-3 h-5 w-5 text-gray-500" /> :
                     <Settings className="mr-3 h-5 w-5 text-gray-500" />}
                    <span className="text-sm text-gray-700">{action}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </div>
    </div>
  )
}
