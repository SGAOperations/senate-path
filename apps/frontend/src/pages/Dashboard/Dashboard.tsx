import React, { useEffect, useState } from 'react';
import { getFullPath } from './../../utils';
import {
  HomeContainer,
  Nominations,
  InputContainer,
  SubmitButton,
} from './styles';
import TextField from '@mui/material/TextField';

const Dashboard: React.FC = () => {
  const [nuid, setNuid] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [numNominations, setNumNominations] = useState<number>();
  const [neededNominations, setNeededNominations] = useState<number>(30);
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleSubmit = async () => {
    setError(null);
    try {
      const nuidRegex = /^\d{9}$/;
        if (!nuidRegex.test(nuid)) {
          setError('NUID must be 9 digits long and contain only numbers');
          return;
        }
      fetch(getFullPath(`/api/nominations/nuid/${nuid}`))

        .then((data) => {
          if (data.ok) {
            const out = data.json();
            return out;
          } else {
            data
              .json()
              .then((responseBody) => {
                if (responseBody && responseBody.message) {
                  setMessage('Error Message : ' + responseBody.message);
                  setNumNominations(0);
                  setNeededNominations(30);
                }
              })
              .catch((error) => {
                console.error('Error reading response body as JSON:', error);
              });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            setNumNominations(data);
            if (30 - data > 0) {
              setNeededNominations(30 - data);
              setMessage('You need more nominations!');
            } else {
              setNeededNominations(0);
              setMessage(
                'You have the required amount of nominations! Congrats on becoming a Senator!'
              );
            }
          }
          setShowResult(true);
        })
        .catch((error) => {
          console.error('Error fetching:', error);
        });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    }
  };

  return (
    <HomeContainer>
      <InputContainer>
        <h1>SGA Nomination Dashboard</h1>
        <label htmlFor="nuid">Enter your NUID:</label>
        <TextField
          id="nuid"
          type="text"
          label="Required"
          value={nuid}
          onChange={(e) => setNuid(e.target.value)}
          placeholder="e.g., 001234567"
          required
          fullWidth
        />
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </InputContainer>

      {error && <h2 style={{ color: 'red' }}>{error}</h2>}

      {showResult && (
        <Nominations>
          <h1>Nomination Status</h1>
          <h3>{message}</h3>
          <p>Total Nominations: {numNominations}</p>
          {neededNominations > 0 ? (
            <p>
              You need {neededNominations} more nominations to meet the minimum
              requirement.
            </p>
          ) : (
            <p>You have met the required number of nominations!</p>
          )}
        </Nominations>
      )}
    </HomeContainer>
  );
}

export default Dashboard;