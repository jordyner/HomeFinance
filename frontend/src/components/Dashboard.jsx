import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../styles/dashboard.css';
import budgetIcon from '../icons/budget.png';
import barGraphIcon from '../icons/bar-graph.png';
import IconButton from './IconButton';
import useDataProcessing from './hooks/useDataProcessing';  
import Modal from './Modal';

function Dashboard({ category, color, refreshTrigger, users }) {
    console.log(users)
    const { data, loading } = useDataProcessing(category, refreshTrigger, users);
    const [budget, setBudget] = useState(10000);
    const [total, setTotal] = useState(1850);
    const [showBudgetInfo, setShowBudgetInfo] = useState(false);
    const [chartType, setChartType] = useState('bar');
    const [dataGranularity, setDataGranularity] = useState('daily');
    const [timeFrame, setTimeFrame] = useState('this month');
    const [timeFrameOptions, setTimeFrameOptions] = useState(['This Month', 'Last Month']);
    const [budgetInput, setBudgetInput] = useState(budget);
    const [isChartModalOpen, setChartModalOpen] = useState(false);
    const [isBudgetModalOpen, setBudgetModalOpen] = useState(false);
    const isBudgetActive = dataGranularity === 'daily' && timeFrame === 'this month';

    useEffect(() => {
        if (timeFrame === 'this month') {
            const now = new Date();
            const newTotal = data.reduce((acc, item) => {
                const itemDate = new Date(item.date);
                if (itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()) {
                    return acc + item.amount;
                }
                return acc;
            }, 0);
            setTotal(newTotal);
        }
    }, [data, timeFrame]);


    const budgetUsedPercent = ((total / budget) * 100).toFixed(2);
    const displayWidth = budgetUsedPercent > 100 ? 100 : budgetUsedPercent; // Cap display at 100%

    const toggleChartModal = () => {
        setChartModalOpen(!isChartModalOpen);
    };
    
    const toggleBudgetModal = () => {
        setBudgetModalOpen(!isBudgetModalOpen);
    };

    const handleChartTypeChange = (type) => {
        setChartType(type);
    };

    const handleSetBudget = () => {
        if (budgetInput > 0) {
            setBudget(Number(budgetInput));  
            setShowBudgetInfo(true);      
        }
        setBudgetModalOpen(false);        
    };
    
    const handleRemoveBudget = () => {
        setShowBudgetInfo(false);        
        setBudgetModalOpen(false);      
    };

    const handleDataGranularityChange = (granularity) => {
        console.log("Handle: " + granularity)
        setDataGranularity(granularity);
        if (granularity === 'daily') {
            setTimeFrameOptions(['This Month', 'Last Month']);
            setTimeFrame('this month');
        } else {
            setTimeFrameOptions(['This Year', 'Last Year']);
            setTimeFrame('this year');
        }
    };

    function formatDate(dateString, granularity) {
        console.log(dateString, granularity)

        const date = new Date(dateString);
        if (granularity === 'monthly') {
            // 'Month YYYY'
            return `${date.toLocaleString('en-us', { month: 'long' })} ${date.getFullYear()}`;
        }
        // 'DD. MM. YYYY'
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
    }

    const aggregateMonthlyData = (data) => {
        const monthlyData = data.reduce((acc, item) => {
            const monthYearKey = new Date(item.date).toISOString().slice(0, 7); 
            if (!acc[monthYearKey]) {
                acc[monthYearKey] = { ...item, amount: 0, date: monthYearKey + "-01" }; 
            }
            acc[monthYearKey].amount += item.amount;
            return acc;
        }, {});
        return Object.values(monthlyData);
    };    

    const aggregateDailyData = (data) => {
        const dailyData = data.reduce((acc, item) => {
            const dateKey = item.date.slice(0, 10);
            if (!acc[dateKey]) {
                acc[dateKey] = { date: dateKey, amount: 0 };
            }
            acc[dateKey].amount += item.amount;
            return acc;
        }, {});
        return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
    };
    
    const filteredData = dataGranularity === 'daily' ? 
        aggregateDailyData(data.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            if (timeFrame === 'this month') {
                return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
            } else if (timeFrame === 'last month') {
                let lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return itemDate.getMonth() === lastMonth.getMonth() && itemDate.getFullYear() === lastMonth.getFullYear();
            } else {
                return false;
            }
        })) :

        aggregateMonthlyData(data.filter(item => {
            const itemDate = new Date(item.date);
            const now = new Date();
            if (timeFrame === 'this year') {
                return itemDate.getFullYear() === now.getFullYear();
            } else if (timeFrame === 'last year') {
                return itemDate.getFullYear() === now.getFullYear() - 1;
            } else {
                return false;
            }
        }));

        const getChart = () => {
            let ChartComponent, ChartElement;
        
            switch (chartType) {
                case 'bar':
                    ChartComponent = BarChart;
                    ChartElement = <Bar type="monotone" dataKey="amount" fill={color} stroke="#8884d8" label={{ position: 'center', fill: '#333' }} />;
                    break;
                case 'line':
                    ChartComponent = LineChart;
                    ChartElement = <Line type="monotone" dataKey="amount" fill={color} label={{ position: 'top', fill: '#333' }} />;
                    break;
                case 'area':
                    ChartComponent = AreaChart;
                    ChartElement = <Area type="monotone" dataKey="amount" fill={color} stroke="#8884d8" />;
                    break;
                default:
                    ChartComponent = LineChart;
                    ChartElement = <Line type="monotone" dataKey="amount" fill={color} stroke="#8884d8" />;
                    break;
            }
        
            return (
                <div className='chartContainer'>
                    <ChartComponent width={650} height={400} data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(tick) => formatDate(tick, dataGranularity)} />
                        <YAxis />
                        {ChartElement}
                    </ChartComponent>
                </div>
            );
        };
    
    // Modal content for chart settings. It could have been a separate component but for simplicity I decided to keep it here.
    const chartSettingsModal = (
        <div>
            <div className="settings-section">
                <div className="settings-label">Granularity</div>
                <div className="button-group">
                    <div className={`segmented-button ${dataGranularity === 'daily' ? 'active' : ''}`} onClick={() => handleDataGranularityChange('daily')}>
                        Daily
                    </div>
                    <div className={`segmented-button ${dataGranularity === 'monthly' ? 'active' : ''}`} onClick={() => handleDataGranularityChange('monthly')}>
                        Monthly
                    </div>
                </div>
            </div>
            <div className="settings-section">
                <div className="settings-label">Chart Type</div>
                <div className="button-group">
                    <div className={`segmented-button ${chartType === 'bar' ? 'active' : ''}`} onClick={() => handleChartTypeChange('bar')}>
                        Bar
                    </div>
                    <div className={`segmented-button ${chartType === 'line' ? 'active' : ''}`} onClick={() => handleChartTypeChange('line')}>
                        Line
                    </div>
                    <div className={`segmented-button ${chartType === 'area' ? 'active' : ''}`} onClick={() => handleChartTypeChange('area')}>
                        Area
                    </div>
                </div>
            </div>
            <div className="settings-section">
                <div className="settings-label">Date Frame</div>
                <div className="button-group">
                    {timeFrameOptions.map(option => (
                        <div key={option}
                            className={`segmented-button ${timeFrame === option.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setTimeFrame(option.toLowerCase())}>
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Modal content for budget settings.
    const budgetSettingsModal = (
        <div>
            <div className="settings-section">
                <div className="settings-label">Set Your Budget </div>
                <input 
                    type="number" 
                    className="budget-input" 
                    value={budgetInput} 
                    onChange={(e) => setBudgetInput(e.target.value)} 
                    placeholder="Enter Budget Amount"
                />
            </div>
            <div className="button-group">
                <button className="set-budget-button" onClick={handleSetBudget}>
                    Set Budget
                </button>
                <button className="remove-budget-button" onClick={handleRemoveBudget}>
                    Remove Budget
                </button>
            </div>
        </div>
    );
    

    return (
        <div className="dashboardContainer">
            <div className="dashboardHeader">
                <h2 className="dashboardTitle">
                    {category}
                </h2>
                <div style={{ display: 'flex' }}>
                    <IconButton imageUrl={budgetIcon} alt="Budget" onClick={toggleBudgetModal} />
                        <Modal isOpen={isBudgetModalOpen} toggleModal={toggleBudgetModal} closeButtonLabel="Close">
                            {budgetSettingsModal}
                        </Modal>
                    <IconButton imageUrl={barGraphIcon} alt="Bar Graph" onClick={toggleChartModal} />
                        <Modal isOpen={isChartModalOpen} toggleModal={toggleChartModal} closeButtonLabel="Done">
                            {chartSettingsModal}
                        </Modal>
                </div>
            </div>
            <div className="responsiveContainer">
                {showBudgetInfo && (
                        <div className="budgetInfo" style={{ opacity: isBudgetActive ? 1 : 0.5, filter: isBudgetActive ? 'none' : 'grayscale(100%)' }}>
                            <div className="budgetProgressBar">
                                <div className="progress used" style={{ width: `${displayWidth}%`, backgroundColor: color }}>
                                    <span className="budgetText">{total}</span>
                                </div>
                                <div className="progress remaining" style={{ width: `${100 - displayWidth}%` }}>
                                    <span className="budgetText">{budget - total}</span>
                                </div>
                            </div>
                            <span className="budgetPercentage">{budgetUsedPercent}% used</span>
                        </div>
                    )}
                {getChart()}
            </div>
        </div>
    );
}

export default Dashboard;