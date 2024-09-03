import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

interface OrganizerInfoTabProps {
  formState: EventFormState;
  updateField: (field: keyof EventFormState, value: any) => void;
}

const OrganizerInfoTab: React.FC<OrganizerInfoTabProps> = ({ formState, updateField}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizer Information</CardTitle>
        <CardDescription>Enter details about the event organizer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organizerName">Organizer Name</Label>
            <Input
              id="organizerName"
              value={formState.organizerName}
              onChange={(e) => updateField("organizerName", e.target.value)}
              placeholder="Enter organizer name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organizerContact">Organizer Contact</Label>
            <Input
              id="organizerContact"
              value={formState.organizerContact}
              onChange={(e) => updateField("organizerContact", e.target.value)}
              placeholder="Enter contact number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organizerEmail">Organizer Email</Label>
            <Input
              id="organizerEmail"
              type="email"
              value={formState.organizerEmail}
              onChange={(e) => updateField("organizerEmail", e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizerInfoTab;
