var Disposable = (function () {
  'use strict';

  /* eslint-disable no-restricted-syntax */
  const dispatch = (s, e) => s.events[e].forEach(f => f.apply(s));

  const DISPOSED = {
    disposed: true,
  };

  const NOT_DISPOSED = {
    disposed: false,
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
   * Represents a state of disposition and activation.
   */
  class Disposable {
    /**
     * @ignore
     */
    constructor() {
      DISPOSE_STATE.set(this, NOT_DISPOSED);
      ACTIVE_STATE.set(this, ACTIVE);
      /**
       * @ignore
       */
      this.events = {
        enable: [],
        disable: [],
        dispose: [],
      };
      /**
       * @ignore
       */
      this.children = [];
    }

    /**
     * Creates a Disposable instance.
     *
     * @returns {Disposable};
     */
    static create() {
      if (BASIC_PARENT == null) {
        BASIC_PARENT = new Disposable();
      }

      const disposable = new Disposable();

      DISPOSE_STATE.set(disposable, BASIC_PARENT);
      ACTIVE_STATE.set(disposable, BASIC_PARENT);
      PARENT.set(disposable, BASIC_PARENT);

      return disposable;
    }


    /**
     * Returns true if the Disposable is disposed.
     */
    get disposed() {
      return DISPOSE_STATE.get(this).disposed;
    }

    /**
     * Returns true if the Disposable is active.
     */
    get active() {
      return ACTIVE_STATE.get(this).active;
    }

    /**
     * Enables a Disposable.
     *
     * Fails to enable if the Disposable instance is
     * already disposed.
     * @returns {boolean}
     */
    enable() {
      if (!(this.disposed || this.active)) {
        ACTIVE_STATE.set(this, PARENT.get(this));

        dispatch(this, 'enable');
        return true;
      }
      return false;
    }


    /**
     * Disables a Disposable.
     *
     * Fails to disable if the Disposable instance is
     * already disposed.
     * @returns {boolean}
     */
    disable() {
      if (!this.disposed && this.active) {
        ACTIVE_STATE.set(this, INACTIVE);

        dispatch(this, 'disable');
        return true;
      }
      return false;
    }

    /**
     * Checks if this Disposable is a parent of the given Disposable (hierarchy).
     * @param {Disposable} disposable
     * The child Disposable
     * @returns {boolean}
     */
    isParentTo(disposable) {
      const parent = PARENT.get(disposable);
      return parent != null
        && (parent === this || (parent !== BASIC_PARENT && this.isParentTo(parent)));
    }

    /**
     * Sets the given Disposable as a parent Disposable.
     *
     * if the given Disposable is already disposed, this
     * Disposable is disposed as well.
     * @param {Disposable} disposable
     * @returns {boolean}
     */
    setParent(disposable) {
      if (disposable !== this && !this.isParentTo(disposable) && disposable instanceof Disposable) {
        if (disposable.disposed) {
          this.dispose();
        } else {
          PARENT.set(this, disposable);
          disposable.children.push(this);
          return true;
        }
      }
      return false;
    }

    /**
     * Removes the parent Disposable
     * @param {!Disposable} disposable
     * The parent Disposable
     * @returns {boolean}
     */
    removeParent(disposable) {
      return disposable.remove(this);
    }

    /**
     * Adds a Disposable as a child Disposable.
     *
     * Child Disposables are disposed, enabled and disabled if their
     * parent Disposable is disposed as well.
     *
     * A child Disposable cannot have more than one parent Disposable.
     *
     * If a child Disposable is added to a parent Disposable that is
     * already disposed, the child Disposable is disposed.
     *
     * @param {!Disposable} disposable
     * @returns {boolean}
     */
    add(disposable) {
      return disposable.setParent(this);
    }

    /**
     * Removes a direct child Disposable.
     *
     * @param {!Disposable} disposable
     * The child Disposable to be removed.
     * @returns {boolean}
     */
    remove(disposable) {
      if (!this.disposed && PARENT.get(disposable) === this) {
        this.children = this.children.filter(x => x !== disposable);
        PARENT.set(disposable, BASIC_PARENT);
        return true;
      }
      return false;
    }

    /**
     * Disposes the instance.
     *
     * If the Disposable instance has more than one children, the
     * child Disposables are disposed as well.
     * @returns {boolean}
     */
    dispose() {
      if (!this.disposed) {
        dispatch(this, 'dispose');
        this.children.forEach(x => x.dispose());
        DISPOSE_STATE.set(this, DISPOSED);
        return true;
      }
      return false;
    }

    /**
     * Registers a listener function to a target event dispatcher.
     * @param {!string} ev
     * Defines the event target
     * - enable: fires whenever the Disposable is enabled.
     * - disable: fires whenever the Disposable is disabled.
     * - dispose: fires when the Disposable is disposed.
     * @param {!function} fn
     * a function to be called when the event is dispatched.
     */
    addEventListener(ev, fn) {
      if (typeof fn !== 'function') {
        return;
      }
      const { events } = this;
      if (this.disposed) {
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
     * - enable: fires whenever the Disposable is enabled.
     * - disable: fires whenever the Disposable is disabled.
     * - dispose: fires when the Disposable is disposed.
     * @param {!function} fn
     * a function from be removed from the target event dispatcher.
     */
    removeEventListener(ev, fn) {
      if (typeof fn !== 'function') {
        return;
      }
      const { events } = this;
      if (this.disposed) {
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

  return Disposable;

}());
