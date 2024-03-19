import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import {FormSelect, HomeContainer} from './styles';
import { SampleFormData } from './types';
import { MENU_ITEMS } from './constants';
import MenuItem from '@mui/material/MenuItem';





const Nominations: React.FC = () => {
  const [{dropdown }, setFormData] = useState<SampleFormData>({
    textField: '',
    dropdown: '',
  });
  const isDropdownError = dropdown === '';
  return (
    <>
      I am the nominations page
      
      {/* TODO delete the above text and replace it with the nominations form here 
      
      
      
      */
      <HomeContainer>
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
      </HomeContainer>
      
      }
    </>
  );
};

export default Nominations;
