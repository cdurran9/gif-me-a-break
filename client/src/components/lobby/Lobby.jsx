import { useSelector } from 'react-redux';
import { Box, Button, Modal } from '@mui/material';
import { createUseStyles } from 'react-jss';

const Lobby = (props) => {
  // const [gif, setGif] = useState();
  const isVip = useSelector((state) => state.isVip);
  const timerActive = useSelector((state) => !state.timerDone);
  const timer = useSelector((state) => state.timer);

  const { socket } = props;

  const classes = useStyles();

  const everyoneInClickHandler = () => {
    socket.emit('gameStart');
  }

  // const getGif = useCallback(async () => {
  //   const { data } = await gf.random({ rating: 'pg-13' });
  //   setGif(data);
  // }, []);

  // useEffect(() => {
  //   getGif();
  // }, [getGif]);

  return (
    <div className={classes.root}>
      <h1>Lobby</h1>
      <ul>
        {props.players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      {isVip && (
        <div>
          <p>Press "Everyone's In!" below to start</p>
          <Button className={classes.connectButton} variant='contained' color='success' onClick={everyoneInClickHandler} >
            Everyone's In!
          </Button>
        </div>
      )}
      <Modal open={timerActive}><Box className={classes.timerOverlay}>{Math.floor(timer / 1000)}</Box></Modal>
      {/* {gif && <Gif gif={gif} />} */}
    </div>
  );
};

export default Lobby;

const useStyles = createUseStyles({
  root: {
    backgroundColor: '#1b2d40',
    borderRadius: '20px',
    width: '70%',
    padding: '30px',
    margin: 'auto',
    textAlign: 'center',
    '& ul': {
      padding: '0',
      '& li': {
        listStyle: 'none'
      }
    }
  },
  timerOverlay: {
    textAlign: 'center',
    fontSize: '2rem'
  },
  connectButton: {
    display: 'block',
    '@media only screen and (max-width: 600px)': {
      width: '100%'
    }
  },
});