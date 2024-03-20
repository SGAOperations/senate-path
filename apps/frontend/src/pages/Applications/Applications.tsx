import { useState } from 'react';
import { useFormControl } from '@mui/material/FormControl';
import FormControl from '@mui/material/FormControl';
import { HomeContainer, FormInput, SampleForm, FormTextContainer, FormQuestionContainer, FormTextAnswerContainer} from './styles';
import { SampleFullNameData } from './types';





const Nominations: React.FC = () => {
  const [{ name}, setName] = useState<SampleFullNameData>({
    name: '',
  });
  const isTextFieldError = name === '';
  return (
    <>
      I am the applications page
      
      {/* TODO delete the above text and replace it with the nominations form here 
      
      
      
      */
      <HomeContainer>
        <SampleForm>

          <FormControl
          required
          >
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
                value={name}
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
      </HomeContainer>
      
      }
    </>
  );
};

export default Nominations;
