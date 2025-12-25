import React from 'react';
import MasterDataListPage from '../components/master-data/MasterDataListPage';
import { patternService } from '../services/masterDataService';

const PatternsPage: React.FC = () => {
  return (
    <MasterDataListPage
      service={patternService}
      title="Patterns"
      description="Manage pattern types (Solid, Floral, Geometric, Abstract, etc.)"
      routePrefix="/dashboard/patterns"
    />
  );
};

export default PatternsPage;
