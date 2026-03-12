import React, { useState, useEffect } from 'react';
import './CompanyProfile.css';

function CompanyProfile() {
  const [originalData, setOriginalData] = useState(null);
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
          companyName: 'TechCorp Alpha 1',
          website: 'https://www.techcorpalpha1.com',
          industry: 'Information Technology',
          companySize: '51-200 employees',
          foundedYear: '2015',
          workMode: 'Hybrid',
          officeAddress: '123 Tech Street, Innovation Park, San Francisco, CA 94105',
          headOfficeLocation: 'San Francisco, California',
          companyDescription: 'Leading technology solutions provider specializing in cloud computing, artificial intelligence, and enterprise software development.',
          missionCulture: 'Innovation-driven culture focused on solving real-world problems through cutting-edge technology.',
          benefitsPerks: ['Health Insurance', 'Remote Work', 'Learning Budget', 'Flexible Hours', 'Stock Options', 'Gym Membership']
        };
        setFormData(demoData);
        setOriginalData(JSON.parse(JSON.stringify(demoData)));
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
          setOriginalData(JSON.parse(JSON.stringify(mappedData)));
          setProfileExists(true);
        } else {
          setProfileExists(false);
          setIsEditMode(true);
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
    
    if (!formData.companyName?.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.website?.trim()) {
      newErrors.website = 'Website is required';
    } else {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = 'Please enter a valid website URL';
      }
    }
    if (!formData.industry?.trim()) newErrors.industry = 'Industry is required';
    if (!formData.companySize) newErrors.companySize = 'Company size is required';
    if (!formData.foundedYear?.trim()) newErrors.foundedYear = 'Founded year is required';
    if (!formData.workMode) newErrors.workMode = 'Work mode is required';
    if (!formData.officeAddress?.trim()) newErrors.officeAddress = 'Office address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    if (originalData) {
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
      
      if (token === 'demo-recruiter-token') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOriginalData(JSON.parse(JSON.stringify(formData)));
        setProfileExists(true);
        setIsEditMode(false);
        if (window.showPopup) {
          window.showPopup('Company profile saved successfully!', 'success');
        }
        setSaving(false);
        return;
      }
      
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
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(backendData)
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setOriginalData(JSON.parse(JSON.stringify(formData)));
        setProfileExists(true);
        setIsEditMode(false);
        if (window.showPopup) {
          window.showPopup(`Company profile ${profileExists ? 'updated' : 'created'} successfully!`, 'success');
        }
        fetchCompanyProfile();
      } else {
        throw new Error(responseData.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (window.showPopup) {
        window.showPopup(`Error: ${error.message}`, 'error');
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
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <h1>Company Profile</h1>
            <p>Manage your company information and build your employer brand</p>
          </div>
          <div className="header-actions">
            {!isEditMode ? (
              <button className="edit-profile-btn" onClick={() => setIsEditMode(true)}>
                <i className="ri-edit-line"></i>
                Edit Profile
              </button>
            ) : (
              <>
                <button className="cancel-edit-btn" onClick={handleCancel}>
                  <i className="ri-close-line"></i>
                  Cancel
                </button>
                <button className="save-profile-btn" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <i className="ri-loader-line"></i>
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

        {/* Info Banner */}
        {!isEditMode && (
          <div className="info-banner">
            <i className="ri-information-line"></i>
            <p>Viewing mode - Click "Edit Profile" button above to make changes</p>
          </div>
        )}

        {/* Profile Content */}
        <div className="profile-content">
          {/* Company Information */}
          <div className="profile-section">
            <h2 className="section-title">Company Information</h2>
            <div className="form-grid">
              <div className={`form-group ${errors.companyName ? 'has-error' : ''}`}>
                <label>
                  Company Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  disabled={!isEditMode}
                />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </div>

              <div className={`form-group ${errors.website ? 'has-error' : ''}`}>
                <label>
                  Website <span className="required">*</span>
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.company.com"
                  disabled={!isEditMode}
                />
                {errors.website && <span className="error-message">{errors.website}</span>}
              </div>

              <div className={`form-group ${errors.industry ? 'has-error' : ''}`}>
                <label>
                  Industry <span className="required">*</span>
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
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

              <div className={`form-group ${errors.companySize ? 'has-error' : ''}`}>
                <label>
                  Company Size <span className="required">*</span>
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  disabled={!isEditMode}
                >
                  <option value="">Select Company Size</option>
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="51-200 employees">51-200 employees</option>
                  <option value="201-500 employees">201-500 employees</option>
                  <option value="501-1000 employees">501-1000 employees</option>
                  <option value="1000+ employees">1000+ employees</option>
                </select>
                {errors.companySize && <span className="error-message">{errors.companySize}</span>}
              </div>

              <div className={`form-group ${errors.foundedYear ? 'has-error' : ''}`}>
                <label>
                  Founded Year <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                  placeholder="2015"
                  disabled={!isEditMode}
                />
                {errors.foundedYear && <span className="error-message">{errors.foundedYear}</span>}
              </div>

              <div className={`form-group ${errors.workMode ? 'has-error' : ''}`}>
                <label>
                  Work Mode <span className="required">*</span>
                </label>
                <select
                  value={formData.workMode}
                  onChange={(e) => handleInputChange('workMode', e.target.value)}
                  disabled={!isEditMode}
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.workMode && <span className="error-message">{errors.workMode}</span>}
              </div>

              <div className={`form-group form-group-full ${errors.officeAddress ? 'has-error' : ''}`}>
                <label>
                  Office Address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.officeAddress}
                  onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                  placeholder="123 Business Street, City, State, ZIP"
                  disabled={!isEditMode}
                />
                {errors.officeAddress && <span className="error-message">{errors.officeAddress}</span>}
              </div>

              <div className="form-group form-group-full">
                <label>Head Office Location</label>
                <input
                  type="text"
                  value={formData.headOfficeLocation}
                  onChange={(e) => handleInputChange('headOfficeLocation', e.target.value)}
                  placeholder="City, State/Country"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div className="profile-section">
            <h2 className="section-title">Company Description</h2>
            <div className="form-group">
              <label>About the Company</label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                placeholder="Describe your company, what you do, and what makes you unique..."
                disabled={!isEditMode}
              />
            </div>

            <div className="form-group">
              <label>Mission & Culture</label>
              <textarea
                value={formData.missionCulture}
                onChange={(e) => handleInputChange('missionCulture', e.target.value)}
                placeholder="Describe your company's mission, values, and work culture..."
                disabled={!isEditMode}
              />
            </div>
          </div>

          {/* Benefits & Perks */}
          <div className="profile-section">
            <h2 className="section-title">Benefits & Perks</h2>
            
            {isEditMode && (
              <div className="benefits-input-group">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add a benefit or perk..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                />
                <button
                  type="button"
                  className="add-benefit-btn"
                  onClick={handleAddBenefit}
                  disabled={!newBenefit.trim()}
                >
                  <i className="ri-add-line"></i>
                  Add
                </button>
              </div>
            )}

            {formData.benefitsPerks.length > 0 ? (
              <div className="benefits-list">
                {formData.benefitsPerks.map((benefit, index) => (
                  <div key={index} className={`benefit-tag ${!isEditMode ? 'view-mode' : ''}`}>
                    <span>{benefit}</span>
                    {isEditMode && (
                      <button
                        type="button"
                        className="remove-benefit-btn"
                        onClick={() => handleRemoveBenefit(benefit)}
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-benefits">
                {isEditMode ? 'No benefits added yet. Add some above!' : 'No benefits listed'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;
