/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    __,
    allPass,
    anyPass,
    compose,
    countBy,
    equals, gt,
    gte,
    lte,
    map,
    max,
    mergeLeft,
    not,
    prop,
    reduce,
    sum,
    toLower,
    values
} from "ramda";

const getCircle = prop("circle");
const getTriangle = prop("triangle");
const getStar = prop("star");
const getSquare = prop("square");

const isRed = anyPass([ equals("red"), equals("omitted") ]);
const isWhite = anyPass([ equals("white"), equals("omitted") ]);
const isGreen = anyPass([ equals("green"), equals("omitted") ]);
const isBlue = anyPass([ equals("blue"), equals("omitted") ]);
const isOrange = anyPass([ equals("orange"), equals("omitted") ]);

const isCircleRed = compose(isRed, getCircle);
const isCircleWhite = compose(isWhite, getCircle);
const isCircleGreen = compose(isGreen, getCircle);
const isCircleBlue = compose(isBlue, getCircle);
const isCircleOrange = compose(isOrange, getCircle);

const isTriangleRed = compose(isRed, getTriangle);
const isTriangleWhite = compose(isWhite, getTriangle);
const isTriangleGreen = compose(isGreen, getTriangle);
const isTriangleBlue = compose(isBlue, getTriangle);
const isTriangleOrange = compose(isOrange, getTriangle);

const isStarRed = compose(isRed, getStar);
const isStarWhite = compose(isWhite, getStar);
const isStarGreen = compose(isGreen, getStar);
const isStarBlue = compose(isBlue, getStar);
const isStarOrange = compose(isOrange, getStar);

const isSquareRed = compose(isRed, getSquare);
const isSquareWhite = compose(isWhite, getSquare);
const isSquareGreen = compose(isGreen, getSquare);
const isSquareBlue = compose(isBlue, getSquare);
const isSquareOrange = compose(isOrange, getSquare);

const allWhite = allPass([ isStarWhite, isTriangleWhite, isSquareWhite, isCircleWhite ]);
const allGreen = allPass([ isCircleGreen, isTriangleGreen, isStarGreen, isSquareGreen ]);
const allRed = allPass([ isCircleRed, isTriangleRed, isStarRed, isSquareRed ]);
const allBlue = allPass([ isCircleBlue, isTriangleBlue, isStarBlue, isSquareBlue ]);
const allOrange = allPass([ isCircleOrange, isTriangleOrange, isStarOrange, isSquareOrange ]);

const mapIsGreen = compose(map(isGreen), values);
const mapIsRed = compose(map(isRed), values);
const mapIsOrange = compose(map(isOrange), values);
const mapIsBlue = compose(map(isBlue), values);
const mapIsWhite = compose(map(isWhite), values);

const sumIsGreen = compose(sum, mapIsGreen);
const sumIsRed = compose(sum, mapIsRed);
const sumIsOrange = compose(sum, mapIsOrange);
const sumIsBlue = compose(sum, mapIsBlue);
const sumIsWhite = compose(sum, mapIsWhite);

const omitStar = mergeLeft({ star: "omitted" });
const omitCircle = mergeLeft({ circle: "omitted" });
const omitSquare = mergeLeft({ square: "omitted" });
const omitTriangle = mergeLeft({ triangle: "omitted" });

const getCountByColor = compose(countBy(toLower), values);
const getColorsCounts = compose(values, getCountByColor);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => {
    const isTriangleAndCircleWhite = compose(allWhite, omitSquare, omitStar);
    return allPass([ isTriangleAndCircleWhite, isStarRed, isSquareGreen ])(shapes);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
    const isSumGreenNotLessThan = compose(gte(__, 2), sumIsGreen);
    return allPass([ isSumGreenNotLessThan ])(shapes);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
    const sumOfRed = sumIsRed(shapes);
    const sumOfBlue = sumIsBlue(shapes);
    return equals(sumOfRed, sumOfBlue);
}

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([ isCircleBlue, isStarRed, isSquareOrange ]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
    const isThreeShapesSameColor = compose(lte(3), reduce(max, 0), getColorsCounts);
    const isWhiteColorGreater = compose(gt(3), sumIsWhite);
    return allPass([ isThreeShapesSameColor, isWhiteColorGreater ])(shapes);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета,
// но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
    const areTwoShapesGreen = compose(equals(2), prop("green"), getCountByColor);
    const isOneShapeRed = compose(equals(1), prop("red"), getCountByColor);
    return allPass([ areTwoShapesGreen, isOneShapeRed, isTriangleGreen ])(shapes);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allOrange;

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (shapes) => {
    const isStarNotRed = compose(not, isStarRed);
    const isStarNotWhite = compose(not, isStarWhite);
    return allPass([ isStarNotRed, isStarNotWhite ])(shapes);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = allGreen;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (shapes) => { // TODO: try to refactor in more functional way
    const isNotTriangleWhite = compose(not, isTriangleWhite);
    const isNotSquareWhite = compose(not, isSquareWhite);
    const triangleEqualsSquare = shapes => equals(getTriangle(shapes), getSquare(shapes));
    return allPass([ isNotSquareWhite, isNotTriangleWhite, triangleEqualsSquare ])(shapes);
};
