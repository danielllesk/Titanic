import React from 'react';

function ParseResume( {onBack} ) {
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
    return (
        <section id='resume'>
        <h2>Upload Resume</h2>
        <form action='/action_page.php' id='resumeForm' onSubmit={handleSubmit}>
            <label for="img"> Select Resume: </label>
            <input type='file' id='parse' name='resumeupload' accept='.pdf, .jpeg, .png, .pdf'/>
            <input id='resumesubmit' type='submit' value='Upload'/>
        </form>
        <button type='back' onClick={onBack}> Back </button>
        </section>
    );
}

export default ParseResume;