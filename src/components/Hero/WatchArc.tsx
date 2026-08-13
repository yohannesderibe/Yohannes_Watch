import { Watch } from '../../types';

interface WatchArcProps {
  watches: Watch[];
  activeIndex: number;
  onSelect: (index: number) => void;
  accent: string;
}

const RADIUS = 240; // px — distance of each watch from the arc's pivot (left edge)

// Shortest signed distance (in steps) from `from` to `to` around a circle of `count` items.
function wrappedDiff(from: number, to: number, count: number) {
  let diff = (to - from) % count;
  if (diff > count / 2) diff -= count;
  if (diff < -count / 2) diff += count;
  return diff;
}

export default function WatchArc({ watches, activeIndex, onSelect, accent }: WatchArcProps) {
  const count = watches.length;
  const anglePer = 360 / count;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {watches.map((watch, i) => {
        const diff = wrappedDiff(activeIndex, i, count);
        const angleDeg = diff * anglePer; // 0 = front (rightmost, most prominent)
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = Math.cos(angleRad) * RADIUS;
        const y = Math.sin(angleRad) * RADIUS;

        const isActive = diff === 0;
        const closeness = Math.max(0, 1 - Math.abs(diff) / (count / 2 + 0.5));
        const scale = isActive ? 1 : 0.5 + closeness * 0.22;
        const opacity = isActive ? 1 : 0.35 + closeness * 0.4;

        return (
          <button
            key={watch.id}
            onClick={() => onSelect(i)}
            aria-label={`Show ${watch.name}`}
            aria-current={isActive}
            className="absolute top-1/2 left-0 focus:outline-none"
            style={{
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`,
              transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
              opacity,
              zIndex: isActive ? 20 : 10 - Math.abs(diff),
              filter: isActive ? `drop-shadow(0 0 32px ${accent}55)` : 'none',
              cursor: isActive ? 'default' : 'pointer',
            }}
          >
            <img
              src={watch.image}
              alt={watch.name}
              className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 object-contain pointer-events-none"
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}
