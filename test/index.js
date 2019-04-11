/* eslint-disable no-undef */
import assert from 'assert';
import Disposable from '../src';


describe('Disposable', () => {
  describe('#create', () => {
    it('should create a Disposable', () => {
      assert(Disposable.create() instanceof Disposable);
    });
  });
  describe('#active', () => {
    it('should return true if Disposable is enabled.', () => {
      const d = Disposable.create();
      assert(d.active === true);
    });
    it('should return false if Disposable is disabled.', () => {
      const d = Disposable.create();
      d.disable();
      assert(d.active === false);
    });
    it('should return true if Disposable is disabled then enabled.', () => {
      const d = Disposable.create();
      d.disable();
      d.enable();
      assert(d.active === true);
    });
    it('should return true if Disposable is enabled, disposed, and disabled.', () => {
      const d = Disposable.create();
      d.dispose();
      d.disable();
      assert(d.active === true);
    });
    it('should return true if Disposable is disabled, disposed, and enabled.', () => {
      const d = Disposable.create();
      d.disable();
      d.dispose();
      d.enable();
      assert(d.active === false);
    });
  });
  describe('#disposed', () => {
    it('should return true if Disposable is disposed.', () => {
      const d = Disposable.create();
      d.dispose();
      assert(d.disposed === true);
    });
    it('should return true if Disposable is not disposed.', () => {
      const d = Disposable.create();
      assert(d.disposed === false);
    });
  });
  describe('#dispose', () => {
    it('should return true if Disposable is disposed for the first time.', () => {
      assert(Disposable.create().dispose());
    });
    it('should return false if Disposable has been disposed before.', () => {
      const d = Disposable.create();
      d.dispose();
      assert(d.dispose() === false);
    });
  });
  describe('#enable', () => {
    it('should return true if Disposable is enabled after being disabled.', () => {
      const d = Disposable.create();
      d.disable();
      assert(d.enable());
    });
    it('should return false if Disposable is enabled already.', () => {
      const d = Disposable.create();
      assert(d.enable() === false);
    });
  });
  describe('#disable', () => {
    it('should return true if Disposable is disabled after being enabled.', () => {
      const d = Disposable.create();
      assert(d.disable());
    });
    it('should return false if Disposable is disabled already.', () => {
      const d = Disposable.create();
      d.disable();
      assert(d.disable() === false);
    });
  });
  describe('#setParent', () => {
    it('should return false if the Disposable parent given is the same as the child', () => {
      const d = Disposable.create();
      assert(d.setParent(d) === false);
    });
    it('should return false if the Disposable parent given is not a Disposable', () => {
      assert(Disposable.create().setParent() === false);
    });
    it('should return false if the Disposable parent given is a child of the source Disposable', () => {
      const a = Disposable.create();
      const b = Disposable.create();
      a.setParent(b);
      assert(b.setParent(a) === false);
    });
    it('should return false if the Disposable parent is already disposed.', () => {
      const a = Disposable.create();
      const b = Disposable.create();
      a.dispose();
      assert(b.setParent(a) === false);
      assert(a.disposed);
    });
    it('should the children be disposed if the parent is disposed', () => {
      const a = Disposable.create();
      const b = Disposable.create();
      b.setParent(a);
      a.dispose();
      assert(b.disposed);
    });
    it('should the children be disabled if the parent is disabled', () => {
      const a = Disposable.create();
      const b = Disposable.create();
      b.setParent(a);
      a.disable();
      assert(b.active);
    });
  });
  describe('#remove', () => {
    it('should return false if the Disposable given is not the child.', () => {
      const a = Disposable.create();
      const b = Disposable.create();
      assert(a.remove(b) === false);
    });
    it('should return false if the source is already disposed.', () => {
      const a = Disposable.create();
      const b = Disposable.create();
      a.dispose();
      assert(b.remove(a) === false);
    });
    it('should return true if the removal is successful', () => {
      const a = Disposable.create();
      const b = Disposable.create();
      a.add(b);
      assert(a.remove(b) === true);
      a.dispose();
      assert(b.disposed === false);
    });
  });
  describe('#addEventListener', () => {
    it('should fire the enable listener if the Disposable is enabled', (done) => {
      const a = Disposable.create();
      a.addEventListener('enable');
      a.addEventListener('enable', () => done());
      a.disable();
      a.enable();
    });
    it('should fire the disable listener if the Disposable is disabled', (done) => {
      const a = Disposable.create();
      a.addEventListener('', () => done());
      a.addEventListener('disable', () => done());
      a.disable();
    });
    it('should fire the dispose listener if the Disposable is disposed', (done) => {
      const a = Disposable.create();
      a.addEventListener('', () => done());
      a.addEventListener('dispose', () => done());
      a.dispose();
    });
    it('should not fire the dispose listener if the Disposable is already disposed', (done) => {
      const a = Disposable.create();
      a.dispose();
      a.addEventListener('dispose', () => done(false));
      done();
    });
  });
  describe('#removeEventListener', () => {
    it('should not fire the enable listener if the Disposable is enabled', (done) => {
      const a = Disposable.create();
      const listener = () => done(false);
      a.removeEventListener('enable');
      a.addEventListener('enable', listener);
      a.removeEventListener('enable', listener);
      a.disable();
      a.enable();
      done();
    });
    it('should not fire the disable listener if the Disposable is disabled', (done) => {
      const a = Disposable.create();
      const listener = () => done(false);
      a.removeEventListener('', () => done());
      a.addEventListener('disable', listener);
      a.removeEventListener('disable', listener);
      a.disable();
      done();
    });
    it('should not fire the dispose listener if the Disposable is disposed', (done) => {
      const a = Disposable.create();
      const listener = () => done(false);
      a.addEventListener('dispose', listener);
      a.removeEventListener('dispose', listener);
      a.dispose();
      done();
    });
  });
});
