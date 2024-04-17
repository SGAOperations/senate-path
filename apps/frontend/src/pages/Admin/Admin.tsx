import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { TableStyling, Headers, ButtonStyling } from './styles';

interface Entry {
  id: string;
  fullName: string;
  email: string;
}

const Admin: React.FC = () => {
  const [nominations, setNominations] = useState<Entry[]>([]);
  const [applications, setApplications] = useState<Entry[]>([]);
  const headersNomination = ['id', 'created_at', 'fullName', 'email', 'nominee', 'constituency', 'college', 'major', 'graduationYear', 'recieveSenatorInfo', 'status', '\n'];
  const headersApplication = ['id', 'created_at', 'fullName', 'preferredFullName', 'phoneticPronunciation', 'nickname', 'nuid', 'pronouns', 'email', 'phoneNumber', 'year', 'college', 'major', 'minors', 'constituency', '\n'];
  
  const getData = (url: string, setData: (data: Entry[]) => void) => {
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then(data => {
      setData(data);
    })
    .catch(error => {
      console.error('Error fetching:', error);
    });
  } 
  
  useEffect(() => {
    getData('http://localhost:3000/api/nominations', setNominations);
  }, []);

  useEffect(() => {
    getData('http://localhost:3000/api/applications', setApplications);
  }, []);

  const GenericTable = ({ data }) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell><b>Full Name</b></TableCell>
            <TableCell><b>Email</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const exportToCsv = (data: Entry[], filename: string, headers: string[]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' + 
      data.map(row => Object.values(row).join(',')).unshift(headers).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <Headers>Nominations</Headers>
      <TableStyling>
        <GenericTable data={nominations} />
      </TableStyling>
      <ButtonStyling>
      <Button variant = "contained" onClick={() => exportToCsv(nominations, 'nominations.csv', headersNomination)}>
          Export Nominations to CSV
        </Button>
      </ButtonStyling>
      <Headers>Applications</Headers>
      <TableStyling>
        <GenericTable data={applications} />
      </TableStyling>
      <ButtonStyling>
      <Button variant = "contained" onClick={() => exportToCsv(applications, 'applications.csv', headersApplication)}>
          Export Applications to CSV
      </Button>
      </ButtonStyling>
    </div>
  );
};

export default Admin;