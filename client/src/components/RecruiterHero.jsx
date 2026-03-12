import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecruiterHero.css';

function RecruiterHero() {
  const navigate = useNavigate();

  return (
    <div className="recruiter-hero-section">
      {/* Hero Banner */}
      <div className="recruiter-hero-banner">
        <div className="recruiter-hero-content">
          <div className="recruiter-hero-text">
            <span className="recruiter-badge">JOB POSTING</span>
            <h1 className="recruiter-hero-title">
              Post Jobs on MytechZ –<br />
              India's #1 Leading<br />
              Job Posting Platform
            </h1>
            <div className="recruiter-hero-buttons">
              <button 
                className="recruiter-btn-primary"
                onClick={() => navigate('/recruiter/post-job')}
              >
                Post a free job
              </button>
              <button 
                className="recruiter-btn-secondary"
                onClick={() => navigate('/recruiter/subscription')}
              >
                Explore plans
              </button>
            </div>
          </div>
          
          <div className="recruiter-hero-image">
            <div className="recruiter-response-card">
              <div className="response-header">
                <span className="response-title">Total Responses</span>
                <span className="response-count">345</span>
              </div>
              <div className="response-list">
                <div className="response-item">
                  <div className="response-avatar">V</div>
                  <span className="response-name">Vikram Deshmukh</span>
                  <span className="response-badge">Shortlist</span>
                </div>
                <div className="response-item">
                  <div className="response-avatar">K</div>
                  <span className="response-name">Karan Sharma</span>
                  <span className="response-badge">Shortlist</span>
                </div>
                <div className="response-item">
                  <div className="response-avatar">R</div>
                  <span className="response-name">Rajat Bansal</span>
                  <span className="response-badge">Shortlist</span>
                </div>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop" 
              alt="Professional using laptop" 
              className="recruiter-person-image"
            />
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="recruiter-features">
        <div className="recruiter-feature-card">
          <div className="feature-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Create & quickly publish</h3>
          <p>job listings in <strong>2 minutes</strong></p>
        </div>

        <div className="recruiter-feature-card">
          <div className="feature-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 21C2 17.134 5.13401 14 9 14C12.866 14 16 17.134 16 21" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 21C14 18.2386 16.2386 16 19 16C21.7614 16 24 18.2386 24 21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3>Reach <strong>10 Cr+</strong> candidates</h3>
          <p>across <strong>industries, roles, & geographies</strong></p>
        </div>

        <div className="recruiter-feature-card">
          <div className="feature-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 3V21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3>Manage job listings</h3>
          <p><strong>post, edit, & track</strong> in one place</p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterHero;
