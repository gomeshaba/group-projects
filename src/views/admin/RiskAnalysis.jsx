import React from "react";
import BarChart from "components/charts/BarChart";
import LineChart from "components/charts/LineChart";
import PieChart from "components/charts/PieChart";

const barData = [{
  name: "Traditional Model",
  data: [80, 60, 40],
}, {
  name: "New Model",
  data: [90, 85, 70],
}];
const barOptions = {
  chart: { id: "risk-bar" },
  xaxis: { categories: ["Low Risk", "Medium Risk", "High Risk"] },
  title: { text: "Risk Distribution" },
};

const lineSeries = [
  { name: "Traditional Model", data: [60, 55, 50, 45, 40] },
  { name: "New Model", data: [60, 65, 70, 75, 80] },
];
const lineOptions = {
  chart: { id: "risk-time-series" },
  xaxis: { categories: ["2019", "2020", "2021", "2022", "2023"] },
  title: { text: "Risk Score Over Time" },
};

const pieSeries = [70, 30];
const pieOptions = {
  labels: ["Accessible", "Not Accessible"],
  title: { text: "Accessibility Balance (New Model)" },
};

export default function RiskAnalysis() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Risk & Accessibility Analysis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <h2 className="font-semibold mb-2">Risk Distribution (Bar Chart)</h2>
          <div className="w-full h-64"><BarChart chartData={barData} chartOptions={barOptions} /></div>
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <h2 className="font-semibold mb-2">Risk Over Time (Line Chart)</h2>
          <div className="w-full h-64"><LineChart series={lineSeries} options={lineOptions} /></div>
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center md:col-span-2">
          <h2 className="font-semibold mb-2">Accessibility Balance (Pie Chart)</h2>
          <div className="w-full h-64 flex items-center justify-center"><PieChart series={pieSeries} options={pieOptions} /></div>
        </div>
      </div>
      <div className="mt-8 bg-gray-50 rounded p-4">
        <h2 className="font-semibold mb-2">Key Metrics</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Increase in accessibility: <span className="font-bold text-green-600">+20%</span></li>
          <li>Reduction in risk: <span className="font-bold text-blue-600">-15%</span></li>
          <li>Approval rate (new model): <span className="font-bold">70%</span></li>
          <li>Approval rate (traditional): <span className="font-bold">40%</span></li>
        </ul>
      </div>
    </div>
  );
} 