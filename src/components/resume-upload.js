import React from 'react';

function ParseResume( {onBack} ) {
    return (
        <section id='resume'>
        <h2>Upload Resume</h2>
        <button type='back' onClick={onBack}> Back </button>
        </section>
    );
}

export default ParseResume;