"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flipCoin = void 0;
const flipCoin = () => {
    const flipResult = Math.floor(Math.random() * 2) + 1;
    if (flipResult === 1) {
        return 'heads';
    }
    else {
        return 'tails';
    }
};
exports.flipCoin = flipCoin;
