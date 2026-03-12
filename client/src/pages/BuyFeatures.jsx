import React from 'react';
import './BuyFeatures.css';

function BuyFeatures() {
  return (
    <div className="buy-features-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Find, attract, and hire talent with MytechZ</h1>
            <div className="hero-buttons">
              <button className="btn-primary">Post a free job</button>
              <button className="btn-secondary">Explore plans</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="stats-card">
              <div className="stat-item">
                <div className="stat-number">10Cr+</div>
                <div className="stat-label">Registered Candidates</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1L+</div>
                <div className="stat-label">Active Recruiters</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Active Jobs</div>
              </div>
            </div>
            <div className="trust-badge">
              <i className="ri-shield-check-line"></i>
              <div>
                <div className="trust-title">Trusted by Top Companies</div>
                <div className="trust-subtitle">India's #1 Job Portal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="pricing-section">
        <h2>Attract candidates</h2>
        <p className="pricing-subtitle">with quick and easy plans on India's leading job site</p>
        
        <div className="pricing-cards">
          {/* Hot Vacancy */}
          <div className="pricing-card">
            <div className="plan-header">
              <h3>Hot Vacancy</h3>
              <div className="price">₹1,650</div>
              <p className="gst-text">*GST as applicable</p>
            </div>
            <div className="plan-features">
              <h4>KEY FEATURES</h4>
              <ul>
                <li>✓ Detailed job description</li>
                <li>✓ 3 job locations</li>
                <li>✓ Unlimited applies</li>
                <li>✓ Applies expiry 90 days</li>
                <li>✓ Jobseeker contact details visible</li>
                <li>✓ Boost on Job Search Page</li>
                <li>✓ Job Branding</li>
              </ul>
              <p className="validity">Job validity 30 days</p>
              <p className="discount">🎯 Flat 10% OFF on 5 Job Postings or more</p>
            </div>
            <div className="plan-footer">
              <input type="number" min="1" defaultValue="1" className="quantity-input" />
              <button className="btn-buy">Buy now</button>
            </div>
          </div>

          {/* Classified */}
          <div className="pricing-card">
            <div className="plan-header">
              <h3>Classified</h3>
              <div className="price">₹850</div>
              <p className="gst-text">*GST as applicable</p>
            </div>
            <div className="plan-features">
              <h4>KEY FEATURES</h4>
              <ul>
                <li>✓ Upto 250 character job description</li>
                <li>✓ 3 job locations</li>
                <li>✓ Unlimited applies</li>
                <li>✓ Applies expiry 90 days</li>
                <li>✓ Jobseeker contact details visible</li>
                <li>✓ Boost on Job Search Page</li>
                <li className="disabled">Job Branding</li>
              </ul>
              <p className="validity">Job validity 30 days</p>
              <p className="discount">🎯 Flat 10% OFF on 5 Job Postings or more</p>
            </div>
            <div className="plan-footer">
              <input type="number" min="1" defaultValue="1" className="quantity-input" />
              <button className="btn-buy">Buy now</button>
            </div>
          </div>

          {/* Standard */}
          <div className="pricing-card">
            <div className="plan-header">
              <h3>Standard</h3>
              <div className="price">₹400</div>
              <p className="gst-text">*GST as applicable</p>
            </div>
            <div className="plan-features">
              <h4>KEY FEATURES</h4>
              <ul>
                <li>✓ Upto 250 character job description</li>
                <li>✓ 1 job location</li>
                <li>✓ 200 applies</li>
                <li>✓ Applies expiry 30 days</li>
                <li>✓ Jobseeker contact details visible</li>
                <li>✓ Boost on Job Search Page</li>
                <li className="disabled">Job Branding</li>
              </ul>
              <p className="validity">Job validity 15 days</p>
              <p className="discount">🎯 Flat 10% OFF on 5 Job Postings or more</p>
            </div>
            <div className="plan-footer">
              <input type="number" min="1" defaultValue="1" className="quantity-input" />
              <button className="btn-buy">Buy now</button>
            </div>
          </div>

          {/* Free */}
          <div className="pricing-card free-card">
            <div className="plan-header">
              <h3 className="free-title">Free</h3>
              <div className="free-subtitle">Job Posting</div>
            </div>
            <div className="plan-features">
              <h4>KEY FEATURES</h4>
              <ul>
                <li>✓ Upto 250 character job description</li>
                <li>✓ 1 job location</li>
                <li>✓ 50 applies</li>
                <li>✓ Applies expiry 15 days</li>
                <li className="disabled">Jobseeker contact details visible</li>
                <li className="disabled">Boost on Job Search Page</li>
                <li className="disabled">Job Branding</li>
              </ul>
              <p className="validity">Job validity 7 days</p>
            </div>
            <div className="plan-footer">
              <button className="btn-free">Post a free job</button>
            </div>
          </div>
        </div>
      </section>

      {/* Assisted Hiring Section */}
      <section className="assisted-hiring-section">
        <div className="assisted-header">
          <span className="assisted-badge">ASSISTED HIRING</span>
          <h2>Get our expert assistance</h2>
          <p>to source, screen, and handpick candidates for your business</p>
        </div>

        <div className="assisted-cards">
          {/* Assisted Hiring for Job Posting */}
          <div className="assisted-card">
            <h3>Assisted Hiring for Job Posting</h3>
            <div className="assisted-price">₹4,000</div>
            <p className="gst-text">*GST as applicable</p>
            
            <div className="how-it-works">
              <h4>HOW IT WORKS</h4>
              <ul>
                <li>+ Get a personalized consultation with MytechZ's hiring expert</li>
                <li>+ We post your job on MytechZ.com to reach quality candidates</li>
                <li>+ We shortlist the most relevant applicants</li>
                <li>+ Shortlisted profiles are shared with you for final selection</li>
              </ul>
              <p className="note">ℹ For requirements under 9 lacs CTC</p>
            </div>

            <div className="assisted-footer">
              <input type="number" min="1" defaultValue="1" className="quantity-input" />
              <button className="btn-buy">Buy now</button>
            </div>
          </div>

          {/* Assisted Hiring for Resume Database */}
          <div className="assisted-card">
            <h3>Assisted Hiring for Resume Database</h3>
            <div className="assisted-price">₹5,000</div>
            <p className="gst-text">*GST as applicable</p>
            
            <div className="discount-badge">
              ⚙️ Flat ₹1,500 OFF on purchasing 3 requirements
            </div>

            <div className="how-it-works">
              <h4>HOW IT WORKS</h4>
              <ul>
                <li>+ Get a personalized consultation with MytechZ's hiring expert.</li>
                <li>+ We set up a tailored search in Resdex to match your needs</li>
                <li>+ You can then connect with top matches from MytechZ's 10Cr+ resume database (Resdex)</li>
                <li>+ Get access to 100 CV views per requirement and other features</li>
              </ul>
            </div>

            <div className="assisted-footer">
              <input type="number" min="1" defaultValue="1" className="quantity-input" />
              <button className="btn-buy">Buy now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BuyFeatures;
