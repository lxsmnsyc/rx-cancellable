import Cancellable from './cancellable';
import BooleanCancellable from './boolean';
import { dispatch } from './utils';
/**
 * A Cancellable class that allows linking on Cancellable instances.
 *
 * A LinkedCancellable will be disposed when the linked Cancellable
 * instance is disposed and vice-versa
 */
export default class LinkedCancellable extends Cancellable {
  /**
   * Creates a LinkedCancellable
   */
  constructor() {
    super();

    const bool = new BooleanCancellable();
    /**
     * @ignore
     */
    this.origin = bool;
    /**
     * @ignore
     */
    this.linked = bool;
  }

  /**
   * Returns true if the instance is cancelled.
   * @returns {boolean}
   */
  get cancelled() {
    return this.origin.cancelled;
  }

  /**
   * Cancels the instances contained.
   * @returns {boolean}
   * Returns true if the cancel was successful.
   */
  cancel() {
    if (!this.cancelled) {
      const { linked } = this;
      const { origin } = this;
      if (origin !== linked) {
        this.unlink();
        linked.cancel();
        this.linked = origin;
      }
      origin.cancel();
      dispatch(this, 'cancel');
      return true;
    }
    return false;
  }

  /**
   * Links to a Cancellable instance.
   * @param {Cancellable} cancellable
   * @returns {boolean}
   * Returns true if the link was successful
   */
  link(cancellable) {
    if (cancellable instanceof Cancellable && cancellable !== this) {
      if (this.cancelled) {
        cancellable.cancel();
      } else if (cancellable.cancelled) {
        this.cancel();
      } else {
        this.unlink();

        this.linked = cancellable;

        const listener = () => this.cancel();
        cancellable.addEventListener('cancel', listener);
        this.listener = listener;
        return true;
      }
    }
    return false;
  }

  /**
   * Unlinks this cancellable
   * @returns {boolean}
   * Returns true if the unlink is successful
   */
  unlink() {
    if (!this.cancelled) {
      const { linked } = this;
      const { origin } = this;

      if (origin !== linked) {
        const { listener } = this;
        linked.removeEventListener('cancel', listener);
        this.listener = null;
        this.linked = origin;
        return true;
      }
    }
    return false;
  }
}
