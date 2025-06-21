import React from 'react';
import NextButton from './next-button';
import {useState} from 'react';

function Inputinfo({ onNext })  {
    // Take all values input, and save to a userData object
    const [profile, setProfile]= useState({
     firstname: "", lastname: "", email: "",
     phone: "", province: "", city: "", age: "",
     education: "", study: "", GPA: "", finances: "", extracurricular: "",
    });

    const handleChange = e =>
    setProfile({ ...profile, [e.target.name] : e.target.value})
    // Save user data to local storage stays usable on refresh (can change to sessionStorage, if we just want it for when the
    // user is on the site and reset after)
    const handleSubmit = (e) => {
    e.preventDefault(); //prevent form from refreshing the page
    localStorage.setItem("userProfile", JSON.stringify(profile));
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
                    <input name='firstname' type='text' id='inputFirst' value={profile.firstname} onChange={handleChange} required/>
                    </div>
                    <div className='form-groups'>
                <label for='lastName'> Last Name *</label>
                    <input name='lastname' type='text' id='inputLast' value={profile.lastname} onChange={handleChange} required/>
                    </div>
                    <div className='form-groups'>
                <label for='email'> Email *</label>
                    <input name='email' type='email' id='inputEmail' value={profile.email} onChange={handleChange} required/>
                    </div>
                    <div className='form-groups'>
                <label for='phone'> Phone Number *</label>
                    <input name='phone' type='number' id='inputPhone' value={profile.phone} onChange={handleChange} maxlength='10' required/>
                    </div>
                    <div className='form-groups'>
                <label for='phone'> Province/Territory *</label>
                    <select name="province" id="inputProvince" value={profile.province} onChange={handleChange} required>
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
                    <input name='city' type='text' id='inputCity' value={profile.city} onChange={handleChange} required/>
                    </div>
                    <div className='form-groups'>
                <label for='age'> Age *</label>
                    <input name='age' type='text' id='inputAge' value={profile.age} onChange={handleChange} required/>
                    </div>
                    <div className='form-groups'>
                <label for='phone'> Education Level *</label>
                    <select name="education" id="inputEducation"  value={profile.education} onChange={handleChange} required>
                        <option value='none' selected disabled hidden> Select education level </option>
                        <option value='high school'>High School</option>
                        <option value='college'>College/CEGEP</option>
                        <option value='undergraduate'>Undergraduate</option>
                        <option value='postgraduate'>Post Graduate</option>
                    </select>
                    </div>
                     <div className='form-groups'>
                <label for='study'> Field of Study * </label>
                    <input name='study' type='text' id='inputStudy' value={profile.study} onChange={handleChange} required/>
                    </div>
                    <div className='form-groups'>
                <label for='gpa'> GPA (if applicable) </label>
                    <input name='GPA' type='number' id='inputGPA' value={profile.GPA} onChange={handleChange} />
                    </div>
                    <div className='form-groups'>
                <label for='phone'> Financial Need Level</label>
                    <select name="finances" id="inputFinance" value={profile.finances} onChange={handleChange} required>
                        <option value='none' selected disabled hidden> Select financial need level</option>
                        <option value='high'>High - Significant financial assistance required </option>
                        <option value='medium'>Medium - Some financial assistance required</option>
                        <option value='low'>Low - Minimal financial assistance required</option>
                        <option value='nothing'>No specific financial need</option>
                    </select>
                    </div>
                    <div className='form-groups'>
                <label for='financial'> Extracurricular Activities & Achievements </label>
                    <input name='extracurricular' type='text' id='inputActivities' value={profile.extracurricular} onChange={handleChange} placeholder='List volunteer work, leadership roles, jobs, awards, etc.'/>
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