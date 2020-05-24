const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getSign = (): number => {
  return Math.random() < 0.5 ? 1 : -1;
};

const display3BVs = (BBBVs: number): number => {
  return Math.round(BBBVs * 1000) / 1000;
};

const displayMmss = (time: number) => {
  const minute = Math.floor(time / 60);
  const second = time % 60;
  return ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2);
};

export {display3BVs, displayMmss, getRandomInt, getSign};
