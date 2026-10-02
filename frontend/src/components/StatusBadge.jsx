import React from 'react';
import { CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const normalized = (status || '').toUpperCase();

  switch (normalized) {
    case 'CONFIRMED':
    case 'APPROVED':
    case 'PAID':
    case 'AVAILABLE':
      return (
        <span className={`status-badge badge-success badge-${size}`}>
          <CheckCircle2 size={12} />
          <span>{normalized}</span>
        </span>
      );

    case 'PENDING':
    case 'UPCOMING':
    case 'ONLY 4 LEFT':
      return (
        <span className={`status-badge badge-warning badge-${size}`}>
          <Clock size={12} />
          <span>{normalized}</span>
        </span>
      );

    case 'CANCELLED':
    case 'REJECTED':
    case 'FAILED':
    case 'SOLD OUT':
      return (
        <span className={`status-badge badge-danger badge-${size}`}>
          <XCircle size={12} />
          <span>{normalized}</span>
        </span>
      );

    case 'COMPLETED':
      return (
        <span className={`status-badge badge-neutral badge-${size}`}>
          <ShieldCheck size={12} />
          <span>{normalized}</span>
        </span>
      );

    default:
      return (
        <span className={`status-badge badge-neutral badge-${size}`}>
          <span>{normalized}</span>
        </span>
      );
  }
}
