import { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
  }

interface City {
  id: number;
  name: string;
}

const CitySelect :  React.FC<InfoTabProps> = ({formState, updateField})  => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCity = cities.find(city => city.id === formState.cityId);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/city');
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError('Failed to load cities');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <div className="space-y-2">
      {loading ? (
        <p>Loading cities...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Select
          value={selectedCity?.id ? String(selectedCity.id) : ''}
          onValueChange={(value) => {
            const cityId = parseInt(value, 10);
            updateField('cityId', cityId);
          }}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select City">
              {selectedCity ? selectedCity.name : 'Select city'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={String(city.id)}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default CitySelect;

