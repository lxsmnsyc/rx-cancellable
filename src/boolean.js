import Cancellable from './cancellable';
import UncancelledCancellable from './uncancelled';
import CancelledCancellable from './cancelled';
import { dispatch } from './utils';
/**
 * @ignore
 */
const CANCEL_STATE = new WeakMap();

/**
 * A simple Cancellable class that represents a boolean state.
 */
export default class BooleanCancellable extends Cancellable {
  /**
   * Creates a BooleanCancellable
   */
  constructor() {
    super();

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
   * Cancels the instance
   * @returns {boolean}
   * Returns true if the cancel was successful.
   */
  cancel() {
    if (!this.cancelled) {
      CANCEL_STATE.set(this, CancelledCancellable);

      dispatch(this, 'cancel');
      return true;
    }
    return false;
  }
}
