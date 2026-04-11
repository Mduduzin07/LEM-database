import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface HOD {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  department: string;
  role: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  bio?: string;
  image?: string;
  responsibilities: string[];
  assistants: Array<{
    name: string;
    role: string;
    phone: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export function useHOD() {
  const [hods, setHODs] = useState<HOD[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ department: 'all', isActive: 'all' });

  const fetchHODs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.department && filter.department !== 'all') params.append('department', filter.department);
      if (filter.isActive && filter.isActive !== 'all') params.append('isActive', filter.isActive);
      
      const response = await fetch(`/api/hod?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setHODs(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to fetch HODs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter.department, filter.isActive]);

  useEffect(() => {
    fetchHODs();
  }, [fetchHODs]);

  const addHOD = async (hodData: Omit<HOD, '_id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      const response = await fetch('/api/hod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hodData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('HOD added successfully!');
        await fetchHODs();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to add HOD');
      throw error;
    }
  };

  const updateHOD = async (id: string, updateData: Partial<HOD>): Promise<void> => {
    try {
      const response = await fetch(`/api/hod/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('HOD updated successfully!');
        await fetchHODs();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to update HOD');
      throw error;
    }
  };

  const deleteHOD = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/hod/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('HOD deleted successfully!');
        await fetchHODs();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete HOD');
      throw error;
    }
  };

  const getDepartments = () => {
    const departments = [...new Set(hods.map(hod => hod.department))];
    return departments.sort();
  };

  const getActiveCount = () => {
    return hods.filter(hod => hod.isActive).length;
  };

  const getInactiveCount = () => {
    return hods.filter(hod => !hod.isActive).length;
  };

  return {
    hods,
    loading,
    filter,
    setFilter,
    addHOD,
    updateHOD,
    deleteHOD,
    getDepartments,
    getActiveCount,
    getInactiveCount,
    refresh: fetchHODs,
  };
}