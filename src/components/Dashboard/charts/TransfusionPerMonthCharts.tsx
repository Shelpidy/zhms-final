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

interface TransfusionDataPoint {
  month: string;
  transfusion: number;
  transfusionRequest: number;
}

interface Props {
  data: TransfusionDataPoint[];
}

export const TransfusionsLineChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="transfusion" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const TransfusionsBarChart: React.FC<Props> = ({ data }) => {
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
        <Bar dataKey="transfusion" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CompareTransfusionBarCharts: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
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
        <Bar dataKey="transfusion" fill="#82ca9d" />
        <Bar dataKey="transfusionRequest" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
