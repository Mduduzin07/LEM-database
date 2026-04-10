import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface Offering {
  _id: string;
  amount: number;
  type: string;
  date: string;
  memberName: string;
  note: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OfferingStats {
  total: number;
  byType: Record<string, number>;
  thisMonth: number;
  thisWeek: number;
  average: number;
  highest: number;
  lowest: number;
}

export function useOfferings() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ 
    type: 'all', 
    startDate: '', 
    endDate: '' 
  });

  // Fetch all offerings
  const fetchOfferings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filter.type && filter.type !== 'all') params.append('type', filter.type);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      
      const response = await fetch(`/api/offerings?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setOfferings(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch offerings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch offerings';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching offerings:', err);
    } finally {
      setLoading(false);
    }
  }, [filter.type, filter.startDate, filter.endDate]);

  // Initial fetch
  useEffect(() => {
    fetchOfferings();
  }, [fetchOfferings]);

  // Add new offering
  const addOffering = useCallback(async (offeringData: Omit<Offering, '_id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      const response = await fetch('/api/offerings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offeringData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Offering added successfully!');
        await fetchOfferings();
      } else {
        throw new Error(data.error || 'Failed to add offering');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add offering';
      toast.error(errorMessage);
      console.error('Error adding offering:', err);
      throw err;
    }
  }, [fetchOfferings]);

  // Update existing offering
  const updateOffering = useCallback(async (id: string, updateData: Partial<Offering>): Promise<void> => {
    try {
      const response = await fetch('/api/offerings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Offering updated successfully!');
        await fetchOfferings();
      } else {
        throw new Error(data.error || 'Failed to update offering');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update offering';
      toast.error(errorMessage);
      console.error('Error updating offering:', err);
      throw err;
    }
  }, [fetchOfferings]);

  // Delete offering
  const deleteOffering = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/offerings?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Offering deleted successfully!');
        await fetchOfferings();
      } else {
        throw new Error(data.error || 'Failed to delete offering');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete offering';
      toast.error(errorMessage);
      console.error('Error deleting offering:', err);
      throw err;
    }
  }, [fetchOfferings]);

  // Get total offerings
  const getTotal = useCallback((): number => {
    return offerings.reduce((sum, offering) => sum + offering.amount, 0);
  }, [offerings]);

  // Get total by type
  const getTotalByType = useCallback((type: string): number => {
    return offerings
      .filter(offering => offering.type === type)
      .reduce((sum, offering) => sum + offering.amount, 0);
  }, [offerings]);

  // Get offering statistics
  const getStats = useCallback((): OfferingStats => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    let thisMonthTotal = 0;
    let thisWeekTotal = 0;
    let highest = 0;
    let lowest = Infinity;
    const byType: Record<string, number> = {};
    
    offerings.forEach(offering => {
      const offeringDate = new Date(offering.date);
      
      // By type
      byType[offering.type] = (byType[offering.type] || 0) + offering.amount;
      
      // This month
      if (offeringDate >= startOfMonth) {
        thisMonthTotal += offering.amount;
      }
      
      // This week
      if (offeringDate >= startOfWeek) {
        thisWeekTotal += offering.amount;
      }
      
      // Highest and lowest
      if (offering.amount > highest) highest = offering.amount;
      if (offering.amount < lowest) lowest = offering.amount;
    });
    
    return {
      total: getTotal(),
      byType,
      thisMonth: thisMonthTotal,
      thisWeek: thisWeekTotal,
      average: offerings.length > 0 ? getTotal() / offerings.length : 0,
      highest: highest,
      lowest: lowest === Infinity ? 0 : lowest,
    };
  }, [offerings, getTotal]);

  // Get monthly trends
  const getMonthlyTrends = useCallback((months: number = 6) => {
    const monthlyMap = new Map();
    
    offerings.forEach(offering => {
      const date = new Date(offering.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthName,
          year: date.getFullYear(),
          amount: 0,
          count: 0,
          sortDate: date
        });
      }
      
      const entry = monthlyMap.get(monthKey);
      entry.amount += offering.amount;
      entry.count += 1;
    });
    
    return Array.from(monthlyMap.values())
      .sort((a, b) => a.sortDate - b.sortDate)
      .slice(-months);
  }, [offerings]);

  // Get offerings by date range
  const getOfferingsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return offerings.filter(offering => {
      const offeringDate = new Date(offering.date);
      return offeringDate >= startDate && offeringDate <= endDate;
    });
  }, [offerings]);

  // Get recent offerings
  const getRecentOfferings = useCallback((limit: number = 5) => {
    return [...offerings]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [offerings]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilter({ type: 'all', startDate: '', endDate: '' });
  }, []);

  return {
    // State
    offerings,
    loading,
    error,
    filter,
    
    // Actions
    setFilter,
    clearFilters,
    addOffering,
    updateOffering,
    deleteOffering,
    refresh: fetchOfferings,
    
    // Statistics
    getTotal,
    getTotalByType,
    getStats,
    getMonthlyTrends,
    getOfferingsByDateRange,
    getRecentOfferings,
  };
}