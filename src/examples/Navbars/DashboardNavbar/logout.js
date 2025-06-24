import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import PropTypes from "prop-types";


 const Logout = ({ open, handleClose, handleConfirmLogout }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{
                fontSize: '14px',
                fontWeight: 300,
                padding: '12px 24px',
            }}>Are you sure to logout?</DialogTitle>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    No
                </Button>
                <Button onClick={handleConfirmLogout} color="error" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );

    
};

Logout.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirmLogout: PropTypes.func.isRequired,
  };
  export default Logout; 