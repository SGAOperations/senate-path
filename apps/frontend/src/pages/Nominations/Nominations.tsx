import { FormGroup, FormLabel, Box, Typography, TextField, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
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

        </FormControl>
        <FormGroup>
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
        </FormGroup>
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
        <FormGroup>
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
        </FormGroup>
      </Box>

      }
    </>
    
  );
};

export default Nominations;
