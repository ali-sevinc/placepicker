import Places from "./Places.jsx";
import useFetch from "./useFetch.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isError,
    handleCloseError,
    isLoading,
    values: places,
  } = useFetch("http://localhost:3000/places", "sort");

  return (
    <Places
      title="Available Places"
      places={places}
      isLoading={isLoading}
      isError={isError}
      onConfirm={handleCloseError}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
