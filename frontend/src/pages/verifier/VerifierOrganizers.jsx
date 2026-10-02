import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, XCircle, FileText, Eye, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

const FALLBACK_DOC = 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80';

export default function VerifierOrganizers() {
  const { organizers, updateOrganizerStatus, fetchOrganizers } = useData();
  const [filterTab, setFilterTab] = useState('ALL');
  const [activeReviewOrg, setActiveReviewOrg] = useState(null);

  useEffect(() => {
    if (fetchOrganizers) {
      fetchOrganizers();
    }
  }, [fetchOrganizers]);

  const filtered = (organizers || []).filter((o) => {
    if (filterTab === 'ALL') return true;
    return (o.verificationStatus || '').toUpperCase() === filterTab;
  });

  const handleApprove = (orgId) => {
    updateOrganizerStatus(orgId, 'APPROVED');
    setActiveReviewOrg(null);
  };

  const handleReject = (orgId) => {
    updateOrganizerStatus(orgId, 'REJECTED');
    setActiveReviewOrg(null);
  };

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">COMPLIANCE QUEUE</div>
            <h1>Organizer Verifications</h1>
            <p>Inspect legal certificates, registered addresses, and verify event organizers.</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="booking-tabs">
          <button className={filterTab === 'ALL' ? 'active' : ''} onClick={() => setFilterTab('ALL')}>
            All ({organizers.length})
          </button>
          <button className={filterTab === 'PENDING' ? 'active' : ''} onClick={() => setFilterTab('PENDING')}>
            Pending ({organizers.filter((o) => o.verificationStatus === 'PENDING').length})
          </button>
          <button className={filterTab === 'APPROVED' ? 'active' : ''} onClick={() => setFilterTab('APPROVED')}>
            Approved ({organizers.filter((o) => o.verificationStatus === 'APPROVED').length})
          </button>
          <button className={filterTab === 'REJECTED' ? 'active' : ''} onClick={() => setFilterTab('REJECTED')}>
            Rejected ({organizers.filter((o) => o.verificationStatus === 'REJECTED').length})
          </button>
        </div>

        {/* Table of Applications */}
        <div className="bookings-table-wrapper">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Registration / ID</th>
                <th>Contact Person</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((org) => {
                const orgId = org.organizerId || org.id;
                return (
                  <tr key={orgId}>
                    <td>
                      <strong>{org.organizationName || 'Event Enterprise'}</strong>
                      <small>{org.organizationType || 'Event Management'}</small>
                    </td>
                    <td>
                      <code>{org.registrationNumber || orgId}</code>
                    </td>
                    <td>
                      <div>
                        <b>{org.contactPerson || 'Coordinator'}</b>
                        <small>{org.email}</small>
                      </div>
                    </td>
                    <td>
                      {org.city || 'Hyderabad'}, {org.state || 'Telangana'}
                    </td>
                    <td>
                      <StatusBadge status={org.verificationStatus || 'PENDING'} />
                    </td>
                    <td>
                      <button
                        className="button button-secondary btn-sm"
                        onClick={() => setActiveReviewOrg(org)}
                      >
                        <Eye size={14} /> Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Review Modal */}
      {activeReviewOrg && (
        <div className="modal-overlay">
          <div className="modal-card modal-lg">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <ShieldCheck size={22} className="text-teal" />
                <h3>Verify Organizer Application</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveReviewOrg(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="legal-detail-grid">
                <div className="legal-item">
                  <span>Organization Name</span>
                  <strong>{activeReviewOrg.organizationName}</strong>
                </div>

                <div className="legal-item">
                  <span>Registration Number</span>
                  <strong>{activeReviewOrg.registrationNumber || activeReviewOrg.organizerId}</strong>
                </div>

                <div className="legal-item">
                  <span>Contact Person</span>
                  <strong>{activeReviewOrg.contactPerson || 'Coordinator'}</strong>
                </div>

                <div className="legal-item">
                  <span>Registered Address</span>
                  <strong>{activeReviewOrg.address || 'Address on file'}, {activeReviewOrg.city || 'Hyderabad'}, {activeReviewOrg.state || 'Telangana'}</strong>
                </div>

                <div className="legal-item full-width">
                  <span>Attached Verification Document</span>
                  <div className="doc-preview-box">
                    <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                      Document: <strong>{activeReviewOrg.verificationDocument || 'Business Registration Certificate'}</strong>
                    </p>
                    <img
                      src={activeReviewOrg.documentUrl || FALLBACK_DOC}
                      alt="Document preview"
                      style={{ maxHeight: '180px', objectFit: 'cover', borderRadius: '6px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_DOC;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="button button-danger"
                onClick={() => handleReject(activeReviewOrg.organizerId || activeReviewOrg.id)}
              >
                <XCircle size={15} /> Reject Application
              </button>
              <button
                className="button button-primary"
                onClick={() => handleApprove(activeReviewOrg.organizerId || activeReviewOrg.id)}
              >
                <CheckCircle2 size={15} /> Approve Organizer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
