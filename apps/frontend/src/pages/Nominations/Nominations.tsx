import { FormGroup, FormLabel, Box, Typography, TextField, InputLabel, Select, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
const Nominations: React.FC = () => {
  return (
    <>
      I am the nominations page
      {/* TODO delete the above text and replace it with the nominations form here */
      <Box>
        <FormGroup>
          <Typography variant="h3">
            SGA Senator Nomination Form
          </Typography>
          <Typography variant="subtitle2">
            Complete this form to nominate a person to become a senator in the Student Government Association (SGA). SGA serves as the voice of the undergraduate student body and strives to promote student interests in the university and its surrounding communities. To learn more about SGA, visit our website at northeasternsga.com.
          </Typography>
          <Typography variant="subtitle2">
            This form is a nomination, not a vote. It is simply a statement you would like to see one of your peers become a senator in SGA. You may complete this form for an unlimited number of prospective senators, but you may only nominate each student once. You must belong to the same constituency as the prospective senator seeks to represent (so only undergraduate students in the College of Engineering may nominate senators for the College of Engineering, only NUin students may nominate senators for the NUin program, etc).
          </Typography>
          <Typography variant="subtitle2">
            SGA senator applications are currently open. To apply for a senatorship, visit <a href="">Senator Applications</a>
          </Typography>
          <Typography variant="subtitle2">
            Please contact Cassidy Donoghue at donoghue.ca@northeastern.edu with any questions.
          </Typography>
        </FormGroup>
        <FormControl>
        <FormControl required>
          <Typography variant="subtitle1">
          What is your full name?
          </Typography>
          <Typography variant="body1">
          Please enter your first and last name as they appear in the official university records.
          </Typography>
          <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue=""
          />
        </FormControl>
        <FormGroup>
          <Typography variant="subtitle1">
            What is your Northeastern email?
          </Typography>
          <Typography variant="body1">
            We may contact you to verify the authenticity of this nomination.
          </Typography>
          <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue=""
          />
        </FormGroup>
        <FormControl required>
          <Typography variant="subtitle1">
          Select the name of the person you are nominating.
          </Typography>
           <InputLabel id="nominee">Nominee</InputLabel>
            <Select
            labelId="nominee"
  
            label="Nominee"
          >
            {/* Insert MenuItems using database of nominees */}
            {/* <MenuItem value={"name"}>Name</MenuItem> */}
          </Select>
        </FormControl>
        <FormControl required>
          <Typography variant="subtitle1">
          Please confirm you are one of the prospective senator's constituents.
          </Typography>
          <Typography variant="body1">
          Select a college, organization, or program from the list below to confirm you are one of the prospective senator's constituents. <span  style={{fontWeight: 'bold'}}>You must select the same constituency as the prospective senator for this nomination to be processed.</span>
          </Typography>
           <InputLabel id="constituent">Constituent</InputLabel>
            <Select
            labelId="constituent"
            label="Constituent"
          >
            {/* Insert MenuItems using database of Constituents */}
            {/* <MenuItem value={"constituent"}>Constituent</MenuItem> */}
          </Select>
        </FormControl>

        <FormControl required>
          <Typography variant="subtitle1">
          What is your college?
          </Typography>
          <Typography variant="body1">
          Note: For combined majors (a single major listed in the course catalog that spans two disciplines), list only the home college. For double majors (two distinct majors listed separately in the course catalog), include both colleges.
          </Typography>
          <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue=""
          />

        </FormControl>

        <FormControl >
          <Typography variant="subtitle1">
          What is your major?
          </Typography>
          <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue=""
          />

        </FormControl>

        <FormControl required>
          <FormGroup>
          <Typography variant="subtitle1">
          What is your expected graduation year?
          </Typography>
          <FormLabel id="demo-radio-buttons-group-label">Year</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
          >
            <FormControlLabel value="2023" control={<Radio />} label="2023" />
            <FormControlLabel value="2024" control={<Radio />} label="2024" />
            <FormControlLabel value="2025" control={<Radio />} label="2025" />
            <FormControlLabel value="2026" control={<Radio />} label="2026" />
            <FormControlLabel value="2027" control={<Radio />} label="2027" />
            <FormControlLabel value="2028" control={<Radio />} label="2028" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
          </FormGroup>
        </FormControl>

        <FormControl required>
          <FormGroup>
          <Typography variant="subtitle1">
          Would you like to receive information about how to become a senator?
          </Typography>
          <Typography variant="body1">
          Becoming a senator is an excellent, rewarding opportunity to serve and improve the Northeastern community.
          </Typography>
          <RadioGroup
            name="radio-buttons-group"
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
          </FormGroup>
        </FormControl>

        </FormControl>
        
      </Box>

      }
    </>
    
  );
};

export default Nominations;
