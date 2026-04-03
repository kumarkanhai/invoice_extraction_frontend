import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const api = axios.create({ baseURL: 'https://invoice-extraction-backend-pkx8.onrender.com/api' });

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/invoices')
      .then(res => setInvoices(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <h1>All Invoices</h1>
      
      <div className="table-container glass">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading invoices...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td style={{ fontWeight: 600 }}>{inv.vendorName}</td>
                  <td>{inv.invoiceNumber || '-'}</td>
                  <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                    {inv.totalAmount} {inv.currency}
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: inv.confidenceScore > 0.8 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: inv.confidenceScore > 0.8 ? 'var(--success)' : 'var(--error)'
                    }}>
                      {inv.confidenceScore > 0.8 ? 'High Confidence' : 'Review Needed'}
                    </span>
                  </td>
                  <td>
                    <a href={`http://localhost:5000${inv.fileUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                      <ExternalLink size={18} />
                    </a>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No invoices found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default Invoices;
