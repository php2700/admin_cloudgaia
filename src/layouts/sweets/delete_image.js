import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import axios from 'axios';
import PropTypes from "prop-types";


const Delete_Image = ({ open, handleClose, removeImage }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{
                fontSize: '14px',
                fontWeight: 300,
                padding: '12px 24px',
            }}>Are you sure to remove?</DialogTitle>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    No
                </Button>
                <Button onClick={removeImage} color="error" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );


};

Delete_Image.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    removeImage: PropTypes.func.isRequired,
};

export default Delete_Image; 