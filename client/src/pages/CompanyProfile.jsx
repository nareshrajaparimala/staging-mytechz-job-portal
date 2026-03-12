import React, { useState, useEffect } from 'react';
import './CompanyProfile.css';

function CompanyProfile() {
  // Original data from server (for cancel functionality)
  const [originalData, setOriginalData] = useState(null);
  
  // Current form data (editable)
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    workMode: 'hybrid',
    officeAddress: '',
    headOfficeLocation: '',
    companyDescription: '',
    missionCulture: '',
    benefitsPerks: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [newBenefit, setNewBenefit] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      // Demo mode
      if (token === 'demo-recruiter-token') {
        const demoData = {
          companyName: 'TechCorp Solutions',
          website: 'https://techcorp.example.com',
          industry: 'Information Technology',
          companySize: '50-200',
          foundedYear: '2015',
          workMode: 'hybrid',
          officeAddress: '123 Tech Street, San Francisco, CA 94105',
          headOfficeLocation: 'San Francisco, CA',
          companyDescription: 'Leading technology solutions provider specializing in cloud computing and AI.',
          missionCulture: 'Innovation-driven culture focused on solving real-world problems.',
          benefitsPerks: ['Health Insurance', 'Remote Work', 'Learning Budget', 'Flexible Hours']
        };
        setFormData(demoData);
        setOriginalData(JSON.parse(JSON.stringify(demoData))); // Deep copy
        setProfileExists(true);
        setLoading(false);
        return;
      }
      
      // Real API call
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/company-profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          const profile = data.profile;
          const mappedData = {
            companyName: profile.company_name || '',
            website: profile.website || '',
            industry: profile.industry || '',
            companySize: profile.company_size || '',
            foundedYear: profile.founded_year || '',
            workMode: profile.work_mode || 'hybrid',
            officeAddress: profile.office_address || '',
            headOfficeLocation: profile.head_office_location || '',
            companyDescription: profile.company_description || '',
            missionCulture: profile.mission_and_culture || '',
            benefitsPerks: profile.benefits_list || []
          };
          setFormData(mappedData);
          setOriginalData(JSON.parse(JSON.stringify(mappedData))); // Deep copy
          setProfileExists(true);
        } else {
          setProfileExists(false);
          setIsEditMode(true); // Auto-enable edit for new profiles
        }
      } else if (response.status === 404) {
        setProfileExists(false);
        setIsEditMode(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileExists(false);
      setIsEditMode(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !formData.benefitsPerks.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefitsPerks: [...prev.benefitsPerks, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefit) => {
    setFormData(prev => ({
      ...prev,
      benefitsPerks: prev.benefitsPerks.filter(b => b !== benefit)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Mandatory fields as per user requirements:
    // Company Name, Website, Industry, Company Size, Founded Year, Work Mode, Office Address
    
    if (!formData.companyName || !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.website || !formData.website.trim()) {
      newErrors.website = 'Website is required';
    } else {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = 'Please enter a valid website URL';
      }
    }
    
    if (!formData.industry || !formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
    }
    
    if (!formData.foundedYear || !formData.foundedYear.trim()) {
      newErrors.foundedYear = 'Founded year is required';
    }
    
    if (!formData.workMode) {
      newErrors.workMode = 'Work mode is required';
    }
    
    if (!formData.officeAddress || !formData.officeAddress.trim()) {
      newErrors.officeAddress = 'Office address is required';
    }
    
    // Optional fields (no validation):
    // Head Office Location, Company Description, Mission & Culture, Benefits and Perks
    
    console.log('Validation errors:', newErrors);
    console.log('Form data:', formData);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    if (originalData) {
      // Restore original data
      setFormData(JSON.parse(JSON.stringify(originalData)));
    }
    setErrors({});
    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      if (window.showPopup) {
        window.showPopup('Please fix the errors before saving', 'error');
      }
      return;
    }

    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Demo mode - check both token and email
      if (token === 'demo-recruiter-token' || user.email === 'demo@recruiter.com') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOriginalData(JSON.parse(JSON.stringify(formData))); // Update original
        setProfileExists(true);
        setIsEditMode(false);
        if (window.showPopup) {
          window.showPopup('Company profile saved successfully! (Demo Mode)', 'success');
        }
        setSaving(false);
        return;
      }
      
      // Real API call
      const backendData = {
        company_name: formData.companyName,
        website: formData.website,
        industry: formData.industry,
        company_size: formData.companySize,
        founded_year: formData.foundedYear ? parseInt(formData.foundedYear) : null,
        work_mode: formData.workMode || 'hybrid',
        office_address: formData.officeAddress || '',
        head_office_location: formData.headOfficeLocation || '',
        company_description: formData.companyDescription || '',
        mission_and_culture: formData.missionCulture || '',
        benefits_list: formData.benefitsPerks || []
      };
      
      const method = profileExists ? 'PUT' : 'POST';
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/company-profile`;
      
      console.log('Saving company profile:', { method, url, data: backendData });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(backendData)
      });

      const responseData = await response.json();
      
      console.log('Save response:', { status: response.status, data: responseData });

      if (response.ok && responseData.success) {
        setOriginalData(JSON.parse(JSON.stringify(formData))); // Update original
        setProfileExists(true);
        setIsEditMode(false);
        if (window.showPopup) {
          window.showPopup(`Company profile ${profileExists ? 'updated' : 'created'} successfully!`, 'success');
        }
        fetchCompanyProfile(); // Refresh data
      } else {
        const errorMsg = responseData.message || responseData.error || 'Failed to save profile';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (window.showPopup) {
        window.showPopup(`Error saving company profile: ${error.message}`, 'error');
      } else {
        alert(`Error saving company profile: ${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="company-profile-page">
        <div className="loading">
          <i className="ri-loader-line"></i>
          <p>Loading company profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-profile-page">
      <div className="company-profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-header-left">
              <h1>Company Profile</h1>
              <p>Manage your company information and build your employer brand</p>
            </div>
            
            <div className="profile-header-actions">
              {!isEditMode ? (
                <button
                  type="button"
                  className="edit-profile-btn"
                  onClick={() => setIsEditMode(true)}
                >
                  <i className="ri-edit-line"></i>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="cancel-profile-btn"
                    onClick={handleCancel}
                  >
                    <i className="ri-close-line"></i>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="save-profile-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <i className="ri-loader-line spinning"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* View Mode Alert */}
        {!isEditMode && (
          <div className="view-mode-alert">
            <i className="ri-information-line"></i>
            <span>Viewing mode - Click "Edit Profile" button above to make changes</span>
          </div>
        )}

        {/* Error Alert */}
        {Object.keys(errors).length > 0 && (
          <div className="error-alert">
            <div className="error-alert-header">
              <i className="ri-error-warning-line"></i>
              <strong>Please fix the following errors:</strong>
            </div>
            <ul>
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Profile Content */}
        <div className="profile-content">
          <form className={`company-profile-form ${!isEditMode ? 'view-mode' : 'edit-mode'}`}>
            
            {/* Company Information Section */}
            <div className="profile-section">
              <h2>Company Information</h2>
              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                    className={errors.companyName ? 'error' : ''}
                    disabled={!isEditMode}
                  />
                  {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                </div>

                <div className="profile-form-group">
                  <label>
                    Website <span className="required">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.techcorpalpha1.com"
                    className={errors.website ? 'error' : ''}
                    disabled={!isEditMode}
                  />
                  {errors.website && <span className="error-message">{errors.website}</span>}
                </div>

                <div className="profile-form-group">
                  <label>
                    Industry <span className="required">*</span>
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className={errors.industry ? 'error' : ''}
                    disabled={!isEditMode}
                  >
                    <option value="">Select Industry</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Consulting">Consulting</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.industry && <span className="error-message">{errors.industry}</span>}
                </div>

                <div className="profile-form-group">
                  <label>
                    Company Size <span className="required">*</span>
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => handleInputChange('companySize', e.target.value)}
                    className={errors.companySize ? 'error' : ''}
                    disabled={!isEditMode}
                  >
                    <option value="">Select Size</option>
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="51-200 employees">51-200 employees</option>
                    <option value="201-500 employees">201-500 employees</option>
                    <option value="501-1000 employees">501-1000 employees</option>
                    <option value="1000+ employees">1000+ employees</option>
                  </select>
                  {errors.companySize && <span className="error-message">{errors.companySize}</span>}
                </div>

                <div className="profile-form-group">
                  <label>
                    Founded Year <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.foundedYear}
                    onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                    placeholder="2015"
                    className={errors.foundedYear ? 'error' : ''}
                    disabled={!isEditMode}
                  />
                  {errors.foundedYear && <span className="error-message">{errors.foundedYear}</span>}
                </div>

                <div className="profile-form-group">
                  <label>
                    Work Mode <span className="required">*</span>
                  </label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => handleInputChange('workMode', e.target.value)}
                    className={errors.workMode ? 'error' : ''}
                    disabled={!isEditMode}
                  >
                    <option value="">Select Work Mode</option>
                    <option value="Remote">Remote</option>
                    <option value="Office">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  {errors.workMode && <span className="error-message">{errors.workMode}</span>}
                </div>

                <div className="profile-form-group profile-form-group-full">
                  <label>
                    Office Address <span className="required">*</span>
                  </label>
                  <textarea
                    value={formData.officeAddress}
                    onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                    placeholder="Enter complete office address..."
                    rows="3"
                    className={errors.officeAddress ? 'error' : ''}
                    disabled={!isEditMode}
                  />
                  {errors.officeAddress && <span className="error-message">{errors.officeAddress}</span>}
                </div>

                <div className="profile-form-group">
                  <label>Head Office Location (Optional)</label>
                  <input
                    type="text"
                    value={formData.headOfficeLocation}
                    onChange={(e) => handleInputChange('headOfficeLocation', e.target.value)}
                    placeholder="City, Country"
                    disabled={!isEditMode}
                  />
                </div>
              </div>
            </div>

            {/* About Company Section */}
            <div className="profile-section">
              <h2>About Company</h2>
              <div className="profile-form-grid">
                <div className="profile-form-group profile-form-group-full">
                  <label>Company Description (Optional)</label>
                  <textarea
                    value={formData.companyDescription}
                    onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                    placeholder="Describe your company, what you do, and what makes you unique..."
                    rows="4"
                    disabled={!isEditMode}
                  />
                </div>

                <div className="profile-form-group profile-form-group-full">
                  <label>Mission & Culture (Optional)</label>
                  <textarea
                    value={formData.missionCulture}
                    onChange={(e) => handleInputChange('missionCulture', e.target.value)}
                    placeholder="Share your company's mission, values, and culture..."
                    rows="3"
                    disabled={!isEditMode}
                  />
                </div>

                <div className="profile-form-group profile-form-group-full">
                  <label>Benefits & Perks (Optional)</label>
                  {isEditMode && (
                    <div className="benefits-input-container">
                      <input
                        type="text"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="Add a benefit (e.g., Health Insurance)"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                      />
                      <button type="button" onClick={handleAddBenefit} className="benefits-add-btn">
                        Add
                      </button>
                    </div>
                  )}
                  <div className="benefits-list">
                    {formData.benefitsPerks.map((benefit, index) => (
                      <span key={index} className="benefit-tag">
                        {benefit}
                        {isEditMode && (
                          <i className="ri-close-line" onClick={() => handleRemoveBenefit(benefit)}></i>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;