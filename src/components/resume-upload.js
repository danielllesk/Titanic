import React from 'react';
import NextButton from './next-button';

function ParseResume({ onBack, onNext }) {
    const handleSubmit = (e) => {
        e.preventDefault(); //prevent form from refreshing the page
        const resumeFile = document.getElementById("parse").files[0];
        if(!resumeFile) {
            alert("Please select a resume file before submitting")
            return;
        }
        const resumeData = {
            name: resumeFile.name,
            type: resumeFile.type,
            size: resumeFile.size,
        }; 
        localStorage.setItem("resume", JSON.stringify(resumeData)); // Save resume object meta data to local storage 
        alert("resume saved " + resumeData.name);
    }

    const requiredFields = [
        { id: 'parse' }
    ];

    return (
        <section id='resume'>
            <h2>Upload Resume</h2>
            <form action='/action_page.php' id='resumeForm' onSubmit={handleSubmit}>
                <label for="img"> Select Resume * </label>
                <input type='file' id='parse' name='resumeupload' accept='.pdf, .jpeg, .png, .pdf' required/>
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