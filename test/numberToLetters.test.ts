import { describe, it } from 'node:test';
import assert from 'node:assert';
import { convertNumberToLetters, CURRENCY_CONFIGS } from '../src/utils/numberToLetters.js';

describe('convertNumberToLetters - Cardinal numbers without currency', () => {
  it('handles 0', () => {
    assert.strictEqual(convertNumberToLetters(0), 'cero');
    assert.strictEqual(convertNumberToLetters('0'), 'cero');
  });

  it('handles 1', () => {
    assert.strictEqual(convertNumberToLetters(1), 'uno');
    assert.strictEqual(convertNumberToLetters(1, { gender: 'F' }), 'una');
    assert.strictEqual(convertNumberToLetters(1, { gender: 'N' }), 'un');
  });

  it('handles numbers with accents (16, 21, 22, 23, 26)', () => {
    assert.strictEqual(convertNumberToLetters(16), 'dieciséis');
    assert.strictEqual(convertNumberToLetters(21), 'veintiuno');
    assert.strictEqual(convertNumberToLetters(21, { gender: 'F' }), 'veintiuna');
    assert.strictEqual(convertNumberToLetters(21, { gender: 'N' }), 'veintiún');
    assert.strictEqual(convertNumberToLetters(22), 'veintidós');
    assert.strictEqual(convertNumberToLetters(23), 'veintitrés');
    assert.strictEqual(convertNumberToLetters(26), 'veintiséis');
  });

  it('handles 31 and tens separation with y', () => {
    assert.strictEqual(convertNumberToLetters(31), 'treinta y uno');
    assert.strictEqual(convertNumberToLetters(31, { gender: 'F' }), 'treinta y una');
    assert.strictEqual(convertNumberToLetters(31, { gender: 'N' }), 'treinta y un');
  });

  it('handles 100, 101, 121', () => {
    assert.strictEqual(convertNumberToLetters(100), 'cien');
    assert.strictEqual(convertNumberToLetters(101), 'ciento uno');
    assert.strictEqual(convertNumberToLetters(121), 'ciento veintiuno');
    assert.strictEqual(convertNumberToLetters(121, { gender: 'N' }), 'ciento veintiún');
  });

  it('handles 500 (quinientos) and 999', () => {
    assert.strictEqual(convertNumberToLetters(500), 'quinientos');
    assert.strictEqual(convertNumberToLetters(500, { gender: 'F' }), 'quinientas');
    assert.strictEqual(convertNumberToLetters(999), 'novecientos noventa y nueve');
  });

  it('handles thousands (1000 is mil, not un mil)', () => {
    assert.strictEqual(convertNumberToLetters(1000), 'mil');
    assert.strictEqual(convertNumberToLetters(1001), 'mil uno');
    assert.strictEqual(convertNumberToLetters(21000), 'veintiún mil');
    assert.strictEqual(convertNumberToLetters(100000), 'cien mil');
  });

  it('handles millions (un millón vs millones, with de when exact)', () => {
    assert.strictEqual(convertNumberToLetters(1000000), 'un millón');
    assert.strictEqual(convertNumberToLetters(1000001), 'un millón uno');
    assert.strictEqual(convertNumberToLetters(2000000), 'dos millones');
  });

  it('handles negative numbers', () => {
    assert.strictEqual(convertNumberToLetters(-5), 'menos cinco');
    assert.strictEqual(convertNumberToLetters(-100), 'menos cien');
  });

  it('handles decimal numbers without currency', () => {
    assert.strictEqual(convertNumberToLetters(0.5), 'cero punto cinco');
    assert.strictEqual(convertNumberToLetters(1.01), 'uno punto cero uno');
    assert.strictEqual(convertNumberToLetters(100.25), 'cien punto veinticinco');
  });
});

describe('convertNumberToLetters - Financial currency modes', () => {
  describe('MXN currency', () => {
    const mxn = CURRENCY_CONFIGS.MXN;

    it('formats 1 MXN correctly', () => {
      assert.strictEqual(
        convertNumberToLetters(1, { currency: mxn }),
        'un peso 00/100 M.N.'
      );
    });

    it('formats 1.5 MXN correctly', () => {
      assert.strictEqual(
        convertNumberToLetters(1.5, { currency: mxn }),
        'un peso 50/100 M.N.'
      );
    });

    it('formats 2 MXN correctly', () => {
      assert.strictEqual(
        convertNumberToLetters(2, { currency: mxn }),
        'dos pesos 00/100 M.N.'
      );
    });

    it('formats 1000000 MXN with "de"', () => {
      assert.strictEqual(
        convertNumberToLetters(1000000, { currency: mxn }),
        'un millón de pesos 00/100 M.N.'
      );
    });

    it('formats with word cents when requested', () => {
      assert.strictEqual(
        convertNumberToLetters(1.5, { currency: mxn, decimalMode: 'words' }),
        'un peso con cincuenta centavos M.N.'
      );
      assert.strictEqual(
        convertNumberToLetters(1.01, { currency: mxn, decimalMode: 'words' }),
        'un peso con un centavo M.N.'
      );
    });
  });

  describe('USD currency', () => {
    const usd = CURRENCY_CONFIGS.USD;

    it('formats 1 USD correctly', () => {
      assert.strictEqual(
        convertNumberToLetters(1, { currency: usd }),
        'un dólar 00/100 USD'
      );
    });

    it('formats 2 USD correctly', () => {
      assert.strictEqual(
        convertNumberToLetters(2, { currency: usd }),
        'dos dólares 00/100 USD'
      );
    });

    it('formats with word cents when requested', () => {
      assert.strictEqual(
        convertNumberToLetters(2.25, { currency: usd, decimalMode: 'words' }),
        'dos dólares con veinticinco centavos USD'
      );
    });
  });

  describe('EUR currency', () => {
    const eur = CURRENCY_CONFIGS.EUR;

    it('formats 1 EUR correctly without suffix', () => {
      assert.strictEqual(
        convertNumberToLetters(1, { currency: eur }),
        'un euro 00/100'
      );
    });

    it('formats 2 EUR correctly', () => {
      assert.strictEqual(
        convertNumberToLetters(2, { currency: eur }),
        'dos euros 00/100'
      );
    });

    it('formats cents in words as céntimos', () => {
      assert.strictEqual(
        convertNumberToLetters(1.5, { currency: eur, decimalMode: 'words' }),
        'un euro con cincuenta céntimos'
      );
      assert.strictEqual(
        convertNumberToLetters(1.01, { currency: eur, decimalMode: 'words' }),
        'un euro con un céntimo'
      );
    });
  });

  describe('COP, PEN, ARS currencies', () => {
    it('formats COP', () => {
      assert.strictEqual(
        convertNumberToLetters(1000, { currency: CURRENCY_CONFIGS.COP }),
        'mil pesos 00/100 COP'
      );
    });

    it('formats PEN', () => {
      assert.strictEqual(
        convertNumberToLetters(1, { currency: CURRENCY_CONFIGS.PEN }),
        'un sol 00/100 PEN'
      );
      assert.strictEqual(
        convertNumberToLetters(2, { currency: CURRENCY_CONFIGS.PEN }),
        'dos soles 00/100 PEN'
      );
    });

    it('formats ARS', () => {
      assert.strictEqual(
        convertNumberToLetters(100, { currency: CURRENCY_CONFIGS.ARS }),
        'cien pesos 00/100 ARS'
      );
    });
  });
});
