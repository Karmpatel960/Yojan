// import React, { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/select";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { PlusCircle, Pencil } from "lucide-react";

// interface EventFormState {
//   id: number;
//   title: string;
//   description: string;
//   date: string;
//   time: string;
//   venue: string;
//   category: string;
//   tags: string[];
//   images: string[];
//   videos: string[];
//   instructions: string;
//   organizerName: string;
//   organizerContact: string;
//   organizerEmail: string;
//   ticketPrice: number;
//   availableSeats: number;
//   registrationLink: string;
//   isFeatured: boolean;
//   isPublic: boolean;
//   poster?: string;
//   gallery: string[];
//   createdById: number;
//   cityId: number;
// }

// const UserEventsManager = () => {
//   const [events, setEvents] = useState<EventFormState[]>([]);
//   const [selectedEvent, setSelectedEvent] = useState<EventFormState | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   useEffect(() => {
//     // Fetch events created by the user
//     // This is a mock function - replace with actual API call
//     const fetchUserEvents = async () => {
//       // Simulating API call
//       const response = await new Promise<EventFormState[]>((resolve) => {
//         setTimeout(() => {
//           resolve([
//             {
//               id: 1,
//               title: "Tech Conference 2024",
//               description: "Annual tech conference",
//               date: "2024-06-15",
//               time: "09:00",
//               venue: "Convention Center",
//               category: "Technology",
//               tags: ["tech", "innovation"],
//               images: [],
//               videos: [],
//               instructions: "Bring your laptop",
//               organizerName: "John Doe",
//               organizerContact: "123-456-7890",
//               organizerEmail: "john@example.com",
//               ticketPrice: 99.99,
//               availableSeats: 500,
//               registrationLink: "https://example.com/register",
//               isFeatured: true,
//               isPublic: true,
//               gallery: [],
//               createdById: 1,
//               cityId: 1,
//             },
//             // Add more mock events as needed
//           ]);
//         }, 1000);
//       });
//       setEvents(response);
//     };

//     fetchUserEvents();
//   }, []);

//   const handleEditEvent = (event: EventFormState) => {
//     setSelectedEvent(event);
//     setIsDialogOpen(true);
//   };

//   const handleSaveEvent = (updatedEvent: EventFormState) => {
//     // Update the event in the list
//     setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
//     setIsDialogOpen(false);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Your Events</CardTitle>
//         <CardDescription>Manage events you've created</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-[400px]">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Title</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Venue</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {events.map((event) => (
//                 <TableRow key={event.id}>
//                   <TableCell>{event.title}</TableCell>
//                   <TableCell>{event.date}</TableCell>
//                   <TableCell>{event.venue}</TableCell>
//                   <TableCell>
//                     <Button variant="ghost" onClick={() => handleEditEvent(event)}>
//                       <Pencil className="mr-2 h-4 w-4" /> Edit
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </ScrollArea>
//       </CardContent>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[625px]">
//           <DialogHeader>
//             <DialogTitle>Edit Event</DialogTitle>
//             <DialogDescription>
//               Update the details of your event. Click save when you're done.
//             </DialogDescription>
//           </DialogHeader>
//           {selectedEvent && (
//             <form onSubmit={(e) => {
//               e.preventDefault();
//               handleSaveEvent(selectedEvent);
//             }}>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="title" className="text-right">
//                     Title
//                   </Label>
//                   <Input
//                     id="title"
//                     value={selectedEvent.title}
//                     onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
//                     className="col-span-3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="description" className="text-right">
//                     Description
//                   </Label>
//                   <Textarea
//                     id="description"
//                     value={selectedEvent.description}
//                     onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
//                     className="col-span-3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="date" className="text-right">
//                     Date
//                   </Label>
//                   <Input
//                     id="date"
//                     type="date"
//                     value={selectedEvent.date}
//                     onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
//                     className="col-span-3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="time" className="text-right">
//                     Time
//                   </Label>
//                   <Input
//                     id="time"
//                     type="time"
//                     value={selectedEvent.time}
//                     onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })}
//                     className="col-span-3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="venue" className="text-right">
//                     Venue
//                   </Label>
//                   <Input
//                     id="venue"
//                     value={selectedEvent.venue}
//                     onChange={(e) => setSelectedEvent({ ...selectedEvent, venue: e.target.value })}
//                     className="col-span-3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="category" className="text-right">
//                     Category
//                   </Label>
//                   <Select
//                     onValueChange={(value) => setSelectedEvent({ ...selectedEvent, category: value })}
//                     defaultValue={selectedEvent.category}
//                   >
//                     <SelectTrigger className="col-span-3">
//                       <SelectValue placeholder="Select a category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Technology">Technology</SelectItem>
//                       <SelectItem value="Business">Business</SelectItem>
//                       <SelectItem value="Arts">Arts</SelectItem>
//                       {/* Add more categories as needed */}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {/* Add more form fields for other properties */}
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="isFeatured" className="text-right">
//                     Featured
//                   </Label>
//                   <Checkbox
//                     id="isFeatured"
//                     checked={selectedEvent.isFeatured}
//                     onCheckedChange={(checked) => setSelectedEvent({ ...selectedEvent, isFeatured: checked as boolean })}
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="isPublic" className="text-right">
//                     Public
//                   </Label>
//                   <Checkbox
//                     id="isPublic"
//                     checked={selectedEvent.isPublic}
//                     onCheckedChange={(checked) => setSelectedEvent({ ...selectedEvent, isPublic: checked as boolean })}
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="submit">Save changes</Button>
//               </DialogFooter>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// };

// export default UserEventsManager;