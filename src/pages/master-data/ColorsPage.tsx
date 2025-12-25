import React from 'react';
import MasterDataListPage from '../components/master-data/MasterDataListPage';
import { colorService } from '../services/masterDataService';

const ColorsPage: React.FC = () => {
  return (
    <MasterDataListPage
      service={colorService}
      title="Colors"
      description="Manage color options used across products."
      routePrefix="/dashboard/colors"
    />
  );
};

export default ColorsPage;


