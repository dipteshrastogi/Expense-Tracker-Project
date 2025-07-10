import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// Helper to format month-year key
const formatMonthYear = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleString("default", { month: "long", year: "numeric" });
};

const HistoryPage = () => {
  const [history, setHistory] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [months, setMonths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8000/api/expense/recentmonthsExpense", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ expenses }) => {
        // Group by month and category
        const grouped = {};
        expenses.forEach(({ title, amount, category, timestamp }) => {
          const monthKey = formatMonthYear(timestamp);
          if (!grouped[monthKey]) grouped[monthKey] = {};
          if (!grouped[monthKey][category]) grouped[monthKey][category] = [];
          grouped[monthKey][category].push({ item: title, amount });
        });
        setHistory(grouped);
        const monthKeys = Object.keys(grouped);
        setMonths(monthKeys);
        setSelectedMonth(monthKeys[0] || "");
        setIsLoading(false);
      });
  }, []);

  const toggleCategory = (month, category) => {
    const key = `${month}-${category}`;
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getMonthChartData = (monthData) => {
    const labels = Object.keys(monthData);
    const values = labels.map((cat) =>
      monthData[cat].reduce((sum, item) => sum + item.amount, 0)
    );
    return {
      labels,
      datasets: [
        {
          label: "Expenditure by Category",
          data: values,
          backgroundColor: [
            "rgba(96, 165, 250, 0.8)",
            "rgba(52, 211, 153, 0.8)",
            "rgba(251, 191, 36, 0.8)",
            "rgba(248, 113, 113, 0.8)",
            "rgba(167, 139, 250, 0.8)",
            "rgba(244, 114, 182, 0.8)",
            "rgba(251, 146, 60, 0.8)",
            "rgba(6, 182, 212, 0.8)",
          ],
          borderColor: [
            "rgba(96, 165, 250, 1)",
            "rgba(52, 211, 153, 1)",
            "rgba(251, 191, 36, 1)",
            "rgba(248, 113, 113, 1)",
            "rgba(167, 139, 250, 1)",
            "rgba(244, 114, 182, 1)",
            "rgba(251, 146, 60, 1)",
            "rgba(6, 182, 212, 1)",
          ],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  };

  const getLineChartData = () => {
    const labels = Object.keys(history);
    const categories = new Set();
    labels.forEach((month) => {
      Object.keys(history[month]).forEach((cat) => categories.add(cat));
    });
    
    const colors = [
      "rgba(96, 165, 250, 1)",
      "rgba(52, 211, 153, 1)",
      "rgba(251, 191, 36, 1)",
      "rgba(248, 113, 113, 1)",
      "rgba(167, 139, 250, 1)",
      "rgba(244, 114, 182, 1)",
      "rgba(251, 146, 60, 1)",
      "rgba(6, 182, 212, 1)",
    ];
    
    const datasets = Array.from(categories).map((cat, index) => ({
      label: cat,
      data: labels.map((month) =>
        (history[month][cat] || []).reduce((acc, e) => acc + e.amount, 0)
      ),
      fill: false,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.4,
      pointBackgroundColor: colors[index % colors.length],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }));
    return { labels, datasets };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto mt-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              <span className="ml-4 text-lg font-medium text-gray-700">Loading your expense history...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto mt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Expense History
          </h2>
          <p className="text-gray-600 text-lg">Track your spending patterns and insights</p>
        </div>

        {/* Month Selection */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-4"></div>
              <label className="text-xl font-bold text-gray-800">Select Month:</label>
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200 px-6 py-3 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Month Details */}
        {selectedMonth && history[selectedMonth] && (
          <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full mr-4"></div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedMonth}</h3>
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <span className="text-lg font-bold">
                    Total: ₹{Object.values(history[selectedMonth])
                      .flat()
                      .reduce((acc, e) => acc + e.amount, 0)}
                  </span>
                </div>
              </div>
              
              {/* Monthly Comparison Chart */}
              {Object.keys(history).length > 0 && (
                <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                    <h4 className="text-lg font-bold text-gray-700">
                      {Object.keys(history).length > 1 ? 'Monthly Comparison Trend' : 'Category Trend Analysis'}
                    </h4>
                  </div>
                  <div className="h-80">
                    <Line 
                      data={getLineChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                            labels: {
                              usePointStyle: true,
                              padding: 20,
                              font: {
                                size: 12,
                                weight: 'bold'
                              }
                            }
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: 1,
                            cornerRadius: 8,
                          }
                        },
                        scales: {
                          x: {
                            grid: {
                              display: false
                            },
                            ticks: {
                              font: {
                                weight: 'bold'
                              }
                            }
                          },
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                              font: {
                                weight: 'bold'
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Pie Chart */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl shadow-inner">
                  <h4 className="text-lg font-bold text-gray-700 mb-4 text-center">Category Distribution</h4>
                  <div className="h-64">
                    <Pie 
                      data={getMonthChartData(history[selectedMonth])} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              usePointStyle: true,
                              padding: 15,
                              font: {
                                size: 11,
                                weight: 'bold'
                              }
                            }
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: 1,
                            cornerRadius: 8,
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Bar Chart */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl shadow-inner">
                  <h4 className="text-lg font-bold text-gray-700 mb-4 text-center">Category Amounts</h4>
                  <div className="h-64">
                    <Bar 
                      data={getMonthChartData(history[selectedMonth])} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: 1,
                            cornerRadius: 8,
                          }
                        },
                        scales: {
                          x: {
                            grid: {
                              display: false
                            },
                            ticks: {
                              font: {
                                weight: 'bold'
                              }
                            }
                          },
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                              font: {
                                weight: 'bold'
                              }
                            }
                          },
                        },
                      }} 
                    />
                  </div>
                </div>
              </div>

              {/* Category Details */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Category Breakdown</h4>
                {Object.entries(history[selectedMonth]).map(
                  ([category, expenses]) => {
                    const key = `${selectedMonth}-${category}`;
                    const categoryTotal = expenses.reduce(
                      (acc, item) => acc + item.amount,
                      0
                    );
                    return (
                      <div
                        key={category}
                        className="bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                            <h4 className="text-lg font-bold text-gray-800">
                              {category}
                            </h4>
                            <span className="ml-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                              ₹{categoryTotal}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleCategory(selectedMonth, category)}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            {expandedCategories[key]
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                        </div>
                        {expandedCategories[key] && (
                          <div className="mt-6 animate-fadeIn">
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                              <div className="space-y-3">
                                {expenses.map((e, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center p-3 bg-white/70 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
                                  >
                                    <span className="font-medium text-gray-700">{e.item}</span>
                                    <span className="font-bold text-indigo-600">₹{e.amount}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
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
    </div>
  );
};

export default HistoryPage;