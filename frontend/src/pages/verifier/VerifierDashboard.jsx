import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, CheckCircle2, XCircle, ArrowRight, Building2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function VerifierDashboard() {
  const { organizers } = useData();

  const orgList = organizers || [];
  const pendingList = orgList.filter((o) => (o.verificationStatus || '').toUpperCase() === 'PENDING');
  const approvedList = orgList.filter((o) => (o.verificationStatus || '').toUpperCase() === 'APPROVED');
  const rejectedList = orgList.filter((o) => (o.verificationStatus || '').toUpperCase() === 'REJECTED');

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">COMPLIANCE PORTAL</div>
            <h1>Verifier Workspace</h1>
            <p>Review event organizer credentials, verify corporate documentation, and manage publishing rights.</p>
          </div>
        </div>

        <div className="stats-grid premium-metrics verifier-metrics">
          <div className="stat-card premium-stat-card">
            <div className="stat-topline">
              <span>Pending Reviews</span>
              <span className="metric-trend warning">Needs action</span>
            </div>
            <strong className="text-amber">{pendingList.length}</strong>
            <small>Requires compliance action</small>
          </div>
          <div className="stat-card premium-stat-card">
            <div className="stat-topline">
              <span>Approved Partners</span>
              <span className="metric-trend positive">Stable</span>
            </div>
            <strong className="text-green">{approvedList.length}</strong>
            <small>Active publishing organizers</small>
          </div>
          <div className="stat-card premium-stat-card">
            <div className="stat-topline">
              <span>Rejected</span>
              <span className="metric-trend danger">Review</span>
            </div>
            <strong className="text-red">{rejectedList.length}</strong>
            <small>Failed compliance check</small>
          </div>
          <div className="stat-card premium-stat-card">
            <div className="stat-topline">
              <span>Total Organizers</span>
              <span className="metric-trend neutral">Live</span>
            </div>
            <strong>{orgList.length}</strong>
            <small>Partner enterprises</small>
          </div>
        </div>

        <div className="dashboard-content premium-layout" style={{ marginTop: '36px' }}>
          <div className="dashboard-table-card enterprise-table-card">
            <div className="table-card-head">
              <div>
                <span className="section-kicker">Review queue</span>
                <h2>Pending Organizer Applications ({pendingList.length})</h2>
              </div>
              <Link className="text-link" to="/verifier/organizers">
                Open Full Queue <ArrowRight size={15} />
              </Link>
            </div>

            {pendingList.length > 0 ? (
              <div className="events-data-table">
                {pendingList.map((org) => {
                  const orgId = org.organizerId || org.id;
                  return (
                    <div className="table-data-row" key={orgId}>
                      <div className="verifier-avatar">
                        <Building2 size={20} />
                      </div>
                      <div className="table-event-info">
                        <strong>{org.organizationName || 'Event Enterprise'}</strong>
                        <span>
                          {org.registrationNumber || orgId} · {org.city || 'Hyderabad'}, {org.state || 'Telangana'}
                        </span>
                      </div>
                      <Link className="button button-primary btn-sm" to="/verifier/organizers">
                        Review Docs
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <CheckCircle2 size={36} className="text-green" />
                <h3>All caught up!</h3>
                <p>No organizer applications are currently pending verification.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
