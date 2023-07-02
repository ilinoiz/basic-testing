// Uncomment the code below and write your tests
import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

const mockOneMock = jest.fn();
const mockTwoMock = jest.fn();
const mockThreeMock = jest.fn();

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');
  return {
    ...originalModule,
    mockOne: () => mockOneMock(),
    mockTwo: () => mockTwoMock(),
    mockThree: () => mockThreeMock(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const mockedConsole = jest.spyOn(console, 'log');
    mockOne();
    expect(mockedConsole).not.toHaveBeenCalledWith('foo');

    mockTwo();
    expect(mockedConsole).not.toHaveBeenCalledWith('bar');

    mockThree();
    expect(mockedConsole).not.toHaveBeenCalledWith('baz');

    mockedConsole.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const mockedConsole = jest.spyOn(console, 'log');
    unmockedFunction();

    expect(mockedConsole).toHaveBeenCalledWith('I am not mocked');
    mockedConsole.mockRestore();
  });
});
