import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDetailsTab from "@/components/Admin/CreateEvent/EventDetailsTab";
import OrganizerInfoTab from "./OrganizerInfoTab";
import MediaTab from "./MediaTab";
import TicketsTab from "./TicketsTab";

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

interface Props {
  formState: EventFormState;
  updateField: (field: keyof EventFormState, value: any) => void;
  handleFileUpload: (field: 'images' | 'videos', files: FileList) => void;
  loading: boolean;
  error: string | null;
}

const QuickEventCreation: React.FC<Props> = ({ formState, updateField, handleFileUpload, loading, error }) => {
  const [activeTab, setActiveTab] = useState<string>("details");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/listevent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Event created successfully:', data);
      // Optionally redirect or display a success message
    } catch (error) {
      console.error('Error submitting form:', error);
      // Optionally display an error message
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="organizer">Organizer Info</TabsTrigger>
              <TabsTrigger value="tickets">Tickets & Registration</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <EventDetailsTab formState={formState} updateField={updateField} />
              <Button type="button" className="w-full mt-4" onClick={() => handleTabChange("media")}>
                Go to Media
              </Button>
            </TabsContent>
            <TabsContent value="media">
              <MediaTab
                formState={formState}
                updateField={updateField}
                handleFileUpload={handleFileUpload}
                loading={loading}
                error={error}
              />
              <Button type="button" className="w-full mt-4" onClick={() => handleTabChange("organizer")}>
                Go to Organizer Info
              </Button>
            </TabsContent>
            <TabsContent value="organizer">
              <OrganizerInfoTab formState={formState} updateField={updateField} />
              <Button type="button" className="w-full mt-4" onClick={() => handleTabChange("tickets")}>
                Go to Tickets & Registration
              </Button>
            </TabsContent>
            <TabsContent value="tickets">
              <TicketsTab formState={formState} updateField={updateField} />
              <Button type="submit" className="w-full mt-4">
                Create Event
              </Button>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
};

export default QuickEventCreation;
