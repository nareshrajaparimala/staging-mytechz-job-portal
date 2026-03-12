import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecruiterHome.css';

function RecruiterHome() {
  const navigate = useNavigate();

  return (
    <div className="recruiter-home">
      {/* Hero Section - Recruiter Focused */}
      <section className="recruiter-hero">
        <div className="recruiter-hero-content">
          <div className="hero-text">
            <span className="hero-badge">RECRUITER DASHBOARD</span>
            <h1>Welcome to MytechZ Recruiter Portal</h1>
            <p>Post jobs, find candidates, and manage your hiring process all in one place</p>
            
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/recruiter/post-job')}>
                <i className="ri-add-line"></i> Post a Job
              </button>
              <button className="btn-secondary" onClick={() => navigate('/recruiter/resume-database')}>
                <i className="ri-search-line"></i> Search Candidates
              </button>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="response-card">
              <div className="response-header">
                <span>Quick Actions</span>
              </div>
              <div className="response-list">
                <div className="response-item" onClick={() => navigate('/recruiter/post-job')}>
                  <div className="avatar"><i className="ri-briefcase-line"></i></div>
                  <span>Post New Job</span>
                  <i className="ri-arrow-right-line"></i>
                </div>
                <div className="response-item" onClick={() => navigate('/recruiter/resume-database')}>
                  <div className="avatar"><i className="ri-user-search-line"></i></div>
                  <span>Browse Resumes</span>
                  <i className="ri-arrow-right-line"></i>
                </div>
                <div className="response-item" onClick={() => navigate('/recruiter/post-internship')}>
                  <div className="avatar"><i className="ri-graduation-cap-line"></i></div>
                  <span>Post Internship</span>
                  <i className="ri-arrow-right-line"></i>
                </div>
                <div className="response-item" onClick={() => navigate('/recruiter/reports')}>
                  <div className="avatar"><i className="ri-bar-chart-line"></i></div>
                  <span>View Reports</span>
                  <i className="ri-arrow-right-line"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="recruiter-features">
        <h2 className="section-title">Why Recruiters Choose MytechZ</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="ri-file-edit-line"></i>
            </div>
            <h3>Quick Job Posting</h3>
            <p>Create and publish job listings in under 2 minutes with our intuitive interface</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="ri-team-line"></i>
            </div>
            <h3>Massive Candidate Pool</h3>
            <p>Access 10 Cr+ active job seekers across all industries and experience levels</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="ri-dashboard-line"></i>
            </div>
            <h3>Centralized Management</h3>
            <p>Manage all your job postings, applications, and candidates from one dashboard</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="ri-search-eye-line"></i>
            </div>
            <h3>Advanced Search</h3>
            <p>Find the perfect candidates with powerful filters and search capabilities</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="recruiter-stats">
        <h2>MytechZ by the Numbers</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon"><i className="ri-user-line"></i></div>
            <h3>10 Cr+</h3>
            <p>Active Job Seekers</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><i className="ri-building-line"></i></div>
            <h3>5 Lakh+</h3>
            <p>Companies Trust Us</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><i className="ri-time-line"></i></div>
            <h3>2 Minutes</h3>
            <p>Average Posting Time</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><i className="ri-customer-service-line"></i></div>
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="recruiter-services">
        <h2>Our Recruiter Services</h2>
        <div className="services-grid">
          <div className="service-card" onClick={() => navigate('/recruiter/post-job')}>
            <i className="ri-briefcase-line"></i>
            <h3>Job Posting</h3>
            <p>Post unlimited jobs and reach millions of candidates</p>
          </div>
          <div className="service-card" onClick={() => navigate('/recruiter/resume-database')}>
            <i className="ri-database-line"></i>
            <h3>Resume Database</h3>
            <p>Search and download candidate resumes instantly</p>
          </div>
          <div className="service-card" onClick={() => navigate('/recruiter/post-internship')}>
            <i className="ri-graduation-cap-line"></i>
            <h3>Internship Programs</h3>
            <p>Find talented interns for your organization</p>
          </div>
          <div className="service-card" onClick={() => navigate('/recruiter/reports')}>
            <i className="ri-bar-chart-box-line"></i>
            <h3>Analytics & Reports</h3>
            <p>Track your hiring performance with detailed insights</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="recruiter-cta">
        <h2>Ready to Find Your Next Great Hire?</h2>
        <p>Start posting jobs and connecting with top talent today</p>
        <div className="cta-buttons">
          <button className="btn-cta" onClick={() => navigate('/recruiter/post-job')}>
            <i className="ri-add-circle-line"></i> Post Your First Job
          </button>
          <button className="btn-cta-secondary" onClick={() => navigate('/recruiter/resume-database')}>
            <i className="ri-search-line"></i> Browse Candidates
          </button>
        </div>
      </section>
    </div>
  );
}

export default RecruiterHome;
