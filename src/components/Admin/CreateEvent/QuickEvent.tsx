import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import EventDetailsTab from "@/components/Admin/CreateEvent/EventDetailsTab"
import OrganizerInfoTab from "./OrganizerInfoTab"
import MediaTab from "./MediaTab"
import TicketsTab from "./TicketsTab"
import { Loader2, CheckCircle  } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"



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
  paymentAddress: string
}

interface Props {
  formState: EventFormState
  updateField: (field: keyof EventFormState, value: any) => void
  handleFileUpload: (field: 'images' | 'videos', files: FileList) => void
  loading: boolean
  error: string | null
}

const initialFormState: EventFormState = {
  title: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  category: "",
  tags: [],
  images: [],
  videos: [],
  instructions: "",
  organizerName: "",
  organizerContact: "",
  organizerEmail: "",
  ticketPrice: 0,
  availableSeats: 0,
  registrationLink: "",
  isFeatured: false,
  isPublic: true,
  gallery: [],
  createdById: 0,
  cityId: 0,
  paymentAddress: "",
}

const QuickEventCreation: React.FC<Props> = ({ formState, updateField, handleFileUpload, loading: fileLoading, error }) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const resetForm = () => {
    Object.keys(initialFormState).forEach((key) => {
      updateField(key as keyof EventFormState, initialFormState[key as keyof EventFormState]);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate required fields
    if (!formState.title || !formState.date || !formState.venue) {
      toast({
        title: "Error",
        description: "Title, date, and venue are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {

      const eventResponse = await fetch("/api/listevent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState }),
      });

      if (!eventResponse.ok) {
        throw new Error("Failed to create event.");
      }

      
   

      const eventData = await eventResponse.json();

      let paymentAddress = eventData.paymentAddress;


      if (paymentAddress == "") {
        const walletResponse = await fetch("/api/wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create", userId: Number(eventData.createdById) }),
        });

        const walletData = await walletResponse.json();
        if (walletResponse.ok) {
          paymentAddress = walletData.address;
          setShowSuccessMessage(true);

          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 5000);
        } else {
          throw new Error("Failed to create wallet.");
        }
      }

      if(paymentAddress !== "") {

       const nftResponse = await fetch("/api/mintNFT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: Number(eventData.id),
          totalSupply: Number(eventData.availableSeats)
        }),
      });

      const nftData = await nftResponse.json();
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      if (!nftData.ok) {
        throw new Error("Failed to mint NFT.");
      }

    }


      toast({
        title: "Event Created",
        description: "Your event has been successfully created, and an NFT has been minted.",
      });

      resetForm();
      setActiveTab("details");
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error creating event: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        {showSuccessMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Event Created Successfully!</AlertTitle>
            <AlertDescription className="text-green-600">
              Your event has been created and an NFT has been minted. You can view it in the "Your Events" tab.
            </AlertDescription>
          </Alert>
        )}
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
                loading={fileLoading}
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
              <Button type="submit" className="w-full mt-4" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}

export default QuickEventCreation