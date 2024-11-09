const Home: React.FC = () => {



  const urlParameters = window.location.href.split(/&|=|#/);

  if (urlParameters.includes("access_token")) {
    // Set auth token in local storage
    // TODO: encypt token, perhaps use CryptoJS
    localStorage.setItem("token", JSON.stringify(urlParameters[urlParameters.indexOf("access_token") + 1]));
  }

  return (
      <div>I am the home page</div>
    
  );
  return <div>This is the home page</div>;
};

export default Home;
