import React, { useState } from 'react';

import { HomeContainer } from '../Nominations/styles';
import SubmitPopUp from '../../components/SubmitPopUp';
import NominationForm from '../../components/forms/NominationForm';

const Nominations: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <HomeContainer>
      <NominationForm setIsPopupOpen={setIsPopupOpen} />

      <SubmitPopUp
        open={isPopupOpen}
        setOpen={setIsPopupOpen}
        name="Nomination"
      />
    </HomeContainer>
  );
};

export default Nominations;
