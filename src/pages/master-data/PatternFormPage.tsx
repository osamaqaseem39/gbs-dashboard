import React from 'react';
import MasterDataFormPage from '../components/master-data/MasterDataFormPage';
import { patternService } from '../services/masterDataService';

const PatternFormPage: React.FC = () => {
  return (
    <MasterDataFormPage
      service={patternService}
      title="Patterns"
      description="Help customers understand the pattern type of products"
      singularTitle="Pattern"
      routePrefix="/dashboard/patterns"
      examples={['Solid', 'Floral', 'Geometric', 'Abstract', 'Striped', 'Polka Dot', 'Embroidered']}
    />
  );
};

export default PatternFormPage;

