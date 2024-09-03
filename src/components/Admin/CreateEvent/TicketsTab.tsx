import React from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { DollarSign, Users, Link2 } from "lucide-react";
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

interface TabProps {
  formState: EventFormState;
  updateField: (field: keyof EventFormState, value: any) => void;
 // handleTabChange: (tab: string) => void;
}

const TicketsTab : React.FC<TabProps>= ({ formState, updateField }) => {

  return (
    <Card>
    <CardHeader>
      <CardTitle>Tickets & Registration</CardTitle>
      <CardDescription>Set up ticket information and registration details</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ticketPrice">Ticket Price</Label>
          <div className="relative">
            <Input
              id="ticketPrice"
              type="number"
              min="0"
              step="0.01"
              value={formState.ticketPrice}
              onChange={(e) => updateField("ticketPrice", parseFloat(e.target.value))}
              placeholder="0.00"
              required
            />
            <DollarSign className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableSeats">Available Seats</Label>
          <div className="relative">
            <Input
              id="availableSeats"
              type="number"
              min="0"
              value={formState.availableSeats}
              onChange={(e) => updateField("availableSeats", parseInt(e.target.value))}
              placeholder="Number of seats"
              required
            />
            <Users className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registrationLink">Solana Public Address</Label>
        <div className="relative">
          <Input
            id="registrationLink"
            type="url"
            value={formState.registrationLink}
            onChange={(e) => updateField("registrationLink", e.target.value)}
            placeholder="1234356hgfsdsfkjhgq23454dw34t554t"
          />
          <Link2 className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Label htmlFor="isFeatured">Featured Event</Label>
          <Switch
            id="isFeatured"
            checked={formState.isFeatured}
            onCheckedChange={(checked) => updateField("isFeatured", checked)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Label htmlFor="isPublic">Public Event</Label>
          <Switch
            id="isPublic"
            checked={formState.isPublic}
            onCheckedChange={(checked) => updateField("isPublic", checked)}
          />
        </div>
      </div>
    </div>
    </CardContent>
    </Card>
  );
};

export default TicketsTab;
