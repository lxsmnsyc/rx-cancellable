import Cancellable from './cancellable';

/* eslint-disable class-methods-use-this */

/**
 * A Cancellable class that is always cancelled and cannot be cancelled.
 */
class CancelledCancellable extends Cancellable {
  /**
   * Always returns true since this is a CancelledCancellable.
   */
  get cancelled() {
    return true;
  }

  /**
   * Cancels the CancelledCancellable (empty)
   */
  cancel() {
    return false;
  }
}

const CANCELLED = new CancelledCancellable();

/**
 * An instance of the CancelledCancellable
 */
export default CANCELLED;
