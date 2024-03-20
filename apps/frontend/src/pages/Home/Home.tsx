import { useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

import { MENU_ITEMS } from './constants';
import { HomeContainer, SampleForm, FormInput, FormSelect } from './styles';
import { SampleFormData } from './types';

const Home: React.FC = () => {
  const [{ textField, dropdown }, setFormData] = useState<SampleFormData>({
    textField: '',
    dropdown: '',
  });

  const isTextFieldError = textField === '';
  const isDropdownError = dropdown === '';

  const handleSampleFormSubmit = () => {
    if (isTextFieldError || isDropdownError) {
      console.log("One or more fields don't pass validation");
      return;
    }

    console.log('Values:', textField, dropdown);
  };

  return (
    <>
      <div>I am the home page</div>

      <HomeContainer>
        {/* Note that the form should be its own component */}
        <div>Sample form</div>
        <SampleForm>
          <FormControl>
            This is an example of a text field
            <FormInput
              value={textField}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  textField: e.target.value,
                }))
              }
              error={isTextFieldError}
            />
          </FormControl>

          <FormControl>
            This is an example of a dropdown menu
            <FormSelect
              label="Dropdown"
              value={dropdown}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  dropdown: e.target.value as string,
                }))
              }
              error={isDropdownError}
            >
              {MENU_ITEMS.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </FormSelect>
          </FormControl>

          <Button variant="contained" onClick={handleSampleFormSubmit}>
            You can click on this button to submit the form
          </Button>
        </SampleForm>
      </HomeContainer>
    </>
  );
};

export default Home;
