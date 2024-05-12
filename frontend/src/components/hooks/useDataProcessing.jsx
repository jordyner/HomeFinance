import { useState, useEffect, useCallback } from 'react';
import { listTransactions } from '../ApiService';

const useDataProcessing = (category = null, refreshTrigger, users = []) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await listTransactions();
            let filteredData = response.filter(transaction => 
                (!category || transaction.category.toLowerCase() === category.toLowerCase()) && 
                (!users.length || users.includes(transaction.userId))
            );
            setData(filteredData);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    }, [category, users, refreshTrigger]);

    const aggregateByCategoryThisMonth = (transactions, categories) => {
        const now = new Date();
        const thisMonthTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
        });
    
        const categoryColorMap = categories.reduce((map, category) => {
            map[category.name.toLowerCase()] = category.color; 
            return map;
        }, {});
    
        const aggregationMap = {};
        thisMonthTransactions.forEach(item => {
            const categoryKey = item.category.toLowerCase(); 
            if (!aggregationMap[categoryKey]) {
                aggregationMap[categoryKey] = { 
                    name: categories.find(cat => cat.name.toLowerCase() === categoryKey)?.name || item.category, 
                    value: 0,
                    color: categoryColorMap[categoryKey] || "#000000"
                };
            }
            aggregationMap[categoryKey].value += item.amount;
        });
    
        return Object.values(aggregationMap).sort((a, b) => a.name.localeCompare(b.name));
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, aggregateByCategoryThisMonth };
};

export default useDataProcessing;
