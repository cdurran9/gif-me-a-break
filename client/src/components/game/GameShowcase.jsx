import { useSelector } from 'react-redux';
import ShowcaseItem from './ShowcaseItem';

const GameShowcase = () => {
  const showcaseData = useSelector((state) => state.showcaseData);
  return (
    <div>
      {showcaseData.map((d) => (
        <ShowcaseItem key={d.value.gifId} gifId={d.value.gifId} caption={d.value.prompt} />
      ))}
    </div>
  );
};

export default GameShowcase;
