import React from 'react';

function ParseResume( {onBack} ) {
    return (
        <section id='resume'>
        <h2>Upload Resume</h2>
        <form action='/action_page.php'>
            <label for="img"> Select Resume: </label>
            <input type='file' id='parse' name='resumeupload' accept='.pdf, .jpeg, .png, .pdf'/>
            <input type='submit'/>
        </form>
        <button type='back' onClick={onBack}> Back </button>
        </section>
    );
}

export default ParseResume;