import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import ResumeManager from '../components/Resume/ResumeManager';

function Profile() {
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: '', dateOfBirth: '',
    address: '', city: '', state: '', pincode: '', bio: '',
    skills: [], experience: '', education: '', linkedin: '', github: '', portfolio: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('view-edit');
  const [activeSection, setActiveSection] = useState('preferences');
  const [editingSection, setEditingSection] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [showResumeManager, setShowResumeManager] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchResumeInfo();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const profileData = response.data;
      if (profileData.skills && !Array.isArray(profileData.skills)) {
        profileData.skills = profileData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      } else if (!profileData.skills) {
        profileData.skills = [];
      }
      
      const defaultProfile = {
        firstName: '', lastName: '', email: '', phone: '', gender: '', dateOfBirth: '',
        address: '', city: '', state: '', pincode: '', bio: '',
        skills: [], experience: '', education: '', linkedin: '', github: '', portfolio: ''
      };
      
      setProfile({ ...defaultProfile, ...profileData });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (window.showPopup) {
        window.showPopup('Error loading profile data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchResumeInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resume-upload/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumeInfo(response.data);
    } catch (error) {
      console.error('Error fetching resume info:', error);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      profile.firstName, profile.lastName, profile.email, profile.phone,
      profile.gender, profile.dateOfBirth, profile.city, profile.bio,
      profile.skills.length > 0, profile.experience, profile.education,
      resumeInfo?.hasResume
    ];
    const completed = fields.filter(field => field).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getMissingDetails = () => {
    const missing = [];
    if (!profile.bio) missing.push({ text: 'Add bio', section: 'personal' });
    if (profile.skills.length === 0) missing.push({ text: 'Add skills', section: 'skills' });
    if (!profile.experience) missing.push({ text: 'Add experience', section: 'employment' });
    if (!profile.education) missing.push({ text: 'Add education', section: 'education' });
    if (!resumeInfo?.hasResume) missing.push({ text: 'Upload resume', section: 'resume' });
    return missing;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSaveSection = async (section) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Validate required fields
      if (!profile.firstName || !profile.lastName || !profile.email) {
        throw new Error('First name, last name, and email are required fields.');
      }
      
      const cleanProfile = { ...profile };
      
      const optionalFields = ['bio', 'address', 'city', 'state', 'pincode', 'experience', 'education', 'linkedin', 'github', 'portfolio'];
      optionalFields.forEach(field => {
        if (cleanProfile[field] === '') cleanProfile[field] = null;
      });
      
      if (!Array.isArray(cleanProfile.skills)) cleanProfile.skills = [];
      if (cleanProfile.phone) cleanProfile.phone = cleanProfile.phone.trim();
      
      console.log('Updating profile with data:', cleanProfile);
      console.log('API URL:', `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`);
      
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, cleanProfile, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile update response:', response.data);
      
      const user = JSON.parse(localStorage.getItem('user'));
      user.name = `${profile.firstName} ${profile.lastName}`;
      localStorage.setItem('user', JSON.stringify(user));
      
      if (window.showPopup) {
        window.showPopup('Profile updated successfully!', 'success');
      }
      setEditingSection(null);
    } catch (error) {
      console.error('Profile update error:', error);
      
      // More detailed error handling
      let errorMessage = 'Error updating profile';
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.errors) {
          // Handle validation errors
          const errors = error.response.data.errors;
          const errorMessages = [];
          Object.keys(errors).forEach(field => {
            if (Array.isArray(errors[field])) {
              errorMessages.push(...errors[field]);
            } else {
              errorMessages.push(errors[field]);
            }
          });
          errorMessage = errorMessages.join('. ');
        }
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request);
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Other error
        console.error('Error:', error.message);
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      if (window.showPopup) {
        window.showPopup(errorMessage, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="naukri-profile-page">
        <div className="naukri-loading">
          <div className="naukri-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const completionPercent = calculateProfileCompletion();
  const missingDetails = getMissingDetails();

  return (
    <div className="naukri-profile-page">
      <div className="naukri-profile-container">
        {/* Profile Header */}
        <div className="naukri-profile-header">
          <div className="naukri-header-content">
            {/* Photo Section */}
            <div className="naukri-photo-section">
              <div className="naukri-photo-wrapper">
                <svg className="naukri-completion-ring" viewBox="0 0 136 136">
                  <circle cx="68" cy="68" r="64" fill="none" stroke="#e0e0e0" strokeWidth="4" />
                  <circle
                    cx="68" cy="68" r="64" fill="none" stroke="#4A90E2" strokeWidth="4"
                    strokeDasharray={`${(completionPercent / 100) * 402} 402`}
                    strokeLinecap="round" transform="rotate(-90 68 68)"
                  />
                </svg>
                <div className="naukri-photo">
                  <div className="naukri-photo-placeholder">
                    <i className="ri-user-line"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="naukri-info-section">
              <h1 className="naukri-name">{profile.firstName} {profile.lastName}</h1>
              <div className="naukri-info-grid">
                <div className="naukri-info-item">
                  <i className="ri-mail-line"></i>
                  <span>{profile.email}</span>
                  <i className="ri-verified-badge-fill naukri-verified"></i>
                </div>
                {profile.phone && (
                  <div className="naukri-info-item">
                    <i className="ri-phone-line"></i>
                    <span>{profile.phone}</span>
                    <i className="ri-verified-badge-fill naukri-verified"></i>
                  </div>
                )}
                {profile.city && (
                  <div className="naukri-info-item">
                    <i className="ri-map-pin-line"></i>
                    <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
                  </div>
                )}
                {profile.gender && (
                  <div className="naukri-info-item">
                    <i className="ri-user-2-line"></i>
                    <span>{profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</span>
                  </div>
                )}
                {profile.dateOfBirth && (
                  <div className="naukri-info-item">
                    <i className="ri-calendar-line"></i>
                    <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                {profile.education && (
                  <div className="naukri-info-item">
                    <i className="ri-graduation-cap-line"></i>
                    <span>{profile.education.substring(0, 50)}{profile.education.length > 50 ? '...' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Completion Widget */}
            <div className="naukri-completion-widget">
              <div className="naukri-completion-header">
                <span className="naukri-completion-title">Profile Completion</span>
                <span className="naukri-completion-percent">{completionPercent}%</span>
              </div>
              <div className="naukri-completion-bar">
                <div className="naukri-completion-fill" style={{ width: `${completionPercent}%` }}></div>
              </div>
              {missingDetails.length > 0 && (
                <ul className="naukri-missing-items">
                  {missingDetails.map((item, index) => (
                    <li 
                      key={index} 
                      className="naukri-missing-item"
                      onClick={() => {
                        setActiveSection(item.section);
                        setEditingSection(item.section);
                      }}
                    >
                      <i className="ri-add-circle-line"></i>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="naukri-tabs">
          <ul className="naukri-tabs-list">
            <li className={`naukri-tab ${activeTab === 'view-edit' ? 'active' : ''}`} onClick={() => setActiveTab('view-edit')}>
              View & Edit
            </li>
            <li className={`naukri-tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
              Activity Insights
            </li>
          </ul>
          
          {activeTab === 'view-edit' && (
            <button
              className="naukri-edit-all-btn"
              onClick={() => {
                if (editingSection) {
                  // If editing, save and exit
                  setEditingSection(null);
                } else {
                  // Enable edit mode for current section
                  setEditingSection(activeSection);
                }
              }}
              style={{
                padding: '0.5rem 1.25rem',
                backgroundColor: editingSection ? '#22c55e' : '#4A90E2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              {editingSection ? (
                <>
                  <i className="ri-check-line"></i>
                  Editing Mode
                </>
              ) : (
                <>
                  <i className="ri-edit-line"></i>
                  Edit Section
                </>
              )}
            </button>
          )}
        </div>

        {/* Main Content */}
        {activeTab === 'view-edit' && (
          <div className="naukri-main-content">
            {/* Sidebar */}
            <aside className="naukri-sidebar">
              <div className="naukri-sidebar-card">
                <div className="naukri-sidebar-title">Quick Links</div>
                <ul className="naukri-sidebar-menu">
                  <li className={`naukri-sidebar-item ${activeSection === 'preferences' ? 'active' : ''}`} onClick={() => setActiveSection('preferences')}>
                    <i className="ri-heart-line"></i>
                    <span>Career Preferences</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'education' ? 'active' : ''}`} onClick={() => setActiveSection('education')}>
                    <i className="ri-graduation-cap-line"></i>
                    <span>Education</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'skills' ? 'active' : ''}`} onClick={() => setActiveSection('skills')}>
                    <i className="ri-tools-line"></i>
                    <span>Key Skills</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'employment' ? 'active' : ''}`} onClick={() => setActiveSection('employment')}>
                    <i className="ri-briefcase-line"></i>
                    <span>Employment</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'resume' ? 'active' : ''}`} onClick={() => setActiveSection('resume')}>
                    <i className="ri-file-text-line"></i>
                    <span>Resume</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'personal' ? 'active' : ''}`} onClick={() => setActiveSection('personal')}>
                    <i className="ri-user-line"></i>
                    <span>Personal Details</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'social' ? 'active' : ''}`} onClick={() => setActiveSection('social')}>
                    <i className="ri-links-line"></i>
                    <span>Social Links</span>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Content Area */}
            <div className="naukri-content-area">
              {/* Career Preferences Section */}
              {activeSection === 'preferences' && (
                <div className="naukri-section">
                  <div className="naukri-section-header">
                    <h2 className="naukri-section-title">
                      <i className="ri-heart-line"></i>
                      Career Preferences
                    </h2>
                    {editingSection !== 'preferences' && (
                      <button className="naukri-edit-btn" onClick={() => setEditingSection('preferences')}>
                        <i className="ri-edit-line"></i>
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="naukri-section-body">
                    {editingSection === 'preferences' ? (
                      <>
                        <div className="naukri-form-grid">
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">Bio / Summary</label>
                            <textarea
                              name="bio"
                              value={profile.bio}
                              onChange={handleInputChange}
                              className="naukri-form-textarea"
                              placeholder="Tell us about yourself and your career goals..."
                              rows="5"
                            />
                          </div>
                        </div>
                        <div className="naukri-actions">
                          <button className="naukri-btn naukri-btn-primary" onClick={() => handleSaveSection('preferences')} disabled={saving}>
                            <i className="ri-save-line"></i>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button className="naukri-btn naukri-btn-secondary" onClick={() => setEditingSection(null)}>
                            <i className="ri-close-line"></i>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="naukri-view-content">
                        {profile.bio ? (
                          <p>{profile.bio}</p>
                        ) : (
                          <div className="naukri-empty-state">
                            <i className="ri-file-text-line"></i>
                            <p>Add your career preferences and bio to help recruiters find you</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {activeSection === 'education' && (
                <div className="naukri-section">
                  <div className="naukri-section-header">
                    <h2 className="naukri-section-title">
                      <i className="ri-graduation-cap-line"></i>
                      Education
                    </h2>
                    {editingSection !== 'education' && (
                      <button className="naukri-edit-btn" onClick={() => setEditingSection('education')}>
                        <i className="ri-edit-line"></i>
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="naukri-section-body">
                    {editingSection === 'education' ? (
                      <>
                        <div className="naukri-form-grid">
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">Education Details</label>
                            <textarea
                              name="education"
                              value={profile.education}
                              onChange={handleInputChange}
                              className="naukri-form-textarea"
                              placeholder="Degree, College/University, Year of Graduation..."
                              rows="5"
                            />
                          </div>
                        </div>
                        <div className="naukri-actions">
                          <button className="naukri-btn naukri-btn-primary" onClick={() => handleSaveSection('education')} disabled={saving}>
                            <i className="ri-save-line"></i>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button className="naukri-btn naukri-btn-secondary" onClick={() => setEditingSection(null)}>
                            <i className="ri-close-line"></i>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="naukri-view-content">
                        {profile.education ? (
                          <p>{profile.education}</p>
                        ) : (
                          <div className="naukri-empty-state">
                            <i className="ri-graduation-cap-line"></i>
                            <p>Add your educational qualifications</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div className="naukri-section">
                  <div className="naukri-section-header">
                    <h2 className="naukri-section-title">
                      <i className="ri-tools-line"></i>
                      Key Skills
                    </h2>
                    {editingSection !== 'skills' && (
                      <button className="naukri-edit-btn" onClick={() => setEditingSection('skills')}>
                        <i className="ri-edit-line"></i>
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="naukri-section-body">
                    {editingSection === 'skills' ? (
                      <>
                        <div className="naukri-add-skill">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="naukri-form-input"
                            placeholder="Add a skill (e.g., JavaScript, Python, React)"
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          />
                          <button className="naukri-btn naukri-btn-primary" onClick={addSkill}>
                            <i className="ri-add-line"></i>
                            Add
                          </button>
                        </div>
                        <div className="naukri-skills-container">
                          {profile.skills.map((skill, index) => (
                            <span key={index} className="naukri-skill-tag">
                              {skill}
                              <i className="ri-close-line naukri-skill-remove" onClick={() => removeSkill(skill)}></i>
                            </span>
                          ))}
                        </div>
                        <div className="naukri-actions">
                          <button className="naukri-btn naukri-btn-primary" onClick={() => handleSaveSection('skills')} disabled={saving}>
                            <i className="ri-save-line"></i>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button className="naukri-btn naukri-btn-secondary" onClick={() => setEditingSection(null)}>
                            <i className="ri-close-line"></i>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="naukri-view-content">
                        {profile.skills.length > 0 ? (
                          <div className="naukri-skills-container">
                            {profile.skills.map((skill, index) => (
                              <span key={index} className="naukri-skill-tag">{skill}</span>
                            ))}
                          </div>
                        ) : (
                          <div className="naukri-empty-state">
                            <i className="ri-tools-line"></i>
                            <p>Add your key skills to improve your profile visibility</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Employment Section */}
              {activeSection === 'employment' && (
                <div className="naukri-section">
                  <div className="naukri-section-header">
                    <h2 className="naukri-section-title">
                      <i className="ri-briefcase-line"></i>
                      Employment
                    </h2>
                    {editingSection !== 'employment' && (
                      <button className="naukri-edit-btn" onClick={() => setEditingSection('employment')}>
                        <i className="ri-edit-line"></i>
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="naukri-section-body">
                    {editingSection === 'employment' ? (
                      <>
                        <div className="naukri-form-grid">
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">Work Experience</label>
                            <textarea
                              name="experience"
                              value={profile.experience}
                              onChange={handleInputChange}
                              className="naukri-form-textarea"
                              placeholder="Company, Position, Duration, Responsibilities..."
                              rows="5"
                            />
                          </div>
                        </div>
                        <div className="naukri-actions">
                          <button className="naukri-btn naukri-btn-primary" onClick={() => handleSaveSection('employment')} disabled={saving}>
                            <i className="ri-save-line"></i>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button className="naukri-btn naukri-btn-secondary" onClick={() => setEditingSection(null)}>
                            <i className="ri-close-line"></i>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="naukri-view-content">
                        {profile.experience ? (
                          <p>{profile.experience}</p>
                        ) : (
                          <div className="naukri-empty-state">
                            <i className="ri-briefcase-line"></i>
                            <p>Add your work experience to showcase your career journey</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resume Section */}
              {activeSection === 'resume' && (
                <div className="naukri-section">
                  <div className="naukri-section-header">
                    <h2 className="naukri-section-title">
                      <i className="ri-file-text-line"></i>
                      Resume
                    </h2>
                  </div>
                  <div className="naukri-section-body">
                    {resumeInfo?.hasResume ? (
                      <div className="naukri-resume-info">
                        <div className="naukri-resume-details">
                          <div className="naukri-resume-icon">
                            <i className="ri-file-text-line"></i>
                          </div>
                          <div>
                            <h4>{resumeInfo.fileName}</h4>
                            <p>Uploaded on {new Date(resumeInfo.uploadedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button className="naukri-btn naukri-btn-primary" onClick={() => setShowResumeManager(true)}>
                          <i className="ri-settings-line"></i>
                          Manage Resume
                        </button>
                      </div>
                    ) : (
                      <div className="naukri-resume-upload" onClick={() => setShowResumeManager(true)}>
                        <i className="ri-upload-cloud-line"></i>
                        <h3>Upload Your Resume</h3>
                        <p>Upload your resume to apply for jobs quickly</p>
                        <button className="naukri-btn naukri-btn-primary">
                          <i className="ri-upload-line"></i>
                          Upload Resume
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Personal Details Section */}
              {activeSection === 'personal' && (
                <div className="naukri-section">
                  <div className="naukri-section-header">
                    <h2 className="naukri-section-title">
                      <i className="ri-user-line"></i>
                      Personal Details
                    </h2>
                    {editingSection !== 'personal' && (
                      <button className="naukri-edit-btn" onClick={() => setEditingSection('personal')}>
                        <i className="ri-edit-line"></i>
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="naukri-section-body">
                    {editingSection === 'personal' ? (
                      <>
                        <div className="naukri-form-grid">
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={profile.firstName}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                            />
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={profile.lastName}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                            />
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={profile.email}
                              className="naukri-form-input"
                              disabled
                            />
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={profile.phone}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                            />
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">Gender</label>
                            <select
                              name="gender"
                              value={profile.gender}
                              onChange={handleInputChange}
                              className="naukri-form-select"
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">Date of Birth</label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={profile.dateOfBirth}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                            />
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">City</label>
                            <input
                              type="text"
                              name="city"
                              value={profile.city}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                            />
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">State</label>
                            <input
                              type="text"
                              name="state"
                              value={profile.state}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                            />
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">Pincode</label>
                            <input
                              type="text"
                              name="pincode"
                              value={profile.pincode}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                            />
                          </div>
                          <div className="naukri-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="naukri-form-label">Address</label>
                            <textarea
                              name="address"
                              value={profile.address}
                              onChange={handleInputChange}
                              className="naukri-form-textarea"
                              rows="3"
                            />
                          </div>
                        </div>
                        <div className="naukri-actions">
                          <button className="naukri-btn naukri-btn-primary" onClick={() => handleSaveSection('personal')} disabled={saving}>
                            <i className="ri-save-line"></i>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button className="naukri-btn naukri-btn-secondary" onClick={() => setEditingSection(null)}>
                            <i className="ri-close-line"></i>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="naukri-view-content">
                        <div className="naukri-info-grid">
                          <div className="naukri-info-row">
                            <span className="naukri-info-label">Name:</span>
                            <span>{profile.firstName} {profile.lastName}</span>
                          </div>
                          <div className="naukri-info-row">
                            <span className="naukri-info-label">Email:</span>
                            <span>{profile.email}</span>
                          </div>
                          <div className="naukri-info-row">
                            <span className="naukri-info-label">Phone:</span>
                            <span>{profile.phone || 'Not provided'}</span>
                          </div>
                          <div className="naukri-info-row">
                            <span className="naukri-info-label">Gender:</span>
                            <span>{profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not provided'}</span>
                          </div>
                          <div className="naukri-info-row">
                            <span className="naukri-info-label">Date of Birth:</span>
                            <span>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                          </div>
                          <div className="naukri-info-row">
                            <span className="naukri-info-label">Location:</span>
                            <span>{profile.city || profile.state ? `${profile.city}${profile.state ? `, ${profile.state}` : ''}` : 'Not provided'}</span>
                          </div>
                          {profile.address && (
                            <div className="naukri-info-row" style={{ gridColumn: '1 / -1' }}>
                              <span className="naukri-info-label">Address:</span>
                              <span>{profile.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links Section */}
              {activeSection === 'social' && (
                <div className="naukri-section">
                  <div className="naukri-section-header">
                    <h2 className="naukri-section-title">
                      <i className="ri-links-line"></i>
                      Social Links
                    </h2>
                    {editingSection !== 'social' && (
                      <button className="naukri-edit-btn" onClick={() => setEditingSection('social')}>
                        <i className="ri-edit-line"></i>
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="naukri-section-body">
                    {editingSection === 'social' ? (
                      <>
                        <div className="naukri-form-grid">
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">
                              <i className="ri-linkedin-line"></i> LinkedIn
                            </label>
                            <input
                              type="url"
                              name="linkedin"
                              value={profile.linkedin}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">
                              <i className="ri-github-line"></i> GitHub
                            </label>
                            <input
                              type="url"
                              name="github"
                              value={profile.github}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                              placeholder="https://github.com/username"
                            />
                          </div>
                          <div className="naukri-form-group">
                            <label className="naukri-form-label">
                              <i className="ri-global-line"></i> Portfolio
                            </label>
                            <input
                              type="url"
                              name="portfolio"
                              value={profile.portfolio}
                              onChange={handleInputChange}
                              className="naukri-form-input"
                              placeholder="https://yourportfolio.com"
                            />
                          </div>
                        </div>
                        <div className="naukri-actions">
                          <button className="naukri-btn naukri-btn-primary" onClick={() => handleSaveSection('social')} disabled={saving}>
                            <i className="ri-save-line"></i>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button className="naukri-btn naukri-btn-secondary" onClick={() => setEditingSection(null)}>
                            <i className="ri-close-line"></i>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="naukri-view-content">
                        {(profile.linkedin || profile.github || profile.portfolio) ? (
                          <div className="naukri-social-links">
                            {profile.linkedin && (
                              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="naukri-social-link">
                                <i className="ri-linkedin-line"></i>
                                <span>LinkedIn Profile</span>
                                <i className="ri-external-link-line"></i>
                              </a>
                            )}
                            {profile.github && (
                              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="naukri-social-link">
                                <i className="ri-github-line"></i>
                                <span>GitHub Profile</span>
                                <i className="ri-external-link-line"></i>
                              </a>
                            )}
                            {profile.portfolio && (
                              <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="naukri-social-link">
                                <i className="ri-global-line"></i>
                                <span>Portfolio Website</span>
                                <i className="ri-external-link-line"></i>
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="naukri-empty-state">
                            <i className="ri-links-line"></i>
                            <p>Add your social media profiles to connect with recruiters</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Insights Tab - Full Dashboard */}
        {activeTab === 'activity' && (
          <div className="activity-dashboard">
            {/* Top Summary Bar - 4 Metric Cards */}
            <div className="dashboard-summary-bar">
              <div className="metric-card">
                <div className="metric-icon profile-views">
                  <i className="ri-eye-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">247</div>
                  <div className="metric-label">Profile Views</div>
                  <div className="metric-trend positive">
                    <i className="ri-arrow-up-line"></i>
                    <span>12% vs last week</span>
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon recruiter-searches">
                  <i className="ri-search-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">89</div>
                  <div className="metric-label">Recruiter Searches</div>
                  <div className="metric-trend positive">
                    <i className="ri-arrow-up-line"></i>
                    <span>8% increase</span>
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon applications">
                  <i className="ri-file-list-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">23</div>
                  <div className="metric-label">Applications Sent</div>
                  <div className="metric-breakdown">
                    <span className="pending">12 Pending</span>
                    <span className="shortlisted">8 Shortlisted</span>
                    <span className="rejected">3 Rejected</span>
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon resume-downloads">
                  <i className="ri-download-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">34</div>
                  <div className="metric-label">Resume Downloads</div>
                  <div className="metric-trend positive">
                    <i className="ri-arrow-up-line"></i>
                    <span>5 this week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section - Activity Graph + Profile Strength */}
            <div className="dashboard-middle-section">
              <div className="activity-graph-container">
                <div className="section-card">
                  <div className="card-header">
                    <h3><i className="ri-line-chart-line"></i> Weekly Activity</h3>
                    <div className="time-filter">
                      <button className="active">7 Days</button>
                      <button>30 Days</button>
                      <button>90 Days</button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="chart-placeholder">
                      <div className="chart-bars">
                        <div className="bar-group">
                          <div className="bar applications" style={{ height: '60%' }}></div>
                          <div className="bar views" style={{ height: '80%' }}></div>
                          <span className="bar-label">Mon</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar applications" style={{ height: '45%' }}></div>
                          <div className="bar views" style={{ height: '65%' }}></div>
                          <span className="bar-label">Tue</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar applications" style={{ height: '70%' }}></div>
                          <div className="bar views" style={{ height: '90%' }}></div>
                          <span className="bar-label">Wed</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar applications" style={{ height: '55%' }}></div>
                          <div className="bar views" style={{ height: '75%' }}></div>
                          <span className="bar-label">Thu</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar applications" style={{ height: '80%' }}></div>
                          <div className="bar views" style={{ height: '95%' }}></div>
                          <span className="bar-label">Fri</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar applications" style={{ height: '40%' }}></div>
                          <div className="bar views" style={{ height: '50%' }}></div>
                          <span className="bar-label">Sat</span>
                        </div>
                        <div className="bar-group">
                          <div className="bar applications" style={{ height: '35%' }}></div>
                          <div className="bar views" style={{ height: '45%' }}></div>
                          <span className="bar-label">Sun</span>
                        </div>
                      </div>
                      <div className="chart-legend">
                        <div className="legend-item">
                          <span className="legend-color applications"></span>
                          <span>Applications</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color views"></span>
                          <span>Profile Views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-strength-container">
                <div className="section-card">
                  <div className="card-header">
                    <h3><i className="ri-shield-star-line"></i> Profile Strength</h3>
                  </div>
                  <div className="card-body">
                    <div className="strength-meter">
                      <div className="strength-circle">
                        <svg viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#4A90E2" strokeWidth="8"
                            strokeDasharray={`${completionPercent * 2.827} 282.7`}
                            strokeLinecap="round" transform="rotate(-90 50 50)" />
                        </svg>
                        <div className="strength-value">{completionPercent}%</div>
                      </div>
                      <div className="strength-label">
                        {completionPercent >= 80 ? 'Excellent' : completionPercent >= 60 ? 'Good' : completionPercent >= 40 ? 'Average' : 'Needs Work'}
                      </div>
                    </div>
                    <div className="missing-fields">
                      <h4>Complete Your Profile</h4>
                      {missingDetails.length > 0 ? (
                        <ul>
                          {missingDetails.map((item, index) => (
                            <li key={index} onClick={() => {
                              setActiveTab('view-edit');
                              setActiveSection(item.section);
                              setEditingSection(item.section);
                            }}>
                              <i className="ri-add-circle-line"></i>
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="complete-message">
                          <i className="ri-checkbox-circle-fill"></i>
                          Profile Complete!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Career Health Score */}
                <div className="section-card career-health">
                  <div className="card-header">
                    <h3><i className="ri-heart-pulse-line"></i> Career Health Score</h3>
                  </div>
                  <div className="card-body">
                    <div className="health-score">
                      <div className="score-value">78</div>
                      <div className="score-label">Good Standing</div>
                    </div>
                    <div className="health-factors">
                      <div className="factor">
                        <span>Resume Quality</span>
                        <div className="factor-bar">
                          <div className="factor-fill" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div className="factor">
                        <span>Profile Completeness</span>
                        <div className="factor-bar">
                          <div className="factor-fill" style={{ width: `${completionPercent}%` }}></div>
                        </div>
                      </div>
                      <div className="factor">
                        <span>Activity Level</span>
                        <div className="factor-bar">
                          <div className="factor-fill" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Action Center */}
            <div className="dashboard-action-center">
              {/* Recommended Jobs */}
              <div className="action-card">
                <div className="card-header">
                  <h3><i className="ri-briefcase-line"></i> Recommended Jobs</h3>
                  <a href="/jobs" className="view-all">View All <i className="ri-arrow-right-line"></i></a>
                </div>
                <div className="card-body">
                  <div className="job-recommendation">
                    <div className="job-item">
                      <div className="job-logo">
                        <i className="ri-building-line"></i>
                      </div>
                      <div className="job-details">
                        <h4>Senior Frontend Developer</h4>
                        <p>Tech Corp Inc.</p>
                        <div className="job-meta">
                          <span><i className="ri-map-pin-line"></i> Remote</span>
                          <span><i className="ri-money-dollar-circle-line"></i> $80k-$120k</span>
                        </div>
                      </div>
                      <div className="job-match">
                        <div className="match-score">92%</div>
                        <span>Match</span>
                      </div>
                    </div>
                    <div className="job-item">
                      <div className="job-logo">
                        <i className="ri-building-line"></i>
                      </div>
                      <div className="job-details">
                        <h4>React Developer</h4>
                        <p>Innovation Labs</p>
                        <div className="job-meta">
                          <span><i className="ri-map-pin-line"></i> New York</span>
                          <span><i className="ri-money-dollar-circle-line"></i> $70k-$100k</span>
                        </div>
                      </div>
                      <div className="job-match">
                        <div className="match-score">88%</div>
                        <span>Match</span>
                      </div>
                    </div>
                    <div className="job-item">
                      <div className="job-logo">
                        <i className="ri-building-line"></i>
                      </div>
                      <div className="job-details">
                        <h4>Full Stack Engineer</h4>
                        <p>StartUp XYZ</p>
                        <div className="job-meta">
                          <span><i className="ri-map-pin-line"></i> San Francisco</span>
                          <span><i className="ri-money-dollar-circle-line"></i> $90k-$130k</span>
                        </div>
                      </div>
                      <div className="job-match">
                        <div className="match-score">85%</div>
                        <span>Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Demand Insights */}
              <div className="action-card">
                <div className="card-header">
                  <h3><i className="ri-fire-line"></i> Trending Skills</h3>
                </div>
                <div className="card-body">
                  <div className="skill-demand">
                    <div className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">React.js</span>
                        <span className="skill-demand-level high">High Demand</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-fill" style={{ width: '95%' }}></div>
                      </div>
                      <div className="skill-stats">
                        <span>12,450 jobs</span>
                      </div>
                    </div>
                    <div className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">Node.js</span>
                        <span className="skill-demand-level high">High Demand</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-fill" style={{ width: '88%' }}></div>
                      </div>
                      <div className="skill-stats">
                        <span>9,820 jobs</span>
                      </div>
                    </div>
                    <div className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">TypeScript</span>
                        <span className="skill-demand-level medium">Growing</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-fill" style={{ width: '75%' }}></div>
                      </div>
                      <div className="skill-stats">
                        <span>7,340 jobs</span>
                      </div>
                    </div>
                    <div className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">Python</span>
                        <span className="skill-demand-level high">High Demand</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-fill" style={{ width: '92%' }}></div>
                      </div>
                      <div className="skill-stats">
                        <span>11,200 jobs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Improvement Tips */}
              <div className="action-card">
                <div className="card-header">
                  <h3><i className="ri-lightbulb-line"></i> Improve Your Profile</h3>
                </div>
                <div className="card-body">
                  <div className="tips-list">
                    <div className="tip-item">
                      <div className="tip-icon">
                        <i className="ri-checkbox-circle-line"></i>
                      </div>
                      <div className="tip-content">
                        <h4>Add a Professional Photo</h4>
                        <p>Profiles with photos get 14x more views</p>
                        <button className="tip-action" onClick={() => {
                          setActiveTab('view-edit');
                          setActiveSection('personal');
                        }}>
                          Add Photo
                        </button>
                      </div>
                    </div>
                    <div className="tip-item">
                      <div className="tip-icon">
                        <i className="ri-file-text-line"></i>
                      </div>
                      <div className="tip-content">
                        <h4>Update Your Resume</h4>
                        <p>Keep your resume current for better matches</p>
                        <button className="tip-action" onClick={() => {
                          setActiveTab('view-edit');
                          setActiveSection('resume');
                        }}>
                          Update Resume
                        </button>
                      </div>
                    </div>
                    <div className="tip-item">
                      <div className="tip-icon">
                        <i className="ri-links-line"></i>
                      </div>
                      <div className="tip-content">
                        <h4>Add Social Links</h4>
                        <p>LinkedIn and GitHub boost credibility</p>
                        <button className="tip-action" onClick={() => {
                          setActiveTab('view-edit');
                          setActiveSection('social');
                        }}>
                          Add Links
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hiring Probability & Salary Benchmark */}
            <div className="dashboard-premium-section">
              <div className="premium-card">
                <div className="card-header">
                  <h3><i className="ri-trophy-line"></i> Hiring Probability</h3>
                  <span className="premium-badge">AI Powered</span>
                </div>
                <div className="card-body">
                  <div className="probability-meter">
                    <div className="probability-gauge">
                      <div className="gauge-fill" style={{ width: '73%' }}></div>
                    </div>
                    <div className="probability-value">73%</div>
                  </div>
                  <p className="probability-text">
                    Based on your skills, experience, and current market demand, you have a <strong>high probability</strong> of getting hired within the next 30 days.
                  </p>
                  <div className="probability-factors">
                    <div className="factor-chip positive">
                      <i className="ri-check-line"></i> In-demand skills
                    </div>
                    <div className="factor-chip positive">
                      <i className="ri-check-line"></i> Complete profile
                    </div>
                    <div className="factor-chip neutral">
                      <i className="ri-information-line"></i> Update resume
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-card">
                <div className="card-header">
                  <h3><i className="ri-money-dollar-circle-line"></i> Salary Benchmark</h3>
                  <span className="premium-badge">Market Data</span>
                </div>
                <div className="card-body">
                  <div className="salary-comparison">
                    <div className="salary-range">
                      <div className="range-label">Market Range</div>
                      <div className="range-value">$70k - $120k</div>
                    </div>
                    <div className="salary-marker">
                      <div className="marker-line">
                        <div className="marker-point" style={{ left: '60%' }}>
                          <span className="marker-label">Your Target</span>
                          <span className="marker-value">$95k</span>
                        </div>
                      </div>
                    </div>
                    <div className="salary-stats">
                      <div className="stat">
                        <span className="stat-label">25th Percentile</span>
                        <span className="stat-value">$70k</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Median</span>
                        <span className="stat-value">$90k</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">75th Percentile</span>
                        <span className="stat-value">$120k</span>
                      </div>
                    </div>
                  </div>
                  <p className="salary-note">
                    <i className="ri-information-line"></i>
                    Based on {profile.city || 'your location'} market data for similar roles
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Resume Manager Modal */}
      {showResumeManager && (
        <ResumeManager 
          onClose={() => {
            setShowResumeManager(false);
            fetchResumeInfo();
          }} 
        />
      )}
    </div>
  );
}

export default Profile;
