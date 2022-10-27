export const mapRange = (
    x: number,
    a: number,
    b: number,
    c: number,
    d: number
) => c + (d - c) * ((x - a) / (b - a));

export const clamp = (x: number, min: number, max: number) =>
    Math.min(max, Math.max(min, x));

export const wrap = (x: number, min: number, max: number) => {
    return x - Math.floor((x - min) / (max - min)) * (max - min);
};
