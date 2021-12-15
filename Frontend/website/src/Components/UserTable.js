import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function UserTable(props) {
  console.log(props.userList);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="left">User Name</TableCell>
            <TableCell align="left">Full name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
          props.userList.map((user) => (
            <TableRow
              key={user.id}
            >
              <TableCell component="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell align="left">{user.user_name}</TableCell>
              <TableCell align="left">{user.full_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}