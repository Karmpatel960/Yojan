import { useEffect, useState } from 'react';

interface City {
  id: number;
  name: string;
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch('/api/city');
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        } else {
          setError('Failed to fetch cities');
        }
      } catch (error) {
        setError('Error fetching cities');
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  return { cities, loading, error };
}

