import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Tag, X } from "lucide-react";
import CitySelect from "@/components/Admin/CreateEvent/City";

interface EventFormState {
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    category: string;
    tags: string[];
    images: string[];
    videos: string[];
    instructions: string;
    organizerName: string;
    organizerContact: string;
    organizerEmail: string;
    ticketPrice: number;
    availableSeats: number;
    registrationLink: string;
    isFeatured: boolean;
    isPublic: boolean;
    poster?: string;
    gallery: string[];
    createdById: number;
    cityId: number;
  }
  
  interface InfoTabProps {
    formState: EventFormState;
    updateField: (field: keyof EventFormState, value: any) => void;
  //  handleTabChange: (tab: string) => void;
  }

const EventDetailsTab: React.FC<InfoTabProps> = ({formState, updateField}) => {
     const [currentTag, setCurrentTag] = useState("");
     const [timeInput, setTimeInput] = useState(formState.time);

    const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && currentTag.trim() !== '') {
            event.preventDefault();
            updateField('tags', [...formState.tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        updateField('tags', formState.tags.filter(tag => tag !== tagToRemove));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeString = e.target.value;
        setTimeInput(timeString);
        
        const [time, modifier] = timeString.split(/(\s+)/).filter(Boolean);
        const [hours, minutes] = time.split(':').map(Number);
    
        let newHours = hours;
        if (modifier === 'PM' && hours < 12) {
          newHours += 12;
        } else if (modifier === 'AM' && hours === 12) {
          newHours = 0;
        }
    
        updateField('time', `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
      };

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
                        <div className="relative">
                            <Input
                                id="date"
                                type="date"
                                value={formState.date}
                                onChange={(e) => updateField('date', e.target.value)}
                                required
                            />
                            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <div className="relative">
                            <Input
                            id="time"
                            type="text"
                            value={timeInput}
                            onChange={handleTimeChange}
                            placeholder="Enter time (e.g., 2:00 PM)"
                            required
                            />
                            <Clock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
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
                        placeholder="Enter event Instruction"
                        value={formState.instructions}
                        onChange={(e) => updateField('instructions', e.target.value)}
                        required
                    />
                </div>
            </CardContent>
        </Card>
        

    );
};

export default EventDetailsTab;

