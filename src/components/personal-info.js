import React from 'react'
import NextButton from './next-button'

function Inputinfo({ onNext })  {
    const handleSubmit = (e) => {
    e.preventDefault(); //prevent form from refreshing the page

    // Take all values input, and save to a userData object
    const userData = {
     firstname: document.getElementById("inputFirst").value, // Take returned value from function with this id specfied
     lastname: document.getElementById("inputLast").value,
     email: document.getElementById("inputEmail").value,
     phone: document.getElementById("inputPhone").value,
     province: document.getElementById("inputProvince").value,
     city: document.getElementById("inputCity").value,
     age: document.getElementById("inputAge").value,
     education: document.getElementById("inputFirst").value,
     study: document.getElementById("inputFirst").value,
     GPA: document.getElementById("inputFirst").value,
     finances: document.getElementById("inputFirst").value,
     extracurricular: document.getElementById("inputFirst").value,
    };
    // Save user data to local storage stays usable on refresh (can change to sessionStorage, if we just want it for when the
    // user is on the site and reset after)
    localStorage.setItem("userProfile", JSON.stringify(userData));
    alert("user data saved");
};

    const requiredFields = [
        { id: 'inputFirst' },
        { id: 'inputLast' },
        { id: 'inputEmail' },
        { id: 'inputPhone' },
        { id: 'inputProvince' },
        { id: 'inputCity' },
        { id: 'inputAge' },
        { id: 'inputEducation' },
        {id: 'inputStudy'}
    ];

    return (
        <section id='personal'> 
            <h3>Personal Information</h3>
            <p>Tell us about yourself</p>
            <form id='userForm' onSubmit={handleSubmit}> 
                <div className='form-grid'>
                    <div className='form-groups'>
                <label for='firstName'> First Name *</label>
                    <input type='text' id='inputFirst' required/>
                    </div>
                    <div className='form-groups'>
                <label for='lastName'> Last Name *</label>
                    <input type='text' id='inputLast' required/>
                    </div>
                    <div className='form-groups'>
                <label for='email'> Email *</label>
                    <input type='email' id='inputEmail' required/>
                    </div>
                    <div className='form-groups'>
                <label for='phone'> Phone Number *</label>
                    <input type='number' id='inputPhone' required/>
                    </div>
                    <div className='form-groups'>
                <label for='phone'> Province/Territory *</label>
                    <select name="provinces/territory" id="inputProvince" required>
                        <option value='none' selected disabled hidden> Select your province/territory </option>
                        <option value='alberta'>Alberta</option>
                        <option value='british columbia'>British Columbia</option>
                        <option value='manitoba'>Manitoba</option>
                        <option value='new brunswick'>New Brunswick</option>
                        <option value='newfoundland and labrador'>Newfoundland and Labrador</option>
                        <option value='northwest territories'>Northwest Territories</option>
                        <option value='nova scotia'>Nova Scotia</option>
                        <option value='nunavut'>Nunavut</option>
                        <option value='ontario'>Ontario</option>
                        <option value='prince edward island'>Prince Edward Island</option>
                        <option value='quebec'>Quebec</option>
                        <option value='saskatchewan'>Saskatchewan</option>
                        <option value='yukon'>Yukon</option>
                    </select>
                    </div>
                    <div className='form-groups'>
                <label for='city'> City *</label>
                    <input type='text' id='inputCity' required/>
                    </div>
                    <div className='form-groups'>
                <label for='age'> Age *</label>
                    <input type='text' id='inputAge' required/>
                    </div>
                    <div className='form-groups'>
                <label for='phone'> Education Level *</label>
                    <select name="education" id="inputEducation"  required>
                        <option value='none' selected disabled hidden> Select education level </option>
                        <option value='high school'>High School</option>
                        <option value='college'>College/CEGEP</option>
                        <option value='undergraduate'>Undergraduate</option>
                        <option value='postgraduate'>Post Graduate</option>
                    </select>
                    </div>
                     <div className='form-groups'>
                <label for='study'> Field of Study * </label>
                    <input type='text' id='inputStudy' required/>
                    </div>
                    <div className='form-groups'>
                <label for='gpa'> GPA (if applicable) </label>
                    <input type='number' id='inputGPA'/>
                    </div>
                    <div className='form-groups'>
                <label for='phone'> Financial Need Level</label>
                    <select name="finance" id="inputFinance" required>
                        <option value='none' selected disabled hidden> Select financial need level</option>
                        <option value='high'>High - Significant financial assistance required </option>
                        <option value='medium'>Medium - Some financial assistance required</option>
                        <option value='low'>Low - Minimal financial assistance required</option>
                        <option value='nothing'>No specific financial need</option>
                    </select>
                    </div>
                    <div className='form-groups'>
                <label for='financial'> Extracurricular Activities & Achievements </label>
                    <input type='text' id='inputActivities' placeholder='List volunteer work, leadership roles, jobs, awards, etc.'/>
                    </div>
                </div>
                <NextButton 
                    requiredFields={requiredFields}
                    onNext={onNext}
                    buttonText="Continue to Resume Upload"
                />
            </form>
        </section>
    )
}

export default Inputinfo;