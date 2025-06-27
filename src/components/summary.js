import React, { useState, useEffect } from 'react';
import NextButton from './next-button';

function Summary({ onBack, onNext }) {
    const [userProfile, setUserProfile] = useState({});
    const [parsedResume, setParsedResume] = useState({});
    const [editableKeywords, setEditableKeywords] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Load data from localStorage
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const resume = JSON.parse(localStorage.getItem('parsedResume') || '{}');
        
        setUserProfile(profile);
        setParsedResume(resume);
        setEditableKeywords(resume.keywords || []);
    }, []);

    const handleKeywordChange = (index, value) => {
        const newKeywords = [...editableKeywords];
        newKeywords[index] = value;
        setEditableKeywords(newKeywords);
    };

    const addKeyword = () => {
        setEditableKeywords([...editableKeywords, '']);
    };

    const removeKeyword = (index) => {
        const newKeywords = editableKeywords.filter((_, i) => i !== index);
        setEditableKeywords(newKeywords);
    };

    const handleSave = () => {
        // Update the parsed resume with edited keywords
        const updatedResume = {
            ...parsedResume,
            keywords: editableKeywords.filter(keyword => keyword.trim() !== '')
        };
        localStorage.setItem('parsedResume', JSON.stringify(updatedResume));
        setIsEditing(false);
    };

    const handleContinue = () => {
        // Save any changes before continuing
        if (isEditing) {
            handleSave();
        }
        onNext();
    };

    const requiredFields = []; // No required fields for summary page

    return (
        <section id='summary' style={{ margin: '1.5rem auto', padding: '1.5rem', maxWidth: '900px', backgroundColor: '#f5f9ff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>Profile Summary</h2>
            
            {/* Personal Information Section */}
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '1rem', color: '#007bff' }}>Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                        <strong>Name:</strong> {userProfile.firstname} {userProfile.lastname}
                    </div>
                    <div>
                        <strong>Email:</strong> {userProfile.email}
                    </div>
                    <div>
                        <strong>Phone:</strong> {userProfile.phone}
                    </div>
                    <div>
                        <strong>Location:</strong> {userProfile.city}, {userProfile.province}
                    </div>
                    <div>
                        <strong>Age:</strong> {userProfile.age}
                    </div>
                    <div>
                        <strong>Education Level:</strong> {userProfile.education}
                    </div>
                    <div>
                        <strong>Field of Study:</strong> {userProfile.study}
                    </div>
                    <div>
                        <strong>GPA:</strong> {userProfile.GPA || 'Not provided'}
                    </div>
                    <div>
                        <strong>Financial Need:</strong> {userProfile.finances}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Extracurricular Activities:</strong> {userProfile.extracurricular || 'None listed'}
                    </div>
                </div>
            </div>

            {/* Parsed Resume Information */}
            {parsedResume.workExperience && parsedResume.workExperience.length > 0 && (
                <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#007bff' }}>Work Experience (from Resume)</h3>
                    {parsedResume.workExperience.map((job, index) => (
                        <div key={index} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #e9ecef', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 'bold' }}>{job.jobTitle}</div>
                            <div style={{ color: '#666' }}>{job.organization}</div>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                {job.startDate} - {job.endDate || 'Present'}
                            </div>
                            {job.description && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{job.description}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {parsedResume.education && parsedResume.education.length > 0 && (
                <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#007bff' }}>Education (from Resume)</h3>
                    {parsedResume.education.map((edu, index) => (
                        <div key={index} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #e9ecef', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                            <div style={{ color: '#666' }}>{edu.organization}</div>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                {edu.startDate} - {edu.endDate || 'Present'}
                            </div>
                            {edu.grade && (
                                <div style={{ fontSize: '0.9rem' }}>Grade: {edu.grade}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Resume Keywords Section */}
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: '#007bff', margin: 0 }}>Resume Keywords & Skills</h3>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: isEditing ? '#28a745' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                </div>
                
                {isEditing ? (
                    <div>
                        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                            Edit the keywords extracted from your resume. These will be used to find relevant scholarships.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {editableKeywords.map((keyword, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                                        style={{
                                            padding: '4px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                    <button
                                        onClick={() => removeKeyword(index)}
                                        style={{
                                            padding: '2px 6px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addKeyword}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            + Add Keyword
                        </button>
                    </div>
                ) : (
                    <div>
                        {editableKeywords.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {editableKeywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            padding: '4px 8px',
                                            backgroundColor: '#e9ecef',
                                            borderRadius: '12px',
                                            fontSize: '0.9rem',
                                            color: '#495057'
                                        }}
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No keywords extracted from resume</p>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                    type='button' 
                    onClick={onBack}
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
                >
                    Back
                </button>
                <NextButton 
                    requiredFields={requiredFields}
                    onNext={handleContinue}
                    buttonText="Find Scholarships"
                />
            </div>
        </section>
    );
}

export default Summary; 