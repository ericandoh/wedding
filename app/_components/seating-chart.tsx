'use client';

import type { KeyboardEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLongRightIcon,
  CakeIcon,
  GiftIcon,
  HeartIcon,
  MusicalNoteIcon,
  SparklesIcon,
  StarIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  namesMatchSeatToHighlight,
  parseFindSeatInput,
  rsvpToDisplayNameParts,
  seatDisplayLines,
  splitNameForSeatDisplay,
} from '#/lib/seating-highlight';

type SeatingRow = {
  leftA: string;
  leftB: string;
  rightA: string;
  rightB: string;
};

type SeatingResponse = {
  seatingRows: SeatingRow[];
};

type Side = 'left' | 'right';

/**
 * Each bend = 3 seats. Step 0 = outer (wall), 2 = inner (aisle).
 * First guests start inside; the first bend goes outward (2→1→0), then inward (0→1→2), etc.
 */
function zigzagStep(index: number): 0 | 1 | 2 {
  const bend = Math.floor(index / 3);
  const pos = index % 3;
  const outwardFromInside = bend % 2 === 0;
  const step = outwardFromInside ? (2 - pos) : pos;
  return step as 0 | 1 | 2;
}

const INDENT = ['pl-0', 'pl-2 sm:pl-9 sm:pl-11', 'pl-4 sm:pl-[4.25rem] sm:pl-[5.25rem]'] as const;
const INDENT_R = ['pr-0', 'pr-2 sm:pr-9 sm:pr-11', 'pr-4 sm:pr-[4.25rem] sm:pr-[5.25rem]'] as const;

/** Global stagger order: row 0 left table, row 0 right table, row 1 left, … */
function buildRowStaggerOrders(leftLen: number, rightLen: number) {
  const leftOrder: number[] = [];
  const rightOrder: number[] = [];
  let k = 0;
  const maxLen = Math.max(leftLen, rightLen);
  for (let row = 0; row < maxLen; row++) {
    if (row < leftLen) leftOrder[row] = k++;
    if (row < rightLen) rightOrder[row] = k++;
  }
  return { leftOrder, rightOrder, total: k };
}

function SeatPersonIcon() {
  return (
    <UserIcon
      className="h-4 w-4 shrink-0 text-gray-600 sm:h-5 sm:w-5"
      strokeWidth={1.5}
      aria-hidden
    />
  );
}

/** Arrow: along top toward center, then down — flow from terrace into the room. */
function SeatingBallroomTerraceArrow({ label }: { label: string }) {
  return (
    <figure className="mx-auto flex w-full max-w-2xl flex-col items-center">
      <svg
        viewBox="0 0 320 48"
        className="h-10 w-full text-gray-600 sm:h-12"
        aria-hidden
      >
        <path
          d="M 8 24 H 162 V 40"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M 162 46 L 155 34 H 169 Z" fill="currentColor" />
      </svg>
      <figcaption className="text-body -mt-0.5 px-1 text-center text-[0.65rem] font-semibold leading-tight text-gray-800 sm:text-xs">
        {label}
      </figcaption>
    </figure>
  );
}

function SeatingMainEntranceArrow({ label }: { label: string }) {
  return (
    <div
      className="flex h-full min-h-[6rem] w-max min-w-0 flex-row items-center justify-center gap-0.5 pr-0 sm:min-h-[7.5rem] sm:gap-0.5"
      role="group"
      aria-label={label}
    >
      <div className="relative grid h-[6.25rem] w-4 shrink-0 place-items-center overflow-visible sm:h-[7.25rem] sm:w-4">
        <span className="text-body absolute left-1/2 top-1/2 inline-block w-max origin-center -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[0.55rem] font-medium leading-none text-gray-800 sm:text-[0.6rem] sm:font-semibold">
          {label}
        </span>
      </div>
      <ArrowLongRightIcon className="h-4 w-7 shrink-0 text-gray-600 sm:h-4 sm:w-8" strokeWidth={1.5} aria-hidden />
    </div>
  );
}

/** Fluid type: extra-small on phones; scroll parent avoids squishing. */
const SEAT_NAME_FLUID =
  'max-sm:text-[clamp(0.4rem,calc(0.32rem+2.8vw),0.68rem)] text-[clamp(0.48rem,1.9vmin+1.2vw,0.78rem)] sm:text-[clamp(0.5625rem,1.8vmin+1.1vw,0.9375rem)] md:text-[clamp(0.625rem,1.2vmin+0.75vw,1rem)]';

