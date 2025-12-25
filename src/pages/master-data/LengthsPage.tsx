import React from 'react';
import MasterDataListPage from '../components/master-data/MasterDataListPage';
import { lengthService } from '../services/masterDataService';

const LengthsPage: React.FC = () => {
  return (
    <MasterDataListPage
      service={lengthService}
      title="Garment Lengths"
      description="Manage garment length options (Short, Medium, Long, Floor Length, etc.)"
      routePrefix="/dashboard/lengths"
    />
  );
};

export default LengthsPage;

