import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import {FormSelect, HomeContainer, FormInput, SampleForm, FormText, FormNameText} from './styles';
import { SampleFormData, SampleFullNameData } from './types';
import { MENU_ITEMS } from './constants';
import MenuItem from '@mui/material/MenuItem';





const Nominations: React.FC = () => {
  const [{ name}, setName] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ textField, dropdown }, setFormData] = useState<SampleFormData>({
    textField: '',
    dropdown: '',
  });
  const isDropdownError = dropdown === '';
  const isTextFieldError = name === '';
  return (
    <>
      I am the nominations page
      
      {/* TODO delete the above text and replace it with the nominations form here 
      
      
      
      */
      <HomeContainer>
        <SampleForm>

          <FormControl>
            <FormNameText>What is your full name</FormNameText>
            <FormText>
              Please enter your full name as it appears in the university records. This name will only be used in official communications between SGA leadership and university administrators.
            </FormText>

            <FormInput
              id="text-field"
              name="textField"
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
          </FormControl>



        <FormControl>
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
            </SampleForm>
      </HomeContainer>
      
      }
    </>
  );
};

export default Nominations;
