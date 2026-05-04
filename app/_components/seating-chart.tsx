'use client';

import type { KeyboardEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
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
} from '#/lib/seating-highlight';

type SeatingResponse = {
  leftTable: string[];
  rightTable: string[];
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

const INDENT = ['pl-0', 'pl-5 sm:pl-9 sm:pl-11', 'pl-10 sm:pl-[4.25rem] sm:pl-[5.25rem]'] as const;
const INDENT_R = ['pr-0', 'pr-5 sm:pr-9 sm:pr-11', 'pr-10 sm:pr-[4.25rem] sm:pr-[5.25rem]'] as const;

/** Global stagger order: row 0 left, row 0 right, row 1 left, … (same rhythm as reading across tables). */
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

function ZigzagNameList({
  names,
  side,
  label,
  highlightTokens,
  rowOrders,
  visibleOrders,
}: {
  names: string[];
  side: Side;
  label: string;
  highlightTokens: string[];
  rowOrders: number[];
  visibleOrders: number[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col w-full">
      <h3 className="text-title mb-3 text-center text-sm font-bold tracking-tight text-gray-900 sm:mb-4 sm:text-base md:text-lg lg:text-xl">
        {label}
      </h3>
      <ul className="w-full min-w-0 overflow-visible px-0 sm:px-1 md:px-2" aria-label={label}>
        {names.map((name, i) => {
          const step = zigzagStep(i);
          const indentClass = side === 'left' ? INDENT[step] : INDENT_R[step];
          const globalOrder = rowOrders[i] ?? i;
          const rowVisible = visibleOrders.includes(globalOrder);
          const matched =
            highlightTokens.length > 0 &&
            highlightTokens.some((h) => namesMatchSeatToHighlight(name, h));
          const nameClass = matched
            ? 'text-body min-w-0 break-words text-xs font-bold leading-snug text-gray-900 underline decoration-2 underline-offset-2 sm:text-sm md:text-base'
            : 'text-body min-w-0 break-words text-xs leading-snug text-gray-800 sm:text-sm md:text-base';
          const rowInner =
            side === 'left' ? (
              <>
                <div className="shrink-0 bg-white transition-transform duration-300 group-hover:scale-125">
                  <SeatPersonIcon />
                </div>
                <div className="min-w-0 transition-transform duration-300 group-hover:scale-110">
                  <span className={nameClass}>{name}</span>
                </div>
              </>
            ) : (
              <>
                <div className="min-w-0 transition-transform duration-300 group-hover:scale-110">
                  <span className={nameClass}>{name}</span>
                </div>
                <div className="shrink-0 bg-white transition-transform duration-300 group-hover:scale-125">
                  <SeatPersonIcon />
                </div>
              </>
            );
          return (
            <li
              key={`${i}-${name}`}
              className={`group flex cursor-pointer items-center gap-1.5 py-1 leading-snug transition-all duration-350 sm:gap-2.5 sm:py-1.5 ${indentClass} ${
                side === 'left' ? 'justify-start' : 'justify-end'
              } ${rowVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              {rowInner}
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
        className="flex w-9 shrink-0 cursor-pointer select-none items-center justify-center self-stretch rounded-sm px-0 outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-11 md:w-12"
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
        <p className="text-title origin-center rotate-[-90deg] whitespace-nowrap text-[0.65rem] font-bold text-gray-800 sm:text-xs md:text-sm">
          {label}
        </p>
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
  clearSearchLabel: string;
}) {
  const [data, setData] = useState<SeatingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [findSeatInput, setFindSeatInput] = useState('');
  const [visibleSeatOrders, setVisibleSeatOrders] = useState<number[]>([]);

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
          setData({
            leftTable: json.leftTable ?? [],
            rightTable: json.rightTable ?? [],
          });
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

  const left = data?.leftTable ?? [];
  const right = data?.rightTable ?? [];

  const { leftOrder, rightOrder, totalSeatSteps } = useMemo(
    () => {
      const { leftOrder: lo, rightOrder: ro, total } = buildRowStaggerOrders(
        left.length,
        right.length,
      );
      return { leftOrder: lo, rightOrder: ro, totalSeatSteps: total };
    },
    [left, right],
  );

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
  }, [loading, error, totalSeatSteps, left, right]);

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

  const isEmpty = left.length === 0 && right.length === 0;

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

      <div className="flex flex-row items-start justify-center gap-1 sm:gap-2 md:gap-3">
        <div className="min-w-0 flex-1 basis-0">
          {left.length > 0 ? (
            <ZigzagNameList
              names={left}
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

        <DanceFloorLabel label={danceFloor} />

        <div className="min-w-0 flex-1 basis-0">
          {right.length > 0 ? (
            <ZigzagNameList
              names={right}
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
  );
}
