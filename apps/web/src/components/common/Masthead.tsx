// apps/web/src/components/marquee/Masthead.tsx
import { WordmarkSVG } from './Wordmark';

function Tagline() {
  return <div className="tagline">The Gaming Agency</div>;
}

export function Masthead() {
  return (
    <div className="masthead">
      <WordmarkSVG />
      <Tagline />
    </div>
  );
}
