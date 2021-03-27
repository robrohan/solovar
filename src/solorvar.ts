import { RenderFn, UIContext } from "interfaces";

export function solovarInit(selector: string, render: RenderFn): UIContext {
  const ctx = {
    mx: 0,
    my: 0,
    down: false,
    style: {
      fontSize: 16,
      fontFamily: "serif",
      textColor: [255, 0, 255, 1],
      bgColor: [0, 0, 0, 1],
    }
  } as UIContext;

  ctx.canvas = document.querySelector(selector);
  const canvas = ctx.canvas;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx.ctx = canvas.getContext("2d");

  document.addEventListener("mousemove", (e) => {
    ctx.mx = e.clientX;
    ctx.my = e.clientY;
  });
  document.addEventListener("mousedown", (e) => (ctx.down = true));
  document.addEventListener("mouseup", (e) => (ctx.down = false));
  // erm...
  window.addEventListener("resize", (e) => {
    // solovarInit(selector, render)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  });


  // Don't think about this too much, it super pointer loopy
  const lp = makeLoop(ctx, render);
  ctx.aniFrame = lp;
  window.requestAnimationFrame(lp);

  return ctx;
}

function makeLoop(ctx: UIContext, render: RenderFn) {
  return function (t: number) {
    render(ctx, t);
    window.requestAnimationFrame(ctx.aniFrame);
  }
}

