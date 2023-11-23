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
  AreaChart,
} from "recharts";

interface BloodDonationDataPoint {
  month: string;
  donation: number;
}

interface BloodGroupDataPoint {
  group: string;
  amount: number;
}

interface Props {
  data: BloodDonationDataPoint[];
  bloodGroupData: BloodGroupDataPoint[];
}

export const BloodDonationsLineChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="donation" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const BloodDonationsBarChart: React.FC<Props> = ({ data }) => {
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
        <Bar dataKey="donation" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CompareBloodGroupBarCharts: React.FC<Props> = ({
  bloodGroupData,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={bloodGroupData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="group" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};
