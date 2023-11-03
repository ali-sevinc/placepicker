import { useRef, useState, useCallback } from "react";

import { updateUserPlaces } from "./http.js";

import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import Places from "./components/Places.jsx";
import logoImg from "./assets/logo.png";
import Modal from "./components/Modal.jsx";
import Error from "./components/Error.jsx";
import useFetch from "./components/useFetch.jsx";

function App() {
  const selectedPlace = useRef();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [fetchError, setFetchError] = useState(null);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  const {
    isError,
    handleCloseError,
    isLoading,
    values: userPlaces,
    setValues: setUserPlaces,
  } = useFetch("http://localhost:3000/user-places");

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }

      return [selectedPlace, ...prevPickedPlaces];
    });

    if (userPlaces.some((place) => place.id === selectedPlace.id)) {
      return;
    }

    try {
      const data = await updateUserPlaces({
        places: [selectedPlace, ...userPlaces],
      });
      console.log(data);
    } catch (error) {
      setUserPlaces(userPlaces);
      setFetchError({ message: error.message || "Something went wrong..." });
    }
  }

  //we have to add userPlaces as a depenancy
  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        const data = await updateUserPlaces({
          places: userPlaces.filter(
            (place) => place.id !== selectedPlace.current.id
          ),
        });
        console.log(data);
      } catch (error) {
        setUserPlaces(userPlaces);
        setFetchError({ message: "Removing user data failed..." });
      }

      setModalIsOpen(false);
    },
    [userPlaces, setUserPlaces]
  );

  function handleUpdateError() {
    setFetchError(null);
  }

  return (
    <>
      <Modal open={fetchError} onClose={handleUpdateError}>
        {fetchError && (
          <Error
            title="Update Error Occured"
            message={fetchError.message}
            onConfirm={handleUpdateError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isLoading={isLoading}
          isError={isError}
          places={userPlaces}
          onConfirm={handleCloseError}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
