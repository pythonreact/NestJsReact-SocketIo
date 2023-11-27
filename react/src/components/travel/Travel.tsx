import React from 'react';
import { useTravel } from '../../logics/useTravel';

const Travel: React.FC = () => {
  const { Table } = useTravel();

  return <Table />;
};

export default Travel;
