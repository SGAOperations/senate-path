import { HomeContainer, Nominations } from './styles';
import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [numOfNoms, setNumOfNoms] = useState(0);
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

  useEffect(() => {
    receiveNominations();
  }, []);

  const setNums = import.meta.env.VITE_NUM_MIN_NOMINATIONS;

  const neededNoms = setNums - numOfNoms;
  if (neededNoms <= 0) {
    return (
      <HomeContainer>
        <h1>
          Congratulations! You have met the required amount of nominations.
        </h1>
      </HomeContainer>
    );
  } else {
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
  }
};

export default Dashboard;
