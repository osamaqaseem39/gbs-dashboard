import React from 'react';
import MasterDataListPage from 'components/master-data/MasterDataListPage';
import { sleeveLengthService } from 'services/masterDataService';

const SleeveLengthsPage: React.FC = () => {
  return (
    <MasterDataListPage
      service={sleeveLengthService}
      title="Sleeve Lengths"
      description="Manage sleeve length options (Sleeveless, Short, 3/4, Long, Full)"
      routePrefix="/dashboard/sleeve-lengths"
    />
  );
};

export default SleeveLengthsPage;

