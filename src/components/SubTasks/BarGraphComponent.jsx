
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, Cell } from 'recharts';
import './BarGraphComponent.css'; 

const COLORS = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FFA07A', '#20B2AA', '#87CEFA', '#778899', '#FFA500'];

function BarGraphComponent({ data }) {
  
  return (
    <div className="bar-graph-container">
      <BarChart
        width={600}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis>
          <Label value="Money" angle={-90} position="insideLeft"/>
        </YAxis>
        <Tooltip
        cursor={{ fill: 'transparent' }}
      />
        <Legend />
        <Bar
          dataKey="expenses"
          cursor="pointer"
          isAnimationActive={true}
          animationDuration={1500}
          barSize={40}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none"/>
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}

export default BarGraphComponent;
