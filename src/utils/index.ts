const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getSign = (): number => {
  return Math.random() < 0.5 ? 1 : -1;
};

export {getRandomInt, getSign};
