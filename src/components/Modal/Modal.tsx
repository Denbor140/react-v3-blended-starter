import { ReactNode, useEffect } from "react";
import css from "./Modal.module.css";
import { createPortal } from "react-dom";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ children, onClose }: ModalProps) {
  const closeForBackDrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const closeForKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", closeForKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeForKeyDown);
      document.body.style.overflow = "";
    };
  });

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={closeForBackDrop}>
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}
