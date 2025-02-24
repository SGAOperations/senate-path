import React from 'react';
import {
  SampleForm,
  FormInput,
  FormQuestionContainer,
  FormTextContainer,
  FormQuestionText,
  FormTextAnswerContainer,
} from '../styles';
import { useState } from 'react';
import { FormControl, Button } from '@mui/material';
import { SubFormProps } from './SubFormProps';

export const NameSubForm: React.FC<SubFormProps> = ({
  formData,
  setFormData,
  updateErrors,
  errors,
  errorMessages,
  handleNext,
  handlePrev,
}) => {
  const [isNext, setIsNext] = useState(false);

  const handleNameNext = () => {
    setIsNext(true);
    if (
      !(
        errors.fullName ||
        errors.preferredFullName ||
        errors.phoneticPronunciation ||
        errors.nickname
      )
    ) {
      handleNext();
    }
  };

  const handleFullNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, fullName: value }));
    updateErrors('fullName', !value);
  };

  const handlePreferredNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, preferredFullName: value }));
    updateErrors('preferredFullName', !value);
  };

  const handlePhoneticPronunciationChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, phoneticPronunciation: value }));
    updateErrors('phoneticPronunciation', !value);
  };

  const handleNicknameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, nickname: value }));
    updateErrors('nickname', !value);
  };
  return (
    <>
      <SampleForm>
        <FormControl error={isNext && errors.fullName}>
          <FormQuestionContainer>
            <FormTextContainer>
              <FormQuestionText>What is your full name?</FormQuestionText>
              Please enter your full name as it appears in the university
              records. This name will only be used in official communications
              between SGA leadership and university administrators.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                placeholder="Your Full Name"
                required
                value={formData.fullName}
                onChange={(e) => {
                  handleFullNameChange(e);
                }}
                error={isNext && errors.fullName}
                helperText={isNext && errors.fullName && errorMessages.fullName}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
        <FormControl error={isNext && errors.preferredFullName}>
          <FormQuestionContainer>
            <FormTextContainer>
              <FormQuestionText>What is your preferred name?</FormQuestionText>
              Please enter your preferred first and last name. Do not enter any
              nicknames in this field. This name will be used for all official
              SGA business. It will be posted on the website and printed on your
              senator placard.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Your Preferred Name"
                value={formData.preferredFullName}
                onChange={(e) => {
                  handlePreferredNameChange(e);
                }}
                error={isNext && errors.preferredFullName}
                helperText={
                  isNext &&
                  errors.preferredFullName &&
                  errorMessages.preferredFullName
                }
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
        <FormControl error={isNext && errors.phoneticPronunciation}>
          <FormQuestionContainer>
            <FormTextContainer>
              <FormQuestionText>
                What is the phonetic pronunciation of your name?
              </FormQuestionText>
              Please enter how to pronounce your name. This pronunciation will
              be used during roll-call votes.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Name Pronunciation"
                value={formData.phoneticPronunciation}
                onChange={(e) => {
                  handlePhoneticPronunciationChange(e);
                }}
                error={isNext && errors.phoneticPronunciation}
                helperText={
                  isNext &&
                  errors.phoneticPronunciation &&
                  errorMessages.phoneticPronunciation
                }
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
        <FormControl error={isNext && errors.nickname}>
          <FormQuestionContainer>
            <FormTextContainer>
              <FormQuestionText>What is your nickname?</FormQuestionText>
              If you have a nickname, please enter it here. This name will not
              be used in official SGA business, but it will be used informally
              when appropriate.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                placeholder="Nickname"
                value={formData.nickname}
                onChange={(e) => {
                  handleNicknameChange(e);
                }}
                error={isNext && errors.nickname}
                helperText={isNext && errors.nickname && errorMessages.nickname}
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
          handleNameNext();
        }}
      >
        Next
      </Button>
    </>
  );
};
