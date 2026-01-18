import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import type { Photo } from "../../types/photo";
import { getPhotos } from "../../services/photos";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";
import Modal from "../Modal/Modal";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectPhoto, setSelectPhoto] = useState<Photo | null>(null);

  const openModal = (photo: Photo) => setSelectPhoto(photo);

  const closeModal = () => setSelectPhoto(null);

  const handleSearch = async (value: string) => {
    setPhotos([]);
    setIsError(false);
    setIsLoading(true);
    try {
      const data = await getPhotos(value);

      if (data.length === 0) {
        toast.error("No photos found for your request.");
        setPhotos([]);
        return;
      }

      setPhotos(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Section>
        <Container>
          <Toaster />
          <Form onSubmit={handleSearch} />
          {isError && (
            <Text textAlign="center" marginBottom="20">
              Something went wrong. Please try again.
            </Text>
          )}
          {isLoading && <Loader />}
          {photos.length > 0 && (
            <PhotosGallery onSelect={openModal} photos={photos} />
          )}
          {selectPhoto && (
            <Modal onClose={closeModal}>
              <img src={selectPhoto.src.original} alt={selectPhoto.alt} />
            </Modal>
          )}
        </Container>
        Home page
      </Section>
    </>
  );
}
