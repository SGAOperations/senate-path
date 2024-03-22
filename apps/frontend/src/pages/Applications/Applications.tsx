import { useState } from 'react';
import { useFormControl } from '@mui/material/FormControl';
import { MenuItem, FormControl } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { HomeContainer, FormInput, SampleForm, FormTextContainer, FormQuestionContainer, FormTextAnswerContainer, Introduction, FormInputCheckbox, FormSelect, FormDropdown } from './styles';
import { SampleFullNameData, SampleFormData } from './types';
import { YEARS, CONSTITUENCY, CONSTITUENCY_TYPE } from './constants'


const Nominations: React.FC = () => {
  const [{ name: fullName}, setName] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: preferredName}, setPreferredName] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: pronunciation}, setPronunciation] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: nickname}, setNickname] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: northeasternID}, setNortheasternID] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: email}, setEmail] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: phoneNumber}, setPhoneNumber] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: college}, setCollege] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: major}, setMajor] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: minors}, setMinors] = useState<SampleFullNameData>({
    name: '',
  });
  const [{ name: constituencyName}, setConstituencyName] = useState<SampleFullNameData>({
    name: '',
  });

  const [{ textField, dropdown }, setFormData] = useState<SampleFormData>({
    textField: '',
    dropdown: '',
  });

  const [{ textField2, dropdown2 }, setFormData2] = useState<SampleFormData>({
    textField2: '',
    dropdown2: '',
  });

  const [{ textField3, dropdown3 }, setFormData3] = useState<SampleFormData>({
    textField3: '',
    dropdown3: '',
  });

  const [pronouns, setPronouns] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (pronouns.includes(value)) {
      setPronouns(pronouns.filter(pronoun => pronoun !== value));
    } else {
      setPronouns([...pronouns, value]);
    }
  };

  const isTextFieldError = fullName === '';
  const isDropdownError = dropdown === '';


  return (
      <HomeContainer>
        {
          <SampleForm>
            <Introduction style={{ textAlign: 'center' }}>
              <h2>SGA Senator Application</h2>
              Thank you for your interest in joining the Student Government Association (SGA)! SGA serves as the voice of the undergraduate student body and strives to promote student interests in the university and its surrounding communities. We have many active projects and initiatives. Read more about our work at northeasternsga.com.
              <br></br>
              Any undergraduate student in good academic and judicial standing is eligible to apply to become a senator. There are no elections. Read more about the process to become a senator in the frequently asked questions document (https://docs.google.com/document/d/1xDyzPBpnlzlHmPL9pd2mGsKhzQCl_Cs9EPlFb0G-Y_o/edit) and please contact Senate Speaker Donoghue at Donoghue.ca@northeastern.edu with any questions.
              <br></br>
              This form is the first step in becoming a senator, the second step is to gather signatures. For your application to be accepted, you need to collect at least 30 nominations from students in your constituency. If you are applying to be a special interest senator and your organization has less than 40 members, you must get three fourths of the organization’s members’ signatures. This form must be submitted so your name can be automatically added to the signature collection form. Both forms will stop accepting submissions on January 30th at 11:59 pm EST.
              <br></br>
              Welcome to SGA!
              <br></br>
            </Introduction>
          </SampleForm>
          
        }
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
                  label="Required"
                  placeholder="Your Full Name"
                  required
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
                label = "Required"
                required
                placeholder="Your Preferred Name"
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
      {
        <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is the phonetic pronunciation of your name?
            <br></br>
            Please enter how to pronounce your name. This pronunciation will be used during roll-call votes.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label = "Required"
                required
                placeholder="Name Pronunciation"
                value={pronunciation}
                onChange={(e) =>
                  setPronunciation((prevData) => ({
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
            <FormTextContainer>
            What is your nickname?
            <br></br>
            If you have a nickname, please enter it here. This name will not be used in official SGA business, but it will be used informally when appropriate.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                placeholder="Nickname"
                value={nickname}
                onChange={(e) =>
                  setNickname((prevData) => ({
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
            <FormTextContainer>
            What is your NUID?
            <br></br>
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label = "Required"
                required
                placeholder="NUID"
                value={northeasternID}
                onChange={(e) =>
                  setNortheasternID((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                error={isTextFieldError}
              />
              <br></br>
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }

      {
      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
            What pronouns do you use?
            </FormTextContainer>
                <FormInputCheckbox>
                  
                  <FormControlLabel required control={<Checkbox />} onChange={handleCheckboxChange} label="She/her/her" value="She/her/her" checked={pronouns.includes('She/her/her')}/>
                  <FormControlLabel required control={<Checkbox />} onChange={handleCheckboxChange} label="He/him/his" value="He/him/his" checked={pronouns.includes('He/him/his')}/>
                  <FormControlLabel required control={<Checkbox />} onChange={handleCheckboxChange} label="They/them/their" value="They/them/their" checked={pronouns.includes('They/them/their')}/>
                  <FormControlLabel required control={<Checkbox />} onChange={handleCheckboxChange} label="Other" value="Other" checked={pronouns.includes('Other')}/>
                
                </FormInputCheckbox>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }

      {
        <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
            What is your Northeastern email?
            <br></br>
            All email communications will be sent to this address.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label = "Required"
                required
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail((prevData) => ({
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
            <FormTextContainer>
            What is your phone number?
            <br></br>
            Please enter your cell phone number. If you do not have a phone that can receive calls and texts in the United States, note so here. Make sure to include the country code if your phone number has a country code other than 1 (most North American countries and islands).
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label = "Required"
                required
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber((prevData) => ({
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
            <FormTextContainer>
            What is your year?
            <br></br>
            </FormTextContainer>
            <FormDropdown>
            <FormSelect
              label="Dropdown"
              required
              value={dropdown}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  dropdown: e.target.value as string,
                }))
              }
              error={isDropdownError}
            >
              {YEARS.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </FormSelect>
            </FormDropdown>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }

{
      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
            What is your college?
            <br></br>
            For combined majors (a single major listed in the course catalog that spans two disciplines), list only the home college. For double majors (two distinct majors listed separately in the course catalog), include both colleges.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label = "Required"
                required
                placeholder="College"
                value={college}
                onChange={(e) =>
                  setCollege((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                error={isTextFieldError}
              />
              <br></br>
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }

{
      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
            What is your major?
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label = "Required"
                required
                placeholder="Major"
                value={major}
                onChange={(e) =>
                  setMajor((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                error={isTextFieldError}
              />
              <br></br>
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }

{
      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
            What are your minors?
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                placeholder="Minors"
                value={minors}
                onChange={(e) =>
                  setMinors((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                error={isTextFieldError}
              />
              <br></br>
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }

{
        <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
            What is your constituency?
            <br></br>
            Academic senators represent an official Northeastern academic college or program. Example constituencies include the College of Engineering, the Global Scholars program, or the Honors program. Students in specialized entrance programs can only apply to become a senator representing a specialized entrance program as a constituency while actively enrolled in the program. For example, students can only apply to be NUin senators as first-semester students. Most senators are academic senators.
            <br></br>
            Special interest senators are selected by the members and executive board of the organization they intend to represent. Example constituencies include Greek life organizations and clubs. More information about the difference between academic and special interest senators is available in the frequently asked questions document located at https://docs.google.com/document/d/1xDyzPBpnlzlHmPL9pd2mGsKhzQCl_Cs9EPlFb0G-Y_o/edit. 
            <br></br>
            </FormTextContainer>
            <FormDropdown>
            <FormSelect
              label="Dropdown2"
              required
              value={dropdown2}
              onChange={(e) =>
                setFormData2((prevData) => ({
                  ...prevData,
                  dropdown: e.target.value as string,
                }))
              }
              error={isDropdownError}
            >
              {CONSTITUENCY.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </FormSelect>
            </FormDropdown>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }

      {
        <SampleForm>
        <FormControl>
            <FormTextContainer>
            <h3>Special Interest Senator Constituency Information</h3>
            Note: Special interest senators applying from a student organization with less than 30 members must submit a paper nomination. Paper applications are available to pick up at the SGA office, 332 Curry.
            </FormTextContainer>
        </FormControl>
      </SampleForm>
      }

{
        <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
            What type of constituency would you like to represent?
            </FormTextContainer>
            <FormDropdown>
            <FormSelect
              label="Dropdown3"
              required
              value={dropdown3}
              onChange={(e) =>
                setFormData3((prevData) => ({
                  ...prevData,
                  dropdown: e.target.value as string,
                }))
              }
              error={isDropdownError}
            >
              {CONSTITUENCY_TYPE.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </FormSelect>
            </FormDropdown>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }

{
      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
            What is the name of your constituency?
            <br></br>
            Please enter the name of the organization as recognized by the Student Involvement Board. Only recognized student organizations may have a special interest senator.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label = "Required"
                required
                placeholder="Constituency Name"
                value={constituencyName}
                onChange={(e) =>
                  setConstituencyName((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
                error={isTextFieldError}
              />
              <br></br>
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>
      }


      </HomeContainer>
      
  );
};

export default Nominations;
