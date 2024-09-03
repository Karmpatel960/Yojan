import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription ,CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle} from "lucide-react"

export default function EventBooks() {
    // const [date, setDate] = useState<Date | undefined>(new Date())
    // const [events, setEvents] = useState([
    //   { id: 1, name: "Company Picnic", date: "2023-07-15", status: "Upcoming" },
    //   { id: 2, name: "Team Building Workshop", date: "2023-08-05", status: "Planning" },
    //   { id: 3, name: "Annual Conference", date: "2023-09-20", status: "Confirmed" },
    // ])
    // const [transactions, setTransactions] = useState([
    //   { id: 1, description: "Venue Booking", amount: 500, date: "2023-06-30" },
    //   { id: 2, description: "Catering Deposit", amount: 250, date: "2023-07-02" },
    //   { id: 3, description: "Equipment Rental", amount: 150, date: "2023-07-05" },
    // ])
  
    // const addEvent = (event: React.FormEvent<HTMLFormElement>) => {
    //   event.preventDefault()
    //   const formData = new FormData(event.currentTarget)
    //   const newEvent = {
    //     id: events.length + 1,
    //     name: formData.get("eventName") as string,
    //     date: formData.get("eventDate") as string,
    //     status: "Planning",
    //   }
    //   setEvents([...events, newEvent])
    return (
        <div>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Manage your planned events</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Detailed Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Fill in the details for your new event. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input id="date" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time
                      </Label>
                      <Input id="time" type="time" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input id="location" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="capacity" className="text-right">
                        Capacity
                      </Label>
                      <Input id="capacity" type="number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea id="description" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="photo" className="text-right">
                        Photo
                      </Label>
                      <div className="col-span-3">
                        <Input id="photo" type="file" accept="image/*" />
                        <p className="text-sm text-muted-foreground mt-1">
                          Upload an image (max 5MB). Supported formats: JPG, PNG, GIF.
                        </p>
                      </div>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button type="submit">Save Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>
                          <Badge variant={event.status === "Confirmed" ? "default" : "secondary"}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))} */}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
    );
    }