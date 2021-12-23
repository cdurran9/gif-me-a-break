import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';

const gf = new GiphyFetch('CAHETFjiiIDOOJqlHQpXB3q6yEWqtxLb');

const Lobby = (props) => {
  const [gif, setGif] = useState();

  const getGif = useCallback(async () => {
    const { data } = await gf.random({ rating: 'pg-13' });
    setGif(data);
  }, []);

  useEffect(() => {
    getGif();
  }, [getGif])

  return (
    <div>
      <h1>Lobby</h1>
      <ul>
        {props.players.map(player => <li key={player.id}>{player.name}</li>)}
      </ul>
      {gif && <Gif gif={gif} />}
    </div>
  );
};

export default Lobby;
