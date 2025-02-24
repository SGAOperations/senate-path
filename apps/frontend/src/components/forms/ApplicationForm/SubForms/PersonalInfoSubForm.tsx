import React from 'react';
import {
  SampleForm,
  FormInput,
  FormQuestionContainer,
  FormTextContainer,
  FormTextAnswerContainer,
} from '../styles';
import { FormControl, Button } from '@mui/material';
import { SubFormProps } from './SubFormProps';
import { useState } from 'react';

export const PersonalInfoSubForm: React.FC<SubFormProps> = ({
  formData,
  setFormData,
  updateErrors,
  errors,
  errorMessages,
  handleNext,
  handlePrev,
}) => {
  const [isNext, setIsNext] = useState(false);

  const handlePersonalInfoNext = () => {
    setIsNext(true);
    if (!(errors.northeasternID || errors.email || errors.phoneNumber)) {
      handleNext();
    }
  };

  const handleNUIDChange = (value: string) => {
    setFormData((prev) => ({ ...prev, northeasternID: value }));
    updateErrors('northeasternID', !value);
  };

  const handleEmailChange = (value: string) => {
    setFormData((prev) => ({ ...prev, email: value }));
    updateErrors('email', !value);
  };

  const handlePhoneNumberChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
    updateErrors('phoneNumber', !value);
  };
  return (
    <>
      <SampleForm>
        <FormControl error={isNext && errors.northeasternID}>
          <FormQuestionContainer>
            <FormTextContainer>
              <b>What is your NUID?</b>
              <br />
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="NUID"
                value={formData.northeasternID}
                onChange={(e) => {
                  handleNUIDChange(e.target.value);
                }}
                error={isNext && errors.northeasternID}
                helperText={
                  isNext &&
                  errors.northeasternID &&
                  errorMessages.northeasternID
                }
              />
              <br />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
        <FormControl error={isNext && errors.email}>
          <FormQuestionContainer>
            <FormTextContainer>
              <b>What is your Northeastern email?</b>
              <br />
              All email communications will be sent to this address.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Email"
                value={formData.email}
                onChange={(e) => {
                  handleEmailChange(e.target.value);
                }}
                error={isNext && errors.email}
                helperText={isNext && errors.email && errorMessages.email}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
        <FormControl error={isNext && errors.phoneNumber}>
          <FormQuestionContainer>
            <FormTextContainer>
              <b>What is your phone number?</b>
              <br />
              Please enter your cell phone number. If you do not have a phone
              that can receive calls and texts in the United States, note so
              here. Make sure to include the country code if your phone number
              has a country code other than 1 (most North American countries and
              islands).
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => {
                  handlePhoneNumberChange(e.target.value);
                }}
                error={isNext && errors.phoneNumber}
                helperText={
                  isNext && errors.phoneNumber && errorMessages.phoneNumber
                }
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
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
          handlePersonalInfoNext();
        }}
      >
        Next
      </Button>
    </>
  );
};
