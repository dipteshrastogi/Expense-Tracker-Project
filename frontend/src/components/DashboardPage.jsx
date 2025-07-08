// src/components/DashboardPage.jsx
import React, { useState } from 'react';

const DashboardPage = ({ expenses = [] }) => {
  const [expenseList, setExpenseList] = useState(Array.isArray(expenses) ? expenses.slice(-6).reverse() : []);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '', date: '' });

  const handleAddClick = () => {
    setShowNewRow(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleSave = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.category || !newExpense.date) return;
    setExpenseList([{ ...newExpense }, ...expenseList.slice(0, 5)]);
    setNewExpense({ name: '', amount: '', category: '', date: '' });
    setShowNewRow(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h1>
      <button
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={handleAddClick}
      >
        + Add New Expense
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b bg-yellow-50">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="name"
                    value={newExpense.name}
                    onChange={handleInputChange}
                    className="w-full border px-2 py-1 rounded"
                    placeholder="Enter name"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    name="amount"
                    value={newExpense.amount}
                    onChange={handleInputChange}
                    className="w-full border px-2 py-1 rounded"
                    placeholder="Enter amount"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="category"
                    value={newExpense.category}
                    onChange={handleInputChange}
                    className="w-full border px-2 py-1 rounded"
                    placeholder="Enter category"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="date"
                    name="date"
                    value={newExpense.date}
                    onChange={handleInputChange}
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </td>
              </tr>
            )}
            {expenseList.map((exp, index) => (
              <tr key={exp.id || index} className="border-b last:border-0">
                <td className="px-4 py-2 text-gray-800">{exp.name}</td>
                <td className="px-4 py-2 text-gray-800">₹{Number(exp.amount).toFixed(2)}</td>
                <td className="px-4 py-2 text-gray-800">{exp.category}</td>
                <td className="px-4 py-2 text-gray-800">{exp.date}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                  <button className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
