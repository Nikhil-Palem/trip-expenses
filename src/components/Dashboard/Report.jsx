import React, { useEffect, useState, useContext } from 'react';
import { FaMoneyBillWave, FaPlane, FaLightbulb, FaMapMarkerAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import PieChartComponent from '../SubTasks/PieChartComponent';
import BarGraphComponent from '../SubTasks/BarGraphComponent';
import './Report.css';
import axios from 'axios';
import { RecoveryContext } from '../../App';
import TripsLoading from '../../images/trips-loading-animation.json';
import Lottie from "lottie-react";

function Report() {
  const { User_Id, BackendUrl } = useContext(RecoveryContext);
  const [trips, setTrips] = useState([]);
  const [countTrips, setcountTrips] = useState(0);
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const fetchAllExpenses = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${BackendUrl}/getAllExpenses`, {
        params: {
          user_id: User_Id,
        }
      });
      const BackendData = resp.data.success;
      setcountTrips(BackendData.length);
      const newTrips = [];
      console.log("Data", BackendData);
      BackendData.forEach((data) => {
        if (data.TripObj == null && data != null) {
          newTrips.push({
            destination: data.place_name,
            expenses: '0',
            category: 'None'
          });
        }
        data.TripObj?.forEach((trip) => {
          newTrips.push({
            destination: data.place_name,
            expenses: trip?.amount,
            category: trip?.category
          });
        });
      });
      setTrips(newTrips);
      console.log("new trips", newTrips);
      console.log(BackendData);
    } catch (err) {
      console.log("this is report error", err);
    } finally {
      setLoading(false);
    }
  };

  if (trips.length > 0) {
    const totalExpenses = trips.reduce((sum, trip) => sum + parseFloat(trip.expenses), 0);
    const avgExpensePerTrip = (totalExpenses / trips.length).toFixed(2);

    const barGraphData = trips.reduce((acc, item) => {
      const existingCategory = acc.find(entry => entry.category === item.category);
      if (existingCategory) {
        existingCategory.expenses += parseFloat(item.expenses);
      } else {
        acc.push({ category: item.category, expenses: parseFloat(item.expenses) });
      }
      return acc;
    }, []);

    const pieGraphData = barGraphData.map(item => ({
      name: item.category,
      value: parseFloat(((item.expenses / totalExpenses) * 100).toFixed(2)),
      amount: parseFloat(item.expenses.toFixed(2)),
    }));

    const topExpense = trips.reduce((prev, curr) => (parseFloat(prev.expenses) > parseFloat(curr.expenses) ? prev : curr), {});

    const leastExpense = trips.reduce((prev, curr) => (parseFloat(prev.expenses) <= parseFloat(curr.expenses) ? prev : curr), {});

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
              <p>{countTrips}</p>
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
              <h4 className='boxTC'><FaArrowUp className='icon' />Most Expensive Trip : </h4>
              <p>{topExpense.destination}</p>
            </div>
            <div className='h4-p'>
              <h4 className='boxTC'><FaArrowDown className='icon' />  Least Expensive Trip : </h4>
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
  } else {
    return (
      <div className="report-div">
        <h1 className='boxTC'>Overall Report</h1>
        {Loading && <div className="main-loader">
          <Lottie animationData={TripsLoading} loop={true} style={{ height: "100px" }} />
        </div>}
        {!Loading && <p>no data exists...</p>}
      </div>)
  }
}

export default Report;