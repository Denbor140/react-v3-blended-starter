import type { Photo } from "../../types/photo";
import Grid from "../Grid/Grid";
import GridItem from "../GridItem/GridItem";
import PhotosGalleryItem from "../PhotosGalleryItem/PhotosGalleryItem";

interface PhotosGalleryProps {
  onSelect: (photo: Photo) => void;
  photos: Photo[];
}

export default function PhotosGallery({
  onSelect,
  photos,
}: PhotosGalleryProps) {
  return (
    <Grid>
      {photos.map((photo) => (
        <GridItem key={photo.id}>
          <PhotosGalleryItem onSelect={onSelect} photo={photo} />
        </GridItem>
      ))}
    </Grid>
  );
}
