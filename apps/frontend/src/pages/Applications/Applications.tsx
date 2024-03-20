import { useState } from 'react';
import { useFormControl } from '@mui/material/FormControl';
import FormControl from '@mui/material/FormControl';
import { HomeContainer, FormInput, SampleForm, FormTextContainer, FormQuestionContainer, FormTextAnswerContainer} from './styles';
import { SampleFullNameData } from './types';





const Nominations: React.FC = () => {
  const [{ name: fullName}, setName] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: preferredName}, setPreferredName] = useState<SampleFullNameData>({
    name: '',
  });
  const isTextFieldError = fullName === '';
  return (
      
      <HomeContainer>
      {
      
        <SampleForm>
          <FormControl>
            <FormQuestionContainer>
              <FormTextContainer>What is your full name?
              <br></br>
              Please enter your full name as it appears in the university records. This name will only be used in official communications between SGA leadership and university administrators.
              </FormTextContainer>
              <FormTextAnswerContainer>
                <FormInput
                  required
                  id="outlined-basic"
                  name="name"
                  placeholder="Your answer"
                  value={fullName}
                  onChange={(e) =>
                    setName((prevData) => ({
                      ...prevData,
                      name: e.target.value,
                    }))
                  }
                  error={isTextFieldError}
                />
              </FormTextAnswerContainer>
            </FormQuestionContainer>
          </FormControl>
        </SampleForm>
      }
      {
        <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>What is your preferred name?
            <br></br>
            Please enter your preferred first and last name. Do not enter any nicknames in this field. This name will be used for all official SGA business. It will be posted on the website and printed on your senator placard.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                required
                id="outlined-basic"
                name="name"
                placeholder="Your answer"
                value={preferredName}
                onChange={(e) =>
                  setPreferredName((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                error={isTextFieldError}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }
      </HomeContainer>
  );
};

export default Nominations;
