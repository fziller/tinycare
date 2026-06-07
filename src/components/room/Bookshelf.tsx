import { useMemo } from 'react';
import { RoundedRect } from '@shopify/react-native-skia';
import { glowTier, useAnimatedNumeric } from './RoomScene.types';

type Props = {
  fun: number;
  glow: number;
  height: number;
};

const SHELF_X = 10;
const SHELF_TOP = 90;
const SHELF_W = 28;
const SHELF_H = 50;
const SHELF_THICK = 3;

const BOOK_COLORS = ['#D94040', '#4080D9', '#E8B040', '#40A060', '#A060C0', '#E06080'];
const BOOK_WIDTH = 5;

export function Bookshelf({ fun, glow, height: _h }: Props) {
  const glowLvl = glowTier(glow);
  const funFactor = useAnimatedNumeric(fun / 100, 800);

  const bookCount = Math.min(
    Math.max(0, glowLvl * 2 + Math.floor(funFactor * 3)),
    6,
  );

  const books = useMemo(
    () =>
      Array.from({ length: bookCount }, (_, i) => ({
        x: SHELF_X + SHELF_W - BOOK_WIDTH - 2 - i * (BOOK_WIDTH + 2),
        y: SHELF_TOP + 6 + (i % 3) * 5,
        w: BOOK_WIDTH,
        h: 18 + (i % 2) * 6,
        color: BOOK_COLORS[i % BOOK_COLORS.length],
      })),
    [bookCount],
  );

  return (
    <>
      <RoundedRect x={SHELF_X} y={SHELF_TOP} width={SHELF_W} height={SHELF_H} r={4} color="#C8B898" />
      <RoundedRect x={SHELF_X} y={SHELF_TOP} width={SHELF_W} height={SHELF_THICK} r={2} color="#B0A080" />
      <RoundedRect
        x={SHELF_X}
        y={SHELF_TOP + SHELF_H / 2}
        width={SHELF_W}
        height={SHELF_THICK}
        r={2}
        color="#B0A080"
      />
      {books.map((book, i) => (
        <RoundedRect
          key={`book-${i}`}
          x={book.x}
          y={book.y}
          width={book.w}
          height={book.h}
          r={1}
          color={book.color}
        />
      ))}
    </>
  );
}
