import { solovarInit, UIContext, widgetLabel } from 'main';
import { solovarEnd, solovarStart } from 'widgets';

console.log(process.env.NODE_ENV);

const state = {
  clicks: 0,
}

solovarInit(".immediate", (ctx: UIContext, t: number) => {

  // Solorvar UI
  {
    solovarStart(ctx);
    const label = `Number of clicks: ${state.clicks}`;
    widgetLabel(ctx, "1", [10, 5, 300, 40], label);
    if (widgetLabel(ctx, "2", [10, 60, 90, 32], "Click me!")) {
      state.clicks += 1;
    }
    solovarEnd(ctx);
  }

  // Demo of something moving around
  {
    const centerX = ctx.canvas.width * 0.5;
    const centerY = ctx.canvas.height * 0.5 * Math.abs(Math.sin(t / 1000));
    const radius = 70;
    ctx.ctx.beginPath();
    ctx.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.ctx.fillStyle = "green";
    ctx.ctx.fill();
    ctx.ctx.lineWidth = 5;
    ctx.ctx.strokeStyle = "#003300";
    ctx.ctx.stroke();
  }
});

