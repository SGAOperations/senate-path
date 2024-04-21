import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';

import {
  FormInput,
  SampleForm,
  FormTextContainer,
  FormQuestionContainer,
  FormTextAnswerContainer,
  Introduction,
  FormInputCheckbox,
  RadioButtons,
} from './styles';

interface Props {
  setIsPopupOpen: (open: boolean) => void;
}

const ApplicationForm: React.FC<Props> = ({ setIsPopupOpen }) => {
  const [fullName, setFullName] = useState<string>('');
  const [preferredFullName, setPreferredFullName] = useState<string>('');
  const [phoneticPronunciation, setPhoneticPronunciation] =
    useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [northeasternID, setNortheasternID] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [minors, setMinors] = useState<string>('');
  const [constituencyName, setConstituencyName] = useState<string>('');

  const [year, setYear] = useState<number>();
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setYear(value);
  };

  const [constituency, setConstituency] = useState<string>('academic');
  const handleConstituencyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConstituency(event.target.value);
  };

  const [constituencyType, setConstituencyType] = useState<string>('club');
  const handleConstituencyTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConstituencyType(event.target.value);
  };

  const [returningSenatorType, setReturningSenatorType] =
    useState<string>('no');
  const handleReturningTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReturningSenatorType(event.target.value);
  };

  const [attestation, setAttestation] = useState<string>();
  const handleAttestationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAttestation(event.target.value);
  };

  const [pronouns, setPronouns] = useState<string[]>([]);
  const handleCheckboxChange = (event: React.SyntheticEvent) => {
    const { value } = event.currentTarget;
    if (pronouns.includes(value)) {
      setPronouns(pronouns.filter((pronoun) => pronoun !== value));
    } else {
      setPronouns([...pronouns, value]);
    }
  };

  const isTextFieldError = fullName === '';
  const isPreferredFullNameError = preferredFullName === '';
  const isPhoneticPronunciationError = phoneticPronunciation === '';
  const isNicknameError = nickname === '';
  const isNortheasternIDError = northeasternID === '';
  const isEmailError = email === '';
  const isPhoneNumberError = phoneNumber === '';
  const isCollegeError = college === '';
  const isMajorError = major === '';
  const isMinorError = minors === '';
  const isconstituencyNameError = constituencyName === '';
  const isYearError = year == null || year < 0;
  const isConstituencyError = constituency == null;
  const isConstituencyTypeError = constituencyType == null;
  const isReturningSenatorError = returningSenatorType == null;
  const isAttestationError = attestation !== 'agree';

  const submitApplication = () => {
    if (
      isTextFieldError ||
      isPreferredFullNameError ||
      isPhoneticPronunciationError ||
      isNicknameError ||
      isNortheasternIDError ||
      isEmailError ||
      isPhoneNumberError ||
      isCollegeError ||
      isMinorError ||
      isMajorError ||
      isconstituencyNameError ||
      isYearError ||
      isConstituencyError ||
      isConstituencyTypeError ||
      isReturningSenatorError ||
      isAttestationError
    ) {
      // TODO show error popup with message
      return;
    }

    const formData = {
      fullName,
      preferredFullName,
      phoneticPronunciation,
      nickname,
      nuid: northeasternID,
      email,
      phoneNumber,
      college,
      major,
      minors,
      constituencyName,
      year: year,
      constituency: constituency,
      selectedConstituencyType: constituencyType,
      selectedReturningType: returningSenatorType,
      selectedAttestation: attestation,
      pronouns: pronouns.join(', '),
    };

    fetch('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((data) => {
        if (data.ok) {
          setIsPopupOpen(true);
        } else {
          // TODO show error popup with below message
          console.log(`Application failed to submit: ${data.statusText}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <SampleForm>
        <Introduction>
          <h2>SGA Senator Application</h2>
          Thank you for your interest in joining the Student Government
          Association (SGA)! SGA serves as the voice of the undergraduate
          student body and strives to promote student interests in the
          university and its surrounding communities. We have many active
          projects and initiatives. Read more about our work at
          northeasternsga.com.
          <br />
          Any undergraduate student in good academic and judicial standing is
          eligible to apply to become a senator. There are no elections. Read
          more about the process to become a senator in the frequently asked
          questions document
          (https://docs.google.com/document/d/1xDyzPBpnlzlHmPL9pd2mGsKhzQCl_Cs9EPlFb0G-Y_o/edit)
          and please contact Senate Speaker Donoghue at
          Donoghue.ca@northeastern.edu with any questions.
          <br />
          This form is the first step in becoming a senator, the second step is
          to gather signatures. For your application to be accepted, you need to
          collect at least 30 nominations from students in your constituency. If
          you are applying to be a special interest senator and your
          organization has less than 40 members, you must get three fourths of
          the organization’s members’ signatures. This form must be submitted so
          your name can be automatically added to the signature collection form.
          Both forms will stop accepting submissions on January 30th at 11:59 pm
          EST.
          <br />
          Welcome to SGA!
          <br />
        </Introduction>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is your full name?
              <br />
              Please enter your full name as it appears in the university
              records. This name will only be used in official communications
              between SGA leadership and university administrators.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                placeholder="Your Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={isTextFieldError}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is your preferred name?
              <br />
              Please enter your preferred first and last name. Do not enter any
              nicknames in this field. This name will be used for all official
              SGA business. It will be posted on the website and printed on your
              senator placard.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Your Preferred Name"
                value={preferredFullName}
                onChange={(e) => setPreferredFullName(e.target.value)}
                error={isPreferredFullNameError}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is the phonetic pronunciation of your name?
              <br />
              Please enter how to pronounce your name. This pronunciation will
              be used during roll-call votes.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Name Pronunciation"
                value={phoneticPronunciation}
                onChange={(e) => setPhoneticPronunciation(e.target.value)}
                error={isPhoneticPronunciationError}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is your nickname?
              <br />
              If you have a nickname, please enter it here. This name will not
              be used in official SGA business, but it will be used informally
              when appropriate.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                error={isNicknameError}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is your NUID?
              <br />
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="NUID"
                value={northeasternID}
                onChange={(e) => setNortheasternID(e.target.value)}
                error={isNortheasternIDError}
              />
              <br />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>What pronouns do you use?</FormTextContainer>
            <FormInputCheckbox>
              <FormControlLabel
                required
                control={<Checkbox />}
                onChange={handleCheckboxChange}
                label="She/her/her"
                value="She/her/her"
                checked={pronouns.includes('She/her/her')}
              />
              <FormControlLabel
                required
                control={<Checkbox />}
                onChange={handleCheckboxChange}
                label="He/him/his"
                value="He/him/his"
                checked={pronouns.includes('He/him/his')}
              />
              <FormControlLabel
                required
                control={<Checkbox />}
                onChange={handleCheckboxChange}
                label="They/them/their"
                value="They/them/their"
                checked={pronouns.includes('They/them/their')}
              />
              <FormControlLabel
                required
                control={<Checkbox />}
                onChange={handleCheckboxChange}
                label="Other"
                value="Other"
                checked={pronouns.includes('Other')}
              />
            </FormInputCheckbox>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is your Northeastern email?
              <br />
              All email communications will be sent to this address.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={isEmailError}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is your phone number?
              <br />
              Please enter your cell phone number. If you do not have a phone
              that can receive calls and texts in the United States, note so
              here. Make sure to include the country code if your phone number
              has a country code other than 1 (most North American countries and
              islands).
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={isPhoneNumberError}
              />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is your year?*
              <br />
            </FormTextContainer>
            <RadioButtons>
              <RadioGroup
                name="year-buttons-group"
                value={year?.toString()}
                onChange={handleYearChange}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Undergraduate first year"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Undergraduate second year"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="Undergraduate third year"
                />
                <FormControlLabel
                  value="4"
                  control={<Radio />}
                  label="Undergraduate fourth year"
                />
                <FormControlLabel
                  value="5"
                  control={<Radio />}
                  label="Undergraduate fifth+ year"
                />
              </RadioGroup>
            </RadioButtons>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is your college?
              <br />
              For combined majors (a single major listed in the course catalog
              that spans two disciplines), list only the home college. For
              double majors (two distinct majors listed separately in the course
              catalog), include both colleges.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="College"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                error={isCollegeError}
              />
              <br />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>What is your major?</FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                error={isMajorError}
              />
              <br />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>What are your minors?</FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                placeholder="Minors"
                value={minors}
                onChange={(e) => setMinors(e.target.value)}
                error={isMinorError}
              />
              <br />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is your constituency?*
              <br />
              Academic senators represent an official Northeastern academic
              college or program. Example constituencies include the College of
              Engineering, the Global Scholars program, or the Honors program.
              Students in specialized entrance programs can only apply to become
              a senator representing a specialized entrance program as a
              constituency while actively enrolled in the program. For example,
              students can only apply to be NUin senators as first-semester
              students. Most senators are academic senators.
              <br />
              Special interest senators are selected by the members and
              executive board of the organization they intend to represent.
              Example constituencies include Greek life organizations and clubs.
              More information about the difference between academic and special
              interest senators is available in the frequently asked questions
              document located at
              https://docs.google.com/document/d/1xDyzPBpnlzlHmPL9pd2mGsKhzQCl_Cs9EPlFb0G-Y_o/edit.
              <br />
            </FormTextContainer>
            <RadioButtons>
              <RadioGroup
                name="constituency-buttons-group"
                value={constituency}
                onChange={handleConstituencyChange}
              >
                <FormControlLabel
                  value="academic"
                  control={<Radio />}
                  label="Academic senator"
                />
                <FormControlLabel
                  value="special"
                  control={<Radio />}
                  label="Special interest senator"
                />
              </RadioGroup>
            </RadioButtons>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormTextContainer>
            <h3>Special Interest Senator Constituency Information</h3>
            Note: Special interest senators applying from a student organization
            with less than 30 members must submit a paper nomination. Paper
            applications are available to pick up at the SGA office, 332 Curry.
          </FormTextContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What type of constituency would you like to represent?*
            </FormTextContainer>
            <RadioButtons>
              <RadioGroup
                name="constituency-type-buttons-group"
                value={constituencyType}
                onChange={handleConstituencyTypeChange}
              >
                <FormControlLabel
                  value="club"
                  control={<Radio />}
                  label="Official club"
                />
                <FormControlLabel
                  value="greek"
                  control={<Radio />}
                  label="Greek organization"
                />
              </RadioGroup>
            </RadioButtons>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              What is the name of your constituency?
              <br />
              Please enter the name of the organization as recognized by the
              Student Involvement Board. Only recognized student organizations
              may have a special interest senator.
            </FormTextContainer>
            <FormTextAnswerContainer>
              <FormInput
                label="Required"
                required
                placeholder="Constituency Name"
                value={constituencyName}
                onChange={(e) => setConstituencyName(e.target.value)}
                error={isconstituencyNameError}
              />
              <br />
            </FormTextAnswerContainer>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormTextContainer>
            <h3>SGA Senator Nomination Form</h3>
          </FormTextContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              Are you a returning senator?*
              <br />
              Select "yes" only if you have completed the Senator Education and
              Training Program (STEP) and remained a senator in good standing
              for at least one entire semester.
            </FormTextContainer>
            <RadioButtons>
              <RadioGroup
                name="returning-type-buttons-group"
                value={returningSenatorType}
                onChange={handleReturningTypeChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </RadioButtons>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <SampleForm>
        <FormControl>
          <FormQuestionContainer>
            <FormTextContainer>
              Acknowledgment and Attestation*
              <br />
              Please carefully read the following statement and select the
              button below if you agree: I attest that I am the undergraduate
              student in good academic and judicial standing listed on this form
              and that all information I am submitting is completely truthful
              and accurately presented; I authorize the Northeastern University
              Student Government Association to verify the information on this
              form, and I agree to abide by every responsibility and expectation
              of a senator, including attending weekly senate meetings and
              maintaining effective communication with my constituents.
            </FormTextContainer>
            <RadioButtons>
              <RadioGroup
                name="attestation-buttons-group"
                value={attestation}
                onChange={handleAttestationChange}
              >
                <FormControlLabel
                  value="agree"
                  control={<Radio />}
                  label="I have carefully read and fully agree to the statement above."
                />
              </RadioGroup>
            </RadioButtons>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm>

      <Button variant="contained" onClick={submitApplication}>
        Submit
      </Button>
    </>
  );
};

export default ApplicationForm;
