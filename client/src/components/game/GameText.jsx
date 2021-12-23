import { InputBase, Button } from '@mui/material';
import { useState } from 'react';
import { createUseStyles } from 'react-jss';

const GameText = (props) => {
  const { socket, action, description, placeholder } = props;
  const classes = createStyles();
  const [textValue, setTextValue] = useState('');

  const textSubmitHandler = (event) => {
    event.preventDefault();
    const submitValue = textValue.trim();

    if (!submitValue.length) return;

    socket.emit(action, submitValue);
    setTextValue('');
  };

  const textChangeHandler = (event) => {
    const newValue = event.target.value;
    setTextValue(newValue);
  }

  return (
    <form onSubmit={textSubmitHandler}>
      <p>{description}</p>
      <div className={classes.root}>
        <InputBase
          placeholder={placeholder}
          className={classes.input}
          value={textValue}
          onChange={textChangeHandler}
        />
      </div>
      <Button
        type='submit'
        className={classes.submitButton}
        variant='contained'
        color='success'
      >
        Submit
      </Button>
    </form>
  );
};

export default GameText;

const createStyles = createUseStyles({
  root: {
    backgroundColor: '#1b2d40',
    borderRadius: '20px',
    width: '90%',
    padding: '3em 0',
    margin: 'auto',
    textAlign: 'center',
  },
  input: {
    width: '90%',
    padding: '5px',
    margin: '5px 0',
    borderColor: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '40px',
    display: 'block',
    transition: 'background-color 0.3s',
    // '&:hover': {
    //   backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // },
  },
  submitButton: {
    display: 'block',
    '@media only screen and (max-width: 600px)': {
      width: '100%',
    },
  },
  formError: {
    color: 'red',
  },
});
