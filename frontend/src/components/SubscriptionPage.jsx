// src/components/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SubscriptionPage = ({ subscriptions = [], onCharge }) => {
  const [subs, setSubs] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', amount: '', interval: 'monthly', nextChargeDate: '', category: '' });

  useEffect(() => {
    // initialize local subscriptions once
    setSubs(subscriptions);
  }, []);


  // Automatic charge processing
  useEffect(() => {
    const today = new Date().toISOString().slice(0,10);
    subs.forEach(sub => {
      if(sub.isActive && sub.nextChargeDate <= today) {
        onCharge && onCharge(sub);
        // bump nextChargeDate
        const next = new Date(sub.nextChargeDate);
        if(sub.interval === 'monthly') next.setMonth(next.getMonth()+1);
        else next.setFullYear(next.getFullYear()+1);
        updateSub({ ...sub, nextChargeDate: next.toISOString().slice(0,10) });
      }
    });
  }, [subs]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => setForm({ id: null, name: '', amount: '', interval: 'monthly', nextChargeDate: '', category: '' });

  const addSub = sub => {
    setSubs(prev => [...prev, sub]);
  };

  const updateSub = sub => {
    setSubs(prev => prev.map(s => s.id === sub.id ? sub : s));
  };

  const removeSub = id => {
    setSubs(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { name, amount, interval, nextChargeDate, category } = form;
    if(!name || !amount || !nextChargeDate) return;
    const payload = {
      id: form.id || uuidv4(),
      name,
      amount: parseFloat(amount),
      interval,
      nextChargeDate,
      category,
      isActive: true,
    };
    if(form.id) updateSub(payload);
    else addSub(payload);
    resetForm();
  };

  const startEdit = sub => setForm(sub);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Subscription</h2>
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Service name" className="border rounded px-3 py-2" />
        <div className="flex">
          <span className="inline-flex items-center px-3 bg-gray-200 rounded-l">₹</span>
          <input name="amount" value={form.amount} onChange={handleChange} required type="number" placeholder="Amount" className="border-t border-b border-r rounded-r px-3 py-2 flex-1" />
        </div>
        <select name="interval" value={form.interval} onChange={handleChange} className="border rounded px-3 py-2">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input name="nextChargeDate" type="date" value={form.nextChargeDate} onChange={handleChange} required className="border rounded px-3 py-2" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border rounded px-3 py-2" />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          {form.id ? 'Update Subscription' : 'Add Subscription'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-4">My Subscriptions</h2>
      <ul className="space-y-4">
        {subs.map(sub => (
          <li key={sub.id} className="flex justify-between items-center border rounded px-4 py-2">
            <div>
              <h3 className="font-medium">{sub.name}</h3>
              <p className="text-sm text-gray-600">
                ₹{sub.amount} / {sub.interval}, Next: {sub.nextChargeDate}
              </p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => startEdit(sub)} className="text-blue-500 hover:underline text-sm">Edit</button>
              <button onClick={() => removeSub(sub.id)} className="text-red-500 hover:underline text-sm">Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionPage;
