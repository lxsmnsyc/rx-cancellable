import Cancellable from './cancellable';
import BooleanCancellable from './boolean';
import { dispatch } from './utils';
/**
 * @ignore
 */
const ORIGIN = new WeakMap();
/**
 * @ignore
 */
const LINK = new WeakMap();
/**
 * @ignore
 */
const LISTENER = new WeakMap();

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
    ORIGIN.set(this, bool);
    LINK.set(this, bool);
  }

  /**
   * Returns true if the instance is cancelled.
   * @returns {boolean}
   */
  get cancelled() {
    return ORIGIN.get(this).cancelled;
  }

  /**
   * Cancels the instances contained.
   * @returns {boolean}
   * Returns true if the cancel was successful.
   */
  cancel() {
    if (!this.cancelled) {
      const link = LINK.get(this);
      const origin = ORIGIN.get(this);
      if (origin !== link) {
        this.unlink();
        link.cancel();
        LINK.set(this, origin);
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

        LINK.set(this, cancellable);

        const listener = () => this.cancel();
        cancellable.addEventListener('cancel', listener);
        LISTENER.set(this, listener);
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
      const link = LINK.get(this);
      const origin = ORIGIN.get(this);

      if (origin !== link) {
        const listener = LISTENER.get(this);
        link.removeEventListener('cancel', listener);
        LISTENER.set(this, null);
        LINK.set(this, origin);
        return true;
      }
    }
    return false;
  }
}
