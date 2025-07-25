import React from "react";
import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import LineChart from "components/charts/LineChart";

const barData = [
  { name: "Traditional", data: [30, 40, 50] },
  { name: "New Model", data: [60, 70, 80] },
];
const barOptions = {
  chart: { id: "access-bar" },
  xaxis: { categories: ["Rural", "Urban", "Total"] },
  title: { text: "Accessibility by Area" },
};

const pieSeries = [60, 40];
const pieOptions = {
  labels: ["Accessible", "Not Accessible"],
  title: { text: "Overall Accessibility" },
};

const lineSeries = [
  { name: "Accessibility %", data: [40, 45, 50, 55, 60] },
];
const lineOptions = {
  chart: { id: "access-time-series" },
  xaxis: { categories: ["2019", "2020", "2021", "2022", "2023"] },
  title: { text: "Accessibility Over Time" },
};

export default function AccessibilityReports() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Accessibility Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <h2 className="font-semibold mb-2">Accessibility by Area (Bar Chart)</h2>
          <div className="w-full h-64"><BarChart chartData={barData} chartOptions={barOptions} /></div>
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <h2 className="font-semibold mb-2">Overall Accessibility (Pie Chart)</h2>
          <div className="w-full h-64 flex items-center justify-center"><PieChart series={pieSeries} options={pieOptions} /></div>
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center md:col-span-2">
          <h2 className="font-semibold mb-2">Accessibility Over Time (Line Chart)</h2>
          <div className="w-full h-64"><LineChart series={lineSeries} options={lineOptions} /></div>
        </div>
      </div>
      <div className="mt-8 bg-gray-50 rounded p-4">
        <h2 className="font-semibold mb-2">Summary</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Accessibility has increased significantly with the new model.</li>
          <li>Rural and urban areas both show improvement, with rural areas benefiting the most.</li>
          <li>Overall accessibility is now at <span className="font-bold text-green-600">60%</span> compared to <span className="font-bold text-blue-600">30%</span> previously.</li>
        </ul>
      </div>
    </div>
  );
} 