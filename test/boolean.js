/* eslint-disable no-undef */
import assert from 'assert';
import { BooleanCancellable } from '../src';

describe('BooleanCancellable', () => {
  describe('cancel', () => {
    it('should return true if instance is never cancelled before', () => {
      const c = new BooleanCancellable();
      assert(c.cancel());
    });
    it('should return false if instance has been cancelled before.', () => {
      const c = new BooleanCancellable();
      c.cancel();
      assert(c.cancel() === false);
    });
  });
});
