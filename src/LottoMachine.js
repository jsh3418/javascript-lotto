const { Console, Random } = require("@woowacourse/mission-utils");
const LOTTO = require("./constants/constants");
const MESSAGE = require("./constants/message");
const Lotto = require("./Lotto");

class LottoMachine {
  #payment;
  #winningNumbers;
  #bonusNumber;

  getPayment() {
    Console.readLine(MESSAGE.REQUEST.PAYMENT, (payment) => {
      this.validatePayment(payment);

      this.#payment = payment;

      this.getWinningNumbers();
    });
  }

  getWinningNumbers() {
    Console.readLine(MESSAGE.REQUEST.WINNING_NUMBERS, (numbers) => {
      this.#winningNumbers = numbers.split(",");
      this.validateWinningNumbers(this.#winningNumbers);

      this.getBonusNumber();
    });
  }

  getBonusNumber() {
    Console.readLine(MESSAGE.REQUEST.BONUS_NUMBER, (number) => {
      this.validateBonusNumber();

      this.#bonusNumber = number;
    });
  }

  getRandomNumberLottos() {
    const lottos = [];

    while (this.#payment !== 0) {
      const numbers = Random.pickUniqueNumbersInRange(LOTTO.MIN_NUMBER, LOTTO.MAX_NUMBER, LOTTO.NUMBER_COUNT);
      const lotto = new Lotto(numbers);

      lottos.push(lotto.getNumbers());

      this.#payment -= LOTTO.PRICE;
    }

    return lottos;
  }

  validatePayment(payment) {
    if (this.isNotANumber(payment)) throw new Error(MESSAGE.ERROR.PAYMENT_MUST_BE_NUMBER);
    if (!this.isChange(payment)) throw new Error(MESSAGE.ERROR.CHANGE_MUST_BE_ZERO);
  }

  validateWinningNumbers(numbers) {
    if (numbers.some(this.isOutOfRange)) throw new Error(MESSAGE.ERROR.OUT_OF_RANGE_NUMBER);
    if (numbers.some(this.isNotANumber)) throw new Error(MESSAGE.ERROR.WINNING_NUMBER_MUST_BE_NUMBER);
    if (this.isIncorrectCount(numbers)) throw new Error(MESSAGE.ERROR.WINNING_NUMBER_COUNT);
    if (this.isDuplicateNumbers(numbers)) throw new Error(MESSAGE.ERROR.WINNING_NUMBER_MUST_NOT_BE_DUPLICATE);
  }

  validateBonusNumber(number) {
    if (this.isOutOfRange(number)) throw new Error(MESSAGE.ERROR.OUT_OF_RANGE_NUMBER);
    if (this.isNotANumber(number)) throw new Error(MESSAGE.ERROR.BONUS_NUMBER_MUST_BE_NUMBER);
  }

  isNotANumber(number) {
    return isNaN(Number(number));
  }

  isChange(number) {
    return number % LOTTO.PRICE === 0;
  }

  isOutOfRange(number) {
    return !(number >= LOTTO.MIN_NUMBER && number <= LOTTO.MAX_NUMBER);
  }

  isIncorrectCount(numbers) {
    return numbers.length !== LOTTO.NUMBER_COUNT;
  }

  isDuplicateNumbers(numbers) {
    return numbers.length !== new Set(numbers).size;
  }
}

module.exports = LottoMachine;
