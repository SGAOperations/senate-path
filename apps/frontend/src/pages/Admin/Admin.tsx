import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableStyling, Headers } from './styles';

interface Entry {
  id: string;
  fullName: string;
  email: string;
}

const Admin: React.FC = () => {
  const [nominations, setNominations] = useState<Entry[]>([]);
  const [applications, setApplications] = useState<Entry[]>([]);
  
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

  return (
    <div>
      <Headers>
      <h2>Nominations</h2>
      </Headers>
      <TableStyling>
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
            {nominations.map(nomination => (
              <TableRow key={nomination.id}>
                <TableCell>{nomination.id}</TableCell>
                <TableCell>{nomination.fullName}</TableCell>
                <TableCell>{nomination.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </TableStyling>
      <Headers>
      <h2>Applications</h2>
      </Headers>
      <TableStyling>
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
            {applications.map(application => (
              <TableRow key={application.id}>
                <TableCell>{application.id}</TableCell>
                <TableCell>{application.fullName}</TableCell>
                <TableCell>{application.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </TableStyling>
    </div>
  );
};

export default Admin;