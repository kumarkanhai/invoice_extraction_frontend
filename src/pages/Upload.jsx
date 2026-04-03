import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, Loader, File as FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const api = axios.create({ baseURL: 'https://invoice-extraction-backend-pkx8.onrender.com/api' });

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.details || err.message);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <h1>Upload Invoice</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Upload JPG, PNG, or PDF invoices. Our AI will automatically extract and structure the data.
      </p>

      <div 
        className={`upload-container ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".jpg,.jpeg,.png,.pdf" 
          multiple={false} 
          onChange={handleChange} 
          style={{ display: 'none' }} 
        />
        <UploadCloud className="upload-icon" />
        <p style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.5rem' }}>
          Drag and drop your file here
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          or click to browse from your computer
        </p>
      </div>

      <AnimatePresence>
        {file && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              background: 'var(--bg-card)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <FileIcon style={{ color: 'var(--primary)' }} />
              <div>
                <p style={{ fontWeight: 600 }}>{file.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button className="btn" onClick={uploadFile} disabled={loading}>
              {loading ? <Loader className="spin" size={18} /> : 'Process File'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {(result || error) && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="glass"
          style={{ marginTop: '2rem', padding: '2rem' }}
        >
          {error ? (
            <div style={{ color: 'var(--error)' }}>
              <h3>Error Parsing Document</h3>
              <p>{error}</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '1.5rem' }}>
                <CheckCircle />
                <h3 style={{ margin: 0 }}>Extraction Successful</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vendor</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{result.vendorName}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Amount</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{result.totalAmount} {result.currency}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Invoice Number</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{result.invoiceNumber}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Confidence Score</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem', color: result.confidenceScore > 0.8 ? 'var(--success)' : 'orange' }}>
                    {(result.confidenceScore * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <h4>Line Items</h4>
              <div className="table-container" style={{ padding: 0, marginTop: '1rem' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.lineItems?.map((item, i) => (
                      <tr key={i}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unitPrice}</td>
                        <td>{item.total}</td>
                      </tr>
                    ))}
                    {(!result.lineItems || result.lineItems.length === 0) && (
                      <tr><td colSpan="4">No line items extracted.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};

export default Upload;
