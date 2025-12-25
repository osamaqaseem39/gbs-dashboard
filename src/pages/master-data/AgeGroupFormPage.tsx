import React from 'react';
import MasterDataFormPage from 'components/master-data/MasterDataFormPage';
import { ageGroupService } from 'services/masterDataService';

const AgeGroupFormPage: React.FC = () => {
  return (
    <MasterDataFormPage
      service={ageGroupService}
      title="Age Groups"
      description="Help categorize products by target age group"
      singularTitle="Age Group"
      routePrefix="/dashboard/age-groups"
      examples={['Young Adult', 'Adult', 'Mature']}
    />
  );
};

export default AgeGroupFormPage;

