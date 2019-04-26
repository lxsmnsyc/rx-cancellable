/* eslint-disable class-methods-use-this */

/**
 * Abstract class for the Cancellable classes
 * @abstract
 */
export default class Cancellable {
  /**
   * @ignore
   */
  constructor() {
    /**
     * @ignore
     */
    this.events = {
      cancel: [],
    };
  }

  /**
   * Returns true if the instance is cancelled.
   * @abstract
   * @returns {boolean}
   */
  get cancelled() {
    return false;
  }

  /**
   * Cancels the instance.
   * @abstract
   * @returns {boolean}
   */
  cancel() {
    return false;
  }

  /**
   * Registers a listener function to a target event dispatcher.
   * @param {!string} ev
   * Defines the event target
   * - cancel: fires when the Cancellable is cancelled.
   * @param {!function} listener
   * a function to be called when the event is dispatched.
   */
  addEventListener(ev, listener) {
    if (typeof listener !== 'function') {
      return;
    }
    const { events } = this;
    if (this.cancelled) {
      return;
    }
    if (ev in events) {
      events[ev].push(listener);
    }
  }


  /**
   * Removes a listener function from a target event dispatcher.
   * @param {!string} ev
   * Defines the event target
   * - cancel: fires when the Cancellable is cancelled.
   * @param {!function} listener
   * a function from be removed from the target event dispatcher.
   */
  removeEventListener(ev, listener) {
    if (typeof listener !== 'function') {
      return;
    }
    const { events } = this;
    if (this.cancelled) {
      return;
    }
    if (ev in events) {
      const index = events[ev].indexOf(listener);
      if (index !== -1) {
        events[ev].splice(index, 1);
      }
    }
  }
}
