import { useSelector } from 'react-redux';
import GameCombos from './GameCombos';
// import GameGifs from './GameGifs';
import GameText from './GameText';
import GameWait from './GameWait';
import GameShowcase from './GameShowcase';

const GamePlayer = (props) => {
  const { socket } = props;
  const gamePhase = useSelector((state) => state.gamePhase);

  switch (gamePhase) {
    case 'TEXT':
      return (
        <GameText
          socket={socket}
          action='submitText'
          description={
            'Enter some funny meme template text. Something like "My face when X" or "When you think it\'s just Y, but it\'s Z"'
          }
          placeholder='Meme Text'
        />
      );
    case 'GIFS':
      return (
        <GameText
          socket={socket}
          action='submitGifTags'
          description={
            'Enter some one-word tags for gifs! Try feelings like "depressed" or "giddy", or try topics like "baseball" or "spongebob"'
          }
          placeholder='Tags'
        />
      );
    case 'COMBOS':
      return <GameCombos socket={socket} />;
    case 'WAIT':
      return <GameWait />;
    case 'SHOWCASE':
      return <GameShowcase />;
    default:
      return (
        <div>
          You're in the game as a player, but something has gone wrong.
          GamePhase is {gamePhase}
        </div>
      );
  }
};

export default GamePlayer;
