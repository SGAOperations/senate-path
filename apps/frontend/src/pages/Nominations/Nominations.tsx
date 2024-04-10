import { FormGroup, FormLabel, Box, Typography, TextField, InputLabel, Select, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { HomeContainer, FormInput, SampleForm, FormTextContainer, FormQuestionContainer, FormTextAnswerContainer, Introduction, FormInputCheckbox, FormSelect, RadioButtons, Title } from '../Nominations/styles';
import React, { useState, useEffect } from 'react';
import SubmitPopUp from '../../components/SubmitPopUp';

const Nominations: React.FC = () => {
  // START: fetch example
  // For more info, https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // const fetchData = (formData) => {
  //   fetch('http://localhost:3000/api/nominations', {
  //     method: 'POST',
  //     body:
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // useEffect((formData) => {
  //   fetchData(formData);
  // }, []);
  // END: fetch example

  const [fullName, setFullName] = useState('');
  const [northeasternEmail, setNortheasternEmail] = useState('');
  const [nominee, setNominee] = useState('');
  const [constituent, setConstituent] = useState('');
  const [college, setCollege] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState(0);
  const [receiveInfo, setReceiveInfo] = useState(false);
  const isFullNameError = fullName === '';
  const isNortheasternEmailError = northeasternEmail === '';
  const isNomineeError = nominee === '';
  const isConstituentError = constituent === '';
  const isCollegeError = college === '';
  const isMajorError = major === '';
  const isGradYearError = gradYear === 0;
  const [open, setOpen] = useState(false);
  const handleSampleFormSubmit = () => {
    if (
      isFullNameError ||
      isNortheasternEmailError ||
      isNomineeError ||
      isConstituentError ||
      isCollegeError ||
      isMajorError ||
      isGradYearError
    ) {
      console.log("One or more fields don't pass validation");
      return;
    }
    
    console.log(
      'Values:',
      fullName,
      northeasternEmail,
      nominee,
      constituent,
      college,
      major,
      gradYear,
      receiveInfo
    );
    const values = {
      fullName,
      email: northeasternEmail, 
      nominee, 
      constituency: constituent, 
      college, 
      major, 
      graduationYear: gradYear, 
      receiveSenatorInfo: receiveInfo}

    fetch('http://localhost:3000/api/nominations', {
      method: 'POST',
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(values)
    })
    .then((data) => {
      console.log(data);
      if (data.ok) {
        console.log('Nomination successfully submitted');      
        setOpen(true);  
      } else {
        console.log(`Nomination failed to submit: ${data.statusText}`);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };


  return (
    <>
      {
      <HomeContainer>
        <SampleForm>
          <Title>SGA Senator Nomination Form </Title>
            <p>Complete this form to nominate a person to become a senator in the Student Government Association (SGA). SGA serves as the voice of the undergraduate student body and strives to promote student interests in the university and its surrounding communities. To learn more about SGA, visit our website at northeasternsga.com.</p>
            <p>This form is a nomination, not a vote. It is simply a statement you would like to see one of your peers become a senator in SGA. You may complete this form for an unlimited number of prospective senators, but you may only nominate each student once. You must belong to the same constituency as the prospective senator seeks to represent (so only undergraduate students in the College of Engineering may nominate senators for the College of Engineering, only NUin students may nominate senators for the NUin program, etc).</p>
            <p>SGA senator applications are currently open. To apply for a senatorship, visit <a href="">Senator Applications</a></p>
            <p>Please contact Cassidy Donoghue at donoghue.ca@northeastern.edu with any questions.</p>
        </SampleForm>

          <SampleForm>
            <FormControl required>
              <FormQuestionContainer>
                <FormTextContainer>
                  <h1>What is your full name?</h1>
                  <p>
                    Please enter your first and last name as they appear in the
                    official university records.
                  </p>
                </FormTextContainer>
                <FormTextAnswerContainer>
                  <TextField
                    required
                    id="outlined-required"
                    label="Required"
                    defaultValue=""
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </FormTextAnswerContainer>
              </FormQuestionContainer>
            </FormControl>
          </SampleForm>
        
        <SampleForm>
          <FormQuestionContainer>
            <FormTextContainer>
            <h1>What is your Northeastern email?</h1>
            <p>We may contact you to verify the authenticity of this nomination.</p>
            </FormTextContainer>
            <FormTextAnswerContainer>
            <TextField
              required
              id="outlined-required"
              label="Required"
              defaultValue=""
              onChange={(e) =>
                setNortheasternEmail(e.target.value)
              }
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </SampleForm>

        <SampleForm>
          <FormQuestionContainer>
            <FormTextContainer>
            <h1>Select the name of the person you are nominating</h1>
            </FormTextContainer>
            <FormTextAnswerContainer>
              
            <FormSelect
            required
            label="nominee"
            onChange={(e) =>
              setNominee(e.target.value as string)
            }
          >
            {/* Insert MenuItems using database of nominees */}
            <MenuItem value={"Name1"}>Name1</MenuItem>
            <MenuItem value={"Name2"}>Name2</MenuItem>
            <MenuItem value={"Name3"}>Name3</MenuItem>
            <MenuItem value={"Name4"}>Name4</MenuItem>

          </FormSelect>
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </SampleForm>

        <SampleForm>
          <FormQuestionContainer>
            <FormTextContainer>
            <h1>Please confirm you are one of the prospective senator's constituents.</h1>
          <p>Select a college, organization, or program from the list below to confirm you are one of the prospective senator's constituents. <span  style={{fontWeight: 'bold'}}>You must select the same constituency as the prospective senator for this nomination to be processed.</span></p>
            </FormTextContainer>
            <FormTextAnswerContainer>
            <FormSelect
            required
            onChange={(e) =>
              setConstituent(e.target.value as string)
            }
          >
            {/* Insert MenuItems using database of Constituents */}
            <MenuItem value={"Alpha Chi Omega Sorority"}>Alpha Chi Omega Sorority</MenuItem>
            <MenuItem value={"Alpha Epsilon Phi"}>Alpha Epsilon Phi</MenuItem>
            <MenuItem value={"Alpha Epsilon Pi"}>Alpha Epsilon Pi</MenuItem>
            <MenuItem value={"Bouvé College of Health Sciences"}>Bouvé College of Health Sciences</MenuItem>
            <MenuItem value={"College of Science"}>College of Science</MenuItem>
            <MenuItem value={"College of Social Sciences and Humanities"}>College of Social Sciences and Humanities</MenuItem>
            <MenuItem value={"D'Amore-McKim School of Business"}>D'Amore-McKim School of Business</MenuItem>
            <MenuItem value={"Delta Phi Epsilon"}>Delta Phi Epsilon</MenuItem>
            <MenuItem value={"Delta Tau Delta"}>Delta Tau Delta</MenuItem>
            <MenuItem value={"Delta Zeta"}>Delta Zeta</MenuItem>
            <MenuItem value={"Global Scholars program"}>Global Scholars program</MenuItem>
            <MenuItem value={"Honors program"}>Honors program</MenuItem>
            <MenuItem value={"Kappa Delta"}>Kappa Delta</MenuItem>
            <MenuItem value={"Khoury College of Computer Sciences"}>Khoury College of Computer Sciences</MenuItem>
            <MenuItem value={"Northeastern University Real Estate Club (NURE)"}>Northeastern University Real Estate Club (NURE)</MenuItem>
            <MenuItem value={"NU Immerse"}>NU Immerse</MenuItem>
            <MenuItem value={"Phi Sigma Rho"}>Phi Sigma Rho</MenuItem>
            <MenuItem value={"Sandbox"}>Sandbox</MenuItem>

          </FormSelect>
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </SampleForm>
          
        <SampleForm>
          <FormQuestionContainer>
            <FormTextContainer>
            <h1>What is your college?</h1>
          <p>Note: For combined majors (a single major listed in the course catalog that spans two disciplines), list only the home college. For double majors (two distinct majors listed separately in the course catalog), include both colleges.</p>
            </FormTextContainer>
            <FormTextAnswerContainer>
            <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue=""
          onChange={(e) =>
            setCollege(e.target.value)
          }
          />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </SampleForm>

          <SampleForm>
            <FormQuestionContainer>
              <FormTextContainer>
                <h1>What is your major?</h1>
              </FormTextContainer>
              <FormTextAnswerContainer>
                <TextField
                  required
                  id="outlined-required"
                  label="Required"
                  defaultValue=""
                  onChange={(e) => setMajor(e.target.value)}
                />
              </FormTextAnswerContainer>
            </FormQuestionContainer>
          </SampleForm>

          <SampleForm>
            <FormQuestionContainer>
              <FormTextContainer>
                <h1>What is your expected graduation year?</h1>
              </FormTextContainer>
              <RadioButtons>
          <RadioGroup
            name="year-buttons-group"
            aria-required
            onChange={(e) =>
              setGradYear(Number.parseInt(e.target.value))
            }
            /* TODO pick up radio options from env variable */
          >
            <FormControlLabel value={2023} control={<Radio />} label="2023" />
            <FormControlLabel value={2024} control={<Radio />} label="2024" />
            <FormControlLabel value={2025} control={<Radio />} label="2025" />
            <FormControlLabel value={2026} control={<Radio />} label="2026" />
            <FormControlLabel value={2027} control={<Radio />} label="2027" />
            <FormControlLabel value={2028} control={<Radio />} label="2028" />
          </RadioGroup>
              </RadioButtons>
            </FormQuestionContainer>
          </SampleForm>

          <SampleForm>
            <FormQuestionContainer>
              <FormTextContainer>
                <h1>
                  Would you like to receive information about how to become a
                  senator?
                </h1>
                <p>
                  Becoming a senator is an excellent, rewarding opportunity to
                  serve and improve the Northeastern community.
                </p>
              </FormTextContainer>
              <RadioButtons>
                <RadioGroup
                  aria-required
                  name="receive-buttons-group"
                  onChange={(e) => setReceiveInfo(e.target.value==="Yes")}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </RadioButtons>
            </FormQuestionContainer>
          </SampleForm>

          <Button variant="contained" onClick={handleSampleFormSubmit}>
            Submit
          </Button>
          <SubmitPopUp open = {open} setOpen={ setOpen} name = {'Nomination'}></SubmitPopUp>
        </HomeContainer>
      }
    </>
  );
};

export default Nominations;
