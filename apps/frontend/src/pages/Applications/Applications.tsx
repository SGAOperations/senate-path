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
      <HomeContainer>
        <SampleForm>

        <Introduction>
          <h2>SGA Senator Application</h2>
          <p>Thank you for your interest in joining the Student Government Association (SGA)! SGA serves as the voice of the undergraduate student body and strives to promote student interests in the university and its surrounding communities. We have many active projects and initiatives. Read more about our work at northeasternsga.com.</p>
          <p>Any undergraduate student in good academic and judicial standing is eligible to apply to become a senator. There are no elections. Read more about the process to become a senator in the frequently asked questions document here and please contact Senate Speaker Donoghue at Donoghue.ca@northeastern.edu with any questions.</p>
          <p>This form is the first step in becoming a senator, the second step is to gather signatures. For your application to be accepted, you need to collect at least 30 nominations from students in your constituency. If you are applying to be a special interest senator and your organization has less than 40 members, you must get three fourths of the organization’s members’ signatures. This form must be submitted so your name can be automatically added to the signature collection form. Both forms will stop accepting submissions on January 30th at 11:59 pm EST.</p>
          <p>Welcome to SGA!</p>
        </Introduction>

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
    </>
  );
};

export default Nominations;
