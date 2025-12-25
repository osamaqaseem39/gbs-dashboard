import React from 'react';
import MasterDataListPage from '../components/master-data/MasterDataListPage';
import { ageGroupService } from '../services/masterDataService';

const AgeGroupsPage: React.FC = () => {
  return (
    <MasterDataListPage
      service={ageGroupService}
      title="Age Groups"
      description="Manage age group categories (Young Adult, Adult, Mature, etc.)"
      routePrefix="/dashboard/age-groups"
    />
  );
};

export default AgeGroupsPage;

