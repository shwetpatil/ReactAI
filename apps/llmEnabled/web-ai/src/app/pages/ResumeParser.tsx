import { useState } from "react";
import "./ResumeParser.css";

export default function ResumeParser() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    linkedin: "",
    github: "",
    location: "",
    currentDesignation: "",
    totalExperience: "",
    summary: "",
    skills: [],
    education: [],
    experience: []
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleParseResume = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume file.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("resume", file);

      const response = await fetch(
        "http://localhost:3333/api/resume/parse",
        {
          method: "POST",
          body: data
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setFormData({
        name: result.data.name ?? "",
        email: result.data.email ?? "",
        phoneNumber: result.data.phoneNumber ?? "",
        linkedin: result.data.linkedin ?? "",
        github: result.data.github ?? "",
        location: result.data.location ?? "",
        currentDesignation:
          result.data.currentDesignation ?? "",
        totalExperience:
          result.data.totalExperience ?? "",
        summary: result.data.summary ?? "",
        skills: result.data.skills ?? [],
        education: result.data.education ?? [],
        experience: result.data.experience ?? []
      });
    } catch (error) {
      console.error(error);
      alert("Failed to parse resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1 className="title">
          📄 AI Resume Parser
        </h1>

        <p className="subtitle">
          Upload a resume and extract structured
          candidate information using Gemini AI
        </p>
      </header>

      <div className="card">
        <form
          className="upload-section"
          onSubmit={handleParseResume}
        >
          <h2 className="section-title">
            Upload Resume
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
                : "📄 Select Resume"}
            </label>

            {file && (
              <p className="file-name">
                Selected: {file.name}
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
        <h2 className="section-title">
          Candidate Profile
        </h2>

        <div className="profile-grid">
          <div>
            <label>Name</label>
            <input
              value={formData.name}
              readOnly
            />
          </div>

          <div>
            <label>Email</label>
            <input
              value={formData.email}
              readOnly
            />
          </div>

          <div>
            <label>Phone Number</label>
            <input
              value={formData.phoneNumber}
              readOnly
            />
          </div>

          <div>
            <label>Location</label>
            <input
              value={formData.location}
              readOnly
            />
          </div>

          <div>
            <label>
              Current Designation
            </label>
            <input
              value={
                formData.currentDesignation
              }
              readOnly
            />
          </div>

          <div>
            <label>
              Total Experience
            </label>
            <input
              value={
                formData.totalExperience
              }
              readOnly
            />
          </div>

          <div>
            <label>LinkedIn</label>
            <input
              value={formData.linkedin}
              readOnly
            />
          </div>

          <div>
            <label>GitHub</label>
            <input
              value={formData.github}
              readOnly
            />
          </div>
        </div>

        <div className="section">
          <h3>
            Professional Summary
          </h3>

          <textarea
            rows={5}
            value={formData.summary}
            readOnly
          />
        </div>

        <div className="section">
          <h3>Skills</h3>

          <div className="skills-container">
            {formData.skills.length > 0 ? (
              formData.skills.map(
                (skill, index) => (
                  <span
                    key={index}
                    className="skill-chip"
                  >
                    {skill}
                  </span>
                )
              )
            ) : (
              <p>
                No skills extracted.
              </p>
            )}
          </div>
        </div>

        <div className="section">
          <h3>Education</h3>

          {formData.education.length >
          0 ? (
            formData.education.map(
              (edu, index) => (
                <div
                  key={index}
                  className="card-item"
                >
                  <strong>
                    {edu.degree}
                  </strong>

                  <p>
                    {
                      edu.institution
                    }
                  </p>

                  <p>{edu.year}</p>
                </div>
              )
            )
          ) : (
            <p>
              No education found.
            </p>
          )}
        </div>

        <div className="section">
          <h3>Experience</h3>

          {formData.experience.length >
          0 ? (
            formData.experience.map(
              (job, index) => (
                <div
                  key={index}
                  className="card-item"
                >
                  <h4>{job.role}</h4>

                  <p>
                    {job.company}
                  </p>

                  <p>
                    {
                      job.startDate
                    }{" "}
                    -{" "}
                    {job.endDate}
                  </p>

                  <p>
                    {
                      job.description
                    }
                  </p>
                </div>
              )
            )
          ) : (
            <p>
              No experience found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}