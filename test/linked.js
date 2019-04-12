/* eslint-disable no-undef */
import assert from 'assert';
import { LinkedCancellable, BooleanCancellable } from '../src';

describe('LinkedCancellable', () => {
  describe('link', () => {
    it('should return false if the given argument is a non-Cancellable', () => {
      assert(new LinkedCancellable().link() === false);
    });
    it('should return false if the given argument is the same as the source', () => {
      const c = new LinkedCancellable();
      assert(c.link(c) === false);
    });
    it('should return false and cancel the source if the given Cancellable is cancelled', () => {
      const c = new LinkedCancellable();
      const a = new BooleanCancellable();
      a.cancel();

      assert(c.link(a) === false && c.cancelled);
    });
    it('should return false and cancel the given Cancellable if the source is cancelled', () => {
      const c = new LinkedCancellable();
      const a = new BooleanCancellable();
      c.cancel();

      assert(c.link(a) === false && a.cancelled);
    });
    it('should return true if both the source and the given Cancellable are not cancelled', () => {
      const c = new LinkedCancellable();
      const a = new BooleanCancellable();

      assert(c.link(a) === true);
    });
  });
  describe('cancel', () => {
    it('should return false if the source is cancelled', () => {
      const c = new LinkedCancellable();
      c.cancel();

      assert(c.cancel() === false);
    });
    it('should return true if the source was never cancelled before', () => {
      const c = new LinkedCancellable();
      assert(c.cancel());
    });
    it('should return true and cancel the link if there is one', () => {
      const c = new LinkedCancellable();
      const b = new BooleanCancellable();
      c.link(b);
      assert(c.cancel() && b.cancelled);
    });
  });
  describe('unlink', () => {
    it('should return false if the source is cancelled', () => {
      const c = new LinkedCancellable();
      c.cancel();

      assert(c.unlink() === false);
    });
    it('should return false if there is no link.', () => {
      const c = new LinkedCancellable();
      assert(c.unlink() === false);
    });
  });
  describe('cancelled', () => {
    it('should return true if the source is cancelled', () => {
      const c = new LinkedCancellable();
      c.cancel();

      assert(c.cancelled);
    });
    it('should return true if the link is cancelled', () => {
      const c = new LinkedCancellable();
      const b = new BooleanCancellable();
      c.link(b);
      b.cancel();

      assert(c.cancelled);
    });
    it('should return false if the source was never cancelled', () => {
      const c = new LinkedCancellable();

      assert(c.cancelled === false);
    });
  });
});
