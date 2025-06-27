import React from 'react';
import NextButton from './next-button';
import { useState } from 'react';

function ParseResume({ onBack, onNext }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => { 
        const resumeFile = e.target.files[0]; // Retrieve input file
        if(!resumeFile) {
            setError("Please select a resume file before submitting");
            return;
        }
        // Validate file type
        if (!resumeFile.type.includes('pdf')) {
            setError("Please select a PDF file");
            return;
        }
        setFile(resumeFile);
        setError(null);
    }

    const requiredFields = [
        { id: 'parse' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please add a resume");
            return;
        }
        
        setUploading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append("resume", file);
        
        try {
            const res = await fetch("http://localhost:5000/parse-resume", {
                method: "POST",
                body: formData,
            });
            
            if(!res.ok) {
                const text = await res.text();
                throw new Error(`Server error: ${text}`);
            }
            
            const parsedData = await res.json();
            console.log("Parsed Resume: ", parsedData);
            
            // Check if we got keywords
            if (parsedData.keywords && parsedData.keywords.length > 0) {
                localStorage.setItem("parsedResume", JSON.stringify(parsedData));
                setUploadSuccess(true);
                setError(null);
            } else {
                throw new Error("No keywords were extracted from the resume");
            }
        } catch (error) {
            console.error(error);
            setError(`Error: ${error.message}`);
        } finally {
            setUploading(false);
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
                
                {error && (
                    <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}
                
                {uploadSuccess && (
                    <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>
                        ✅ Resume uploaded and parsed successfully!
                    </div>
                )}
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', width: '100%', justifyContent: 'center' }}>
                    <button type='button' onClick={onBack}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
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
                        loading={uploading}
                    />
                </div>
            </form>
        </section>
    );
}

export default ParseResume;