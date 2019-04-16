import Cancellable from './cancellable';
import UncancelledCancellable from './uncancelled';
import CancelledCancellable from './cancelled';
import { dispatch } from './utils';

/**
 * A simple Cancellable class that represents a boolean state.
 */
export default class BooleanCancellable extends Cancellable {
  /**
   * Creates a BooleanCancellable
   */
  constructor() {
    super();

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
   * Cancels the instance
   * @returns {boolean}
   * Returns true if the cancel was successful.
   */
  cancel() {
    if (!this.cancelled) {
      this.state = CancelledCancellable;

      dispatch(this, 'cancel');
      return true;
    }
    return false;
  }
}
