import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

function PostInternship() {
  const [hasCompanyProfile, setHasCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [internshipData, setInternshipData] = useState({
    title: '',
    department: '',
    duration: '3 months',
    workMode: 'Remote',
    location: '',
    stipend: {
      amount: '',
      currency: 'INR',
      period: 'monthly'
    },
    description: '',
    responsibilities: [],
    requirements: [],
    skills: [],
    benefits: [],
    startDate: '',
    applicationDeadline: '',
    applicationMethod: 'internal',
    applicationLink: '',
    applicationEmail: '',
    publishImmediately: true,
    internshipStatus: 'draft'
  });

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
          
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Please complete ALL mandatory fields in your company profile to start posting internships.
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
              <i className="ri-alert-line"></i> All fields marked with * must be filled before you can post internships.
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
                fontSize: '1rem'
              }}
            >
              <i className="ri-building-line"></i> Complete Profile
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
    { id: 2, title: 'Description', icon: 'ri-file-text-line' },
    { id: 3, title: 'Requirements', icon: 'ri-checkbox-multiple-line' },
    { id: 4, title: 'Application', icon: 'ri-settings-line' },
    { id: 5, title: 'Preview', icon: 'ri-eye-line' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setInternshipData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setInternshipData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayAdd = (field, value) => {
    if (value.trim()) {
      setInternshipData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setInternshipData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (status = 'draft') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/post-internship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...internshipData, internshipStatus: status })
      });

      if (response.ok) {
        if (window.showPopup) {
          window.showPopup(`Internship ${status === 'published' ? 'published' : 'saved as draft'} successfully!`, 'success');
        }
        window.location.href = '/recruiter/posted-internships';
      }
    } catch (error) {
      console.error('Error posting internship:', error);
      if (window.showPopup) {
        window.showPopup('Error posting internship', 'error');
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Basic Internship Details</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Internship Title *</label>
                <input
                  type="text"
                  value={internshipData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Frontend Development Intern"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={internshipData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="e.g. Engineering"
                />
              </div>

              <div className="form-group">
                <label>Duration *</label>
                <select
                  value={internshipData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  required
                >
                  <option value="1 month">1 Month</option>
                  <option value="2 months">2 Months</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="12 months">12 Months</option>
                </select>
              </div>

              <div className="form-group">
                <label>Work Mode *</label>
                <select
                  value={internshipData.workMode}
                  onChange={(e) => handleInputChange('workMode', e.target.value)}
                  required
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={internshipData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={internshipData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="salary-section">
              <h3>Stipend Details</h3>
              <div className="salary-grid">
                <div className="form-group">
                  <label>Stipend Amount</label>
                  <input
                    type="number"
                    value={internshipData.stipend.amount}
                    onChange={(e) => handleInputChange('stipend.amount', e.target.value)}
                    placeholder="e.g. 15000"
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={internshipData.stipend.currency}
                    onChange={(e) => handleInputChange('stipend.currency', e.target.value)}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Period</label>
                  <select
                    value={internshipData.stipend.period}
                    onChange={(e) => handleInputChange('stipend.period', e.target.value)}
                  >
                    <option value="monthly">Per Month</option>
                    <option value="total">Total</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Internship Description</h2>
            
            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={internshipData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the internship, learning opportunities, and what makes this exciting..."
                rows="8"
                required
              />
            </div>

            <div className="array-input-section">
              <h3>Key Responsibilities</h3>
              <ArrayInput
                items={internshipData.responsibilities}
                onAdd={(value) => handleArrayAdd('responsibilities', value)}
                onRemove={(index) => handleArrayRemove('responsibilities', index)}
                placeholder="Add a responsibility..."
              />
            </div>

            <div className="array-input-section">
              <h3>Benefits & Perks</h3>
              <ArrayInput
                items={internshipData.benefits}
                onAdd={(value) => handleArrayAdd('benefits', value)}
                onRemove={(index) => handleArrayRemove('benefits', index)}
                placeholder="Add a benefit..."
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
                items={internshipData.requirements}
                onAdd={(value) => handleArrayAdd('requirements', value)}
                onRemove={(index) => handleArrayRemove('requirements', index)}
                placeholder="Add a requirement..."
              />
            </div>

            <div className="array-input-section">
              <h3>Required Skills *</h3>
              <ArrayInput
                items={internshipData.skills}
                onAdd={(value) => handleArrayAdd('skills', value)}
                onRemove={(index) => handleArrayRemove('skills', index)}
                placeholder="Add a skill..."
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
                value={internshipData.applicationDeadline}
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
                    checked={internshipData.applicationMethod === 'internal'}
                    onChange={(e) => handleInputChange('applicationMethod', e.target.value)}
                  />
                  <span>Through our platform</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="external"
                    checked={internshipData.applicationMethod === 'external'}
                    onChange={(e) => handleInputChange('applicationMethod', e.target.value)}
                  />
                  <span>External website</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="email"
                    checked={internshipData.applicationMethod === 'email'}
                    onChange={(e) => handleInputChange('applicationMethod', e.target.value)}
                  />
                  <span>Email application</span>
                </label>
              </div>
            </div>

            {internshipData.applicationMethod === 'external' && (
              <div className="form-group">
                <label>Application URL *</label>
                <input
                  type="url"
                  value={internshipData.applicationLink}
                  onChange={(e) => handleInputChange('applicationLink', e.target.value)}
                  placeholder="https://company.com/internships/apply"
                  required
                />
              </div>
            )}

            {internshipData.applicationMethod === 'email' && (
              <div className="form-group">
                <label>Application Email *</label>
                <input
                  type="email"
                  value={internshipData.applicationEmail}
                  onChange={(e) => handleInputChange('applicationEmail', e.target.value)}
                  placeholder="internships@company.com"
                  required
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h2>Preview & Publish</h2>
            
            <div className="job-preview">
              <div className="preview-header">
                <h3>{internshipData.title || 'Internship Title'}</h3>
                <div className="preview-meta">
                  <span><i className="ri-map-pin-line"></i> {internshipData.location || 'Location'}</span>
                  <span><i className="ri-time-line"></i> {internshipData.duration}</span>
                  <span><i className="ri-home-office-line"></i> {internshipData.workMode}</span>
                </div>
                {internshipData.stipend.amount && (
                  <div className="preview-salary">
                    <i className="ri-money-dollar-circle-line"></i>
                    {internshipData.stipend.currency === 'INR' ? '₹' : internshipData.stipend.currency === 'USD' ? '$' : '€'}
                    {parseInt(internshipData.stipend.amount).toLocaleString()} {internshipData.stipend.period === 'monthly' ? 'per month' : 'total'}
                  </div>
                )}
              </div>

              <div className="preview-content">
                {internshipData.description && (
                  <div className="preview-section">
                    <h4>Description</h4>
                    <p>{internshipData.description}</p>
                  </div>
                )}

                {internshipData.responsibilities.length > 0 && (
                  <div className="preview-section">
                    <h4>Responsibilities</h4>
                    <ul>
                      {internshipData.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {internshipData.requirements.length > 0 && (
                  <div className="preview-section">
                    <h4>Requirements</h4>
                    <ul>
                      {internshipData.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {internshipData.skills.length > 0 && (
                  <div className="preview-section">
                    <h4>Required Skills</h4>
                    <div className="skills-preview">
                      {internshipData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {internshipData.benefits.length > 0 && (
                  <div className="preview-section">
                    <h4>Benefits</h4>
                    <ul>
                      {internshipData.benefits.map((item, index) => (
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
                    checked={internshipData.publishImmediately}
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
        <div className="steps-header">
          <h1>Post a New Internship</h1>
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

        <div className="step-container">
          {renderStepContent()}
        </div>

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
                <button className="btn-secondary" onClick={() => handleSubmit('draft')}>
                  Save as Draft
                </button>
                <button className="btn-primary" onClick={() => handleSubmit('published')}>
                  <i className="ri-send-plane-line"></i>
                  Publish Internship
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
              <button type="button" onClick={() => onRemove(index)} className="remove-btn">
                <i className="ri-close-line"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostInternship;
