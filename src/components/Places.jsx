import Error from "./Error";

export default function Places({
  title,
  places,
  fallbackText,
  onSelectPlace,
  isLoading,
  isError,
  onConfirm,
}) {
  return (
    <section className="places-category">
      <h2>{title}</h2>

      {!isLoading && isError && (
        <Error
          title="Error occured.."
          message={isError.message || "Something went wrong..."}
          onConfirm={onConfirm}
        />
      )}
      {isLoading && !isError && <p className="fallback-text">Loading....</p>}
      {places.length === 0 && !isLoading && !isError && (
        <p className="fallback-text">{fallbackText}</p>
      )}
      {places.length > 0 && !isLoading && !isError && (
        <ul className="places">
          {places.map((place) => (
            <li key={place.id} className="place-item">
              <button onClick={() => onSelectPlace(place)}>
                <img
                  src={`http://localhost:3000/${place.image.src}`}
                  alt={place.image.alt}
                />
                <h3>{place.title}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
