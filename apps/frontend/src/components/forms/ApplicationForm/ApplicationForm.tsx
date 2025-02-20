import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import { FormHelperText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { NameSubForm } from './SubForms/NameSubForm';
import { FormIntro } from './SubForms/FormIntro';
import { PersonalInfoSubForm } from './SubForms/PersonalInfoSubForm';
import { ApplicationErrors, ErrorMessages } from './ApplicationErrors';

import { getFullPath } from './../../../utils';

import {
  FormInput,
  SampleForm,
  FormTextContainer,
  FormQuestionText,
  FormQuestionContainer,
  FormTextAnswerContainer,
  Introduction,
  FormSelect,
  FormInputCheckbox,
  RadioButtons,
} from './styles';
import { PronounSubForm } from './SubForms/PronounsSubForm';
import { AcademicsSubForm } from './SubForms/AcademicsSubForm';
import { SpecialInterestSubForm } from './SubForms/SpecialInterestSubForm';

interface Props {
  setIsPopupOpen: (open: boolean) => void;
  setErrorMessage: (message: string) => void;
  setErrorOpen: (open: boolean) => void;
}

export interface ApplicationFormData {
  fullName: string;
  preferredFullName: string;
  phoneticPronunciation: string;
  nickname: string;
  northeasternID: string;
  pronouns: string[];
  email: string;
  phoneNumber: string;
  year?: number;
  college: string;
  major: string;
  minor: string;
  constituency: string;
  constituencyType: string;
  constituencyName: string;
  returningSenatorType: string;
  attestation: string;
}

const ApplicationForm: React.FC<Props> = ({
  setIsPopupOpen,
  setErrorMessage,
  setErrorOpen,
}) => {
  const [FormData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    preferredFullName: '',
    phoneticPronunciation: '',
    nickname: '',
    northeasternID: '',
    pronouns: [],
    email: '',
    phoneNumber: '',
    college: '',
    major: '',
    minor: '',
    constituency: '',
    constituencyType: '',
    constituencyName: '',
    returningSenatorType: 'no',
    attestation: '',
  });

  const [applicationErrors, setApplicationErrors] = useState<ApplicationErrors>(
    {
      fullName: true,
      preferredFullName: true,
      phoneticPronunciation: true,
      nickname: true,
      northeasternID: true,
      pronouns: true,
      email: true,
      phoneNumber: true,
      year: true,
      college: true,
      major: true,
      minor: true,
      constituency: true,
      constituencyType: true,
      constituencyName: true,
      returningSenatorType: true,
      attestation: true,
    }
  );

  const updateErrors = (field: keyof ApplicationErrors, value: boolean) => {
    setApplicationErrors((prev) => ({ ...prev, [field]: value }));
  };

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const submitApplication = () => {
    setErrorOpen(false);
    setIsSubmitted(true);
    if (
      validateNameInputs() ||
      validatePronounInputs() ||
      validatePersonalInfoInputs() ||
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

      const newErrors: {
        fullName?: string;
        preferredFullName?: string;
        phoneticPronunciation?: string;
        nickname?: string;
        northeasternID?: string;
        email?: string;
        phoneNumber?: string;
        college?: string;
        major?: string;
        minors?: string;
        constituencyName?: string;
        year?: string;
        constituency?: string;
        selectedConstituencyType?: string;
        selectedReturningType?: string;
        selectedAttestation?: string;
        pronouns?: string;
      } = {};
      if (isFullNameError) newErrors.fullName = 'Name is mandatory';
      if (isPreferredFullNameError)
        newErrors.preferredFullName = 'Preferred Name is mandatory';
      if (isPhoneticPronunciationError)
        newErrors.phoneticPronunciation = 'Pronunciation is mandatory';
      if (isNicknameError) newErrors.nickname = 'Nickname is mandatory';
      if (isPronounError) newErrors.pronouns = 'Pronouns are mandatory';
      if (isNortheasternIDError) newErrors.northeasternID = 'NUID is mandatory';
      if (isEmailError) newErrors.email = 'Email is mandatory';
      if (isPhoneNumberError)
        newErrors.phoneNumber = 'Phone Number is mandatory';
      if (isCollegeError) newErrors.college = 'College is mandatory';
      if (isMinorError) newErrors.minors = 'Minor is mandatory';
      if (isMajorError) newErrors.major = 'Major is mandatory';
      if (isconstituencyNameError)
        newErrors.constituencyName = 'Constituency Name is mandatory';
      if (isYearError) newErrors.year = 'Year is mandatory';
      if (isConstituencyError)
        newErrors.constituency = 'Constituency is mandatory';
      if (isConstituencyTypeError)
        newErrors.selectedConstituencyType = 'Constituency Type is mandatory';
      if (isReturningSenatorError)
        newErrors.selectedReturningType = 'Field is mandatory';
      if (isAttestationError)
        newErrors.selectedAttestation = 'Please accept the acknowledgement';

      setErrors(newErrors);
      // if (!validateForm()) {
      console.log('error message here');
      return;
      // }
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
      constituencyName: constituencyName,
      year: year,
      constituency: constituency,
      selectedConstituencyType: constituencyType,
      selectedReturningType: returningSenatorType,
      selectedAttestation: attestation,
      pronouns: pronouns.join(', '),
    };
    console.log(JSON.stringify(formData));
    fetch('https://nomination-system-2.onrender.com/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((data) => {
        if (data.ok) {
          setIsPopupOpen(true);
        } else {
          console.log(`Application failed to submit: ${data.statusText}`);
          data
            .json()
            .then((responseBody) => {
              // Extract and log the 'message' property from the response
              if (responseBody && responseBody.message) {
                console.log('Error Message:', responseBody.message);
                setErrorMessage(responseBody.message);
                setErrorOpen(true);
              } else {
                console.log('Unexpected response format:', responseBody);
              }
            })
            .catch((error) => {
              console.error('Error reading response body as JSON:', error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNextForm = () => {
    setSubFormIndex((prev) => prev + 1);
  };
  const handlePrevForm = () => {
    setSubFormIndex((prev) => prev - 1);
  };
  const SubForms = [
    <FormIntro handleNext={handleNextForm} />,

    <NameSubForm
      formData={FormData}
      setFormData={setFormData}
      updateErrors={updateErrors}
      errors={applicationErrors}
      errorMessages={ErrorMessages}
      handleNext={handleNextForm}
      handlePrev={handlePrevForm}
    />,
    <PersonalInfoSubForm
      formData={FormData}
      setFormData={setFormData}
      updateErrors={updateErrors}
      errors={applicationErrors}
      errorMessages={ErrorMessages}
      handleNext={handleNextForm}
      handlePrev={handlePrevForm}
    />,
    <PronounSubForm
      formData={FormData}
      setFormData={setFormData}
      updateErrors={updateErrors}
      errors={applicationErrors}
      errorMessages={ErrorMessages}
      handleNext={handleNextForm}
      handlePrev={handlePrevForm}
    />,
    <AcademicsSubForm
      formData={FormData}
      setFormData={setFormData}
      updateErrors={updateErrors}
      errors={applicationErrors}
      errorMessages={ErrorMessages}
      handleNext={handleNextForm}
      handlePrev={handlePrevForm}
    />,
    <SpecialInterestSubForm
      formData={FormData}
      setFormData={setFormData}
      updateErrors={updateErrors}
      errors={applicationErrors}
      errorMessages={ErrorMessages}
      handleNext={handleNextForm}
      handlePrev={handlePrevForm}
    />,
  ];
  const [subFormIndex, setSubFormIndex] = useState(0);

  return (
    <>
      {SubForms[subFormIndex]}
      {/* 

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
              <b>Are you a returning senator?</b>
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
        <FormControl error={isSubmitted && !!errors.selectedAttestation}>
          <FormQuestionContainer>
            <FormTextContainer>
              <b>Acknowledgment and Attestation</b>
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
                {isSubmitted && errors.selectedAttestation && (
                  <FormHelperText>{errors.selectedAttestation}</FormHelperText>
                )}
              </RadioGroup>
            </RadioButtons>
          </FormQuestionContainer>
        </FormControl>
      </SampleForm> */}

      <Button variant="contained" onClick={submitApplication}>
        Submit
      </Button>
    </>
  );
};

export default ApplicationForm;
