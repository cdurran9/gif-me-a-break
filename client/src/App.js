import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import logo from './logo.svg';
import './App.css';

const ROOM_CODE = 'ABCD';

function App() {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/api');
      const data = await response.json();
      setMessage(data.message);
    }
    getData();
  }, []);

  const connectHandler = () => {
    // const response = await fetch(`/api/connect/${ROOM_CODE}`);
    // const data = await response.json();
    // console.log('Connected:', data);
    const socket = io();
    setSocket(socket);
    setIsConnected(true);
  }

  const sayHiHandler = () => {
    socket.emit('message', 'hello server!');
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {message}
        </p>
        {!isConnected && <button onClick={connectHandler}>Connect</button>}
        {isConnected && <button onClick={sayHiHandler}>Say hi</button>}
      </header>
    </div>
  );
}

export default App;
