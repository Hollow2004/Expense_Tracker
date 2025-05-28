import React from "react";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material"; // Import Typography for the heading
import { scaleBand } from "@devexpress/dx-chart-core";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import {
  Animation,
  ArgumentScale,
  EventTracker,
} from "@devexpress/dx-react-chart";
import dayjs from "dayjs";

export default function TransactionIncomeChart({ data }) {
  console.log("Incoming Data to Income Chart:", data);

  // Map the data to prepare it for the chart
  const chartData = (data || []).map((item) => ({
    month: dayjs().month(item._id - 1).format("MMMM"), // Convert _id to month name
    totalIncome: item.totalIncome, // Use totalIncome for y-axis value
  }));

  // Calculate total earnings
  const totalIncome = chartData.reduce((acc, item) => acc + item.totalIncome, 0);

  // Return a message if no data is available
  if (chartData.length === 0) {
    return (
      <Paper sx={{ padding: 2, textAlign: "center" }}>
        <p>No data available.</p>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        backgroundColor: "#f8f8f8", // Off-white background color
        color: "#424242", // Dark text for readability
        borderRadius: 2,
        boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)", // Softer shadow
      }}
    >
      {/* Heading */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#2C3E50", // Heading color
          marginBottom: 2,
        }}
      >
        Earning
      </Typography>

      {/* Display Total Earnings */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: "#2C3E50", // Same color as the heading for consistency
          marginBottom: 2,
        }}
      >
        Total Earnings: ₹{totalIncome.toFixed(2)} {/* Indian Rupee Symbol */}
      </Typography>

      {/* Chart */}
      <Chart data={chartData} sx={{ marginTop: 4 }}>
        <ArgumentScale factory={scaleBand} />
        <ArgumentAxis />
        <ValueAxis />
        <BarSeries
          valueField="totalIncome"
          argumentField="month"
          color="#2C3E50" // Dark blue-gray color for bars
        />
        <Animation />
        <EventTracker />
        <Tooltip />
      </Chart>
    </Paper>
  );
}
