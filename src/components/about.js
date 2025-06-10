import React from 'react'


// Section for the about page of the webapp
function about() {
    return (
        <section id='about'> 
        <div className='about-header'>
            <img id='info' src='https://img.icons8.com/ios7/600/info.png' alt='info icon'/>
            <h2>About Titanic</h2>
            </div>
            <p> Titanic is a specialized tool designed to connect students with scholarships tailored to their unique profile. 
                By analyzing your personal information and resume, 
                we match you with scholarships from across Canada that you're most likely to qualify for.</p>
         </section>
    );
}

export default about;