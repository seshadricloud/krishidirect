import React, { useEffect, useState } from 'react';
import { getFarmers } from '../../services/farmerService';
import FarmerCard from '../../components/farmer/FarmerCard';
import Loader from '../../components/ui/Loader';

const FarmersPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const data = await getFarmers();
        setFarmers(data);
      } catch (err) {
        setError('Failed to fetch farmers');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Farmers List</h1>
      <div className="farmers-grid">
        {farmers.map((farmer) => (
          <FarmerCard key={farmer.id} farmer={farmer} />
        ))}
      </div>
    </div>
  );
};

export default FarmersPage;