export const X = 0;
export const Y = 1;
export const W = 2;
export const H = 3;
export const R = 0;
export const G = 1;
export const B = 2;
export const A = 3;

export type Vec4 = [number, number, number, number];
export type Vec2 = [number, number];

/** RGBA */
export type Color = Vec4;
export type UIID = string;

export type UIStyle = {
  fontSize: number,
  fontFamily: string,
  /** "rgba(255,0,255,1)", */
  textColor: Color,
  bgColor: Color,
};

export type UIContext = {
  /** the element is highlighted (mouse over for example) */
  hotId: UIID,
  /** the element is active (mouse down for example) */
  activeId: UIID,
  /** Mouse X */
  mx: number,
  /** Mouse Y */
  my: number,
  /** Mouse Down (left) */
  down: boolean,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  style: UIStyle,

  // Internal stuff
  aniFrame: (t: number) => void,
};

export type RenderFn = (ctx: UIContext, t: number) => void;

export type WidgetRect = (ctx: UIContext, id: UIID, d: Vec4) => boolean;
