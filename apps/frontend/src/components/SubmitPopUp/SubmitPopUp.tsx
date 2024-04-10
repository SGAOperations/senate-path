import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


interface Props {
    open: boolean;
    setOpen: (arg0: boolean)=>void;
}

const SubmitPopUp:  React.FC<Props> = ({open, setOpen}) => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    return(
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Application Form Submitted!
        </Alert>
      </Snackbar>
    );
};
export default SubmitPopUp;