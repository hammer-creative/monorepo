// apps/web/src/components/common/ClientIcons.tsx
import {
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
  if (chyron) {
    const midpoint = Math.ceil(ICONS.length / 2);
    const topRow = ICONS.slice(0, midpoint);
    const bottomRow = ICONS.slice(midpoint);

    return (
      <div className={className}>
        <div className="card-icons-row">
          {topRow.map((Icon, index) => (
            <div key={index} className="icon-item">
              <Icon fill={fill} />
            </div>
          ))}
          {topRow.map((Icon, index) => (
            <div key={`dup-${index}`} className="icon-item">
              <Icon fill={fill} />
            </div>
          ))}
        </div>
        <div className="card-icons-row">
          {bottomRow.map((Icon, index) => (
            <div key={index} className="icon-item">
              <Icon fill={fill} />
            </div>
          ))}
          {bottomRow.map((Icon, index) => (
            <div key={`dup-${index}`} className="icon-item">
              <Icon fill={fill} />
            </div>
          ))}
        </div>
      </div>
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
