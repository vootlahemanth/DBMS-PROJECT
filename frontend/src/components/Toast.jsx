import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Toast() {
  const { toast, hideToast } = useData();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon success" />,
    error: <AlertCircle size={18} className="toast-icon error" />,
    warning: <AlertCircle size={18} className="toast-icon warning" />,
    info: <Info size={18} className="toast-icon info" />
  };

  return (
    <div className={`toast-container toast-${toast.type || 'info'}`}>
      <div className="toast-content">
        {icons[toast.type] || icons.info}
        <p>{toast.message}</p>
      </div>
      <button className="toast-close" onClick={hideToast} aria-label="Close">
        <X size={15} />
      </button>
    </div>
  );
}
