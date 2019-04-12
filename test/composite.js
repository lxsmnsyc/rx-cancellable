/* eslint-disable no-undef */
import assert from 'assert';
import { CompositeCancellable, BooleanCancellable } from '../src';

describe('CompositeCancellable', () => {
  describe('cancel', () => {
    it('should return true if instance is never cancelled before', () => {
      const c = new CompositeCancellable();
      assert(c.cancel());
    });
    it('should return false if instance has been cancelled before.', () => {
      const c = new CompositeCancellable();
      c.cancel();
      assert(c.cancel() === false);
    });
    it('should cancel the composed instances', () => {
      const c = new CompositeCancellable();
      const a = new BooleanCancellable();
      c.add(a);
      c.cancel();
      assert(a.cancelled);
    });
  });
  describe('add', () => {
    it('should return true if given instance is Cancellable', () => {
      const c = new CompositeCancellable();
      const a = new BooleanCancellable();
      assert(c.add(a));
    });
    it('should return false if given instance is non-Cancellable.', () => {
      const c = new CompositeCancellable();
      assert(c.add() === false);
    });
    it('should return false and cancel given instance if source is cancelled.', () => {
      const c = new CompositeCancellable();
      c.cancel();
      const a = new BooleanCancellable();
      assert(c.add(a) === false && a.cancelled);
    });
  });
  describe('remove', () => {
    it('should return true if given instance is in the composite', () => {
      const c = new CompositeCancellable();
      const a = new BooleanCancellable();
      c.add(a);
      assert(c.remove(a));
    });
    it('should return false if given instance is non-Cancellable.', () => {
      const c = new CompositeCancellable();
      assert(c.remove() === false);
    });
    it('should return false if given instance is the same as the source.', () => {
      const c = new CompositeCancellable();
      assert(c.remove(c) === false);
    });
    it('should return false if the given instance is not in the Composite', () => {
      const c = new CompositeCancellable();
      const a = new BooleanCancellable();
      assert(c.remove(a) === false);
    });
  });
});
