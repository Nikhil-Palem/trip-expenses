import React from 'react';
import { FaMoneyBillWave, FaPlane, FaLightbulb, FaMapMarkerAlt,FaArrowUp, FaArrowDown } from 'react-icons/fa';
import PieChartComponent from '../SubTasks/PieChartComponent';
import BarGraphComponent from '../SubTasks/BarGraphComponent';
import './Report.css';

// Hardcoded data
const trips = [
  { id: 1, destination: 'Goa', expenses: 2000, category: 'Accommodation' },
  { id: 2, destination: 'Delhi', expenses: 500, category: 'Food' },
  { id: 3, destination: 'Mumbai', expenses: 1200, category: 'Transport' },
  { id: 4, destination: 'Kerala', expenses: 800, category: 'Accommodation' },
  { id: 5, destination: 'Goa', expenses: 500, category: 'Entertainment' },
];

function Report() {
  const totalExpenses = trips.reduce((sum, trip) => sum + trip.expenses, 0);
  const avgExpensePerTrip = (totalExpenses / trips.length).toFixed(2);

  const barGraphData = trips.reduce((acc, item) => {
    const existingCategory = acc.find(entry => entry.category === item.category);
    if (existingCategory) {
      existingCategory.expenses += item.expenses;
    } else {
      acc.push({ category: item.category, expenses: item.expenses });
    }
    return acc;
  }, []);

  //here we are using bargraph data bcz duplicates are removed and we also need overall data total ex :accommodation 2800

  const pieGraphData = barGraphData.map(item => ({
    name: item.category,
    value: parseFloat(((item.expenses / totalExpenses) * 100).toFixed(2)),
    amount: parseFloat(item.expenses.toFixed(2)),
  }));

  console.log("pie", pieGraphData);

  const topExpense = trips.reduce((prev, curr) => (prev.expenses > curr.expenses ? prev : curr));

  const leastExpense = trips.reduce((prev, curr) => (prev.expenses <= curr.expenses ? prev : curr));

  const destinationCount = trips.reduce((acc, trip) => {
    acc[trip.destination] = (acc[trip.destination] || 0) + 1;
    return acc;
  }, {});

  const mostVisitedPlace = Object.keys(destinationCount).reduce((a, b) => destinationCount[a] > destinationCount[b] ? a : b);


  return (
    <div className='report-div'>
      <h1 className='boxTC'>Overall Report</h1>
      <div className='report'>
        <div className='report-card boxes'>
          <div className='h4-p'>
            <h4 className='boxTC'>
              <FaMoneyBillWave className='icon' /> Total Expenses :
            </h4>
            <p>₹{totalExpenses}</p>
          </div>
          <div className='h4-p'>
            <h4 className='boxTC'>
              <FaPlane className='icon' /> No Of Trips : 
            </h4>
            <p>{trips.length}</p>
          </div>
          <div className='h4-p'>
            <h4 className='boxTC'>
              <FaMoneyBillWave className='icon' /> Average Expense Per Trip :
            </h4>
            <p>₹{avgExpensePerTrip}</p>
          </div>
          <div className='h4-p'>
            <h4 className='boxTC'>
              <FaMapMarkerAlt className='icon' /> Top Expense :
            </h4>
            <p>You spent most on {topExpense.category} in a trip to {topExpense.destination}</p>
          </div>
          <div className='h4-p'>
            <h4 className='boxTC'>
              <FaLightbulb className='icon' /> Suggestions :
            </h4>
            <p>You tend to overspend on transport; consider using public transport next time.</p>
          </div>
          <div className="h4-p">
            <h4 className='boxTC'>Most Visited Place : </h4>
            <p>{mostVisitedPlace}</p>
          </div>
          <div className="h4-p">
            <h4 className='boxTC'><FaArrowUp className='icon'/>Most Expensive Trip : </h4>
            <p>{topExpense.destination}</p>
          </div>
          <div className='h4-p'>
            <h4 className='boxTC'><FaArrowDown className='icon'/>  Least Expensive Trip : </h4>
            <p>{leastExpense.destination}</p>
          </div>
        </div>
        <div className="graphs">
          <div className='pie_chart'>
            <h4>Overall Stats</h4>
            <PieChartComponent data={pieGraphData} />
          </div>
          <div className='linegraph'>
            <h4>Year Wise Spent</h4>
            <BarGraphComponent data={barGraphData} />
            <h4>Month Wise Spent</h4>
            <BarGraphComponent data={barGraphData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
