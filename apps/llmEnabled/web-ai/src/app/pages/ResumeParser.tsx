import { useState } from 'react';

export default function ResumeParser() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        education: '',
        phoneNumber: '',
        email: '',
        linkedin: '',
        github: '',
        summary: '',
        skills: '',
        experience: ''
    });
    
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleParseSubmit = async (e) => {
        e.preventDefault(); 
        if (!file) return;

        setLoading(true);
        const dataToSend = new FormData();
        dataToSend.append('resume', file);

        try {
            const response = await fetch('http://localhost:3333/api/resume/parse', {
                method: 'POST',
                body: dataToSend,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Parsing Result:', result);

            if (result.success && result.data) {
                setFormData({
                    name: result.data.name ?? '',
                    age: result.data.age ?? '',
                    education: result.data.education ?? '',
                    phoneNumber: result.data.phoneNumber ?? '',
                    email: result.data.email ?? '',
                    linkedin: result.data.linkedin ?? '',
                    github: result.data.github ?? '',
                    summary: result.data.summary ?? '',
                    skills: result.data.skills ?? '',
                    experience: result.data.experience ?? ''
                });
            } else {
                alert('Failed to parse resume data.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred while parsing the resume.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        console.log('Final Data Ready to Save:', formData);
        alert('Data saved successfully!');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Resume Parser</h1>
            
            <form onSubmit={handleParseSubmit}>
                <h2>Step 1: Attach Resume</h2>
                <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFileChange} 
                    disabled={loading}
                />
                {file && <p>Selected file: {file.name}</p>}
                {loading && <p style={{ color: 'blue' }}>Parsing file with Gemini AI...</p>}
                <button type="submit" disabled={!file || loading}>Parse Resume</button>
            </form>

            <hr style={{ margin: '20px 0' }} />

            <h2>Step 2: Review & Complete Info</h2>
            <form onSubmit={handleSubmitForm}>
                <h3>Personal Information</h3>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="age">Age</label>
                    <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
                </div>

                <h3>Contact & Links</h3>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="linkedin">LinkedIn URL</label>
                    <input type="url" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="github">GitHub URL</label>
                    <input type="url" id="github" name="github" value={formData.github} onChange={handleChange} />
                </div>

                <h3>Professional Details</h3>
                <div>
                    <label htmlFor="summary">Professional Summary</label>
                    <textarea id="summary" name="summary" rows={3} value={formData.summary} onChange={handleChange} style={{ width: '100%' }} />
                </div>

                <div>
                    <label htmlFor="education">Education</label>
                    <textarea id="education" name="education" rows={2} value={formData.education} onChange={handleChange} style={{ width: '100%' }} />
                </div>

                <div>
                    <label htmlFor="skills">Skills (Comma separated)</label>
                    <input type="text" id="skills" name="skills" placeholder="React, Node.js, TypeScript" value={formData.skills} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="experience">Work Experience</label>
                    <textarea id="experience" name="experience" rows={4} value={formData.experience} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                
                <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>Submit Final Profile</button>
            </form>
        </div>
    );
}
