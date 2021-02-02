export const flipCoin = (): string => {
  const flipResult: number = Math.floor(Math.random() * 2) + 1;
  if (flipResult === 1) {
    return 'heads';
  } else {
    return 'tails';
  }
};
