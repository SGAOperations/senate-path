import React, { useState } from 'react';

import { HomeContainer } from '../Nominations/styles';
import SubmitPopUp from '../../components/SubmitPopUp';
import NominationForm from '../../components/forms/NominationForm';
import ErrorPopUp from '../../components/ErrorPopUp';

const Nominations: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isErrorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <HomeContainer>
      <NominationForm setIsPopupOpen={setIsPopupOpen} 
      setErrorMessage={setErrorMessage} 
      setErrorOpen={setErrorOpen}/>

      <SubmitPopUp
        open={isPopupOpen}
        setOpen={setIsPopupOpen}
        name="Nomination"
      />

    <ErrorPopUp 
    open = {isErrorOpen}
    setOpen={setErrorOpen}
    message={errorMessage}
    />
    </HomeContainer>
  );
};

export default Nominations;
