import React from 'react';
import MasterDataListPage from 'components/master-data/MasterDataListPage';
import { sizeService } from 'services/masterDataService';

const SizesPage: React.FC = () => {
  return (
    <MasterDataListPage
      service={sizeService}
      title="Sizes"
      description="Manage size options available for products."
      routePrefix="/dashboard/sizes"
    />
  );
};

export default SizesPage;


