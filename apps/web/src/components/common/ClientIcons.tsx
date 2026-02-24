// apps/web/src/components/common/ClientIcons.tsx

'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

import {
  BandaiIcon,
  BethesedaIcon,
  BlizzardIcon,
  CrystalDynamicsIcon,
  DeepSilverIcon,
  EaIcon,
  EidosIcon,
  EpicIcon,
  MarvelIcon,
  RiotGamesIcon,
  SquareEnixIcon,
  TwoKIcon,
  UbisoftIcon,
  WizardsIcon,
} from './icons';

interface ClientIconsProps {
  className?: string;
  fill?: string;
  chyron?: boolean;
}

const ICONS = [
  TwoKIcon,
  BandaiIcon,
  BethesedaIcon,
  BlizzardIcon,
  CrystalDynamicsIcon,
  DeepSilverIcon,
  EaIcon,
  EidosIcon,
  EpicIcon,
  MarvelIcon,
  RiotGamesIcon,
  SquareEnixIcon,
  UbisoftIcon,
  WizardsIcon,
];

export function ClientIcons({
  className = '',
  fill = 'currentColor',
  chyron = false,
}: ClientIconsProps) {
  const isWide = useMediaQuery('(min-width: 50em)');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="client-icons-loading" />;
  }

  if (chyron) {
    if (isWide) {
      return (
        <Marquee speed={50} gradient={false} className="fade-in-marquee">
          {ICONS.map((Icon, index) => (
            <div
              key={index}
              className="icon-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Icon fill={fill} />
            </div>
          ))}
        </Marquee>
      );
    }

    const evenIcons = ICONS.filter((_, i) => i % 2 === 0);
    const oddIcons = ICONS.filter((_, i) => i % 2 !== 0);

    return (
      <>
        <Marquee speed={50} gradient={false} className="fade-in-marquee">
          {evenIcons.map((Icon, index) => (
            <div
              key={index}
              className="icon-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Icon fill={fill} />
            </div>
          ))}
        </Marquee>
        <Marquee
          speed={50}
          gradient={false}
          direction="right"
          className="fade-in-marquee"
        >
          {oddIcons.map((Icon, index) => (
            <div
              key={index}
              className="icon-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Icon fill={fill} />
            </div>
          ))}
        </Marquee>
      </>
    );
  }

  return (
    <div className={className}>
      {ICONS.map((Icon, index) => (
        <div key={index} className="icon-item">
          <Icon fill={fill} />
        </div>
      ))}
    </div>
  );
}
