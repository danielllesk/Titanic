import React, { useState } from 'react'

function Scholarship({ onBack }) {
    const [scholarships, setScholarships] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFindScholarships = async () => {
        setLoading(true);
        setError(null);
        try {
            const personalInfo = JSON.parse(localStorage.getItem('userProfile'));
            const parsedResume = JSON.parse(localStorage.getItem('parsedResume'));
            const keywords = parsedResume?.keywords || [];
            const res = await fetch('http://localhost:5000/find-scholarships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ personalInfo, keywords })
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setScholarships(data.scholarships || []);
            setCurrent(0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => setCurrent((prev) => Math.min(prev + 1, scholarships.length - 1));
    const handlePrev = () => setCurrent((prev) => Math.max(prev - 1, 0));

    // Helper to check if a row is a fallback dataset (has 'title' and 'organization')
    const isFallbackDataset = (row) => row && row.title && row.organization !== undefined;

    return (
        <section id='scholarships' style={{ margin: '1.5rem auto', padding: '0.5rem', maxWidth: '700px', backgroundColor: '#f5f9ff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Find Canadian Scholarships</h2>
            <p style={{ marginBottom: '1.5rem' }}>Click below to find Canadian scholarships tailored to your profile.</p>
            {scholarships.length === 0 && (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <button type="button" onClick={onBack}
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
                    >Back</button>
                    <button type="button" onClick={handleFindScholarships} disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: loading ? '#cccccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        {loading ? 'Finding...' : 'Find Scholarships'}
                    </button>
                </div>
            )}
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            {scholarships.length > 0 && (
                <div className="scholarship-card" style={{ margin: '2rem 0', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px #ccc', background: '#fff', textAlign: 'left' }}>
                    {/* If fallback dataset, show as before */}
                    {isFallbackDataset(scholarships[current]) ? (
                        <>
                            <h3 style={{ marginTop: 0 }}>{scholarships[current].title}</h3>
                            {scholarships[current].organization && <p><strong>Organization:</strong> {scholarships[current].organization}</p>}
                            <p><strong>Description:</strong> {scholarships[current].notes}</p>
                            <a href={scholarships[current].url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>View Dataset</a>
                            {scholarships[current].resources && scholarships[current].resources.length > 0 && (
                                <div style={{ marginTop: '1rem' }}>
                                    <strong>Resources:</strong>
                                    <ul>
                                        {scholarships[current].resources.map((r, idx) => (
                                            <li key={idx}>
                                                <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name} ({r.format})</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        // Otherwise, display only the mapped scholarship fields
                        <div>
                            <h3 style={{ marginTop: 0 }}>{scholarships[current].name || 'N/A'}</h3>
                            <p><strong>Description:</strong> {scholarships[current].description || 'N/A'}</p>
                            <p><strong>Amount:</strong> {scholarships[current].amount || 'N/A'}</p>
                            <p><strong>Deadline:</strong> {scholarships[current].deadline || 'N/A'}</p>
                            <a href={scholarships[current].link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>View Scholarship</a>
                        </div>
                    )}
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={handlePrev} disabled={current === 0}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: current === 0 ? '#cccccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: current === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s ease'
                            }}
                        >Previous</button>
                        <button onClick={handleNext} disabled={current === scholarships.length - 1}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: current === scholarships.length - 1 ? '#cccccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: current === scholarships.length - 1 ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s ease'
                            }}
                        >Next</button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Scholarship;