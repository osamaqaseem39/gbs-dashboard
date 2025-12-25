import React from 'react';
import MasterDataListPage from '../components/master-data/MasterDataListPage';
import { colorFamilyService } from '../services/masterDataService';

const ColorFamiliesPage: React.FC = () => {
  return (
    <MasterDataListPage
      service={colorFamilyService}
      title="Color Families"
      description="Manage color family groups (Pastels, Brights, Neutrals, Dark, etc.)"
      routePrefix="/dashboard/color-families"
    />
  );
};

export default ColorFamiliesPage;

