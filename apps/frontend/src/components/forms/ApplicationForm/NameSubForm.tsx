import React from 'react';
import {
  SampleForm,
  FormQuestionContainer,
  FormTextContainer,
  FormQuestionText,
  FormTextAnswerContainer,
} from './styles';
import { FormControl } from '@mui/material';
import { ApplicationFormData } from './ApplicationForm';

interface Props {
  isNext: boolean;
  errors: unknown;
  formData: ApplicationFormData;
  setFormData: () => void;
  handleNext: () => void;
}

const NameSubForm: React.FC<Props> = ({
  isNext,
  errors,
  formData,
  setFormData,
}) => {
  return (
    <>
      <SampleForm>
        <FormControl error={isNext && !!errors.fullName}>
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
                  setFullName(e.target.value);
                  if (errors.fullName) {
                    errors.fullName = '';
                  }
                }}
                error={isNext && !!isFullNameError}
                helperText={isNext && errors.fullName}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
        <FormControl error={isNext && !!errors.preferredFullName}>
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
                  setPreferredFullName(e.target.value);
                  if (errors.preferredFullName) {
                    errors.preferredFullName = '';
                  }
                }}
                error={isNext && !!isPreferredFullNameError}
                helperText={isNext && errors.preferredFullName}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
        <FormControl error={isNext && !!errors.phoneticPronunciation}>
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
                  setPhoneticPronunciation(e.target.value);
                  if (errors.phoneticPronunciation) {
                    errors.phoneticPronunciation = '';
                  }
                }}
                error={isNext && !!isPhoneticPronunciationError}
                helperText={isNext && errors.phoneticPronunciation}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
        <FormControl error={isNext && !!errors.nickname}>
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
                  setNickname(e.target.value);
                  if (errors.nickname) {
                    errors.nickname = '';
                  }
                }}
                error={isNext && !!isNicknameError}
                helperText={isNext && errors.nickname}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
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
