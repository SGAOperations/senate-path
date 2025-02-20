import React from 'react';
import {
  SampleForm,
  FormInput,
  FormQuestionContainer,
  FormTextContainer,
  FormTextAnswerContainer,
  RadioButtons,
} from '../styles';
import { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  Button,
  RadioGroup,
  FormHelperText,
  Radio,
} from '@mui/material';
import { SubFormProps } from './SubForm';

export const NominationSubForm: React.FC<SubFormProps> = ({
  formData,
  setFormData,
  updateErrors,
  errors,
  errorMessages,
  handleNext,
  handlePrev,
}) => {
  const [isNext, setIsNext] = useState(false);

  const handleNominationNext = () => {
    setIsNext(true);
    if (!(errors.returningSenatorType || errors.attestation)) {
      handleNext();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          handlePrev();
        }}
      >
        Previous
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handleNominationNext();
        }}
      >
        Next
      </Button>
    </>
  );
};
