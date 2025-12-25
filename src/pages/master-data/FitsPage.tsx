import React from 'react';
import MasterDataListPage from '../components/master-data/MasterDataListPage';
import { fitService } from '../services/masterDataService';

const FitsPage: React.FC = () => {
  return (
    <MasterDataListPage
      service={fitService}
      title="Fits"
      description="Manage fit types (Loose, Fitted, Semi-fitted, Oversized, A-line, etc.)"
      routePrefix="/dashboard/fits"
    />
  );
};

export default FitsPage;

