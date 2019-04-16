/* eslint-disable no-restricted-syntax */
import Cancellable from './cancellable';
import UncancelledCancellable from './uncancelled';
import CancelledCancellable from './cancelled';
import { dispatch } from './utils';
/**
 * A Cancellable class that allows composition of Cancellable instances.
 */
export default class CompositeCancellable extends Cancellable {
  /**
   * Creates a CompositeCancellable
   */
  constructor() {
    super();

    /**
     * @ignore
     */
    this.buffer = [];
    /**
     * @ignore
     */
    this.state = UncancelledCancellable;
  }

  /**
   * Returns true if the instance is cancelled.
   * @returns {boolean}
   */
  get cancelled() {
    return this.state.cancelled;
  }

  /**
   * Cancels the instances contained.
   * @returns {boolean}
   * Returns true if the cancel was successful.
   */
  cancel() {
    if (!this.cancelled) {
      const { buffer } = this;
      this.buffer = [];

      for (const i of buffer) {
        i.cancel();
      }

      this.state = CancelledCancellable;
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
        this.buffer.push(cancellable);
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
      const { buffer } = this;

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
