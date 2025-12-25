import React from 'react';
import MasterDataFormPage from '../components/master-data/MasterDataFormPage';
import { lengthService } from '../services/masterDataService';

const LengthFormPage: React.FC = () => {
  return (
    <MasterDataFormPage
      service={lengthService}
      title="Garment Lengths"
      description="Help customers understand the garment length"
      singularTitle="Garment Length"
      routePrefix="/dashboard/lengths"
      examples={['Short', 'Medium', 'Long', 'Floor Length', 'Ankle Length']}
    />
  );
};

export default LengthFormPage;

