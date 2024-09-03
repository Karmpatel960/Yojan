import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

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

interface MediaTabProps {
  formState: EventFormState;
  updateField: (field: keyof EventFormState, value: any) => void;
  handleFileUpload: (field: 'images' | 'videos', files: FileList) => void;
  loading: boolean;
  error: string | null;
}

const MediaTab: React.FC<MediaTabProps> = ({ formState, updateField, handleFileUpload, loading, error }) => {

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload('images', files);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload('videos', files);
    }
  };

  const removeImage = (index: number) => {
    updateField('images', formState.images.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    updateField('videos', formState.videos.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Media</CardTitle>
        <CardDescription>Upload images and videos for your event</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="images">Images</Label>
          <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="videos">Videos</Label>
          <Input id="videos" type="file" accept="video/*" multiple onChange={handleVideoUpload} />
        </div>
        <div className="space-y-4">
          <Label>Image Previews</Label>
          <ScrollArea className="h-72 w-full rounded-md border">
            <div className="flex flex-wrap gap-4 p-4">
              {formState.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image src={image} alt={`Preview ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="space-y-4">
          <Label>Video Previews</Label>
          <ScrollArea className="h-72 w-full rounded-md border">
            <div className="flex flex-wrap gap-4 p-4">
              {formState.videos.map((video, index) => (
                <div key={index} className="relative">
                  <video src={video} className="h-24 w-24 object-cover rounded-md" controls />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removeVideo(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          {loading && <p>Uploading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaTab;
