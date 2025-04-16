import { useState, useEffect } from "react";

const useGeoLocation = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setError(null);
          setLoading(false); // Stop loading after fetching location
        },
        (error) => {
          setError(error.message);
          setLoading(false); // Stop loading even if there’s an error
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  console.log( 'location',location);
  return { location, error, loading };
};

export default useGeoLocation;
