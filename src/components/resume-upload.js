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

    const handleSubmit = async () => {
        if (!file) {
            alert("Please add a resume");
            return;
        }
        const formData = new FormData();
        formData.append("resume", file);
        try {
            const res = await fetch("http://localhost:3000/components/parse-resume", { // API backend, sends uploaded resume to backend
                method: "POST", // POST request for formData to use file uploaded
                body: formData,
        });
        if(!res.ok) {
            const text = await res.text();
            console.error("Error: ", text)
            return;
        }
        const parsedData = await res.json(); // returns promise that is a javascript object e.g. all the parsed resume data
        console.log("Parsed Resume: ", parsedData);
        localStorage.setItem("parsedResume", JSON.stringify(parsedData));
    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
}

    return (
        <section id='resume'>
            <h2>Upload Resume</h2>
            <form action='/action_page.php' id='resumeForm' onSubmit={handleSubmit}>
                <label for="img"> Select Resume * </label>
                <input type='file' id='parse' name='resumeupload' accept='.pdf' 
                onChange={handleFileChange} required/>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type='button' onClick={onBack}>Back</button>
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