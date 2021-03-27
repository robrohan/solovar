import type { UIContext, UIID, Vec4, Vec2 } from 'interfaces';
import { X, Y, H, W, R, G, B, A } from 'interfaces';

export function setCursor(to: "pointer" | "default") {
  document.body.style.cursor = to;
}

export function toColor(v: Vec4): string {
  return `rgba(${v[R]},${v[G]},${v[B]},${v[A]})`;
}

export function isInside(p: Vec2, d: Vec4) {
  return p[X] >= d[X] &&
    p[X] < d[X] + d[W] &&
    p[Y] > d[Y] &&
    p[Y] < d[Y] + d[H];
}

export function solovarStart(ctx: UIContext) {
  setCursor("default");
  ctx.ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function solovarEnd(ctx: UIContext) {
  ctx.hotId = undefined;
}

export function widgetLabel(ctx: UIContext, id: UIID, d: Vec4, text: string) {
  const clicked = widgetRect(ctx, id, d);

  // draw text
  ctx.ctx.textAlign = "center";
  ctx.ctx.textBaseline = "middle";
  ctx.ctx.fillStyle = toColor(ctx.style.textColor);
  ctx.ctx.fillText(text, d[X] + d[W] * 0.5, d[Y] + d[H] * 0.5, d[W]);

  return clicked;
}

export function widgetRect(ctx: UIContext, id: UIID, d: Vec4): boolean {
  const v2: Vec2 = [ctx.mx, ctx.my];

  {
    if (isInside(v2, d)) {
      // the mouse is within this control
      ctx.hotId = id;
      setCursor("pointer");
      if (ctx.down) {
        // if the mouse is down set us as active
        ctx.activeId = id;
      }
    }
  }

  {
    ctx.ctx.save();
    ctx.ctx.font = `${ctx.style.fontSize}px ${ctx.style.fontFamily}`;
    // highlight if hot
    if (ctx.hotId === id) {
      ctx.ctx.fillStyle = toColor(ctx.style.textColor);
      ctx.ctx.fillRect(d[X] - 5, d[Y] - 5, d[W] + 10, d[H] + 10);
    }
    // draw background
    ctx.ctx.fillStyle = toColor(ctx.style.bgColor);
    ctx.ctx.fillRect(d[X], d[Y], d[W], d[H]);
    ctx.ctx.restore();
  }

  {
    // check if we're clicked
    if (
      ctx.down === false &&
      ctx.hotId === id &&
      ctx.activeId === id
    ) {
      ctx.activeId = undefined;
      return true;
    }
  }

  return false;
}

