import { useEffect, useState } from 'react';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

const gf = new GiphyFetch('CAHETFjiiIDOOJqlHQpXB3q6yEWqtxLb');

const ShowcaseItem = (props) => {
  const [gif, setGif] = useState();
  const { gifId, caption } = props;

  console.log('ShowcaseItem', gifId, caption);

  useEffect(() => {
    const getGif = async () => {
      const {data} = await gf.gif(gifId);
      console.log('Gif:', data);
      setGif(data);
    };
    getGif();
  }, [gifId]);

  const voteHandler = (e) => {
    console.log('clicked:', e);
  }

  return (
    <div>
      {gif && <Gif
        gif={gif}
        noLink
        hideAttribution
        width={window.innerWidth * 0.9}
        onGifClick={voteHandler}
      />}
      <p>{caption}</p>
    </div>
  );
};

export default ShowcaseItem;
