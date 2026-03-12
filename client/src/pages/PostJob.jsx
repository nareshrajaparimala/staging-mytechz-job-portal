import React, { useState, useEffect } from 'react';
import './UserDashboard.css'; // Reusing existing dashboard styles

function PostJob() {
  const [hasCompanyProfile, setHasCompanyProfile] = useState(null); // null = checking, true = has profile, false = no profile
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState({
    // Basic Details
    title: '',
    department: '',
    jobType: 'Full-time',
    workMode: 'Remote',
    experience: '',
    location: '',
    salary: {
      min: '',
      max: '',
      currency: 'INR',
      period: 'annually'
    },
    
    // Job Description
    description: '',
    responsibilities: [],
    requirements: [],
    skills: [],
    benefits: [],
    
    // Company Details
    companyName: '',
    companyLogo: '',
    
    // Application Settings
    applicationDeadline: '',
    applicationMethod: 'internal', // internal, external, email
    applicationLink: '',
    applicationEmail: '',
    
    // Screening Questions
    screeningQuestions: [],
    
    // Publishing
    publishImmediately: true,
    featuredJob: false,
    jobStatus: 'draft'
  });

  // Check company profile on component mount
  useEffect(() => {
    checkCompanyProfile();
  }, []);

  const checkCompanyProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Check for demo mode
      if (token === 'demo-recruiter-token') {
        setHasCompanyProfile(true);
        setLoading(false);
        return;
      }

      // Fetch company profile to check if it exists and has all mandatory fields
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/company-profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          const profile = data.profile;
          // Check all mandatory fields
          const hasMandatoryFields = 
            profile.company_name && 
            profile.website && 
            profile.industry && 
            profile.company_size && 
            profile.founded_year && 
            profile.work_mode && 
            profile.office_address;
          
          setHasCompanyProfile(hasMandatoryFields);
        } else {
          setHasCompanyProfile(false);
        }
      } else if (response.status === 404) {
        setHasCompanyProfile(false);
      } else {
        setHasCompanyProfile(false);
      }
    } catch (error) {
      console.error('Error checking company profile:', error);
      setHasCompanyProfile(false);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>
          <i className="ri-loader-line spinning" style={{ fontSize: '2rem' }}></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show company profile pending message
  if (hasCompanyProfile === false) {
    return (
      <div className="user-dashboard">
        <div className="approval-pending-container" style={{
          maxWidth: '600px',
          margin: '4rem auto',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            backgroundColor: '#fff3cd',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="ri-building-line" style={{ fontSize: '2.5rem', color: '#856404' }}></i>
          </div>
          
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>
            Complete Company Profile Required
          </h2>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            Please complete ALL mandatory fields in your company profile to start posting jobs.
          </p>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1rem', color: '#333', marginBottom: '1rem' }}>
              <i className="ri-information-line" style={{ color: '#4A90E2' }}></i> Required Fields:
            </h3>
            <ul style={{ paddingLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
              <li>Company Name</li>
              <li>Website</li>
              <li>Industry</li>
              <li>Company Size</li>
              <li>Founded Year</li>
              <li>Work Mode</li>
              <li>Office Address</li>
            </ul>
            <p style={{ marginTop: '1rem', color: '#856404', fontWeight: '500' }}>
              <i className="ri-alert-line"></i> All fields marked with * must be filled before you can post jobs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.href = '/recruiter/company-profile'}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4A90E2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="ri-building-line"></i>
              Complete Company Profile
            </button>
            
            <button
              onClick={() => window.location.href = '/recruiter'}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: 'Basic Details', icon: 'ri-information-line' },
    { id: 2, title: 'Job Description', icon: 'ri-file-text-line' },
    { id: 3, title: 'Requirements', icon: 'ri-list-check' },
    { id: 4, title: 'Application Settings', icon: 'ri-settings-line' },
    { id: 5, title: 'Preview & Publish', icon: 'ri-eye-line' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setJobData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setJobData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayAdd = (field, value) => {
    if (value.trim()) {
      setJobData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (status = 'draft') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/post-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...jobData,
          jobStatus: status
        })
      });

      if (response.ok) {
        if (window.showPopup) {
          window.showPopup(`Job ${status === 'published' ? 'published' : 'saved as draft'} successfully!`, 'success');
        }
        window.location.href = '/recruiter/posted-jobs';
      }
    } catch (error) {
      console.error('Error posting job:', error);
      if (window.showPopup) {
        window.showPopup('Error posting job', 'error');
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Basic Job Details</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={jobData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Senior React Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={jobData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="e.g. Engineering"
                />
              </div>

              <div className="form-group">
                <label>Job Type *</label>
                <select
                  value={jobData.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label>Work Mode *</label>
                <select
                  value={jobData.workMode}
                  onChange={(e) => handleInputChange('workMode', e.target.value)}
                  required
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience Level *</label>
                <select
                  value={jobData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  required
                >
                  <option value="">Select Experience</option>
                  <option value="0-1 years">0-1 years (Fresher)</option>
                  <option value="1-3 years">1-3 years (Junior)</option>
                  <option value="3-5 years">3-5 years (Mid-level)</option>
                  <option value="5-8 years">5-8 years (Senior)</option>
                  <option value="8+ years">8+ years (Lead/Principal)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={jobData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  required
                />
              </div>
            </div>

            <div className="salary-section">
              <h3>Salary Range</h3>
              <div className="salary-grid">
                <div className="form-group">
                  <label>Minimum Salary</label>
                  <input
                    type="number"
                    value={jobData.salary.min}
                    onChange={(e) => handleInputChange('salary.min', e.target.value)}
                    placeholder="e.g. 800000"
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Salary</label>
                  <input
                    type="number"
                    value={jobData.salary.max}
                    onChange={(e) => handleInputChange('salary.max', e.target.value)}
                    placeholder="e.g. 1200000"
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={jobData.salary.currency}
                    onChange={(e) => handleInputChange('salary.currency', e.target.value)}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Period</label>
                  <select
                    value={jobData.salary.period}
                    onChange={(e) => handleInputChange('salary.period', e.target.value)}
                  >
                    <option value="annually">Per Year</option>
                    <option value="monthly">Per Month</option>
                    <option value="hourly">Per Hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Job Description</h2>
            
            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                value={jobData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                rows="8"
                required
              />
            </div>

            <div className="array-input-section">
              <h3>Key Responsibilities</h3>
              <ArrayInput
                items={jobData.responsibilities}
                onAdd={(value) => handleArrayAdd('responsibilities', value)}
                onRemove={(index) => handleArrayRemove('responsibilities', index)}
                placeholder="Add a key responsibility..."
              />
            </div>

            <div className="array-input-section">
              <h3>Benefits & Perks</h3>
              <ArrayInput
                items={jobData.benefits}
                onAdd={(value) => handleArrayAdd('benefits', value)}
                onRemove={(index) => handleArrayRemove('benefits', index)}
                placeholder="Add a benefit or perk..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Requirements & Skills</h2>
            
            <div className="array-input-section">
              <h3>Requirements *</h3>
              <ArrayInput
                items={jobData.requirements}
                onAdd={(value) => handleArrayAdd('requirements', value)}
                onRemove={(index) => handleArrayRemove('requirements', index)}
                placeholder="Add a requirement (e.g. Bachelor's degree in Computer Science)..."
              />
            </div>

            <div className="array-input-section">
              <h3>Required Skills *</h3>
              <ArrayInput
                items={jobData.skills}
                onAdd={(value) => handleArrayAdd('skills', value)}
                onRemove={(index) => handleArrayRemove('skills', index)}
                placeholder="Add a skill (e.g. React, Node.js, Python)..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Application Settings</h2>
            
            <div className="form-group">
              <label>Application Deadline</label>
              <input
                type="date"
                value={jobData.applicationDeadline}
                onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>How should candidates apply? *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="internal"
                    checked={jobData.applicationMethod === 'internal'}
                    onChange={(e) => handleInputChange('applicationMethod', e.target.value)}
                  />
                  <span>Through our platform</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="external"
                    checked={jobData.applicationMethod === 'external'}
                    onChange={(e) => handleInputChange('applicationMethod', e.target.value)}
                  />
                  <span>External website/portal</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="email"
                    checked={jobData.applicationMethod === 'email'}
                    onChange={(e) => handleInputChange('applicationMethod', e.target.value)}
                  />
                  <span>Email application</span>
                </label>
              </div>
            </div>

            {jobData.applicationMethod === 'external' && (
              <div className="form-group">
                <label>Application URL *</label>
                <input
                  type="url"
                  value={jobData.applicationLink}
                  onChange={(e) => handleInputChange('applicationLink', e.target.value)}
                  placeholder="https://company.com/careers/apply"
                  required
                />
              </div>
            )}

            {jobData.applicationMethod === 'email' && (
              <div className="form-group">
                <label>Application Email *</label>
                <input
                  type="email"
                  value={jobData.applicationEmail}
                  onChange={(e) => handleInputChange('applicationEmail', e.target.value)}
                  placeholder="careers@company.com"
                  required
                />
              </div>
            )}

            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={jobData.featuredJob}
                  onChange={(e) => handleInputChange('featuredJob', e.target.checked)}
                />
                <span>Make this a featured job (+₹500)</span>
              </label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h2>Preview & Publish</h2>
            
            <div className="job-preview">
              <div className="preview-header">
                <h3>{jobData.title || 'Job Title'}</h3>
                <div className="preview-meta">
                  <span><i className="ri-building-line"></i> {jobData.companyName || 'Company Name'}</span>
                  <span><i className="ri-map-pin-line"></i> {jobData.location || 'Location'}</span>
                  <span><i className="ri-briefcase-line"></i> {jobData.jobType}</span>
                  <span><i className="ri-home-office-line"></i> {jobData.workMode}</span>
                </div>
                {(jobData.salary.min || jobData.salary.max) && (
                  <div className="preview-salary">
                    <i className="ri-money-dollar-circle-line"></i>
                    {jobData.salary.currency === 'INR' ? '₹' : jobData.salary.currency === 'USD' ? '$' : '€'}
                    {jobData.salary.min && jobData.salary.max 
                      ? `${parseInt(jobData.salary.min).toLocaleString()} - ${parseInt(jobData.salary.max).toLocaleString()}`
                      : jobData.salary.min || jobData.salary.max
                    } {jobData.salary.period === 'annually' ? 'per year' : jobData.salary.period === 'monthly' ? 'per month' : 'per hour'}
                  </div>
                )}
              </div>

              <div className="preview-content">
                {jobData.description && (
                  <div className="preview-section">
                    <h4>Job Description</h4>
                    <p>{jobData.description}</p>
                  </div>
                )}

                {jobData.responsibilities.length > 0 && (
                  <div className="preview-section">
                    <h4>Key Responsibilities</h4>
                    <ul>
                      {jobData.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {jobData.requirements.length > 0 && (
                  <div className="preview-section">
                    <h4>Requirements</h4>
                    <ul>
                      {jobData.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {jobData.skills.length > 0 && (
                  <div className="preview-section">
                    <h4>Required Skills</h4>
                    <div className="skills-preview">
                      {jobData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {jobData.benefits.length > 0 && (
                  <div className="preview-section">
                    <h4>Benefits & Perks</h4>
                    <ul>
                      {jobData.benefits.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="publish-options">
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={jobData.publishImmediately}
                    onChange={(e) => handleInputChange('publishImmediately', e.target.checked)}
                  />
                  <span>Publish immediately</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="user-dashboard">
      <div className="post-job-container">
        {/* Progress Steps */}
        <div className="steps-header">
          <h1>Post a New Job</h1>
          <div className="steps-progress">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`step-item ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
              >
                <div className="step-circle">
                  <i className={step.icon}></i>
                </div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="step-container">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="step-navigation">
          <div className="nav-left">
            {currentStep > 1 && (
              <button className="btn-secondary" onClick={prevStep}>
                <i className="ri-arrow-left-line"></i>
                Previous
              </button>
            )}
          </div>
          
          <div className="nav-right">
            {currentStep < steps.length ? (
              <button className="btn-primary" onClick={nextStep}>
                Next
                <i className="ri-arrow-right-line"></i>
              </button>
            ) : (
              <div className="publish-buttons">
                <button 
                  className="btn-secondary"
                  onClick={() => handleSubmit('draft')}
                >
                  Save as Draft
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleSubmit('published')}
                >
                  <i className="ri-send-plane-line"></i>
                  Publish Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Array Input Component
function ArrayInput({ items, onAdd, onRemove, placeholder }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="array-input">
      <div className="input-with-button">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
        />
        <button type="button" onClick={handleAdd} className="add-btn">
          <i className="ri-add-line"></i>
        </button>
      </div>
      
      {items.length > 0 && (
        <div className="items-list">
          {items.map((item, index) => (
            <div key={index} className="item-chip">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="remove-btn"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostJob;