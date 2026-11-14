// Name: Graphics 2D
// ID: nonameawagraph
// Description: Blocks to compute lengths, angles, and areas in two dimensions.
// By: NOname-awa
// License: MIT

/* generated l10n code */Scratch.translate.setup({"de":{"name":"Grafiken 2D"},"es":{"area":"área","diameter":"diámetro","name":"Gráficos 2D","radius":"radio"},"fi":{"area":"pinta-ala","circumference":"piiri","diameter":"halkaisija","graph":"verkon [graph] [CS]","line_section":"etäisyys pisteestä ([x1],[y1]) pisteeseen ([x2],[y2])","name":"2D-grafiikka","pi":"pii","quadrilateral":"neliön ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) ([x4],[y4]) [CS]","radius":"säde","ray_direction":"pisteiden ([x1],[y1]) ja ([x2],[y2]) välisen janan suunta","round":"ympyrän, jonka [rd] on [a], [CS]","triangle":"kolmion ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) [CS]","triangle_s":"kolmion [s1] [s2] [s3] pinta-ala"},"it":{"circumference":"circonferenza","diameter":"diametro","graph":"[CS] del grafo [graph]","line_section":"distanza tra ([x1],[y1]) e ([x2],[y2])","name":"Grafica 2D","pi":"pi greco","quadrilateral":"[CS] del quadrangolo ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) ([x4],[y4])","radius":"raggio","ray_direction":"direzione da ([x1],[y1]) a ([x2],[y2])","round":"[CS] del cerchio [rd][a]","triangle":"[CS] del triangolo ([x1],[y1]) ([x2],[y2]) ([x3],[y3])","triangle_s":"area del triangolo [s1] [s2] [s3]"},"ja":{"area":"面積","circumference":"円周","diameter":"直径","graph":"グラフ[graph]の[CS]","line_section":"([x1],[y1]) から ([x2],[y2]) までの長さ","name":"グラフィック2D","pi":"π","quadrilateral":"([x1],[y1]) ([x2],[y2]) ([x3],[y3]) ([x4],[y4]) の四角形の[CS] ","radius":"半径","ray_direction":"([x1],[y1]) から ([x2],[y2]) への向き","round":"[rd]が[a]の円の[CS]","triangle":"([x1],[y1]) ([x2],[y2]) ([x3],[y3]) の三角形の[CS]","triangle_s":"[s1][s2][s3]の三角形の面積"},"ko":{"area":"넓이","circumference":"둘레","diameter":"지름","graph":"그래프 [graph]의 [CS]","line_section":"([x1],[y1]) 부터 ([x2],[y2]) 까지의 거리","name":"그래픽 2D","quadrilateral":"사각형 ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) ([x4],[y4]) 의 [CS]","radius":"반지름","ray_direction":"([x1],[y1]) 에서 ([x2],[y2]) (으)로의 방향","round":"[rd]이(가) [a]인 원의 [CS]","triangle":"삼각형 ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) 의 [CS]","triangle_s":"삼각형 [s1] [s2] [s3] 의 넓이"},"nb":{"area":"område","circumference":"omkrets","graph":"graf [graph] 's [CS]","line_section":"lengde fra ([x1],[y1]) til ([x2],[y2])","name":"Grafikk 2D","quadrilateral":"firkant ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) ([x4],[y4]) 's [CS]","ray_direction":"retning av ([x1],[y1]) til ([x2],[y2])","round":"sirkel av [rd][a]'s [CS]","triangle":"trekant ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) 's [CS]","triangle_s":"trekant [s1] [s2] [s3] 's areal"},"nl":{"area":"oppervlakte","circumference":"omtrek","graph":"[CS] van grafiek [graph]","line_section":"lengte van ([x1],[y1]) naar ([x2],[y2])","name":"2D-trigonometrie","quadrilateral":"[CS] van vierhoek ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) ([x4],[y4])","radius":"straal","ray_direction":"richting van ([x1],[y1]) naar ([x2],[y2])","round":"[CS] van cirkel met [rd] [a]","triangle":"[CS] van driehoek ([x1],[y1]) ([x2],[y2]) ([x3],[y3])","triangle_s":"oppervlakte van driehoek [s1] [s2] [s3]"},"pl":{"area":"powierzchnia"},"ru":{"area":"площадь","circumference":"длина","diameter":"диаметр","graph":"[CS] графа [graph]","line_section":"длина от ([x1],[y1]) до ([x2],[y2])","name":"Графика 2D","pi":"пи","quadrilateral":"[CS] четырехугольника ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) ([x4],[y4])","radius":"радиус","ray_direction":"направление от ([x1],[y1]) к ([x2],[y2])","round":"[CS] круга с [rd] ом [a]","triangle":"[CS] треугольника ([x1],[y1]) ([x2],[y2]) ([x3],[y3])","triangle_s":"площадь треугольника [s1] [s2] [s3]"},"tr":{"name":"Grafik 2D"},"uk":{"name":"Двохвимірна Графіка"},"zh-cn":{"area":"面积","circumference":"周长","diameter":"直径","graph":"图形 [graph] 的 [CS]","line_section":"（[x1],[y1]）到（[x2],[y2]）的长度","name":"图形 2D","pi":"π","quadrilateral":"矩形（[x1],[y1]）（[x2],[y2]）（[x3],[y3]）（[x4],[y4]）的 [CS]","radius":"半径","ray_direction":"（[x1],[y1]）的（[x2],[y2]）的距离","round":"[rd] 为 [a] 的圆的 [CS]","triangle":"三角形（[x1],[y1]）（[x2],[y2]）（[x3],[y3]）的 [CS]","triangle_s":"三角形 [s1] [s2] [s3] 的面积"}});/* end generated l10n code */(function (Scratch) {
  "use strict";
  class graph {
    getInfo() {
      return {
        id: "nonameawagraph",
        name: Scratch.translate({ id: "name", default: "Graphics 2D" }),
        color1: "#ff976c",
        color2: "#cc7956",
        color3: "#e58861",
        blocks: [
          {
            opcode: "line_section",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "line_section",
              default: "length from ([x1],[y1]) to ([x2],[y2])",
            }),
            arguments: {
              x1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "-100",
              },
              y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              x2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "ray_direction",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "ray_direction",
              default: "direction of ([x1],[y1]) to ([x2],[y2])",
            }),
            hideFromPalette: true,
            arguments: {
              x1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              x2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "100",
              },
              y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "ray_direction2",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "ray_direction",
              default: "direction of ([x1],[y1]) to ([x2],[y2])",
            }),
            arguments: {
              x1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              x2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "100",
              },
              y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "vertical",
            blockType: Scratch.BlockType.BOOLEAN,
            // eslint-disable-next-line extension/should-translate
            text: "[a] ⊥ [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.ANGLE,
                defaultValue: "0",
              },
              b: {
                type: Scratch.ArgumentType.ANGLE,
                defaultValue: "90",
              },
            },
          },
          "---",
          {
            opcode: "triangle",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "triangle",
              default: "triangle ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) 's [CS]",
            }),
            arguments: {
              x1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              x2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              x3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              y3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              CS: {
                type: Scratch.ArgumentType.STRING,
                menu: "cs",
              },
            },
          },
          {
            opcode: "triangle_s",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "triangle_s",
              default: "triangle [s1] [s2] [s3] 's area",
            }),
            arguments: {
              s1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "3",
              },
              s2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "4",
              },
              s3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "5",
              },
            },
          },
          {
            opcode: "quadrilateral",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "quadrilateral",
              default:
                "quadrangle ([x1],[y1]) ([x2],[y2]) ([x3],[y3]) ([x4],[y4]) 's [CS]",
            }),
            arguments: {
              x1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              x2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              x3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              y3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              x4: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              y4: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              CS: {
                type: Scratch.ArgumentType.STRING,
                menu: "cs",
              },
            },
          },
          {
            opcode: "graph",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "graph",
              default: "graph [graph] 's [CS]",
            }),
            arguments: {
              graph: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "[[0,0], [0,2], [2,4], [4,2], [4,0]]",
              },
              CS: {
                type: Scratch.ArgumentType.STRING,
                menu: "cs",
              },
            },
          },
          "---",
          {
            opcode: "round",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              id: "round",
              default: "circle of [rd][a]'s [CS]",
            }),
            arguments: {
              rd: {
                type: Scratch.ArgumentType.STRING,
                menu: "rd",
              },
              a: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
              CS: {
                type: Scratch.ArgumentType.STRING,
                menu: "cs",
              },
            },
          },
          "---",
          {
            opcode: "pi",
            disableMonitor: true,
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "pi", default: "pi" }),
          },
        ],
        menus: {
          rd: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate({ id: "radius", default: "radius" }),
                value: "r",
              },
              {
                text: Scratch.translate({
                  id: "diameter",
                  default: "diameter",
                }),
                value: "d",
              },
            ],
          },
          cs: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate({ id: "area", default: "area" }),
                value: "s",
              },
              {
                text: Scratch.translate({
                  id: "circumference",
                  default: "circumference",
                }),
                value: "c",
              },
            ],
          },
        },
      };
    }
    line_section(args) {
      return Math.sqrt(
        Math.pow(args.x1 - args.x2, 2) + Math.pow(args.y1 - args.y2, 2)
      );
    }
    ray_direction(args) {
      // Added by NexusKitten
      // 由 NexusKitten 添加
      const dx =
        Scratch.Cast.toNumber(args.x2) - Scratch.Cast.toNumber(args.x1);
      const dy =
        Scratch.Cast.toNumber(args.y2) - Scratch.Cast.toNumber(args.y1);
      if (dx === 0 && dy === 0) {
        return 0;
      } else if (dy < 0) {
        return (180 / Math.PI) * Math.atan(dx / dy) + 180;
      } else {
        return (180 / Math.PI) * Math.atan(dx / dy);
      }
    }
    ray_direction2(args) {
      const dx =
        Scratch.Cast.toNumber(args.x2) - Scratch.Cast.toNumber(args.x1);
      const dy =
        Scratch.Cast.toNumber(args.y2) - Scratch.Cast.toNumber(args.y1);
      return (Math.atan2(dx, dy) * 180) / Math.PI;
    }
    vertical(args) {
      if (isNaN(args.a) || isNaN(args.b)) {
        return false;
      } else {
        return (args.a - (args.b - 90)) % 180 == 0;
      }
    }
    triangle(args) {
      if (args.CS == "s") {
        let points = [
          [args.x1, args.y1],
          [args.x2, args.y2],
          [args.x3, args.y3],
        ];
        let area = 0;
        let n = points.length;
        for (let i = 0; i < n; i++) {
          let x1 = points[i][0];
          let y1 = points[i][1];
          let x2 = points[(i + 1) % n][0];
          let y2 = points[(i + 1) % n][1];
          area += x1 * y2;
          area -= x2 * y1;
        }
        area = Math.abs(area) / 2;
        return area;
      }
      if (args.CS == "c") {
        let i = 0;
        i += Math.sqrt(
          Math.pow(args.x1 - args.x2, 2) + Math.pow(args.y1 - args.y2, 2)
        );
        i += Math.sqrt(
          Math.pow(args.x2 - args.x3, 2) + Math.pow(args.y2 - args.y3, 2)
        );
        i += Math.sqrt(
          Math.pow(args.x3 - args.x1, 2) + Math.pow(args.y3 - args.y1, 2)
        );
        return i;
      }
      return 0;
    }
    triangle_s(args) {
      const s = (args.s1 + args.s2 + args.s3) / 2;
      const area = Math.sqrt(s * (s - args.s1) * (s - args.s2) * (s - args.s3));
      return area;
    }
    quadrilateral(args) {
      if (args.CS == "s") {
        let points = [
          [args.x1, args.y1],
          [args.x2, args.y2],
          [args.x3, args.y3],
          [args.x4, args.y4],
        ];
        let area = 0;
        let n = points.length;
        for (let i = 0; i < n; i++) {
          let x1 = points[i][0];
          let y1 = points[i][1];
          let x2 = points[(i + 1) % n][0];
          let y2 = points[(i + 1) % n][1];
          area += x1 * y2;
          area -= x2 * y1;
        }
        area = Math.abs(area) / 2;
        return area;
      }
      if (args.CS == "c") {
        let i = 0;
        i += Math.sqrt(
          Math.pow(args.x1 - args.x2, 2) + Math.pow(args.y1 - args.y2, 2)
        );
        i += Math.sqrt(
          Math.pow(args.x2 - args.x3, 2) + Math.pow(args.y2 - args.y3, 2)
        );
        i += Math.sqrt(
          Math.pow(args.x3 - args.x4, 2) + Math.pow(args.y3 - args.y4, 2)
        );
        i += Math.sqrt(
          Math.pow(args.x4 - args.x1, 2) + Math.pow(args.y4 - args.y1, 2)
        );
        return i;
      }
      return 0;
    }
    graph(args) {
      let points;
      try {
        points = JSON.parse(args.graph);
      } catch (error) {
        return 0;
      }
      if (!Array.isArray(points)) {
        return 0;
      }
      let n = points.length;
      if (args.CS == "s") {
        let area = 0;
        for (let i = 0; i < n; i++) {
          let x1 = points[i][0];
          let y1 = points[i][1];
          let x2 = points[(i + 1) % n][0];
          let y2 = points[(i + 1) % n][1];
          area += x1 * y2;
          area -= x2 * y1;
        }
        area = Math.abs(area) / 2;
        return area;
      }
      if (args.CS == "c") {
        let x1, x2, y1, y2;
        let j = 0;
        j = 0;
        var i_end = n - 1;
        var i_inc = 1;
        if (0 > i_end) {
          i_inc = -i_inc;
        }
        for (let i = 0; i_inc >= 0 ? i <= i_end : i >= i_end; i += i_inc) {
          x1 = points[i + 1 - 1][0];
          x2 = i == n - 1 ? points[0][0] : points[i + 2 - 1][0];
          y1 = points[i + 1 - 1][1];
          y2 = i == n - 1 ? points[0][1] : points[i + 2 - 1][1];
          j =
            (typeof j == "number" ? j : 0) +
            Math.sqrt(
              Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2)
            );
        }
        return j;
      }
      return 0;
    }
    round(args) {
      if (args.CS == "c") {
        return 2 * Math.PI * (args.rd == "r" ? args.a : args.a / 2);
      }
      if (args.CS == "s") {
        return Math.PI * (args.rd == "r" ? args.a : args.a / 2) ** 2;
      }
    }
    pi() {
      return Math.PI;
    }
  }
  Scratch.extensions.register(new graph());
})(Scratch);
