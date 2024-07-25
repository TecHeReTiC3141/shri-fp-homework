/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    __,
    allPass,
    andThen,
    compose,
    gt,
    ifElse,
    length,
    lt,
    modulo,
    not,
    partialRight,
    pipe,
    pipeWith,
    prop,
    tap,
    tryCatch,
} from "ramda";

const api = new Api();

const squareUp = partialRight(Math.pow,[2]);
const moduloBy3 = modulo(__, 3);

const getResult = prop("result");

const isLengthLessThan = compose(lt(__, 10), length);
const isLengthGreaterThan = compose(gt(__, 2), length);
const isPositive = compose(gt(__, 0), Number);
const isNumber = compose(not, Number.isNaN);
const validateNumber = allPass([ isLengthLessThan, isLengthGreaterThan, isPositive, isNumber ]);

const toClosestInt = compose(Math.round, Number);

const apiGetToBase = api.get('https://api.tech/numbers/base');
const getBinaryPromise = value => apiGetToBase({ from: 10, to: 2, number: value.toString() });
const getBinary = pipeWith(andThen, [ getBinaryPromise, getResult ]);
const apiGetAnimalNamePromise = id => api.get(`https://animals.tech/${id}`, {});

const getAnimalName = pipeWith(andThen, [ apiGetAnimalNamePromise, getResult ]);

const asyncCompose = handleError => (f, res) => Promise.resolve(res).then(f).catch(handleError);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {

    const tapWriteLog = tap(writeLog);

    const validationPipeline = pipe(tapWriteLog, validateNumber);

    const pipeline = pipeWith(asyncCompose(handleError), [
        toClosestInt,
        tapWriteLog,
        getBinary,
        tapWriteLog,
        length,
        tapWriteLog,
        squareUp,
        tapWriteLog,
        moduloBy3,
        tapWriteLog,
        getAnimalName,
        handleSuccess,
    ]);

    const safePipeline = tryCatch(pipeline, handleError);
    const handleValidationError = () => handleError('ValidationError');

    const sequence = ifElse(
        validationPipeline,
        safePipeline,
        handleValidationError,
    );

    sequence(value);
}

export default processSequence;
