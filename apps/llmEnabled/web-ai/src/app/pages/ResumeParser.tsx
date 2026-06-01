import { useState } from "react";
import "./ResumeParser.css";

export default function ResumeParser() {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        education: "",
        phoneNumber: "",
        email: "",
        linkedin: "",
        github: "",
        summary: "",
        skills: "",
        experience: ""
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
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleParseSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a resume file.");
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("resume", file);

            const response = await fetch(
                "http://localhost:3333/api/resume/parse",
                {
                    method: "POST",
                    body: formDataToSend
                }
            );

            if (!response.ok) {
                throw new Error("Failed to parse resume");
            }

            const result = await response.json();

            if (result.success && result.data) {
                setFormData({
                    name: result.data.name ?? "",
                    age: result.data.age ?? "",
                    education: result.data.education ?? "",
                    phoneNumber: result.data.phoneNumber ?? "",
                    email: result.data.email ?? "",
                    linkedin: result.data.linkedin ?? "",
                    github: result.data.github ?? "",
                    summary: result.data.summary ?? "",
                    skills: Array.isArray(result.data.skills)
                        ? result.data.skills.join(", ")
                        : result.data.skills ?? "",
                    experience:
                        typeof result.data.experience === "string"
                            ? result.data.experience
                            : JSON.stringify(
                                  result.data.experience,
                                  null,
                                  2
                              )
                });
            } else {
                alert("Resume parsing failed.");
            }
        } catch (error) {
            console.error(error);
            alert("Error parsing resume.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        console.log("Final Resume Data:", formData);

        alert("Profile saved successfully.");
    };

    return (
        <div className="container">
            <header className="header">
                <h1 className="title">📄 AI Resume Parser</h1>

                <p className="subtitle">
                    Upload a resume and automatically extract candidate
                    information
                </p>
            </header>

            <div className="card">
                <form
                    className="upload-section"
                    onSubmit={handleParseSubmit}
                >
                    <h2 className="section-title">
                        Step 1: Upload Resume
                    </h2>

                    <div className="dropzone">
                        <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            disabled={loading}
                            className="file-input"
                        />

                        <label
                            htmlFor="resume-upload"
                            className="file-label"
                        >
                            {file
                                ? "🔄 Change Resume"
                                : "📂 Choose Resume"}
                        </label>

                        {file && (
                            <p className="file-name">
                                Selected File:
                                <strong> {file.name}</strong>
                            </p>
                        )}
                    </div>

                    {loading && (
                        <div className="loading-box">
                            ⏳ Parsing Resume...
                        </div>
                    )}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={!file || loading}
                    >
                        {loading
                            ? "Parsing..."
                            : "Parse Resume"}
                    </button>
                </form>
            </div>

            <div className="card">
                <form
                    className="form-grid"
                    onSubmit={handleSubmitForm}
                >
                    <div className="full-width">
                        <h3 className="group-title">
                            👤 Personal Information
                        </h3>
                    </div>

                    <div className="half-width">
                        <label
                            htmlFor="name"
                            className="label"
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            className="input"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="half-width">
                        <label
                            htmlFor="age"
                            className="label"
                        >
                            Age
                        </label>

                        <input
                            id="age"
                            name="age"
                            type="number"
                            className="input"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="full-width">
                        <h3 className="group-title">
                            📞 Contact Information
                        </h3>
                    </div>

                    <div className="half-width">
                        <label
                            htmlFor="email"
                            className="label"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="input"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="half-width">
                        <label
                            htmlFor="phoneNumber"
                            className="label"
                        >
                            Phone Number
                        </label>

                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            className="input"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="half-width">
                        <label
                            htmlFor="linkedin"
                            className="label"
                        >
                            LinkedIn
                        </label>

                        <input
                            id="linkedin"
                            name="linkedin"
                            className="input"
                            value={formData.linkedin}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="half-width">
                        <label
                            htmlFor="github"
                            className="label"
                        >
                            GitHub
                        </label>

                        <input
                            id="github"
                            name="github"
                            className="input"
                            value={formData.github}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="full-width">
                        <h3 className="group-title">
                            💼 Professional Details
                        </h3>
                    </div>

                    <div className="full-width">
                        <label
                            htmlFor="summary"
                            className="label"
                        >
                            Summary
                        </label>

                        <textarea
                            id="summary"
                            name="summary"
                            className="textarea"
                            value={formData.summary}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="full-width">
                        <label
                            htmlFor="education"
                            className="label"
                        >
                            Education
                        </label>

                        <textarea
                            id="education"
                            name="education"
                            className="textarea"
                            value={formData.education}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="full-width">
                        <label
                            htmlFor="skills"
                            className="label"
                        >
                            Skills
                        </label>

                        <input
                            id="skills"
                            name="skills"
                            className="input"
                            value={formData.skills}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="full-width">
                        <label
                            htmlFor="experience"
                            className="label"
                        >
                            Experience
                        </label>

                        <textarea
                            id="experience"
                            name="experience"
                            rows="6"
                            className="textarea"
                            value={formData.experience}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="full-width">
                        <button
                            type="submit"
                            className="save-button"
                        >
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}