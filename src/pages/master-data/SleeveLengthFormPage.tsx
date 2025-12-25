import React from 'react';
import MasterDataFormPage from '../components/master-data/MasterDataFormPage';
import { sleeveLengthService } from '../services/masterDataService';

const SleeveLengthFormPage: React.FC = () => {
  return (
    <MasterDataFormPage
      service={sleeveLengthService}
      title="Sleeve Lengths"
      description="Help customers understand the sleeve length option"
      singularTitle="Sleeve Length"
      routePrefix="/dashboard/sleeve-lengths"
      examples={['Sleeveless', 'Short', '3/4', 'Long', 'Full']}
    />
  );
};

export default SleeveLengthFormPage;

