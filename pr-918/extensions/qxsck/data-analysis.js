// Name: Data Analysis
// ID: qxsckdataanalysis
// Description: Blocks to compute means, medians, maximums, minimums, variances, and modes.
// By: qxsck <https://scratch.mit.edu/users/qxsck/>
// License: MIT

/* generated l10n code */Scratch.translate.setup({"de":{"name":"Datenanalyse"},"fi":{"average":"lukujen [NUMBERS] keskiarvo","maximum":"lukujen [NUMBERS] maksimi","median":"lukujen [NUMBERS] mediaani","minimum":"lukujen [NUMBERS] minimi","mode":"lukujen [NUMBERS] moodi","name":"Datan analysointi","sum":"lukujen [NUMBERS] summa","variance":"lukujen [NUMBERS] varianssi"},"it":{"average":"media di [NUMBERS]","maximum":"massimo di [NUMBERS]","median":"mediana di [NUMBERS]","minimum":"minimo di [NUMBERS]","mode":"moda di [NUMBERS]","name":"Analisi dei Dati","sum":"somma di [NUMBERS]","variance":"varianza di [NUMBERS]"},"ja":{"average":"[NUMBERS]の平均値","maximum":"[NUMBERS]の最大値","median":"[NUMBERS]の中央値","minimum":"[NUMBERS]の最小値","mode":"[NUMBERS]の最頻値","name":"データ分析","sum":"[NUMBERS]の和","variance":"[NUMBERS]の分散"},"ko":{"average":"평균 [NUMBERS]","maximum":"최대값 [NUMBERS]","median":"중앙값 [NUMBERS]","minimum":"최소값 [NUMBERS]","mode":"최빈값 [NUMBERS]","name":"데이터 분석","sum":"종합 [NUMBERS]","variance":"분산 [NUMBERS]"},"nb":{"average":"gjennomsnittet av [NUMBERS]","maximum":"maksimum av [NUMBERS]","median":"median av [NUMBERS]","minimum":"minimum av [NUMBERS]","mode":"modus av [NUMBERS]","name":"Dataanalyse","variance":"variansen til [NUMBERS]"},"nl":{"average":"gemiddelde van [NUMBERS]","maximum":"maximum van [NUMBERS]","median":"mediaan van [NUMBERS]","minimum":"minimum van [NUMBERS]","mode":"modus van [NUMBERS]","name":"Gegevens analyseren","sum":"som van [NUMBERS]","variance":"variantie van [NUMBERS]"},"ru":{"average":"среднее значение [NUMBERS]","maximum":"максимум [NUMBERS]","median":"медиан [NUMBERS]","minimum":"минимум [NUMBERS]","mode":"режим [NUMBERS]","name":"Анализация Данных","sum":"сумма [NUMBERS]","variance":"колебание [NUMBERS]"},"zh-cn":{"average":"[NUMBERS]里所有数字的平均数","maximum":"[NUMBERS]里所有数字的最大数","median":"[NUMBERS]里所有数字的中位数","minimum":"[NUMBERS]里所有数字的最小数","mode":"[NUMBERS]里所有数字的众数","name":"数据分析","sum":"[NUMBERS]的和","variance":"[NUMBERS]里所有数字的方差"}});/* end generated l10n code */(function (Scratch) {
  "use strict";
  class dataAnalysis {
    getInfo() {
      return {
        id: "qxsckdataanalysis",
        name: Scratch.translate({ id: "name", default: "Data Analysis" }),
        blocks: [
          {
            opcode: "sum",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "sum",
              default: "sum of [NUMBERS]",
            }),
            arguments: {
              NUMBERS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 2 3 4 5",
              },
            },
          },
          {
            opcode: "average",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "average",
              default: "average of [NUMBERS]",
            }),
            arguments: {
              NUMBERS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 2 3 4 5",
              },
            },
          },
          {
            opcode: "maximum",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "maximum",
              default: "maximum of [NUMBERS]",
            }),
            arguments: {
              NUMBERS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 2 3 4 5",
              },
            },
          },
          {
            opcode: "minimum",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "minimum",
              default: "minimum of [NUMBERS]",
            }),
            arguments: {
              NUMBERS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 2 3 4 5",
              },
            },
          },
          {
            opcode: "median",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "median",
              default: "median of [NUMBERS]",
            }),
            arguments: {
              NUMBERS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 2 3 4 5",
              },
            },
          },
          {
            opcode: "mode",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "mode",
              default: "mode of [NUMBERS]",
            }),
            arguments: {
              NUMBERS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 2 2 3 4 5",
              },
            },
          },
          {
            opcode: "variance",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "variance",
              default: "variance of [NUMBERS]",
            }),
            arguments: {
              NUMBERS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 2 3 4 5",
              },
            },
          },
        ],
      };
    }

    sum(args) {
      const numbers = Scratch.Cast.toString(args.NUMBERS)
        .split(" ")
        .map(Number);
      return numbers.reduce((a, b) => a + b, 0);
    }

    average(args) {
      const numbers = Scratch.Cast.toString(args.NUMBERS)
        .split(" ")
        .map(Number);
      const sum = numbers.reduce((a, b) => a + b, 0);
      return sum / numbers.length;
    }

    // Spread is not used due to overflow.
    maximum(args) {
      const numbers = Scratch.Cast.toString(args.NUMBERS)
        .split(" ")
        .map(Number);
      let max = -Infinity;
      for (let i = 0; i < numbers.length; i++)
        if (numbers[i] > max) max = numbers[i];
      return max;
    }

    minimum(args) {
      const numbers = Scratch.Cast.toString(args.NUMBERS)
        .split(" ")
        .map(Number);
      let min = Infinity;
      for (let i = 0; i < numbers.length; i++)
        if (numbers[i] < min) min = numbers[i];
      return min;
    }

    median(args) {
      const numbers = Scratch.Cast.toString(args.NUMBERS)
        .split(" ")
        .map(Number);
      const sorted = numbers.sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
      } else {
        return sorted[middle];
      }
    }

    mode(args) {
      const numbers = Scratch.Cast.toString(args.NUMBERS)
        .split(" ")
        .map(Number);
      const counts = new Map();
      let maxCount = 0;
      let mode = null;
      for (const number of numbers) {
        let count = counts.get(number) || 0;
        count++;
        counts.set(number, count);
        if (count > maxCount) {
          maxCount = count;
          mode = number;
        }
      }
      return mode;
    }

    variance(args) {
      const numbers = Scratch.Cast.toString(args.NUMBERS)
        .split(" ")
        .map(Number);
      const mean = this.average(args);
      const squaredDifferences = numbers.map((x) => (x - mean) ** 2);
      const sum = squaredDifferences.reduce((a, b) => a + b, 0);
      return sum / numbers.length;
    }
  }

  Scratch.extensions.register(new dataAnalysis());
})(Scratch);
