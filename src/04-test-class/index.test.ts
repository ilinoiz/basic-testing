// Uncomment the code below and write your tests
import * as _ from 'lodash';
import { InsufficientFundsError, TransferFailedError, getBankAccount } from '.';

jest.mock('lodash');

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(1000);
    expect(bankAccount.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(1000);
    expect(() => bankAccount.withdraw(1500)).toThrow(
      new InsufficientFundsError(1000),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const fromBankAccount = getBankAccount(1000);
    const toBankAccount = getBankAccount(0);
    expect(() => fromBankAccount.transfer(1500, toBankAccount)).toThrow(
      new InsufficientFundsError(1000),
    );
  });

  test('should throw error when transferring to the same account', () => {
    const fromBankAccount = getBankAccount(1000);
    expect(() => fromBankAccount.transfer(1000, fromBankAccount)).toThrow(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(1000);
    const balanceAfterDeposit = bankAccount.deposit(800).getBalance();
    expect(balanceAfterDeposit).toBe(1800);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(1000);
    const balanceAfterWithdraw = bankAccount.withdraw(800).getBalance();
    expect(balanceAfterWithdraw).toBe(200);
  });

  test('should transfer money', () => {
    const fromBankAccount = getBankAccount(1000);
    const toBankAccount = getBankAccount(0);
    const result = fromBankAccount.transfer(800, toBankAccount);
    expect(result.getBalance()).toBe(200);
    expect(toBankAccount.getBalance()).toBe(800);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const randomMock = jest.spyOn(_, 'random');
    randomMock.mockReturnValueOnce(5).mockReturnValueOnce(1);
    const bankAccount = getBankAccount(1000);
    const result = await bankAccount.fetchBalance();
    expect(result).toBe(5);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const randomMock = jest.spyOn(_, 'random');
    randomMock.mockReturnValueOnce(5).mockReturnValueOnce(1);
    const bankAccount = getBankAccount(1000);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(5);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const randomMock = jest.spyOn(_, 'random');
    randomMock.mockReturnValueOnce(5).mockReturnValueOnce(0);
    const bankAccount = getBankAccount(1000);
    const result = await bankAccount.fetchBalance();
    expect(result).toBeNull();
  });
});
