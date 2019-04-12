import Cancellable from './cancellable';

/* eslint-disable class-methods-use-this */

/**
 * A Cancellable class that is always uncancelled and cannot be cancelled.
 */
class UncancelledCancellable extends Cancellable {
  /**
   * Always returns true since this is a CancelledCancellable.
   */
  get cancelled() {
    return false;
  }

  /**
   * Cancels the CancelledCancellable (empty)
   */
  cancel() {
    return false;
  }
}

const UNCANCELLED = new UncancelledCancellable();

/**
 * An instance of the UncancelledCancellable
 */
export default UNCANCELLED;
