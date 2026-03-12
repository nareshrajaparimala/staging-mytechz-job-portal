import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecruiterDashboard.css';

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('job-post');

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    
    // Navigate to respective pages
    switch(tab) {
      case 'job-post':
        navigate('/recruiter/post-job');
        break;
      case 'resume-database':
        navigate('/recruiter/resume-database');
        break;
      case 'internship-post':
        navigate('/recruiter/post-internship');
        break;
      case 'get-report':
        navigate('/recruiter/reports');
        break;
      default:
        break;
    }
  };

  return (
    <div className="recruiter-dashboard">
      {/* Navbar */}
      <nav className="recruiter-navbar">
        <div className="recruiter-navbar-container">
          <div className="recruiter-nav-buttons">
            <button
              className={`recruiter-nav-btn ${activeTab === 'job-post' ? 'active' : ''}`}
              onClick={() => handleNavigation('job-post')}
            >
              <i className="ri-briefcase-line"></i>
              <span>Job Post</span>
            </button>
            
            <button
              className={`recruiter-nav-btn ${activeTab === 'resume-database' ? 'active' : ''}`}
              onClick={() => handleNavigation('resume-database')}
            >
              <i className="ri-file-user-line"></i>
              <span>Resume Database</span>
            </button>
            
            <button
              className={`recruiter-nav-btn ${activeTab === 'internship-post' ? 'active' : ''}`}
              onClick={() => handleNavigation('internship-post')}
            >
              <i className="ri-graduation-cap-line"></i>
              <span>Internship Post</span>
            </button>
            
            <button
              className={`recruiter-nav-btn ${activeTab === 'get-report' ? 'active' : ''}`}
              onClick={() => handleNavigation('get-report')}
            >
              <i className="ri-bar-chart-box-line"></i>
              <span>Get Report</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="recruiter-main-content">
        <div className="recruiter-welcome-section">
          <div className="welcome-text">
            <h1>Welcome to Recruiter Dashboard</h1>
            <p>Manage your job postings, internships, and access candidate database</p>
          </div>
          <div className="welcome-image">
            <img src="/photo1.webp" alt="Recruiter Dashboard" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="recruiter-stats-grid">
          <div className="recruiter-stat-card">
            <div className="stat-icon job-icon">
              <i className="ri-briefcase-line"></i>
            </div>
            <div className="stat-info">
              <h3>Active Jobs</h3>
              <p className="stat-number">12</p>
            </div>
          </div>

          <div className="recruiter-stat-card">
            <div className="stat-icon resume-icon">
              <i className="ri-file-user-line"></i>
            </div>
            <div className="stat-info">
              <h3>Total Applications</h3>
              <p className="stat-number">248</p>
            </div>
          </div>

          <div className="recruiter-stat-card">
            <div className="stat-icon internship-icon">
              <i className="ri-graduation-cap-line"></i>
            </div>
            <div className="stat-info">
              <h3>Internships</h3>
              <p className="stat-number">5</p>
            </div>
          </div>

          <div className="recruiter-stat-card">
            <div className="stat-icon report-icon">
              <i className="ri-bar-chart-box-line"></i>
            </div>
            <div className="stat-info">
              <h3>Reports Generated</h3>
              <p className="stat-number">18</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="recruiter-quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-cards-grid">
            <div className="action-card" onClick={() => handleNavigation('job-post')}>
              <i className="ri-add-circle-line"></i>
              <h3>Post New Job</h3>
              <p>Create and publish a new job opening</p>
            </div>

            <div className="action-card" onClick={() => handleNavigation('resume-database')}>
              <i className="ri-search-line"></i>
              <h3>Search Candidates</h3>
              <p>Browse through candidate profiles</p>
            </div>

            <div className="action-card" onClick={() => handleNavigation('internship-post')}>
              <i className="ri-add-circle-line"></i>
              <h3>Post Internship</h3>
              <p>Create internship opportunities</p>
            </div>

            <div className="action-card" onClick={() => handleNavigation('get-report')}>
              <i className="ri-download-line"></i>
              <h3>Download Report</h3>
              <p>Get detailed analytics and reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
