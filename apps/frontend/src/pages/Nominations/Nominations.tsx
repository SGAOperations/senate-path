import {
  FormGroup,
  FormLabel,
  Box,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const Nominations: React.FC = () => {
  // START: fetch example
  // For more info, https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  const fetchData = () => {
    fetch('http://localhost:3000/api/applications')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  // END: fetch example

  const [fullName, setFullName] = useState('');
  const [northeasternEmail, setNortheasternEmail] = useState('');
  const [nominee, setNominee] = useState('');
  const [constituent, setConstituent] = useState('');
  const [college, setCollege] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [receiveInfo, setReceiveInfo] = useState('');
  const isFullNameError = fullName === '';
  const isNortheasternEmailError = northeasternEmail === '';
  const isNomineeError = nominee === '';
  const isConstituentError = constituent === '';
  const isCollegeError = college === '';
  const isMajorError = major === '';
  const isGradYearError = gradYear === '';
  const isRecieveInfoError = receiveInfo === '';
  const handleSampleFormSubmit = () => {
    if (
      isFullNameError ||
      isNortheasternEmailError ||
      isNomineeError ||
      isConstituentError ||
      isCollegeError ||
      isMajorError ||
      isGradYearError ||
      isRecieveInfoError
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
  };
  return (
    <>
      {
        /* TODO delete the above text and replace it with the nominations form here */
        <Box>
          <FormGroup>
            <h1>SGA Senator Nomination Form</h1>
            <p>
              Complete this form to nominate a person to become a senator in the
              Student Government Association (SGA). SGA serves as the voice of
              the undergraduate student body and strives to promote student
              interests in the university and its surrounding communities. To
              learn more about SGA, visit our website at northeasternsga.com.
            </p>
            <p>
              This form is a nomination, not a vote. It is simply a statement
              you would like to see one of your peers become a senator in SGA.
              You may complete this form for an unlimited number of prospective
              senators, but you may only nominate each student once. You must
              belong to the same constituency as the prospective senator seeks
              to represent (so only undergraduate students in the College of
              Engineering may nominate senators for the College of Engineering,
              only NUin students may nominate senators for the NUin program,
              etc).
            </p>
            <p>
              SGA senator applications are currently open. To apply for a
              senatorship, visit <a href="">Senator Applications</a>
            </p>
            <p>
              Please contact Cassidy Donoghue at donoghue.ca@northeastern.edu
              with any questions.
            </p>
          </FormGroup>
          <FormControl>
            <FormControl required>
              <h1>What is your full name?</h1>
              <p>
                Please enter your first and last name as they appear in the
                official university records.
              </p>
              <TextField
                required
                id="outlined-required"
                label="Required"
                defaultValue=""
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormControl>
            <FormGroup>
              <h1>What is your Northeastern email?</h1>
              <p>
                We may contact you to verify the authenticity of this
                nomination.
              </p>
              <TextField
                required
                id="outlined-required"
                label="Required"
                defaultValue=""
                onChange={(e) => setNortheasternEmail(e.target.value)}
              />
            </FormGroup>
            <FormControl required>
              <h1>Select the name of the person you are nominating</h1>
              <InputLabel id="nominee">Nominee</InputLabel>
              <Select
                labelId="nominee"
                label="nominee"
                onChange={(e) => setNominee(e.target.value as string)}
              >
                {/* Insert MenuItems using database of nominees */}
                <MenuItem value={'name'}>Name</MenuItem>
              </Select>
            </FormControl>
            <FormControl required>
              <h1>
                Please confirm you are one of the prospective senator's
                constituents.
              </h1>
              <p>
                Select a college, organization, or program from the list below
                to confirm you are one of the prospective senator's
                constituents.{' '}
                <span style={{ fontWeight: 'bold' }}>
                  You must select the same constituency as the prospective
                  senator for this nomination to be processed.
                </span>
              </p>
              <InputLabel id="constituent">Constituent</InputLabel>
              <Select
                labelId="constituent"
                label="Constituent"
                onChange={(e) => setConstituent(e.target.value as string)}
              >
                {/* Insert MenuItems using database of Constituents */}
                <MenuItem value={'constituent'}>Constituent</MenuItem>
              </Select>
            </FormControl>

            <FormControl required>
              <h1>What is your college?</h1>
              <p>
                Note: For combined majors (a single major listed in the course
                catalog that spans two disciplines), list only the home college.
                For double majors (two distinct majors listed separately in the
                course catalog), include both colleges.
              </p>
              <TextField
                required
                id="outlined-required"
                label="Required"
                defaultValue=""
                onChange={(e) => setCollege(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <h1>What is your major?</h1>
              <TextField
                required
                id="outlined-required"
                label="Required"
                defaultValue=""
                onChange={(e) => setMajor(e.target.value)}
              />
            </FormControl>

            <FormControl required>
              <FormGroup>
                <h1>What is your expected graduation year?</h1>
                <FormLabel id="demo-radio-buttons-group-label">Year</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  onChange={(e) => setGradYear(e.target.value)}
                >
                  <FormControlLabel
                    value="2023"
                    control={<Radio />}
                    label="2023"
                  />
                  <FormControlLabel
                    value="2024"
                    control={<Radio />}
                    label="2024"
                  />
                  <FormControlLabel
                    value="2025"
                    control={<Radio />}
                    label="2025"
                  />
                  <FormControlLabel
                    value="2026"
                    control={<Radio />}
                    label="2026"
                  />
                  <FormControlLabel
                    value="2027"
                    control={<Radio />}
                    label="2027"
                  />
                  <FormControlLabel
                    value="2028"
                    control={<Radio />}
                    label="2028"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormGroup>
            </FormControl>

            <FormControl required>
              <FormGroup>
                <h1>
                  Would you like to receive information about how to become a
                  senator?
                </h1>
                <p>
                  Becoming a senator is an excellent, rewarding opportunity to
                  serve and improve the Northeastern community.
                </p>
                <RadioGroup
                  name="radio-buttons-group"
                  onChange={(e) => setReceiveInfo(e.target.value)}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormGroup>
            </FormControl>

            <Button variant="contained" onClick={handleSampleFormSubmit}>
              Submit
            </Button>
          </FormControl>
        </Box>
      }
    </>
  );
};

export default Nominations;
