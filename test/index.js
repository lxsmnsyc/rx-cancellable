/* eslint-disable no-undef */
import assert from 'assert';
import Cancellable from '../src';


describe('Cancellable', () => {
  describe('#create', () => {
    it('should create a Cancellable', () => {
      assert(Cancellable.create() instanceof Cancellable);
    });
  });
  describe('#active', () => {
    it('should return true if Cancellable is enabled.', () => {
      const d = Cancellable.create();
      assert(d.active === true);
    });
    it('should return false if Cancellable is disabled.', () => {
      const d = Cancellable.create();
      d.disable();
      assert(d.active === false);
    });
    it('should return true if Cancellable is disabled then enabled.', () => {
      const d = Cancellable.create();
      d.disable();
      d.enable();
      assert(d.active === true);
    });
    it('should return true if Cancellable is enabled, cancelled, and disabled.', () => {
      const d = Cancellable.create();
      d.cancel();
      d.disable();
      assert(d.active === true);
    });
    it('should return true if Cancellable is disabled, cancelled, and enabled.', () => {
      const d = Cancellable.create();
      d.disable();
      d.cancel();
      d.enable();
      assert(d.active === false);
    });
  });
  describe('#cancelled', () => {
    it('should return true if Cancellable is cancelled.', () => {
      const d = Cancellable.create();
      d.cancel();
      assert(d.cancelled === true);
    });
    it('should return true if Cancellable is not cancelled.', () => {
      const d = Cancellable.create();
      assert(d.cancelled === false);
    });
  });
  describe('#cancel', () => {
    it('should return true if Cancellable is cancelled for the first time.', () => {
      assert(Cancellable.create().cancel());
    });
    it('should return false if Cancellable has been cancelled before.', () => {
      const d = Cancellable.create();
      d.cancel();
      assert(d.cancel() === false);
    });
  });
  describe('#enable', () => {
    it('should return true if Cancellable is enabled after being disabled.', () => {
      const d = Cancellable.create();
      d.disable();
      assert(d.enable());
    });
    it('should return false if Cancellable is enabled already.', () => {
      const d = Cancellable.create();
      assert(d.enable() === false);
    });
  });
  describe('#disable', () => {
    it('should return true if Cancellable is disabled after being enabled.', () => {
      const d = Cancellable.create();
      assert(d.disable());
    });
    it('should return false if Cancellable is disabled already.', () => {
      const d = Cancellable.create();
      d.disable();
      assert(d.disable() === false);
    });
  });
  describe('#setParent', () => {
    it('should return false if the Cancellable parent given is the same as the child', () => {
      const d = Cancellable.create();
      assert(d.setParent(d) === false);
    });
    it('should return false if the Cancellable parent given is not a Cancellable', () => {
      assert(Cancellable.create().setParent() === false);
    });
    it('should return false if the Cancellable parent given is a child of the source Cancellable', () => {
      const a = Cancellable.create();
      const b = Cancellable.create();
      a.setParent(b);
      assert(b.setParent(a) === false);
    });
    it('should return false if the Cancellable parent is already cancelled.', () => {
      const a = Cancellable.create();
      const b = Cancellable.create();
      a.cancel();
      assert(b.setParent(a) === false);
      assert(a.cancelled);
    });
    it('should the children be cancelled if the parent is cancelled', () => {
      const a = Cancellable.create();
      const b = Cancellable.create();
      b.setParent(a);
      a.cancel();
      assert(b.cancelled);
    });
    it('should the children be disabled if the parent is disabled', () => {
      const a = Cancellable.create();
      const b = Cancellable.create();
      b.setParent(a);
      a.disable();
      assert(b.active);
    });
  });
  describe('#remove', () => {
    it('should return false if the Cancellable given is not the child.', () => {
      const a = Cancellable.create();
      const b = Cancellable.create();
      assert(a.remove(b) === false);
    });
    it('should return false if the source is already cancelled.', () => {
      const a = Cancellable.create();
      const b = Cancellable.create();
      a.cancel();
      assert(b.remove(a) === false);
    });
    it('should return true if the removal is successful', () => {
      const a = Cancellable.create();
      const b = Cancellable.create();
      a.add(b);
      assert(a.remove(b) === true);
      a.cancel();
      assert(b.cancelled === false);
    });
  });
  describe('#addEventListener', () => {
    it('should fire the enable listener if the Cancellable is enabled', (done) => {
      const a = Cancellable.create();
      a.addEventListener('enable');
      a.addEventListener('enable', () => done());
      a.disable();
      a.enable();
    });
    it('should fire the disable listener if the Cancellable is disabled', (done) => {
      const a = Cancellable.create();
      a.addEventListener('', () => done());
      a.addEventListener('disable', () => done());
      a.disable();
    });
    it('should fire the cancel listener if the Cancellable is cancelled', (done) => {
      const a = Cancellable.create();
      a.addEventListener('', () => done());
      a.addEventListener('cancel', () => done());
      a.cancel();
    });
    it('should not fire the cancel listener if the Cancellable is already cancelled', (done) => {
      const a = Cancellable.create();
      a.cancel();
      a.addEventListener('cancel', () => done(false));
      done();
    });
  });
  describe('#removeEventListener', () => {
    it('should not fire the enable listener if the Cancellable is enabled', (done) => {
      const a = Cancellable.create();
      const listener = () => done(false);
      a.removeEventListener('enable');
      a.addEventListener('enable', listener);
      a.removeEventListener('enable', listener);
      a.disable();
      a.enable();
      done();
    });
    it('should not fire the disable listener if the Cancellable is disabled', (done) => {
      const a = Cancellable.create();
      const listener = () => done(false);
      a.removeEventListener('', () => done());
      a.addEventListener('disable', listener);
      a.removeEventListener('disable', listener);
      a.disable();
      done();
    });
    it('should not fire the cancel listener if the Cancellable is cancelled', (done) => {
      const a = Cancellable.create();
      const listener = () => done(false);
      a.addEventListener('cancel', listener);
      a.removeEventListener('cancel', listener);
      a.cancel();
      done();
    });
  });
});
