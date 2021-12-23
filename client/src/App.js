import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Routes, Route, Navigate } from 'react-router-dom';

// import logo from './logo.svg';
import './App.css';
import ConnectForm from './components/connect/ConnectForm';
import { createUseStyles } from 'react-jss';
import Lobby from './components/lobby/Lobby';
import GameObserver from './components/game/GameObserver';
import GamePlayer from './components/game/GamePlayer';

function App() {
  const [socket, setSocket] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [currentGameState, setCurrentGameState] = useState('LOGIN');
  const [isObserver, setIsObserver] = useState(false);
  const [lobbyPlayers, setLobbyPlayers] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/api');
      const data = await response.json();
      // setMessage(data.message);
    }
    getData();
  }, []);

  const connectHandler = (playerName, roomCode) => {
    const newSocket = io({query: { playerName, roomCode }});
    newSocket.on('connect', () => {
      console.log('Connected to the server');
      setCurrentGameState('LOBBY');
    });
    newSocket.on('message', (msg) => {
      console.log('Server told me to tell you ' + msg);
    });
    newSocket.on('playerJoin', (data) => {
      console.log('Player joined:', data);
      setLobbyPlayers(data.players);
    });
    setSocket(newSocket);
    setIsConnected(true);
  }

  const sayHiHandler = () => {
    socket.emit('message', 'hello server!');
  }

  const screenToRender = () => {
    switch (currentGameState) {
      case 'LOGIN':
        return <ConnectForm onConnect={connectHandler} />;
      case 'LOBBY':
        return <Lobby players={lobbyPlayers} />;
      case 'GAME':
        return isObserver ? <GameObserver /> : <GamePlayer />;
      default:
        return <div>Oops, something went wrong. Current game state is {currentGameState} and isObserver is {isObserver}</div>
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