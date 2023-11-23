"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CompletedAppointmentDataPoint {
  month: string;
  completed: number;
}

interface TotalAppointmentDataPoint {
  year: string;
  totalPending: number;
  totalCompleted: number;
}

interface Props {
  data: CompletedAppointmentDataPoint[];
  totalData: TotalAppointmentDataPoint[];
}

export const CompletedAppointmentLineChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="completed" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const CompletedAppointmentsBarChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CompareAppointmentBarCharts: React.FC<
  Pick<Props, "totalData">
> = ({ totalData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={totalData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalCompleted" fill="#82ca9d" />
        <Bar dataKey="totalPending" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
