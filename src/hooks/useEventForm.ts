import { useState,useEffect } from 'react';

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
  createdById: number;  // Ensure this is in the state
  cityId: number;  // Ensure this is in the state
}

const useEventForm = () => {
  const [formState, setFormState] = useState<EventFormState>({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    tags: [],
    images: [],
    videos: [],
    instructions: '',
    organizerName: '',
    organizerContact: '',
    organizerEmail: '',
    ticketPrice: 0,
    availableSeats: 0,
    registrationLink: '',
    isFeatured: false,
    isPublic: true,
    poster: undefined,
    gallery: [],
    createdById: 0,
    cityId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof EventFormState, value: any) => {
    setFormState(prevState => ({ ...prevState, [field]: value }));
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      updateField('createdById', userId);
    }
  }, []);

  useEffect(() => {
    // Print the formState object whenever it changes
    console.log('Form State:', formState);
  }, [formState]);
  
  const handleFileUpload = async (field: 'images' | 'videos', files: FileList | null) => {
    if (files) {
      setLoading(true);
      setError(null);
      try {
        const urls = await Promise.all(
          Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Upload failed');
            }

            const data = await response.json();
            return data.imgUrl;
          })
        );
        updateField(field, [...formState[field], ...urls]);
      } catch (err) {
        setError('Failed to upload files');
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    formState,
    updateField,
    handleFileUpload,
    loading,
    error,
  };
};

export default useEventForm;


