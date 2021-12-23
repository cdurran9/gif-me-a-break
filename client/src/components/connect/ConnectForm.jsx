import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, InputBase, TextField } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';

const ConnectForm = (props) => {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [codeValid, setCodeValid] = useState(false);
  const [formValid, setFormValid] = useState(true);

  const connectClickHandler = (event) => {
    event.preventDefault();
    if (!playerName.length || roomCode.length !== 4) {
      setFormValid(false);
      return;
    }
    props.onConnect(playerName, roomCode);
  };

  const nameChangeHandler = (event) => {
    const value = event.target.value;
    const trimmed = value.trim();
    if (trimmed.length <= 12) {
      setPlayerName(trimmed.toUpperCase());
      if (trimmed.length > 0 && trimmed.length <= 12 && roomCode.length === 4) {
        setFormValid(true);
      }
    }
  }

  const roomCodeChangeHandler = (event) => {
    const value = event.target.value;
    const trimmed = value.trim();
    if (trimmed.length <= 4) {
      setRoomCode(trimmed.toUpperCase());
      if (trimmed.length === 4 && playerName.length > 0 && playerName.length <= 12) {
        setFormValid(true);
      }
      if (trimmed.length === 4) {
        fetch(`/api/check-room/${value.toUpperCase()}`)
          .then((res) => res.json())
          .then((res) => {
            console.log('Valid room: ', res.valid);
            setCodeValid(res.valid);
          });
      }
    }
  };

  const classes = createStyles();

  return (
    <form className={classes.root} onSubmit={connectClickHandler}>
      <div>
        <InputBase
          startAdornment={<PersonIcon />}
          placeholder='Your Name'
          onChange={nameChangeHandler}
          className={classes.input}
          value={playerName}
        />
      </div>
      <div>
        <InputBase
          startAdornment={<MeetingRoomIcon />}
          placeholder='Room Code, ex. ABCD'
          onChange={roomCodeChangeHandler}
          className={classes.input}
          value={roomCode}
        />
      </div>
      <div>
        {!formValid && <p className={classes.formError}>Please enter a valid name and room code</p>}
      </div>
      <div>
        <Button
          type='submit'
          className={classes.connectButton}
          variant='contained'
          color='secondary'
          disabled={!codeValid}
        >
          Join
        </Button>
        <Button
          type='submit'
          className={classes.connectButton}
          variant='contained'
          color='success'
          disabled={codeValid}
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default ConnectForm;

const createStyles = createUseStyles({
  root: {
    backgroundColor: '#1b2d40',
    borderRadius: '20px',
    width: '70%',
    padding: '30px',
    margin: 'auto',
    textAlign: 'center'
  },
  input: {
    padding: '5px',
    margin: '5px 0',
    borderColor: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '40px',
    display: 'block',
    transition: 'border-color 0.3s',
    // '&:hover': {
    //   borderColor: 'rgba(44, 90, 163, 255)',
    // },
  },
  connectButton: {
    display: 'block',
    '@media only screen and (max-width: 600px)': {
      width: '100%'
    }
  },
  formError: {
    color: 'red'
  }
});
