import React from 'react';
import MasterDataFormPage from '../components/master-data/MasterDataFormPage';
import { colorFamilyService } from '../services/masterDataService';

const ColorFamilyFormPage: React.FC = () => {
  return (
    <MasterDataFormPage
      service={colorFamilyService}
      title="Color Families"
      description="Help categorize colors into families for better organization"
      singularTitle="Color Family"
      routePrefix="/dashboard/color-families"
      examples={['Pastels', 'Brights', 'Neutrals', 'Dark', 'Earthy', 'Jewel Tones']}
    />
  );
};

export default ColorFamilyFormPage;

