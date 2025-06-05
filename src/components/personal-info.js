import React from 'react'




function inputinfo()  {
    return (
        <section id='personal'> 
            <h3>Personal Information</h3>
            <p>Tell us about yourself</p>
            <div className='firstName'>
            <h3> First Name *</h3>
            <input 
            id='inputFirst'/>
            </div>
        </section>
    )
}

export default inputinfo;