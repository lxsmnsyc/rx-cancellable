'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* eslint-disable class-methods-use-this */

/**
 * Abstract class for the Cancellable classes
 * @abstract
 */
class Cancellable {
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
   * - enable: fires whenever the Cancellable is enabled.
   * - disable: fires whenever the Cancellable is disabled.
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
   * - enable: fires whenever the Cancellable is enabled.
   * - disable: fires whenever the Cancellable is disabled.
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
 * @ignore
 */
const dispatch = (s, e) => s.events[e].forEach(f => f.apply(s));

/**
 * @ignore
 */
const CANCEL_STATE = new WeakMap();

/**
 * A simple Cancellable class that represents a boolean state.
 */
class BooleanCancellable extends Cancellable {
  /**
   * Creates a BooleanCancellable
   */
  constructor() {
    super();

    CANCEL_STATE.set(this, UNCANCELLED);
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
      CANCEL_STATE.set(this, CANCELLED);

      dispatch(this, 'cancel');
      return true;
    }
    return false;
  }
}

/* eslint-disable no-restricted-syntax */
/**
 * @ignore
 */
const BUFFERS = new WeakMap();
/**
 * @ignore
 */
const CANCEL_STATE$1 = new WeakMap();

/**
 * A Cancellable class that allows composition of Cancellable instances.
 */
class CompositeCancellable extends Cancellable {
  /**
   * Creates a CompositeCancellable
   */
  constructor() {
    super();

    BUFFERS.set(this, []);
    CANCEL_STATE$1.set(this, UNCANCELLED);
  }

  /**
   * Returns true if the instance is cancelled.
   * @returns {boolean}
   */
  get cancelled() {
    return CANCEL_STATE$1.get(this).cancelled;
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

      CANCEL_STATE$1.set(this, CANCELLED);
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
class LinkedCancellable extends Cancellable {
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

/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2019
 */

exports.BooleanCancellable = BooleanCancellable;
exports.CANCELLED = CANCELLED;
exports.Cancellable = Cancellable;
exports.CompositeCancellable = CompositeCancellable;
exports.LinkedCancellable = LinkedCancellable;
exports.UNCANCELLED = UNCANCELLED;
