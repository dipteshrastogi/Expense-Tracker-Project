// src/components/DashboardPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from "react-hot-toast";

// Loading Spinner Component
const LoadingSpinner = ({ size = "sm" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  
  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
  );
};

// Enhanced Button with Loading State
const LoadingButton = ({ 
  loading, 
  onClick, 
  className, 
  children, 
  disabled = false,
  loadingText = "Processing..."
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${className} ${loading || disabled ? 'opacity-70 cursor-not-allowed' : ''} transition-all duration-200 flex items-center gap-2`}
    >
      {loading && <LoadingSpinner size="sm" />}
      {loading ? loadingText : children}
    </button>
  );
};

const DraggableRow = ({ exp, index, moveRow, handleEdit, handleDelete, isDeleting }) => {
  const readableDate = new Date(exp.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
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
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));

  return (
    <tr
      ref={ref}
      className={`border-b last:border-0 bg-white transition-all duration-300 ${
        isDragging ? 'opacity-50' : ''
      } ${isDeleting ? 'animate-pulse bg-red-50' : ''}`}
    >
      <td className="px-4 py-2 text-gray-500 cursor-move">☰</td>
      <td className="px-4 py-2 text-gray-800">{exp.title}</td>
      <td className="px-4 py-2 text-gray-800">
        ₹{Number(exp.amount).toFixed(2)}
      </td>
      <td className="px-4 py-2 text-gray-800">{exp.category}</td>
      <td className="px-4 py-2 text-gray-800">{readableDate}</td>
      <td className="px-4 py-2 flex space-x-2">
        <button
          className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200"
          onClick={() => handleEdit(index)}
          disabled={isDeleting}
        >
          Edit
        </button>
        <LoadingButton
          loading={isDeleting}
          onClick={() => handleDelete(index)}
          className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          loadingText="Deleting..."
        >
          Delete
        </LoadingButton>
      </td>
    </tr>
  );
};

const DashboardPage = () => {
  const [expenseList, setExpenseList] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  
  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);

  const loadRecentExpenses = async () => {
    setIsLoadingExpenses(true);
    try {
      let response = await fetch("http://localhost:8000/api/expense/recent", {
        method: "GET",
        headers: {
          'content-Type': "application/json",
        },
        credentials: "include"
      });

      response = await response.json();
      setExpenseList(response.expenses);
    } catch (error) {
      toast.error("Error loading expenses");
    } finally {
      setIsLoadingExpenses(false);
    }
  }

  useEffect(() => {
    loadRecentExpenses();
  }, [refreshFlag])

  const triggerRefresh = () => setRefreshFlag(f => !f);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: '',
    date: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // Filter states
  const [frequency, setFrequency] = useState('LAST 1 Week');
  const [type, setType] = useState('ALL');
  const frequencyOptions = [
    'LAST 1 Week',
    'LAST 1 Month',
    'LAST 3 Months',
    'LAST 6 Months',
  ];
  const categories = Array.isArray(expenseList)
    ? expenseList.map(exp => exp.category)
    : [];

  const uniqueCategories = Array.from(new Set(categories));
  const typeOptions = ["ALL", ...uniqueCategories];

  const handleAddClick = () => {
    setShowNewRow(true);
    setEditingIndex(null);
    setNewExpense({ name: '', amount: '', category: '', date: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.category || !newExpense.date)
      return;

    setIsSaving(true);
    try {
      let response = await fetch("http://localhost:8000/api/expense/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newExpense.name,
          amount: newExpense.amount,
          categoryName: newExpense.category,
          date: newExpense.date
        }),
        credentials: "include"
      });

      response = await response.json();
      if (!response.success) {
        toast.error("Error adding expense");
      } else {
        triggerRefresh();
        toast.success('Expense Added Successfully');
        setShowNewRow(false);
        setNewExpense({ name: '', amount: '', category: '', date: '' });
      }
    } catch (error) {
      toast.error("Error adding expense");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setNewExpense(expenseList[idx]);
    setShowNewRow(false);
  };

  const handleDelete = async (idx) => {
    setDeletingIndex(idx);
    try {
      let response = await fetch("http://localhost:8000/api/expense/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: expenseList[idx].id
        }),
        credentials: "include"
      });

      response = await response.json();
      if (!response.success) {
        toast.error("Error deleting expense");
      } else {
        triggerRefresh();
        toast.success('Expense Deleted Successfully');
      }
    } catch (error) {
      toast.error("Error deleting expense");
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleUpdate = async (idx) => {
    setIsUpdating(true);
    try {
      let response = await fetch("http://localhost:8000/api/expense/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: expenseList[idx].id,
          title: newExpense.name,
          amount: newExpense.amount,
          categoryName: newExpense.category,
          date: newExpense.date
        }),
        credentials: "include"
      });

      response = await response.json();
      if (!response.success) {
        toast.error("Error updating expense");
      } else {
        triggerRefresh();
        toast.success('Expense Updated Successfully');
        setEditingIndex(null);
        setNewExpense({ name: '', amount: '', category: '', date: '' });
      }
    } catch (error) {
      toast.error("Error updating expense");
    } finally {
      setIsUpdating(false);
    }
  };

  const moveRow = (from, to) => {
    setExpenseList((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <Link
            to="/analysis"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
          >
            View Analysis
          </Link>
        </div>

        {/* Filter Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex flex-wrap gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-40 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 transition-colors duration-200"
            >
              {frequencyOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-40 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300 transition-colors duration-200"
            >
              {typeOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <button
            className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-200"
            onClick={handleAddClick}
          >
            + Add New Expense
          </button>
        </div>

        {/* Loading State for Expenses */}
        {isLoadingExpenses && (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="lg" />
            <span className="ml-2 text-gray-600">Loading expenses...</span>
          </div>
        )}

        {/* Expenses Table */}
        {!isLoadingExpenses && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* New/Edit Row */}
                {(showNewRow || editingIndex !== null) && (
                  <tr className="border-b bg-yellow-50 animate-fadeIn">
                    <td></td>
                    {['name', 'amount', 'category', 'date'].map((field) => (
                      <td key={field} className="px-4 py-2">
                        <input
                          type={field === 'amount' ? 'number' : field === 'date' ? 'date' : 'text'}
                          name={field}
                          value={newExpense[field]}
                          onChange={handleInputChange}
                          className="w-full border-gray-300 rounded-md px-2 py-1 focus:ring focus:ring-indigo-200 focus:border-indigo-300 transition-colors duration-200"
                          placeholder={`Enter ${field}`}
                          disabled={isSaving || isUpdating}
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2 space-x-2">
                      {editingIndex !== null ? (
                        <LoadingButton
                          loading={isUpdating}
                          onClick={() => handleUpdate(editingIndex)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          loadingText="Updating..."
                        >
                          Update
                        </LoadingButton>
                      ) : (
                        <LoadingButton
                          loading={isSaving}
                          onClick={handleSave}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          loadingText="Saving..."
                        >
                          Save
                        </LoadingButton>
                      )}
                    </td>
                  </tr>
                )}

                {/* Draggable Rows */}
                {expenseList && expenseList.map((exp, idx) => (
                  <DraggableRow
                    key={exp.id ?? idx}
                    exp={exp}
                    index={idx}
                    moveRow={moveRow}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    isDeleting={deletingIndex === idx}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </DndProvider>
  );
};

export default DashboardPage;