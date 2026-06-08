'use client'
import {ModalOverlay, type ModalOverlayProps, Modal as RACModal} from 'react-aria-components/Modal';

export default function Modal(props: ModalOverlayProps) {
  return (
    <ModalOverlay {...props} isDismissable={true}>
      <div className="sticky top-0 left-0 w-full h-(--visual-viewport-height) flex items-center justify-center box-border">
        <RACModal {...props} />
      </div>
    </ModalOverlay>
  );
}