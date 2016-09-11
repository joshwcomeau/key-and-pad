// eslint-disable-next-line import/prefer-default-export
export const calculateDistortionCurve = ({ amount, clarity }) => {
  const samples = 1000;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;

  for (let i = 0; i < samples; i++) {
    const x = i * 2 / samples - 1;
    curve[i] = (amount + 3) * x * 20 * deg / (Math.PI + amount * Math.abs(x) * clarity);
  }

  return curve;
};
