import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, InputBase, TextField } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const ConnectForm = (props) => {
  const [roomCode, setRoomCode] = useState('');
  const [codeValid, setCodeValid] = useState(false);

  const connectClickHandler = () => {
    props.onConnect(roomCode);
  };

  const roomCodeChangeHandler = (event) => {
    const value = event.target.value;
    if (value.trim().length <= 4) {
      setRoomCode(value.toUpperCase());
      fetch(`/api/check-room/${value.toUpperCase()}`)
        .then((res) => res.json())
        .then((res) => {
          console.log('Valid room: ', res.valid);
          setCodeValid(res.valid);
        });
    }
  };

  const classes = createStyles();

  return (
    <div className={classes.root}>
      <div>
        <InputBase
          startAdornment={<MeetingRoomIcon />}
          // InputProps={{ startAdornment: <MeetingRoomIcon /> }}
          placeholder='Room Code, ex. ABCD'
          onChange={roomCodeChangeHandler}
          // variant='standard'
          className={classes.roomCode}
          value={roomCode}
        />
      </div>
      <div>
        <Button
          className={classes.connectButton}
          variant='contained'
          onClick={connectClickHandler}
          color='secondary'
          disabled={!codeValid}
        >
          Join
        </Button>
        <Button
          className={classes.connectButton}
          variant='contained'
          onClick={connectClickHandler}
          color='success'
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default ConnectForm;

const createStyles = createUseStyles({
  root: {
    backgroundColor: 'rgb(0, 30, 60)',
    borderRadius: '20px',
    width: '70%',
    padding: '30px',
  },
  roomCode: {
    borderColor: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '40px',
    display: 'block',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  connectButton: {
    display: 'block',
  },
});
