import { useEffect } from 'react';

const Nominations: React.FC = () => {
  const fetchData = () => {
    fetch('http://localhost:3000/api/applications')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <>I am the nominations page</>;
};

export default Nominations;
