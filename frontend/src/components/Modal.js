import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';

const Modal = ({ show, handleClose, title, children, footerButtons }) => {
    return (
        <BootstrapModal show={show} onHide={handleClose}>
            <BootstrapModal.Header closeButton>
                <BootstrapModal.Title>{title}</BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body>{children}</BootstrapModal.Body>
            {footerButtons && (
                <BootstrapModal.Footer>
                    {footerButtons.map((button, index) => (
                        <Button key={index} variant={button.variant} onClick={button.onClick}>
                            {button.label}
                        </Button>
                    ))}
                </BootstrapModal.Footer>
            )}
        </BootstrapModal>
    );
};

export default Modal;