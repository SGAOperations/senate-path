import { useState } from 'react';

import { HomeContainer } from './styles';
import SubmitPopUp from '../../components/SubmitPopUp';
import ApplicationForm from '../../components/forms/ApplicationForm';
import ErrorPopUp from '../../components/ErrorPopUp';

const Applications: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isErrorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  return (
    <HomeContainer>
      <ApplicationForm 
      setIsPopupOpen={setIsPopupOpen} 
      setErrorMessage={setErrorMessage} 
      setErrorOpen={setErrorOpen}
      />
      <SubmitPopUp
        open={isPopupOpen}
        setOpen={setIsPopupOpen}
        name="Application"
      />

      <ErrorPopUp 
      open = {isErrorOpen}
      setOpen={setErrorOpen}
      message={errorMessage}
      />

    </HomeContainer>
  );
};

export default Applications;
