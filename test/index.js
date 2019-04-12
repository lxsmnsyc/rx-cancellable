/* eslint-disable no-undef */
import assert from 'assert';
import { CANCELLED, UNCANCELLED } from '../src';

describe('CancelledCancellable', () => {
  describe('cancel', () => {
    it('should return false since it is always cancelled', () => {
      assert(CANCELLED.cancel() === false);
    });
  });
  describe('cancelled', () => {
    it('should return true since it is always cancelled', () => {
      assert(CANCELLED.cancelled);
    });
  });
});

describe('UncancelledCancellable', () => {
  describe('cancel', () => {
    it('should return false since it is uncancellable', () => {
      assert(UNCANCELLED.cancel() === false);
    });
  });
  describe('cancelled', () => {
    it('should return false since it is uncancellable', () => {
      assert(UNCANCELLED.cancelled === false);
    });
  });
});
