import React from 'react';
import { Building2, ShieldCheck, Mail, Phone, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

export default function OrganizerProfile() {
  const { currentUser } = useAuth();
  const { organizers } = useData();

  const org =
    organizers.find((o) => o.userId === currentUser?.userId || o.email === currentUser?.email) ||
    organizers[0];

  return (
    <main className="dashboard-page">
      <div className="container narrow">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">CORPORATE PROFILE</div>
            <h1>Organizer Identity</h1>
            <p>Legal credentials and verified documentation filed with Universal Tickets.</p>
          </div>
          <StatusBadge status={org.verificationStatus} />
        </div>

        <div className="profile-form-card">
          <div className="legal-detail-grid">
            <div className="legal-item">
              <span>Organization Name</span>
              <strong>{org.organizationName}</strong>
            </div>

            <div className="legal-item">
              <span>Corporate Identification Number (CIN)</span>
              <strong>{org.registrationNumber}</strong>
            </div>

            <div className="legal-item">
              <span>Contact Executive</span>
              <strong>{org.contactPerson}</strong>
            </div>

            <div className="legal-item">
              <span>Official Email</span>
              <strong>{org.email}</strong>
            </div>

            <div className="legal-item">
              <span>Registered City & State</span>
              <strong>
                {org.city}, {org.state}
              </strong>
            </div>

            <div className="legal-item">
              <span>Verification Document</span>
              <a
                href={org.documentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                <FileText size={15} /> View CIN Registration Copy
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
