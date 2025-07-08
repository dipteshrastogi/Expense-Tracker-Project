// src/components/DashboardPage.jsx
import React from 'react';
import '../index.css';

const DashboardPage = ({ expenses = [] }) => {
  const recent = Array.isArray(expenses) ? expenses.slice(-6).reverse() : [];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h1>
      <button className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
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
            {recent.map((exp, index) => (
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
