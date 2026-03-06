import { toColor, isInside, solovarStart, solovarEnd, widgetRect, widgetLabel } from 'widgets';
import { UIContext, Vec4, Vec2 } from 'interfaces';

function makeCtx(overrides?: Partial<UIContext>): UIContext {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx2d = canvas.getContext('2d') as CanvasRenderingContext2D;

  return {
    mx: 0,
    my: 0,
    down: false,
    hotId: undefined,
    activeId: undefined,
    ctx: ctx2d,
    canvas,
    style: {
      fontSize: 16,
      fontFamily: 'serif',
      textColor: [255, 0, 255, 1],
      bgColor: [0, 0, 0, 1],
    },
    aniFrame: () => {},
    ...overrides,
  } as UIContext;
}

///////////////////////////
// toColor

describe('toColor', () => {
  it('converts a Vec4 to an rgba string', () => {
    const color: Vec4 = [255, 0, 255, 1];
    expect(toColor(color)).toBe('rgba(255,0,255,1)');
  });

  it('handles all-zero values', () => {
    const color: Vec4 = [0, 0, 0, 0];
    expect(toColor(color)).toBe('rgba(0,0,0,0)');
  });

  it('handles fractional alpha', () => {
    const color: Vec4 = [128, 64, 32, 0.5];
    expect(toColor(color)).toBe('rgba(128,64,32,0.5)');
  });
});

///////////////////////////
// isInside

describe('isInside', () => {
  // rect: x=10, y=10, w=100, h=50 == right edge=110, bottom edge=60
  const rect: Vec4 = [10, 10, 100, 50];

  it('returns true for a point clearly inside', () => {
    const p: Vec2 = [50, 30];
    expect(isInside(p, rect)).toBe(true);
  });

  it('returns false when point is left of the rect', () => {
    const p: Vec2 = [5, 30];
    expect(isInside(p, rect)).toBe(false);
  });

  it('returns false when point is right of the rect', () => {
    const p: Vec2 = [115, 30];
    expect(isInside(p, rect)).toBe(false);
  });

  it('returns false when point is above the rect', () => {
    const p: Vec2 = [50, 5];
    expect(isInside(p, rect)).toBe(false);
  });

  it('returns false when point is below the rect', () => {
    const p: Vec2 = [50, 65];
    expect(isInside(p, rect)).toBe(false);
  });

  it('returns true on the left edge (inclusive)', () => {
    const p: Vec2 = [10, 30];
    expect(isInside(p, rect)).toBe(true);
  });

  it('returns true on the right edge', () => {
    const p: Vec2 = [110, 30];
    expect(isInside(p, rect)).toBe(true);
  });

  it('returns true on the top edge', () => {
    const p: Vec2 = [50, 10];
    expect(isInside(p, rect)).toBe(true);
  });

  it('returns true on the bottom edge', () => {
    const p: Vec2 = [50, 60];
    expect(isInside(p, rect)).toBe(true);
  });
});

///////////////////////////
// solovarStart / solovarEnd

describe('solovarStart', () => {
  it('resets cursor to default', () => {
    document.body.style.cursor = 'pointer';
    const ctx = makeCtx();
    solovarStart(ctx);
    expect(document.body.style.cursor).toBe('default');
  });

  it('clears the canvas', () => {
    const ctx = makeCtx();
    solovarStart(ctx);
    expect(ctx.ctx.clearRect).toHaveBeenCalledWith(0, 0, ctx.canvas.width, ctx.canvas.height);
  });
});

describe('solovarEnd', () => {
  it('clears hotId', () => {
    const ctx = makeCtx({ hotId: 'btn1' } as Partial<UIContext>);
    solovarEnd(ctx);
    expect(ctx.hotId).toBeUndefined();
  });
});

///////////////////////////
// widgetRect

describe('widgetRect', () => {
  const rect: Vec4 = [10, 10, 100, 50];

  it('returns false when mouse is outside and not down', () => {
    const ctx = makeCtx({ mx: 0, my: 0 });
    expect(widgetRect(ctx, 'btn1', rect)).toBe(false);
  });

  it('sets hotId when mouse is inside', () => {
    const ctx = makeCtx({ mx: 50, my: 30 });
    widgetRect(ctx, 'btn1', rect);
    expect(ctx.hotId).toBe('btn1');
  });

  it('sets cursor to pointer when mouse is inside', () => {
    const ctx = makeCtx({ mx: 50, my: 30 });
    widgetRect(ctx, 'btn1', rect);
    expect(document.body.style.cursor).toBe('pointer');
  });

  it('sets activeId when mouse is inside and button is held down', () => {
    const ctx = makeCtx({ mx: 50, my: 30, down: true });
    widgetRect(ctx, 'btn1', rect);
    expect(ctx.activeId).toBe('btn1');
  });

  it('returns true (click) when mouse is released over the active widget', () => {
    // Simulate: button was pressed (activeId set), mouse released while still inside
    const ctx = makeCtx({
      mx: 50,
      my: 30,
      down: false,
      hotId: 'btn1',
      activeId: 'btn1',
    } as Partial<UIContext>);
    expect(widgetRect(ctx, 'btn1', rect)).toBe(true);
  });

  it('clears activeId after a click', () => {
    const ctx = makeCtx({
      mx: 50,
      my: 30,
      down: false,
      hotId: 'btn1',
      activeId: 'btn1',
    } as Partial<UIContext>);
    widgetRect(ctx, 'btn1', rect);
    expect(ctx.activeId).toBeUndefined();
  });

  it('does not fire click when a different widget is active', () => {
    const ctx = makeCtx({
      mx: 50,
      my: 30,
      down: false,
      hotId: 'btn1',
      activeId: 'btn2',
    } as Partial<UIContext>);
    expect(widgetRect(ctx, 'btn1', rect)).toBe(false);
  });

  it('does not fire click when mouse was never over the widget (hotId unset)', () => {
    const ctx = makeCtx({
      mx: 0,
      my: 0,
      down: false,
      hotId: undefined,
      activeId: 'btn1',
    } as Partial<UIContext>);
    expect(widgetRect(ctx, 'btn1', rect)).toBe(false);
  });
});


///////////////////////////
// widgetLabel

describe('widgetLabel', () => {
  const rect: Vec4 = [10, 10, 100, 50];

  it('returns false when not clicked', () => {
    const ctx = makeCtx({ mx: 0, my: 0 });
    expect(widgetLabel(ctx, 'lbl1', rect, 'Hello')).toBe(false);
  });

  it('draws text via fillText', () => {
    const ctx = makeCtx({ mx: 0, my: 0 });
    widgetLabel(ctx, 'lbl1', rect, 'Hello');
    expect(ctx.ctx.fillText).toHaveBeenCalledWith('Hello', expect.any(Number), expect.any(Number), rect[2]);
  });

  it('returns true when clicked', () => {
    const ctx = makeCtx({
      mx: 50,
      my: 30,
      down: false,
      hotId: 'lbl1',
      activeId: 'lbl1',
    } as Partial<UIContext>);
    expect(widgetLabel(ctx, 'lbl1', rect, 'Hello')).toBe(true);
  });
});
