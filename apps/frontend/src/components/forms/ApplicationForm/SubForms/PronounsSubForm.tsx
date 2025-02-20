import React from 'react';
import {
  SampleForm,
  FormQuestionContainer,
  FormTextContainer,
  FormInputCheckbox,
} from '../styles';
import {
  FormControl,
  Button,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { SubFormProps } from './SubForm';
import { useState } from 'react';

export const PronounSubForm: React.FC<SubFormProps> = ({
  formData,
  setFormData,
  updateErrors,
  errors,
  errorMessages,
  handleNext,
  handlePrev,
}) => {
  const [isNext, setIsNext] = useState(false);

  const handlePronounNext = () => {
    setIsNext(true);
    if (!errors.pronouns) {
      handleNext();
    }
  };

  const handlePronounChange = (event: React.SyntheticEvent) => {
    const { value } = event.currentTarget;

    setFormData((prev) => {
      const isAlreadySelected = prev.pronouns.includes(value);
      const updatedPronouns = isAlreadySelected
        ? prev.pronouns.filter((pronoun) => pronoun !== value)
        : [...prev.pronouns, value];

      updateErrors('pronouns', updatedPronouns.length === 0);

      return { ...prev, pronouns: updatedPronouns };
    });
  };
  return (
    <SampleForm>
      <FormControl error={isNext && errors.pronouns}>
        <FormQuestionContainer>
          <FormTextContainer>
            <FormQuestionContainer>
              What pronouns do you use?
            </FormQuestionContainer>
          </FormTextContainer>
          <FormInputCheckbox>
            <FormControlLabel
              required
              control={<Checkbox />}
              onChange={handlePronounChange}
              label="She/her/her"
              value="She/her/her"
              checked={formData.pronouns.includes('She/her/her')}
            />
            <FormControlLabel
              required
              control={<Checkbox />}
              onChange={handlePronounChange}
              label="He/him/his"
              value="He/him/his"
              checked={formData.pronouns.includes('He/him/his')}
            />
            <FormControlLabel
              required
              control={<Checkbox />}
              onChange={handlePronounChange}
              label="They/them/their"
              value="They/them/their"
              checked={formData.pronouns.includes('They/them/their')}
            />
            <FormControlLabel
              required
              control={<Checkbox />}
              onChange={handlePronounChange}
              label="Other"
              value="Other"
              checked={formData.pronouns.includes('Other')}
            />
          </FormInputCheckbox>
        </FormQuestionContainer>
        {errors.pronouns && isNext && (
          <FormHelperText>{errorMessages.pronouns}</FormHelperText>
        )}
      </FormControl>
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
          handlePronounNext();
        }}
      >
        Next
      </Button>
    </SampleForm>
  );
};
