import type { Photo } from "../../types/photo";

import styles from "./PhotosGalleryItem.module.css";

interface PhotosGalleryItemProps {
  onSelect: (photo: Photo) => void;
  photo: Photo;
}

export default function PhotosGalleryItem({
  onSelect,
  photo,
}: PhotosGalleryItemProps) {
  return (
    <div
      onClick={() => onSelect(photo)}
      className={styles.thumb}
      style={{
        backgroundColor: photo.avg_color,
        borderColor: photo.avg_color,
      }}
    >
      <img src={photo.src.large} alt={photo.alt} />
    </div>
  );
}
