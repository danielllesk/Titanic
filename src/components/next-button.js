import React, { useState, useEffect } from 'react';

function NextButton({ requiredFields, onNext, buttonText = "Next" }) {
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const validateFields = () => {
            // Check if all required fields have values
            const allFieldsValid = requiredFields.every(field => {
                const element = document.getElementById(field.id);
                if (!element) return false;
                
                if (element.type === 'file') {
                    return element.files.length > 0;
                }
                
                const value = element.value.trim();
                return value !== '' && value !== 'none';
            });
            
            setIsValid(allFieldsValid);
        };

        // Add event listeners to all required fields
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                element.addEventListener('input', validateFields);
                element.addEventListener('change', validateFields);
            }
        });

        // Initial validation
        validateFields();

        // Cleanup event listeners
        return () => {
            requiredFields.forEach(field => {
                const element = document.getElementById(field.id);
                if (element) {
                    element.removeEventListener('input', validateFields);
                    element.removeEventListener('change', validateFields);
                }
            });
        };
    }, [requiredFields]);

    return (
        <button
            type="submit"
            onClick={onNext}
            disabled={!isValid}
            style={{
                padding: '10px 20px',
                backgroundColor: isValid ? '#007bff' : '#cccccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isValid ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.3s ease'
            }}
        >
            {buttonText}
        </button>
    );
}

export default NextButton; 