import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Nomination {
  id: string;
  fullName: string;
  email: string;
}

const Admin: React.FC = () => {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  
  useEffect(() => {
    fetch('http://localhost:3000/api/nominations', {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch nominations');
      }
      return response.json();
    })
    .then(data => {
      setNominations(data);
    })
    .catch(error => {
      console.error('Error fetching nominations:', error);
    });
  }, []);
  
  return (
    <div>
      <h1>Nominations</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
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
      <h1>Applications</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map(applications => (
              <TableRow key={applications.id}>
                <TableCell>{applications.id}</TableCell>
                <TableCell>{applications.fullName}</TableCell>
                <TableCell>{applications.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Admin;