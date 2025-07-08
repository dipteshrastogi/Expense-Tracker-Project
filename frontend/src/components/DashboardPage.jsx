// src/components/DashboardPage.jsx
import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableRow = ({ exp, index, moveRow, handleEdit, handleDelete }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'row',
    hover(item) {
      if (item.index !== index) {
        moveRow(item.index, index);
        item.index = index;
      }
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'row',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  return (
    <tr
      ref={ref}
      className={`border-b last:border-0 ${isDragging ? 'opacity-50' : ''}`}
    >
      <td className="px-4 py-2 text-gray-500 cursor-move">☰</td>
      <td className="px-4 py-2 text-gray-800">{exp.name}</td>
      <td className="px-4 py-2 text-gray-800">₹{Number(exp.amount).toFixed(2)}</td>
      <td className="px-4 py-2 text-gray-800">{exp.category}</td>
      <td className="px-4 py-2 text-gray-800">{exp.date}</td>
      <td className="px-4 py-2 flex space-x-2">
        <button
          className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => handleEdit(index)}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => handleDelete(index)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const DashboardPage = ({ expenses = [] }) => {
  const [expenseList, setExpenseList] = useState(Array.isArray(expenses) ? expenses.slice(-6).reverse() : []);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '', date: '' });
  const [editingIndex, setEditingIndex] = useState(null);

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

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewExpense(expenseList[index]);
    setShowNewRow(false);
  };

  const handleDelete = (index) => {
    const updatedList = [...expenseList];
    updatedList.splice(index, 1);
    setExpenseList(updatedList);
  };

  const handleUpdate = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.category || !newExpense.date) return;
    const updatedList = [...expenseList];
    updatedList[editingIndex] = newExpense;
    setExpenseList(updatedList);
    setNewExpense({ name: '', amount: '', category: '', date: '' });
    setEditingIndex(null);
  };

  const moveRow = (from, to) => {
    const updatedList = [...expenseList];
    const [moved] = updatedList.splice(from, 1);
    updatedList.splice(to, 0, moved);
    setExpenseList(updatedList);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => alert('History feature coming soon!')}
          >
            View History
          </button>
        </div>
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
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(showNewRow || editingIndex !== null) && (
                <tr className="border-b bg-yellow-50">
                  <td className="px-4 py-2"></td>
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
                    {editingIndex !== null ? (
                      <button
                        onClick={handleUpdate}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        onClick={handleSave}
                        className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {expenseList.map((exp, index) => (
                <DraggableRow
                  key={exp.id || index}
                  exp={exp}
                  index={index}
                  moveRow={moveRow}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DndProvider>
  );
};

export default DashboardPage;
