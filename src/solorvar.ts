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

  document_canvas = ctx.canvas;
  const canvas_rect = document_canvas.getBoundingClientRect();
    
  document_canvas.addEventListener("mousemove", (e) => {
    ctx.mx = e.clientX - canvas_rect.left;
    ctx.my = e.clientY - canvas_rect.top;
  });
  document_canvas.addEventListener("mousedown", (e) => (ctx.down = true));
  document_canvas.addEventListener("mouseup", (e) => (ctx.down = false));

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

