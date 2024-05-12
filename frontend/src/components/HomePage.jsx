import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, Text } from 'recharts';
import useDataProcessing from './hooks/useDataProcessing';
import '../styles/hp.css';

const COLORS = [
    '#4CAF50', '#2196F3', '#FFEB3B', '#795548', '#F44336',
    '#9C27B0', '#00BCD4', '#E91E63', '#607D8B', '#FFC107'
];

const categories = [
    { name: "Food", color: "#4CAF50" },
    { name: "Clothing", color: "#2196F3" },
    { name: "Transport", color: "#FFEB3B" },
    { name: "Housing", color: "#795548" },
    { name: "Healthcare", color: "#F44336" },
    { name: "Education", color: "#9C27B0" },
    { name: "Communications", color: "#00BCD4" },
    { name: "Entertainment", color: "#E91E63" },
    { name: "Investments", color: "#607D8B" },
    { name: "Charity", color: "#FFC107" }
];

function HomePage() {
    const navigate = useNavigate();
    const { data, aggregateByCategoryThisMonth } = useDataProcessing(null, null, ["ffd807fe3eb4657d9404e4a6c05bb8d4"]);

    const aggregatedData = aggregateByCategoryThisMonth(data, categories);

    const onPieClick = () => {
        navigate('/overview');
    };

    return (
        <div className='pieChartContainer'>
            <PieChart width={1000} height={1000}>
                <Pie
                    data={aggregatedData}
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={250}
                    innerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={onPieClick}
                >
                    {aggregatedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} cursor="pointer" style={{ outline: "none" }} />
                    ))}
                </Pie>
                <Text x={100} y={500} textAnchor="middle" dominantBaseline="middle" className="center-text">
                    Overview
                </Text>
                <Tooltip />
            </PieChart>

            <div className="detail-text">Click anywhere on pie chart to view details</div>
        </div>
    );
}

export default HomePage;
