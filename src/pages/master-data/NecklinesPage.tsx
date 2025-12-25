import React from 'react';
import MasterDataListPage from '../components/master-data/MasterDataListPage';
import { necklineService } from '../services/masterDataService';

const NecklinesPage: React.FC = () => {
  return (
    <MasterDataListPage
      service={necklineService}
      title="Necklines"
      description="Manage neckline styles (Round, V-neck, Boat, High, etc.)"
      routePrefix="/dashboard/necklines"
    />
  );
};

export default NecklinesPage;

