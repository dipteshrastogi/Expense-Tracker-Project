// src/components/HistoryPage.jsx

// WITH DUMMY DATA
// src/components/HistoryPage.jsx
import React, { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const dummyHistory = {
  "July 2025": {
    Food: [
      { item: "Groceries", amount: 1500 },
      { item: "Dining Out", amount: 1200 },
    ],
    Transport: [
      { item: "Metro Card", amount: 500 },
      { item: "Cab", amount: 700 },
    ],
    Entertainment: [
      { item: "Netflix", amount: 800 },
      { item: "Movies", amount: 400 },
    ],
  },
  "June 2025": {
    Food: [
      { item: "Vegetables", amount: 1000 },
      { item: "Snacks", amount: 800 },
    ],
    Transport: [{ item: "Bus Pass", amount: 300 }],
    Health: [{ item: "Pharmacy", amount: 600 }],
  },
  "May 2025": {
    Food: [{ item: "Groceries", amount: 1200 }],
    Utilities: [
      { item: "Electricity Bill", amount: 900 },
      { item: "Water Bill", amount: 300 },
    ],
  },
};

const HistoryPage = () => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (month, category) => {
    const key = `${month}-${category}`;
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const buildChartData = (monthData) => {
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
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderRadius: 6,
        },
      ],
    };
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Expense History</h2>
      {Object.entries(dummyHistory).map(([month, categories]) => {
        const total = Object.values(categories)
          .flat()
          .reduce((sum, e) => sum + e.amount, 0);

        return (
          <div key={month} className="mb-10">
            <h3 className="text-xl font-semibold mb-2">
              {month} - Total: ₹{total}
            </h3>
            <div className="h-64 mb-4">
              <Bar data={buildChartData(categories)} />
            </div>
            {Object.entries(categories).map(([category, expenses]) => {
              const categoryKey = `${month}-${category}`;
              const categoryTotal = expenses.reduce(
                (acc, item) => acc + item.amount,
                0
              );

              return (
                <div
                  key={category}
                  className="mb-3 border rounded px-4 py-2 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700">
                      {category} - ₹{categoryTotal}
                    </h4>
                    <button
                      onClick={() => toggleCategory(month, category)}
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      {expandedCategories[categoryKey]
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>
                  {expandedCategories[categoryKey] && (
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      {expenses.map((e, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between border-b py-1"
                        >
                          <span>{e.item}</span>
                          <span>₹{e.amount}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default HistoryPage;


// WITH API DATA

// import React, { useEffect, useState } from "react";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Pie, Line } from "react-chartjs-2";

// ChartJS.register(
//   ArcElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// );

// const HistoryPage = () => {
//   const [history, setHistory] = useState({});
//   const [expandedCategories, setExpandedCategories] = useState({});
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [months, setMonths] = useState([]);

//   useEffect(() => {
//     fetch("/api/expense-history")
//       .then((res) => res.json())
//       .then((data) => {
//         setHistory(data);
//         setMonths(Object.keys(data));
//         setSelectedMonth(Object.keys(data)[0] || "");
//       });
//   }, []);

//   const toggleCategory = (month, category) => {
//     const key = `${month}-${category}`;
//     setExpandedCategories((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const getMonthChartData = (monthData) => {
//     const labels = Object.keys(monthData);
//     const values = labels.map((cat) =>
//       monthData[cat].reduce((sum, item) => sum + item.amount, 0)
//     );

//     return {
//       labels,
//       datasets: [
//         {
//           label: "Spending by Category",
//           data: values,
//           backgroundColor: [
//             "#60A5FA",
//             "#34D399",
//             "#FBBF24",
//             "#F87171",
//             "#A78BFA",
//             "#F472B6",
//           ],
//         },
//       ],
//     };
//   };

//   const getLineChartData = () => {
//     const labels = Object.keys(history);
//     const categories = new Set();

//     labels.forEach((month) => {
//       Object.keys(history[month]).forEach((cat) => categories.add(cat));
//     });

//     const datasets = Array.from(categories).map((cat) => {
//       return {
//         label: cat,
//         data: labels.map((month) => {
//           const catItems = history[month][cat];
//           return catItems ? catItems.reduce((acc, e) => acc + e.amount, 0) : 0;
//         }),
//         fill: false,
//         borderColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
//         tension: 0.3,
//       };
//     });

//     return {
//       labels,
//       datasets,
//     };
//   };

//   return (
//     <div className="max-w-6xl mx-auto mt-8 p-4 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-6 text-center">Expense History</h2>

//       {Object.keys(history).length > 0 && (
//         <div className="mb-10">
//           <h3 className="text-xl font-semibold mb-2">Monthly Comparison (Line Chart)</h3>
//           <div className="h-80 bg-gray-50 rounded p-4">
//             <Line data={getLineChartData()} />
//           </div>
//         </div>
//       )}

//       <div className="mb-6">
//         <label className="font-medium mr-2">Select Month:</label>
//         <select
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="border px-3 py-1 rounded"
//         >
//           {months.map((m) => (
//             <option key={m} value={m}>
//               {m}
//             </option>
//           ))}
//         </select>
//       </div>

//       {selectedMonth && history[selectedMonth] && (
//         <div className="mb-8">
//           <h3 className="text-xl font-semibold mb-2">
//             {selectedMonth} - Total: ₹
//             {Object.values(history[selectedMonth])
//               .flat()
//               .reduce((acc, e) => acc + e.amount, 0)}
//           </h3>
//           <div className="h-64 mb-4">
//             <Pie data={getMonthChartData(history[selectedMonth])} />
//           </div>

//           {Object.entries(history[selectedMonth]).map(
//             ([category, expenses]) => {
//               const key = `${selectedMonth}-${category}`;
//               const categoryTotal = expenses.reduce(
//                 (acc, item) => acc + item.amount,
//                 0
//               );
//               return (
//                 <div
//                   key={category}
//                   className="mb-3 border rounded px-4 py-2 bg-gray-50"
//                 >
//                   <div className="flex justify-between items-center">
//                     <h4 className="font-medium text-gray-700">
//                       {category} - ₹{categoryTotal}
//                     </h4>
//                     <button
//                       onClick={() => toggleCategory(selectedMonth, category)}
//                       className="text-indigo-600 hover:underline text-sm"
//                     >
//                       {expandedCategories[key]
//                         ? "Hide Details"
//                         : "View Details"}
//                     </button>
//                   </div>
//                   {expandedCategories[key] && (
//                     <ul className="mt-2 text-sm text-gray-600 space-y-1">
//                       {expenses.map((e, idx) => (
//                         <li
//                           key={idx}
//                           className="flex justify-between border-b py-1"
//                         >
//                           <span>{e.item}</span>
//                           <span>₹{e.amount}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               );
//             }
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistoryPage;
