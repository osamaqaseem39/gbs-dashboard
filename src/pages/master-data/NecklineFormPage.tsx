import React from 'react';
import MasterDataFormPage from 'components/master-data/MasterDataFormPage';
import { necklineService } from 'services/masterDataService';

const NecklineFormPage: React.FC = () => {
  return (
    <MasterDataFormPage
      service={necklineService}
      title="Necklines"
      description="Help customers understand the neckline style"
      singularTitle="Neckline"
      routePrefix="/dashboard/necklines"
      examples={['Round', 'V-neck', 'Boat', 'High', 'Off-shoulder', 'Halter', 'Sweetheart']}
    />
  );
};

export default NecklineFormPage;

