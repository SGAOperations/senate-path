import { useState } from 'react';

import { HomeContainer } from './styles';
import SubmitPopUp from '../../components/SubmitPopUp';
import ApplicationForm from '../../components/forms/ApplicationForm';

const Applications: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <HomeContainer>
      <ApplicationForm setIsPopupOpen={setIsPopupOpen} />

      <SubmitPopUp
        open={isPopupOpen}
        setOpen={setIsPopupOpen}
        name="Application"
      />
    </HomeContainer>
  );
};

export default Applications;
