import { useEffect, useState } from "react";
import { fetchPlaces } from "../http";
import { sortPlacesByDistance } from "../loc";

export default function useFetch(url, sort) {
  const [values, setValues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(function () {
    async function getPlaces() {
      setIsLoading(true);
      try {
        const data = await fetchPlaces(url);
        if (sort) {
          navigator.geolocation.getCurrentPosition((position) => {
            const sortedPlaces = sortPlacesByDistance(
              data,
              position.coords.latitude,
              position.coords.longitude
            );
            setValues(sortedPlaces);

            setIsLoading(false);
          });
        } else {
          setValues(data);
          setIsLoading(false);
        }
      } catch (error) {
        setIsError({ message: "Something went wrong..." });
        setIsLoading(false);
      }
    }

    getPlaces();
  }, []);

  function handleCloseError() {
    setIsError(null);
  }

  return { values, isLoading, isError, handleCloseError, setValues };
}
