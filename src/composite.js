/* eslint-disable no-restricted-syntax */
import Cancellable from './cancellable';
import UncancelledCancellable from './uncancelled';
import CancelledCancellable from './cancelled';
import { dispatch } from './utils';
/**
 * @ignore
 */
const BUFFERS = new WeakMap();
/**
 * @ignore
 */
const CANCEL_STATE = new WeakMap();

/**
 * A Cancellable class that allows composition of Cancellable instances.
 */
export default class CompositeCancellable extends Cancellable {
  /**
   * Creates a CompositeCancellable
   */
  constructor() {
    super();

    BUFFERS.set(this, []);
    CANCEL_STATE.set(this, UncancelledCancellable);
  }

  /**
   * Returns true if the instance is cancelled.
   * @returns {boolean}
   */
  get cancelled() {
    return CANCEL_STATE.get(this).cancelled;
  }

  /**
   * Cancels the instances contained.
   * @returns {boolean}
   * Returns true if the cancel was successful.
   */
  cancel() {
    if (!this.cancelled) {
      const buffer = BUFFERS.get(this);
      BUFFERS.set(this, []);

      for (const i of buffer) {
        i.cancel();
      }

      CANCEL_STATE.set(this, CancelledCancellable);
      return true;
    }
    return false;
  }


  /**
   * Adds the given Cancellable into the composite.
   * @param {Cancellable} cancellable
   * The cancellable to be added to the composite.
   * @returns {boolean}
   */
  add(cancellable) {
    if (cancellable instanceof Cancellable && cancellable !== this) {
      if (this.cancelled) {
        cancellable.cancel();
      } else {
        BUFFERS.get(this).push(cancellable);
        return true;
      }
    }
    return false;
  }

  /**
   * Removes the given Cancellable from the composite.
   * @param {Cancellable} cancellable
   * The cancellable to be removed from the composite.
   * @returns {boolean}
   */
  remove(cancellable) {
    if (cancellable instanceof Cancellable && cancellable !== this) {
      const buffer = BUFFERS.get(this);

      const index = buffer.indexOf(cancellable);

      if (index !== -1) {
        buffer.splice(index, 1);

        dispatch(this, 'cancel');
        return true;
      }
    }
    return false;
  }
}
