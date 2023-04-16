import { add } from '../src/stateMachine';

describe('test', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});