import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '~/charts/LineChart01';
import { chartAreaGradient } from '~/charts/ChartjsConfig';
import EditMenu from '~/components/DropdownEditMenu';

// Import utilities
import { tailwindConfig, hexToRGB } from '~/utils/Utils';
import { getNumberUserByDayForAdmin } from '~/apis/adminApis/manageApis';

function DashboardCard01() {
  const [chartData, setChartData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const response = await getNumberUserByDayForAdmin({ page });
      const userData = response.result;

      // Sort the data by date
      userData.sort((a, b) => new Date(a.day) - new Date(b.day));

      const labels = userData.map(item => {
        const date = new Date(item.day);
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      });

      let cumulativeUsers = 0;
      const cumulativeUserCounts = userData.map(item => {
        cumulativeUsers += item.numberUser;
        return cumulativeUsers;
      });

      setTotalUsers(cumulativeUsers);

      setChartData({
        labels: labels,
        datasets: [
          {
            data: cumulativeUserCounts,
            fill: true,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              return chartAreaGradient(ctx, chartArea, [
                { stop: 0, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.violet[500])}, 0)` },
                { stop: 1, color: `rgba(${hexToRGB(tailwindConfig().theme.colors.violet[500])}, 0.2)` }
              ]);
            },
            borderColor: tailwindConfig().theme.colors.violet[500],
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: tailwindConfig().theme.colors.violet[500],
            pointHoverBackgroundColor: tailwindConfig().theme.colors.violet[500],
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            clip: 20,
            tension: 0.2,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Users: ${context.parsed.y}`;
          },
          title: function (tooltipItems) {
            return tooltipItems[0].label;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">User Growth</h2>
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Option 1
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Option 2
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Total Users</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{totalUsers}</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {chartData && <LineChart data={chartData} width={389} height={128} options={chartOptions} />}
      </div>
      <div className="px-5 py-3">
        <button
          onClick={() => setCurrentPage(prevPage => prevPage + 1)}
          className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition-colors"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default DashboardCard01;