function SeatNameLines({
  name,
  highlightTokens,
  alignClass,
}: {
  name: string;
  highlightTokens: string[];
  alignClass: string;
}) {
  const raw = name.trim();
  if (!raw) {
    return (
      <div className={`text-body ${SEAT_NAME_FLUID} ${alignClass} text-gray-300`}>
        <span className="block whitespace-nowrap">—</span>
      </div>
    );
  }
  const parts = splitNameForSeatDisplay(raw);
  const lines = seatDisplayLines(parts);
  const matched =
    highlightTokens.length > 0 &&
    highlightTokens.some((h) => namesMatchSeatToHighlight(raw, h));
  const lineClass = matched
    ? `text-body block whitespace-nowrap leading-[1.08] font-bold text-gray-900 underline decoration-2 underline-offset-2 ${SEAT_NAME_FLUID}`
    : `text-body block whitespace-nowrap leading-[1.08] text-gray-800 ${SEAT_NAME_FLUID}`;
  return (
    <div className={`flex flex-col gap-0 ${alignClass}`}>
      {lines.map((line, idx) => (
        <span key={`${idx}-${line}`} className={lineClass}>
          {line}
        </span>
      ))}
    </div>
  );
}

function ZigzagPairedTableList({
  rows,
  side,
  label,
  highlightTokens,
  rowOrders,
  visibleOrders,
}: {
  rows: { seatA: string; seatB: string }[];
  side: Side;
  label: string;
  highlightTokens: string[];
  rowOrders: number[];
  visibleOrders: number[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col w-full">
      <h3 className="text-title mb-3 text-center text-xs font-bold tracking-tight text-gray-900 sm:mb-4 sm:text-sm md:text-base lg:text-xl">
        {label}
      </h3>
      <ul className="w-full min-w-0 overflow-visible px-0 sm:px-1 md:px-2" aria-label={label}>
        {rows.map(({ seatA, seatB }, i) => {
          const step = zigzagStep(i);
          /** Wall and aisle edges use opposite phases along the serpentine bend. */
          const innerStep = (2 - step) as 0 | 1 | 2;
          const globalOrder = rowOrders[i] ?? i;
          const rowVisible = visibleOrders.includes(globalOrder);
          const showA = seatA.trim() !== '';
          const showB = seatB.trim() !== '';
          const labelParts = [showA ? seatA : null, showB ? seatB : null].filter(Boolean);
          const rowLabel = labelParts.length > 0 ? labelParts.join(' · ') : `Row ${i + 1}`;
          // Left physical table: wall = first cluster; right physical table: wall = second cluster (far from dance floor).
          const outerClusterPad =
            side === 'left' ? INDENT[step] : INDENT_R[step];
          const innerClusterPad =
            side === 'left' ? INDENT_R[innerStep] : INDENT[innerStep];
          return (
            <li
              key={`${i}-${seatA}-${seatB}`}
              aria-label={rowLabel}
              className={`group flex w-full cursor-pointer items-center gap-0.5 py-1 leading-snug transition-all duration-350 sm:gap-1 sm:py-1.5 ${rowVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <div
                className={`flex min-w-0 flex-1 items-center ${side === 'left' ? outerClusterPad : innerClusterPad} justify-end`}
              >
                <div className="inline-flex max-w-full min-w-0 items-center gap-1">
                  <div className="shrink-0 bg-white leading-none transition-transform duration-300 group-hover:scale-125">
                    <SeatPersonIcon />
                  </div>
                  <div className="min-w-0 max-w-full transition-transform duration-300 group-hover:scale-[1.02]">
                    <SeatNameLines
                      name={showA ? seatA : ''}
                      highlightTokens={highlightTokens}
                      alignClass="text-left"
                    />
                  </div>
                </div>
              </div>
              <span className="shrink-0 select-none px-0.5 text-base text-gray-400/80 sm:text-lg" aria-hidden>
                ❦
              </span>
              <div
                className={`flex min-w-0 flex-1 items-center ${side === 'left' ? innerClusterPad : outerClusterPad} justify-start`}
              >
                <div className="inline-flex max-w-full min-w-0 items-center gap-1">
                  <div className="min-w-0 max-w-full transition-transform duration-300 group-hover:scale-[1.02]">
                    <SeatNameLines
                      name={showB ? seatB : ''}
                      highlightTokens={highlightTokens}
                      alignClass="text-right"
                    />
                  </div>
                  <div className="shrink-0 bg-white leading-none transition-transform duration-300 group-hover:scale-125">
                    <SeatPersonIcon />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Same palette as `app/registry/page.tsx` for falling gifts. */
const CELEBRATION_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
];

type DanceParticle = {
  burstId: string;
  id: string;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
  color: string;
  iconType: number;
};

function CelebrationIcon({
  iconType,
  size,
  color,
}: {
  iconType: number;
  size: number;
  color: string;
}) {
  const p = {
    width: size,
    height: size,
    style: { color } as const,
    strokeWidth: 1.5,
  };
  switch (iconType % 6) {
    case 0:
      return <SparklesIcon {...p} />;
    case 1:
      return <HeartIcon {...p} />;
    case 2:
      return <MusicalNoteIcon {...p} />;
    case 3:
      return <StarIcon {...p} />;
    case 4:
      return <CakeIcon {...p} />;
    default:
      return <GiftIcon {...p} />;
  }
}

function SplashParticle({
  cx,
  cy,
  dx,
  dy,
  rot,
  size,
  color,
  iconType,
}: Omit<DanceParticle, 'burstId' | 'id'>) {
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setBurst(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[55]"
      style={{
        left: cx,
        top: cy,
        transform: burst
          ? `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.2) rotate(${rot}deg)`
          : `translate(-50%, -50%) scale(0.35) rotate(0deg)`,
        opacity: burst ? 0 : 1,
        transition:
          'transform 0.88s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.88s ease-out',
      }}
    >
      <CelebrationIcon iconType={iconType} size={size} color={color} />
    </div>
  );
}

function DanceFloorLabel({ label }: { label: string }) {
  const [particles, setParticles] = useState<DanceParticle[]>([]);
  const lastHoverBurstRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const spawnBurst = useCallback((origin?: { x: number; y: number }, count = 24) => {
    let cx = typeof window !== 'undefined' ? window.innerWidth * 0.5 : 0;
    let cy = typeof window !== 'undefined' ? window.innerHeight * 0.35 : 0;
    if (origin) {
      cx = origin.x;
      cy = origin.y;
    } else if (wrapRef.current && typeof window !== 'undefined') {
      const r = wrapRef.current.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    }
    const burstId = `burst-${performance.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newParts: DanceParticle[] = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 260;
      return {
        burstId,
        id: `${burstId}-${i}`,
        cx,
        cy,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rot: (Math.random() - 0.5) * 200,
        size: 16 + Math.random() * 24,
        color:
          CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
        iconType: Math.floor(Math.random() * 6),
      };
    });
    setParticles((p) => [...p, ...newParts]);
    window.setTimeout(() => {
      setParticles((p) => p.filter((x) => x.burstId !== burstId));
    }, 1000);
  }, []);

  const onPointerEnter = () => {
    if (typeof window === 'undefined') return;
    const now = performance.now();
    if (now - lastHoverBurstRef.current < 900) return;
    lastHoverBurstRef.current = now;
    spawnBurst(undefined, 20);
  };

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    spawnBurst({ x: e.clientX, y: e.clientY }, 34);
  };

  return (
    <>
      {particles.map((p) => (
        <SplashParticle
          key={p.id}
          cx={p.cx}
          cy={p.cy}
          dx={p.dx}
          dy={p.dy}
          rot={p.rot}
          size={p.size}
          color={p.color}
          iconType={p.iconType}
        />
      ))}
      <div
        ref={wrapRef}
        className="relative flex h-full min-h-0 w-4 shrink-0 cursor-pointer select-none items-center justify-center self-stretch rounded-sm px-0 outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 sm:w-4"
        onPointerEnter={onPointerEnter}
        onClick={onClick}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            spawnBurst(undefined, 26);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={label}
      >
        <span className="text-title absolute left-1/2 top-1/2 inline-block w-max origin-center -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[0.55rem] font-semibold leading-none text-gray-800 sm:text-[0.6rem]">
          {label}
        </span>
      </div>
    </>
  );
}

export default function SeatingChart({
  seatingLeftTable,
  seatingRightTable,
  seatingChartLoading,
  seatingChartError,
  seatingChartEmpty,
  seatingChartNoNamesForTable,
  danceFloor,
  seatingFindSeatFor,
  seatingFindSeatPlaceholder,
  seatingBallroomTerrace,
  seatingMainEntrance,
  clearSearchLabel,
}: {
  seatingLeftTable: string;
  seatingRightTable: string;
  seatingChartLoading: string;
  seatingChartError: string;
  seatingChartEmpty: string;
  seatingChartNoNamesForTable: string;
  danceFloor: string;
  seatingFindSeatFor: string;
  seatingFindSeatPlaceholder: string;
  seatingBallroomTerrace: string;
  seatingMainEntrance: string;
  clearSearchLabel: string;
}) {
  const [data, setData] = useState<SeatingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [findSeatInput, setFindSeatInput] = useState('');
  const [visibleSeatOrders, setVisibleSeatOrders] = useState<number[]>([]);

  const mapScrollRef = useRef<HTMLDivElement>(null);
  const danceFloorAnchorRef = useRef<HTMLDivElement>(null);

  const highlightTokens = useMemo(
    () => parseFindSeatInput(findSeatInput),
    [findSeatInput],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/seating');
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Request failed');
        }
        if (!cancelled) {
          let seatingRows: SeatingRow[] = Array.isArray(json.seatingRows)
            ? json.seatingRows
            : [];
          if (
            seatingRows.length === 0 &&
            (Array.isArray(json.leftTable) || Array.isArray(json.rightTable))
          ) {
            const legacyLeft: string[] = json.leftTable ?? [];
            const legacyRight: string[] = json.rightTable ?? [];
            const n = Math.max(legacyLeft.length, legacyRight.length);
            seatingRows = Array.from({ length: n }, (_, i) => ({
              leftA: legacyLeft[i] ?? '',
              leftB: '',
              rightA: legacyRight[i] ?? '',
              rightB: '',
            }));
          }
          setData({ seatingRows });
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : seatingChartError);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [seatingChartError]);

  useEffect(() => {
    let cancelled = false;
    const email =
      typeof window !== 'undefined' ? localStorage.getItem('rsvp-email') : null;
    if (!email?.trim()) {
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/rsvp/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        const json = await res.json();
        if (cancelled) return;
        if (res.ok && json.found && json.data) {
          const parts = rsvpToDisplayNameParts(json.data);
          if (parts.length > 0) {
            const prefilled = parts.join(', ');
            setFindSeatInput((prev) => (prev.trim() === '' ? prefilled : prev));
          }
        }
      } catch {
        /* leave input unchanged */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = data?.seatingRows ?? [];
  /** Omit trailing / sparse rows with no one on the left table (right can still have seats). */
  const leftPairsFiltered = useMemo(
    () =>
      rows
        .filter((r) => (r.leftA ?? '').trim() || (r.leftB ?? '').trim())
        .map((r) => ({ seatA: r.leftA ?? '', seatB: r.leftB ?? '' })),
    [rows],
  );
  const hasLeft = leftPairsFiltered.length > 0;
  const hasRight = rows.some((r) => (r.rightA ?? '').trim() || (r.rightB ?? '').trim());
  const rightPairs = rows.map((r) => ({ seatA: r.rightA ?? '', seatB: r.rightB ?? '' }));

  const { leftOrder, rightOrder, totalSeatSteps } = useMemo(() => {
    const leftLen = hasLeft ? leftPairsFiltered.length : 0;
    const rightLen = hasRight ? rows.length : 0;
    const { leftOrder: lo, rightOrder: ro, total } = buildRowStaggerOrders(
      leftLen,
      rightLen,
    );
    return { leftOrder: lo, rightOrder: ro, totalSeatSteps: total };
  }, [rows, hasLeft, hasRight, leftPairsFiltered]);

  useEffect(() => {
    if (loading || error) return;
    if (totalSeatSteps === 0) {
      setVisibleSeatOrders([]);
      return;
    }
    setVisibleSeatOrders([]);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let k = 0; k < totalSeatSteps; k++) {
      timers.push(
        setTimeout(() => {
          setVisibleSeatOrders((prev) => [...prev, k]);
        }, k * 20),
      );
    }
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [loading, error, totalSeatSteps, rows]);

  /** On small viewports, start scrolled so the dance floor is centered when the map overflows. */
  useLayoutEffect(() => {
    if (loading || error || rows.length === 0) return;

    const scrollEl = mapScrollRef.current;
    const anchor = danceFloorAnchorRef.current;
    if (!scrollEl || !anchor) return;

    const centerDanceFloor = () => {
      if (scrollEl.scrollWidth <= scrollEl.clientWidth + 1) return;
      anchor.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(centerDanceFloor);
    });
  }, [loading, error, rows.length]);

  if (loading) {
    return (
      <div className="px-2 py-16 text-center">
        <p className="text-body text-gray-500">{seatingChartLoading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-2 py-12 text-center">
        <p className="text-body text-gray-700">{seatingChartError}</p>
      </div>
    );
  }

  const isEmpty = rows.length === 0;

  if (isEmpty) {
    return (
      <div className="px-2 py-16 text-center">
        <p className="text-body text-gray-600">{seatingChartEmpty}</p>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-8">
      <div className="mx-auto mb-8 flex max-w-2xl flex-col items-center gap-4 px-1">
        <div className="flex w-full max-w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <label htmlFor="seating-find-seat" className="text-body shrink-0 text-sm font-medium text-gray-700">
            {seatingFindSeatFor}
          </label>
          <div className="relative min-w-0 flex-1">
            <input
              id="seating-find-seat"
              type="text"
              autoComplete="name"
              placeholder={seatingFindSeatPlaceholder}
              value={findSeatInput}
              onChange={(e) => setFindSeatInput(e.target.value)}
              className="text-body w-full border border-gray-400 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 outline-none ring-gray-300 focus:ring-2"
            />
            {findSeatInput ? (
              <button
                type="button"
                onClick={() => setFindSeatInput('')}
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label={clearSearchLabel}
              >
                <XMarkIcon className="h-5 w-5" strokeWidth={1.5} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-0 sm:px-1">
        <div
          ref={mapScrollRef}
          className="flex min-h-0 flex-col overflow-x-auto overflow-y-visible pb-2 [-webkit-overflow-scrolling:touch] sm:overflow-x-visible sm:pb-0"
          role="region"
          aria-label="Seating chart and ballroom terrace"
        >
          <div className="flex min-w-[28rem] flex-col gap-1 sm:min-w-0 sm:gap-2">
            <div className="flex w-full flex-row items-start gap-x-0.5 sm:gap-x-1 md:gap-x-2">
              <div className="w-7 shrink-0 sm:w-8" aria-hidden />
              <div className="min-w-0 flex-1">
                <SeatingBallroomTerraceArrow label={seatingBallroomTerrace} />
              </div>
            </div>
            <div className="flex w-full flex-row items-start gap-x-0.5 sm:gap-x-1 md:gap-x-2">
              <div className="shrink-0 self-stretch">
                <SeatingMainEntranceArrow label={seatingMainEntrance} />
              </div>
              <div className="flex min-w-0 flex-1 flex-row items-start justify-center gap-2 sm:gap-3 md:gap-4">
                <div className="min-w-0 flex-1 basis-0">
                  {hasLeft ? (
                    <ZigzagPairedTableList
                      rows={leftPairsFiltered}
                      side="left"
                      label={seatingLeftTable}
                      highlightTokens={highlightTokens}
                      rowOrders={leftOrder}
                      visibleOrders={visibleSeatOrders}
                    />
                  ) : (
                    <div className="text-center">
                      <h3 className="text-title mb-3 text-center text-sm font-bold text-gray-900 sm:text-base md:text-lg lg:text-xl">
                        {seatingLeftTable}
                      </h3>
                      <p className="text-body text-sm text-gray-400">{seatingChartNoNamesForTable}</p>
                    </div>
                  )}
                </div>

                <div
                  ref={danceFloorAnchorRef}
                  className="flex shrink-0 self-stretch items-center justify-center px-0"
                >
                  <DanceFloorLabel label={danceFloor} />
                </div>

                <div className="min-w-0 flex-1 basis-0">
                  {hasRight ? (
                    <ZigzagPairedTableList
                      rows={rightPairs}
                      side="right"
                      label={seatingRightTable}
                      highlightTokens={highlightTokens}
                      rowOrders={rightOrder}
                      visibleOrders={visibleSeatOrders}
                    />
                  ) : (
                    <div className="text-center">
                      <h3 className="text-title mb-3 text-center text-sm font-bold text-gray-900 sm:text-base md:text-lg lg:text-xl">
                        {seatingRightTable}
                      </h3>
                      <p className="text-body text-sm text-gray-400">{seatingChartNoNamesForTable}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
