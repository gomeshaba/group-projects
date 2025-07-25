import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2'; // Import Bar chart from Chart.js
import Widget from "components/widget/Widget"; // Ensure you have the Widget component imported
// import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const Dashboard = () => {
  const dummyData = {
    totalApplicants: 10000,
    totalAccepted: 7000,
    risks: {
      beforeModel: [70, 60, 50, 40, 30],
      afterModel: [20, 15, 10, 5, 0],
    },
    totalMoneyCredited: 5000000000,
    totalMoneyPaidBack: 2500000000,
    accessibility: {
      beforeModel: [30, 35, 42, 51, 64, 61],
      afterModel: [80, 82,84 , 84.5, 84.5, 85],
    },
  };

  const accessibilityBeforeData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
    datasets: [                       
      {
        label: 'Accessibility Before Model',
        data: dummyData.accessibility.beforeModel,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const riskBeforeData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
    datasets: [
      {
        label: 'Risk Before Model',
        data: dummyData.risks.beforeModel,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const accessibilityAfterData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
    datasets: [
      {
        label: 'Accessibility After Model',
        data: dummyData.accessibility.afterModel,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const riskAfterData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
    datasets: [
      {
        label: 'Risk After Model',
        data: dummyData.risks.afterModel,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div>
      {/* Admin-only banner */}
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
        <p className="font-bold">Admin Dashboard</p>
        <p>This dashboard is only visible to administrators...</p>
      </div>

      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Total Applicants"}
          subtitle={dummyData.totalApplicants.toString()}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Applicants Accepted"}
          subtitle={dummyData.totalAccepted.toString()}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Avg. Risk Level Before"}
          subtitle={Math.round(dummyData.risks.beforeModel.reduce((a, b) => a + b, 0) / dummyData.risks.beforeModel.length).toString()}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Total Credit"}
          subtitle={`MK${dummyData.totalMoneyCredited.toLocaleString()}`}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total Paid Back"}
          subtitle={`MK${dummyData.totalMoneyPaidBack.toLocaleString()}`}
        />
      </div>

      {/* Accessibility Impact Charts */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Accessibility Before Model</h2>
          <Bar data={accessibilityBeforeData} />
        </div>
        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Risk Before Model</h2>
          <Bar data={riskBeforeData} />
        </div>
        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Accessibility After Model</h2>
          <Bar data={accessibilityAfterData} />
        </div>
        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Risk After Model</h2>
          <Bar data={riskAfterData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
