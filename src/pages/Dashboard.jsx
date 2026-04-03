import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const api = axios.create({ baseURL: 'https://invoice-extraction-backend-pkx8.onrender.com/api' });

const Dashboard = () => {
  const [data, setData] = useState({
    totalInvoices: 0,
    spendByVendor: [],
    monthlySpend: [],
    currencyTotals: {},
    recentInvoices: []
  });

  useEffect(() => {
    api.get('/analytics').then(res => setData(res.data)).catch(console.error);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1>Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card glass">
          <span className="stat-label">Total Invoices Processed</span>
          <span className="stat-value">{data.totalInvoices}</span>
        </div>
        <div className="stat-card glass">
          <span className="stat-label">Total Spend (USD)</span>
          <span className="stat-value">
            ${data.currencyTotals?.USD?.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>

      <h2>Spend By Vendor</h2>
      <div className="chart-container glass">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.spendByVendor}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Recent Invoices</h2>
      <div className="table-container glass">
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentInvoices.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.vendorName}</td>
                <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td>{inv.totalAmount} {inv.currency}</td>
                <td><span className="badge">Processed</span></td>
              </tr>
            ))}
            {data.recentInvoices.length === 0 && (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No invoices found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Dashboard;
