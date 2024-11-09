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

  const urlParameters = window.location.href.split(/&|=|#/);

  if (urlParameters.includes("access_token")) {
    // Set auth token in local storage
    // TODO: encypt token, perhaps use CryptoJS
    localStorage.setItem("token", JSON.stringify(urlParameters[urlParameters.indexOf("access_token") + 1]));
  }

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
              label="Required"
              value={textField}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  textField: e.target.value,
                }))
              }
              required
              error={isTextFieldError}
            />
          </FormControl>

          <FormControl>
            This is an example of a dropdown menu
            <FormInput
              select
              label="Required"
              value={dropdown}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  dropdown: e.target.value as string,
                }))
              }
              required
              error={isDropdownError}
            >
              {MENU_ITEMS.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </FormInput>
          </FormControl>

          <Button variant="contained" onClick={handleSampleFormSubmit}>
            You can click on this button to submit the form
          </Button>
        </SampleForm>
      </HomeContainer>
    </>
  );
  return <div>This is the home page</div>;
};

export default Home;
