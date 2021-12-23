import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// import logo from './logo.svg';
import './App.css';
import ConnectForm from './components/connect/ConnectForm';
import { createUseStyles } from 'react-jss';
import Lobby from './components/lobby/Lobby';
import GameObserver from './components/game/GameObserver';
import GamePlayer from './components/game/GamePlayer';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from './store/gameSlice';

function App() {
  const [socket, setSocket] = useState();
  // const isConnected = useSelector((state) => state.isConnected);
  const isObserver = useSelector(state => state.isObserver);
  const gameState = useSelector(state => state.state);
  // const socket = useSelector(state => state.socket);
  const timer = useSelector(state => state.timer);
  const timerActive = useSelector(state => !state.timerDone);
  const lobbyPlayers = useSelector(state => state.lobbyPlayers);
  const dispatch = useDispatch();

  const classes = useStyles();

  useEffect(() => {
    if (!timerActive) return;
    const tick = 1000;
    setTimeout(() => {
      dispatch(actions.decrementTimer(tick));
    }, tick);
  }, [timer, timerActive, dispatch]);

  const connectHandler = (playerName, roomCode) => {
    const newSocket = io({query: { playerName, roomCode }});
    newSocket.on('connect', () => {
      console.log('Connected to the server with ID', newSocket.id);
      dispatch(actions.setGameState('LOBBY'));
      dispatch(actions.setPlayerId(newSocket.id));
    });
    newSocket.on('message', (msg) => {
      console.log('Server told me to tell you ' + msg);
    });
    newSocket.on('playerJoin', (data) => {
      console.log('Player joined:', data);
      dispatch(actions.setLobbyPlayers(data.players));
      if (data.players.find(p => p.id === newSocket.id).vip) {
        dispatch(actions.setIsVip(true));
      }
    });
    newSocket.on('gameStartCountdown', (data) => {
      console.log('Game starting in', data.countdown);
      dispatch(actions.setTimer(data.countdown));
    });
    newSocket.on('gameStart', () => {
      dispatch(actions.setGameState('GAME'));
      dispatch(actions.setGamePhase('TEXT'));
    });
    newSocket.on('changeGamePhase', (data) => {
      switch (data.phase) {
        case 'gifs':
          dispatch(actions.setGamePhase('GIFS'));
          break;
        case 'combos':
          console.log('Combos:', data);
          dispatch(actions.setTags(data.tags));
          dispatch(actions.setTexts(data.texts));
          dispatch(actions.setGamePhase('COMBOS'));
          break;
        case 'showcase':
          console.log('Showcase:', data);
          dispatch(actions.setShowcaseData(data.data));
          dispatch(actions.setGamePhase('SHOWCASE'));
          break;
        default:
          break;
      }
    })
    setSocket(newSocket);
    // dispatch(actions.setSocket(newSocket));
    dispatch(actions.setIsConnected(true));
  }

  // const sayHiHandler = () => {
  //   socket.emit('message', 'hello server!');
  // }

  const screenToRender = () => {
    switch (gameState) {
      case 'LOGIN':
        return <ConnectForm onConnect={connectHandler} socket={socket} />;
      case 'LOBBY':
        return <Lobby players={lobbyPlayers} socket={socket} />;
      case 'GAME':
        return isObserver ? <GameObserver socket={socket} /> : <GamePlayer socket={socket} />;
      default:
        return <div>Oops, something went wrong. Current game state is {gameState} and isObserver is {isObserver}</div>
    }
  }

  return (
    <div className={classes.root}>
      {screenToRender()}
    </div>
  );
}

export default App;

const useStyles = createUseStyles({
  root: {
    margin: '0 auto',
    padding: '2em 0'
  }
})