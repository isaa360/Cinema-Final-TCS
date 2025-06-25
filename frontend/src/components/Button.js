import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

const Button = ({ children, variant = 'primary', onClick, className = '', ...rest }) => {
    return (
        <BootstrapButton variant={variant} onClick={onClick} className={className} {...rest}>
            {children}
        </BootstrapButton>
    );
};

export default Button;