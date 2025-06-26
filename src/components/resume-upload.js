import React from 'react';
import NextButton from './next-button';
import { useState } from 'react';

function ParseResume({ onBack, onNext }) {
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => { 
        const resumeFile = e.target.files[0]; // Retrieve input file
        if(!resumeFile) {
            alert("Please select a resume file before submitting")
            return;
        }
        setFile(resumeFile);
    }

    const requiredFields = [
        { id: 'parse' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please add a resume");
            return;
        }
        const formData = new FormData();
        formData.append("resume", file);
        try {
            const res = await fetch("http://localhost:5000/parse-resume", {
                method: "POST",
                body: formData,
            });
            if(!res.ok) {
                const text = await res.text();
                console.error("Error: ", text)
                return;
            }
            const parsedData = await res.json();
            console.log("Parsed Resume: ", parsedData);
            localStorage.setItem("parsedResume", JSON.stringify(parsedData));
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        }
    }

    return (
        <section id='resume' style={{ margin: '1.5rem auto', padding: '0.5rem', maxWidth: '700px', backgroundColor: '#f5f9ff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Upload Resume</h2>
            <form id='resumeForm' onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="parse" style={{ marginBottom: '1rem', fontWeight: 500, fontSize: '1rem', alignSelf: 'flex-start' }}> Select Resume * </label>
                <input type='file' id='parse' name='resume' accept='.pdf' 
                    onChange={handleFileChange} required
                    style={{ marginBottom: '1.5rem', padding: '8px', borderRadius: '4px', background: '#fff', boxShadow: '0 2px 8px #eee', width: '100%' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', width: '100%', justifyContent: 'center' }}>
                    <button type='button' onClick={onBack}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'background-color 0.3s ease'
                        }}
                    >Back</button>
                    <NextButton 
                        requiredFields={requiredFields}
                        onNext={onNext}
                        buttonText="Upload and Continue"
                    />
                </div>
            </form>
        </section>
    );
}

export default ParseResume;