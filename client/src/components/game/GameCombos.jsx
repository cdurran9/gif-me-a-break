import { useCallback, useState, useEffect } from 'react';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { actions } from '../../store/gameSlice';

const gf = new GiphyFetch('CAHETFjiiIDOOJqlHQpXB3q6yEWqtxLb');

const getRandomSelection = (array, amount, excludeId = null) => {
  let returnArray = [];
  const filteredArray = excludeId ? array.filter(i => i.playerId !== excludeId) : [...array];
  for (let i = 0; i < amount; i++) {
    const randomIndex = Math.floor(Math.random() * filteredArray.length);
    returnArray.push(filteredArray.splice(randomIndex, 1)[0]);
  }
  return returnArray;
}

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const GameCombos = (props) => {
  const { socket } = props;
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.tags);
  const texts = useSelector(state => state.texts);
  const classes = createStyles();
  const [gifs, setGifs] = useState([]);
  const [promptNumber, setPromptNumber] = useState(0);
  const [prompts, setPrompts] = useState([]);
  const [chosenGif, setChosenGif] = useState();

  const getGifs = useCallback(async () => {
    let gifArray = [];
    for (const i in [0, 1, 2]) {
      const tagToUse = randomItem(tags).value;
      const { data } = await gf.random({
        rating: 'pg-13',
        tag: tagToUse,
      });
      gifArray.push(data);
    }
    setGifs(gifArray);
  }, [tags]);

  useEffect(() => {
    getGifs();

    const textPrompts = getRandomSelection(texts, 4).map(t => t.value);

    console.log('prompts:', texts, textPrompts);

    setPrompts(textPrompts);
  }, [getGifs, texts]);

  const gifClickHandler = (e) => {
    console.log('clicked:', e.id);
    setChosenGif(e.id);
  };

  const scrollBackHandler = () => {
    setPromptNumber(state => {
      let value = state += 1;
      return value % prompts.length;
    });
  }

  const scrollForwardHandler = () => {
    setPromptNumber(state => {
      let value = state -= 1;
      return value < 0 ? prompts.length - 1 : value;
    })
  }

  const submitHandler = () => {
    const data = { gifId: chosenGif, prompt: prompts[promptNumber] };
    socket.emit('submitCombo', data);
    dispatch(actions.setGamePhase('WAIT'));
  }

  const getClassNames = (selected) => {
    return `${classes.flexItem} ${selected ? classes.selected : ''}`;
  }

  return (
    <div className={classes.root}>
      <div className={classes.flexContainer}>
        {gifs.map((gif) => (
          <div key={gif.id} className={getClassNames(gif.id === chosenGif)}>
            <Gif
              gif={gif}
              noLink
              hideAttribution
              width={window.innerWidth * .9}
              onGifClick={gifClickHandler}
            />
          </div>
        ))}
      </div>
      <div className={classes.buttonContainer}>
        <Button onClick={scrollBackHandler} variant='contained'><ArrowLeft /></Button>
        {prompts.length && <div>{prompts[promptNumber]}</div>}
        <Button onClick={scrollForwardHandler} variant='contained'><ArrowRight /></Button>
      </div>
      <div>
        <Button className={classes.submitButton} variant='contained' color='success' onClick={submitHandler}>Submit your combo</Button>
      </div>
    </div>
  );
};

export default GameCombos;

const createStyles = createUseStyles({
  root: {
    height: '100%'
  },
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    height: window.innerHeight * 0.8,
    overflowY: 'scroll'
  },
  buttonContainer: {
    margin: '0.25em',
    height: window.innerHeight * 0.1,
    display: 'flex',
    justifyContent: 'space-between',
    '& *': {
      display: 'inline'
    },
  },
  flexItem: {
    margin: '10px auto'
  },
  submitButton: {
    display: 'block',
    '@media only screen and (max-width: 600px)': {
      width: '100%'
    }
  },
  selected: {
    boxShadow: '10px 10px 0 #2e7d32',
    border: '1px solid #2e7d32'
  }
});
