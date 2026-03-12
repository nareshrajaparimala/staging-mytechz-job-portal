import { useState, useEffect } from 'react';
import './Reports.css';

function Reports() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0,
    avgApplicationsPerJob: 0,
    topPerformingJobs: [],
    applicationsByStatus: {
      pending: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0
    },
    recentActivity: []
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Demo mode
      if (token === 'demo-recruiter-token') {
        const demoStats = {
          totalJobs: 12,
          activeJobs: 8,
          totalApplications: 156,
          totalViews: 2340,
          avgApplicationsPerJob: 13,
          topPerformingJobs: [
            { title: 'Senior React Developer', applications: 45, views: 320 },
            { title: 'Full Stack Engineer', applications: 38, views: 280 },
            { title: 'UI/UX Designer', applications: 32, views: 245 }
          ],
          applicationsByStatus: {
            pending: 89,
            shortlisted: 42,
            rejected: 18,
            hired: 7
          },
          recentActivity: [
            { action: 'New Application', job: 'Senior React Developer', time: '2 hours ago' },
            { action: 'Job Published', job: 'DevOps Engineer', time: '5 hours ago' },
            { action: 'Candidate Shortlisted', job: 'Full Stack Engineer', time: '1 day ago' }
          ]
        };
        setStats(demoStats);
        setLoading(false);
        return;
      }

      // Real API call would go here
      setStats({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        totalViews: 0,
        avgApplicationsPerJob: 0,
        topPerformingJobs: [],
        applicationsByStatus: {
          pending: 0,
          shortlisted: 0,
          rejected: 0,
          hired: 0
        },
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reports-container">
        <div className="reports-loading">
          <i className="ri-loader-4-line"></i>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const hasData = stats.totalJobs > 0 || stats.totalApplications > 0;

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Reports & Analytics</h1>
            <p>Track your recruitment performance and insights</p>
          </div>
          <div className="header-actions">
            <button className="export-btn">
              <i className="ri-download-line"></i>
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="reports-main">
        {!hasData ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="ri-bar-chart-box-line"></i>
            </div>
            <h2>No Analytics Data Yet</h2>
            <p>Start posting jobs and receiving applications to see your performance metrics</p>
            <button 
              className="primary-action-btn"
              onClick={() => window.location.href = '/recruiter/post-job'}
            >
              <i className="ri-add-line"></i>
              Post Your First Job
            </button>
          </div>
        ) : (
          <>
            <div className="metrics-grid">
              <div className="metric-card purple">
                <div className="metric-icon">
                  <i className="ri-briefcase-4-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">{stats.totalJobs}</div>
                  <div className="metric-label">Total Jobs Posted</div>
                </div>
              </div>

              <div className="metric-card blue">
                <div className="metric-icon">
                  <i className="ri-checkbox-circle-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">{stats.activeJobs}</div>
                  <div className="metric-label">Active Jobs</div>
                </div>
              </div>

              <div className="metric-card green">
                <div className="metric-icon">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">{stats.totalApplications}</div>
                  <div className="metric-label">Total Applications</div>
                </div>
              </div>

              <div className="metric-card orange">
                <div className="metric-icon">
                  <i className="ri-eye-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">{stats.totalViews.toLocaleString()}</div>
                  <div className="metric-label">Total Job Views</div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <div className="section-header">
                <h2>Application Status Overview</h2>
              </div>
              <div className="status-breakdown">
                <div className="status-item">
                  <div className="status-info">
                    <div className="status-dot pending"></div>
                    <span className="status-name">Pending Review</span>
                  </div>
                  <div className="status-bar-wrapper">
                    <div className="status-bar">
                      <div 
                        className="status-fill pending" 
                        style={{ width: `${(stats.applicationsByStatus.pending / stats.totalApplications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="status-count">{stats.applicationsByStatus.pending}</span>
                  </div>
                </div>

                <div className="status-item">
                  <div className="status-info">
                    <div className="status-dot shortlisted"></div>
                    <span className="status-name">Shortlisted</span>
                  </div>
                  <div className="status-bar-wrapper">
                    <div className="status-bar">
                      <div 
                        className="status-fill shortlisted" 
                        style={{ width: `${(stats.applicationsByStatus.shortlisted / stats.totalApplications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="status-count">{stats.applicationsByStatus.shortlisted}</span>
                  </div>
                </div>

                <div className="status-item">
                  <div className="status-info">
                    <div className="status-dot rejected"></div>
                    <span className="status-name">Rejected</span>
                  </div>
                  <div className="status-bar-wrapper">
                    <div className="status-bar">
                      <div 
                        className="status-fill rejected" 
                        style={{ width: `${(stats.applicationsByStatus.rejected / stats.totalApplications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="status-count">{stats.applicationsByStatus.rejected}</span>
                  </div>
                </div>

                <div className="status-item">
                  <div className="status-info">
                    <div className="status-dot hired"></div>
                    <span className="status-name">Hired</span>
                  </div>
                  <div className="status-bar-wrapper">
                    <div className="status-bar">
                      <div 
                        className="status-fill hired" 
                        style={{ width: `${(stats.applicationsByStatus.hired / stats.totalApplications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="status-count">{stats.applicationsByStatus.hired}</span>
                  </div>
                </div>
              </div>
            </div>

            {stats.topPerformingJobs.length > 0 && (
              <div className="report-section">
                <div className="section-header">
                  <h2>Top Performing Jobs</h2>
                  <button className="view-all-link">View All <i className="ri-arrow-right-line"></i></button>
                </div>
                <div className="jobs-grid">
                  {stats.topPerformingJobs.map((job, index) => (
                    <div key={index} className="job-performance-card">
                      <div className="job-rank">#{index + 1}</div>
                      <h3>{job.title}</h3>
                      <div className="job-metrics">
                        <div className="job-metric">
                          <i className="ri-file-list-line"></i>
                          <span>{job.applications} Applications</span>
                        </div>
                        <div className="job-metric">
                          <i className="ri-eye-line"></i>
                          <span>{job.views} Views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.recentActivity.length > 0 && (
              <div className="report-section">
                <div className="section-header">
                  <h2>Recent Activity</h2>
                </div>
                <div className="activity-timeline">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <i className={
                          activity.action.includes('Application') ? 'ri-file-list-line' :
                          activity.action.includes('Published') ? 'ri-checkbox-circle-line' :
                          'ri-user-star-line'
                        }></i>
                      </div>
                      <div className="activity-details">
                        <p className="activity-action">{activity.action}</p>
                        <p className="activity-job">{activity.job}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="report-section">
              <div className="section-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="quick-actions-grid">
                <div 
                  className="action-card"
                  onClick={() => window.location.href = '/recruiter/posted-jobs'}
                >
                  <div className="action-icon-wrapper blue">
                    <i className="ri-briefcase-line"></i>
                  </div>
                  <h3>Manage Jobs</h3>
                  <p>View and edit your job postings</p>
                </div>

                <div 
                  className="action-card"
                  onClick={() => window.location.href = '/recruiter/resume-database'}
                >
                  <div className="action-icon-wrapper green">
                    <i className="ri-user-search-line"></i>
                  </div>
                  <h3>Search Candidates</h3>
                  <p>Browse resume database</p>
                </div>

                <div 
                  className="action-card"
                  onClick={() => window.location.href = '/recruiter/post-job'}
                >
                  <div className="action-icon-wrapper orange">
                    <i className="ri-add-circle-line"></i>
                  </div>
                  <h3>Post New Job</h3>
                  <p>Create a new job listing</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;
