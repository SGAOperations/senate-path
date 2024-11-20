import React, { useState } from 'react';
import {
  HomeContainer,
  Nominations,
  InputContainer,
  SubmitButton,
} from './styles';

const Dashboard: React.FC = () => {
  const [nuid, setNuid] = useState<string>('');
  const [nominationStatus, setNominationStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Dummy nomination data to display
  const dummyNominationData = {
    message: 'You need more nominations!',
    numNominations: 3,
    neededNominations: 2,
  };

  const handleSubmit = async () => {
    setError(null);

    // Simulate fetching nomination data
    // Replace with actual API call when ready
    /*
    try {
      const response = await fetch(`http://localhost:3000/api/nominations/${nuid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch nomination status');
      }
      const result = await response.json();
      setNominationStatus(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    }
    */

    // Use dummy data for now
    setNominationStatus(dummyNominationData);
  };

  return (
    <HomeContainer>
      <InputContainer>
        <h1>SGA Nomination Dashboard</h1>
        <label htmlFor="nuid">Enter your NUID:</label>
        <input
          id="nuid"
          type="text"
          value={nuid}
          onChange={(e) => setNuid(e.target.value)}
          placeholder="e.g., 001234567"
          required
        />
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </InputContainer>

      {error && <h2 style={{ color: 'red' }}>{error}</h2>}

      {nominationStatus && (
        <Nominations>
          <h1>Nomination Status</h1>
          <h3>{nominationStatus.message}</h3>
          <p>Total Nominations: {nominationStatus.numNominations}</p>
          {nominationStatus.neededNominations > 0 ? (
            <p>
              You need {nominationStatus.neededNominations} more nominations to
              meet the minimum requirement.
            </p>
          ) : (
            <p>You have met the required number of nominations!</p>
          )}
        </Nominations>
      )}
    </HomeContainer>
  );
};

export default Dashboard;
