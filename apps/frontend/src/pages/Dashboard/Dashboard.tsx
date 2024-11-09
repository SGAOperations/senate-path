import { HomeContainer, Nominations } from './styles';
import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [numNominations, setNumNominations] = useState<number>();

  useEffect(() => {
    fetch('http://localhost:3000/api/nominations')
      .then((response) => response.json())
      .then((result) => {
        setNumNominations(result.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const minNoms = import.meta.env.VITE_NUM_MIN_NOMINATIONS;
  if (minNoms == null) {
    return (
      <HomeContainer>
        The value for NUM_MIN_NOMINATIONS is not set. Please notify SGA
        regarding this!
      </HomeContainer>
    );
  }

  if (numNominations == null) {
    return (
      <HomeContainer>
        {/* TODO add loading spinner here */}
        <h1>Loading...</h1>
      </HomeContainer>
    );
  }

  const neededNoms = minNoms - numNominations;

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
          <h3>{numNominations}</h3>
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
