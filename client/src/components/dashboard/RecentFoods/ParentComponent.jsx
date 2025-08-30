import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RecentFoodsCard } from './RecentFoodsCard';

export const ParentComponent = () => {
  const [recentFoods, setRecentFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const getAuthToken = () => {
    return localStorage.getItem('authToken') ||
           sessionStorage.getItem('authToken') ||
           '';
  };

  const fetchRecentFoods = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await axios.get('/api/foodentry', {
        params: {
          days: 7,
          limit: 20
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setRecentFoods(response.data.data || []);
    } catch (error) {
      console.error('Error fetching recent foods:', error);
      setRecentFoods([]);
      if (error.response?.status === 401) {
        console.error('Authentication failed');
      } else if (error.response?.status === 404) {
        console.error('No food entries found');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentFoods();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchRecentFoods();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div>
      <RecentFoodsCard
        recentFoods={recentFoods}
        loading={loading}
      />
    </div>
  );
};