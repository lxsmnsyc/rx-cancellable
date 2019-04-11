var Cancellable = (function () {
  'use strict';

  /* eslint-disable no-restricted-syntax */
  const dispatch = (s, e) => s.events[e].forEach(f => f.apply(s));

  const CANCELLED = {
    cancelled: true,
  };

  const NOT_CANCELLED = {
    cancelled: false,
  };

  const ACTIVE = {
    active: true,
  };

  const INACTIVE = {
    active: false,
  };

  const DISPOSE_STATE = new WeakMap();
  const ACTIVE_STATE = new WeakMap();
  const PARENT = new WeakMap();

  let BASIC_PARENT;

  /**
   * Represents a state of cancellation and activation.
   */
  class Cancellable {
    /**
     * @ignore
     */
    constructor() {
      DISPOSE_STATE.set(this, NOT_CANCELLED);
      ACTIVE_STATE.set(this, ACTIVE);
      /**
       * @ignore
       */
      this.events = {
        enable: [],
        disable: [],
        cancel: [],
      };
      /**
       * @ignore
       */
      this.children = [];
    }

    /**
     * Creates a Cancellable instance.
     *
     * @return {Cancellable}
     */
    static create() {
      if (BASIC_PARENT == null) {
        BASIC_PARENT = new Cancellable();
      }

      const cancellable = new Cancellable();

      DISPOSE_STATE.set(cancellable, BASIC_PARENT);
      ACTIVE_STATE.set(cancellable, BASIC_PARENT);
      PARENT.set(cancellable, BASIC_PARENT);

      return cancellable;
    }


    /**
     * Returns true if the Cancellable is cancelled.
     * @return {boolean}
     */
    get cancelled() {
      return DISPOSE_STATE.get(this).cancelled;
    }

    /**
     * Returns true if the Cancellable is active.
     * @return {boolean}
     */
    get active() {
      return ACTIVE_STATE.get(this).active;
    }

    /**
     * Enables a Cancellable.
     *
     * Fails to enable if the Cancellable instance is
     * already cancelled.
     * @returns {boolean}
     */
    enable() {
      if (!(this.cancelled || this.active)) {
        ACTIVE_STATE.set(this, PARENT.get(this));

        dispatch(this, 'enable');
        return true;
      }
      return false;
    }


    /**
     * Disables a Cancellable.
     *
     * Fails to disable if the Cancellable instance is
     * already cancelled.
     * @returns {boolean}
     */
    disable() {
      if (!this.cancelled && this.active) {
        ACTIVE_STATE.set(this, INACTIVE);

        dispatch(this, 'disable');
        return true;
      }
      return false;
    }

    /**
     * Checks if this Cancellable is a parent of the given Cancellable (hierarchy).
     * @param {Cancellable} cancellable
     * The child Cancellable
     * @returns {boolean}
     */
    isParentTo(cancellable) {
      const parent = PARENT.get(cancellable);
      return parent != null
        && (parent === this || (parent !== BASIC_PARENT && this.isParentTo(parent)));
    }

    /**
     * Sets the given Cancellable as a parent Cancellable.
     *
     * if the given Cancellable is already cancelled, this
     * Cancellable is cancelled as well.
     * @param {Cancellable} cancellable
     * @returns {boolean}
     */
    setParent(cancellable) {
      if (cancellable !== this
        && !this.isParentTo(cancellable) && cancellable instanceof Cancellable) {
        if (cancellable.cancelled) {
          this.cancel();
        } else {
          PARENT.set(this, cancellable);
          cancellable.children.push(this);
          return true;
        }
      }
      return false;
    }

    /**
     * Removes the parent Cancellable
     * @param {!Cancellable} cancellable
     * The parent Cancellable
     * @returns {boolean}
     */
    removeParent(cancellable) {
      return cancellable.remove(this);
    }

    /**
     * Adds a Cancellable as a child Cancellable.
     *
     * Child Disposables are cancelled, enabled and disabled if their
     * parent Cancellable is cancelled as well.
     *
     * A child Cancellable cannot have more than one parent Cancellable.
     *
     * If a child Cancellable is added to a parent Cancellable that is
     * already cancelled, the child Cancellable is cancelled.
     *
     * @param {!Cancellable} cancellable
     * @returns {boolean}
     */
    add(cancellable) {
      return cancellable.setParent(this);
    }

    /**
     * Removes a direct child Cancellable.
     *
     * @param {!Cancellable} cancellable
     * The child Cancellable to be removed.
     * @returns {boolean}
     */
    remove(cancellable) {
      if (!this.cancelled && PARENT.get(cancellable) === this) {
        this.children = this.children.filter(x => x !== cancellable);
        PARENT.set(cancellable, BASIC_PARENT);
        return true;
      }
      return false;
    }

    /**
     * Disposes the instance.
     *
     * If the Cancellable instance has more than one children, the
     * child Disposables are cancelled as well.
     * @returns {boolean}
     */
    cancel() {
      if (!this.cancelled) {
        dispatch(this, 'cancel');
        this.children.forEach(x => x.cancel());
        DISPOSE_STATE.set(this, CANCELLED);
        return true;
      }
      return false;
    }

    /**
     * Registers a listener function to a target event dispatcher.
     * @param {!string} ev
     * Defines the event target
     * - enable: fires whenever the Cancellable is enabled.
     * - disable: fires whenever the Cancellable is disabled.
     * - cancel: fires when the Cancellable is cancelled.
     * @param {!function} fn
     * a function to be called when the event is dispatched.
     */
    addEventListener(ev, fn) {
      if (typeof fn !== 'function') {
        return;
      }
      const { events } = this;
      if (this.cancelled) {
        return;
      }
      if (ev in events) {
        events[ev].push(fn);
      }
    }


    /**
     * Removes a listener function from a target event dispatcher.
     * @param {!string} ev
     * Defines the event target
     * - enable: fires whenever the Cancellable is enabled.
     * - disable: fires whenever the Cancellable is disabled.
     * - cancel: fires when the Cancellable is cancelled.
     * @param {!function} fn
     * a function from be removed from the target event dispatcher.
     */
    removeEventListener(ev, fn) {
      if (typeof fn !== 'function') {
        return;
      }
      const { events } = this;
      if (this.cancelled) {
        return;
      }
      if (ev in events) {
        const index = events[ev].indexOf(fn);
        if (index !== -1) {
          events[ev].splice(index, 1);
        }
      }
    }
  }

  return Cancellable;

}());
