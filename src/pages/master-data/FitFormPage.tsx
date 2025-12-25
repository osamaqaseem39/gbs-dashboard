import React from 'react';
import MasterDataFormPage from '../components/master-data/MasterDataFormPage';
import { fitService } from '../services/masterDataService';

const FitFormPage: React.FC = () => {
  return (
    <MasterDataFormPage
      service={fitService}
      title="Fits"
      description="Help customers understand the fit type"
      singularTitle="Fit"
      routePrefix="/dashboard/fits"
      examples={['Loose', 'Fitted', 'Semi-fitted', 'Oversized', 'A-line', 'Straight']}
    />
  );
};

export default FitFormPage;

