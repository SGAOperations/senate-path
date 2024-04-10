import { HomeContainer, Nominations } from './styles';
import React, { useState } from 'react';
import { ResultType } from '@remix-run/router/dist/utils';

const Dashboard: React.FC = () => {
  const [numOfNoms, setNumOfNoms] = useState(0);
  const setNums = import.meta.env.VITE_NUM_MIN_NOMINATIONS;
  const neededNoms = setNums - numOfNoms;
  const receiveNominations = () => {
    fetch('http://localhost:3000/api/nominations', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.length);
        setNumOfNoms(result.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  receiveNominations();
  return (
    <HomeContainer>
      <Nominations>
        <h1>Nominations</h1>
        <h3>{numOfNoms}</h3>
      </Nominations>
      <Nominations>
        <h1>Nominations Needed</h1>
        <h3>{neededNoms}</h3>
      </Nominations>
    </HomeContainer>
  );
};

export default Dashboard;
