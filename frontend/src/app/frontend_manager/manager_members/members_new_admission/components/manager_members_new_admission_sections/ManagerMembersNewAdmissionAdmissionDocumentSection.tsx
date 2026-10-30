'use client';
// RESPONSIBILITY: Render the student KYC and document upload section during admission. It does not own backend persistence or cross-feature business logic.

import { useState } from 'react';
import { FileText, Upload, CheckCircle2 } from 'lucide-react';

export function ManagerMembersNewAdmissionAdmissionDocumentSection() {
  const [docType, setDocType] = useState('Aadhaar Card');
  const [docNumber, setDocNumber] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  return (
    <section className="mgr-card" aria-labelledby="manager-students-admission-documents">
      <div className="mgr-card-header">
        <div className="mgr-section-number">03</div>
        <h2 id="manager-students-admission-documents" className="mgr-section-title">KYC & Document Upload</h2>
      </div>
      <div className="mgr-card-body">
        <div className="mgr-form-grid">
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-doc-type">Document Type</label>
            <div className="mgr-input-icon-wrap">
              <FileText size={18} strokeWidth={2} className="mgr-input-icon" />
              <select
                id="admission-doc-type"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="mgr-select mgr-input-with-icon"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="College / University ID">College / University ID</option>
                <option value="Driving License">Driving License</option>
                <option value="Passport">Passport</option>
                <option value="Student Photo">Student Photo</option>
              </select>
            </div>
          </div>

          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-doc-number">Document Number / ID</label>
            <input
              id="admission-doc-number"
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="e.g. 5489 1234 5678"
              className="mgr-input"
            />
          </div>

          <div className="mgr-form-field mgr-form-field-full">
            <label className="mgr-label" htmlFor="admission-doc-file">Upload Document File (PDF / JPG / PNG)</label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="admission-doc-file"
                className="mgr-btn-ghost cursor-pointer flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-card"
              >
                <Upload size={16} />
                <span>Choose File</span>
              </label>
              <input
                id="admission-doc-file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="sr-only"
              />
              {selectedFileName ? (
                <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                  <CheckCircle2 size={14} /> {selectedFileName}
                </span>
              ) : (
                <span className="text-xs text-secondary">No file selected (Optional during initial draft)</span>
              )}
            </div>
            <p className="text-xs text-secondary mt-1">Uploaded document will be accessible in student profile and Document Vault.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

