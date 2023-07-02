// Uncomment the code below and write your tests
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';
import path from 'path';
import fs from 'fs';
import * as fsPr from 'fs/promises';

jest.mock('path');
jest.mock('fs');
jest.mock('fs/promises');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callbackMock = jest.fn();
    const mockedSetTimeout = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callbackMock, 10_000);

    expect(mockedSetTimeout).toHaveBeenCalledWith(callbackMock, 10_000);
  });

  test('should call callback only after timeout', () => {
    const callbackMock = jest.fn();
    doStuffByTimeout(callbackMock, 2000);

    expect(callbackMock).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(2000);
    expect(callbackMock).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callbackMock = jest.fn();
    const mockedSetInterval = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callbackMock, 10_000);

    expect(mockedSetInterval).toHaveBeenCalledWith(callbackMock, 10_000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callbackMock = jest.fn();
    doStuffByInterval(callbackMock, 2000);

    expect(callbackMock).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(2000);
    jest.advanceTimersByTime(2000);
    jest.advanceTimersByTime(2000);
    jest.advanceTimersByTime(2000);
    jest.advanceTimersByTime(2000);

    expect(callbackMock).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = './tests/test.ts';
    const joinMock = jest.spyOn(path, 'join');
    await readFileAsynchronously(pathToFile);
    expect(joinMock).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = './tests/test.ts';
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = './tests/test.ts';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fsPr, 'readFile').mockResolvedValue('someData');
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe('someData');
  });
});
