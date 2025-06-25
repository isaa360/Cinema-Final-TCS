import React from 'react';
import { Form } from 'react-bootstrap';

const Input = ({ label, type = 'text', placeholder, value, onChange, ...rest }) => {
    return (
        <Form.Group className="mb-3">
            {label && <Form.Label>{label}</Form.Label>}
            <Form.Control
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...rest}
            />
        </Form.Group>
    );
};

export default Input;