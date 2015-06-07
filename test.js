'use strict';

import assert from 'power-assert';
import combineTemplate from './';
import Kefir from 'kefir';

describe('kefir.combineTemplate', ()=> {

  it('empty', () => {
    let observable = combineTemplate({});
    observable.onValue(() => {});
  });

  it('falsy value', () => {
    let observable = combineTemplate({
      foo : null,
      bar : undefined
    });
    observable.onValue(() => {});
  });

  it('object', (done) => {
    let pool = Kefir.pool();
    let observable = combineTemplate({
      foo  : 'bar',
      test : pool
    });

    observable.onValue((v) => {
      if (v.test != null) {
        assert(v.foo === 'bar');
        assert(v.test === 'baz');
        done();
      }
    });

    pool._emitValue('baz');
  });

  it('array', (done) => {
    let pool1 = Kefir.pool();
    let pool2 = Kefir.pool();
    let pool3 = Kefir.pool();

    let observable = combineTemplate({
      test : [pool1, pool2, pool3],
      qux  : 'c⌒っ.ω.)っ'
    });

    observable.onValue((v) => {
      if (v != null) {
        assert(v.test[0] === 'foo');
        assert(v.test[1] === 'bar');
        assert(v.test[2] === 'baz');
        assert(v.qux === 'c⌒っ.ω.)っ');
        done();
      }
    });

    pool1._emitValue('foo');
    pool2._emitValue('bar');
    pool3._emitValue('baz');
  });

  it('nested', (done) => {
    let pool1 = Kefir.pool();
    let pool2 = Kefir.pool();
    let pool3 = Kefir.pool();

    let observable = combineTemplate({
      foo : 'bar',
      baz : {
        foo : {
          foo : pool1
        },
        bar : 'baz'
      },
      qux : {
        foo : [1, pool2, 3],
        baz : pool3
      }
    });

    observable.onValue((v) => {
      if (v != null) {
        assert(v.foo === 'bar');
        assert(v.baz.foo.foo === 'foo');
        assert(v.baz.bar === 'baz');
        assert(v.qux.foo[0] === 1);
        assert(v.qux.foo[1] === 'bar');
        assert(v.qux.foo[2] === 3);
        assert(v.qux.baz === 'qux');
        done();
      }
    });

    pool1._emitValue('foo');
    pool2._emitValue('bar');
    pool3._emitValue('qux');
  });

  it('twice', (done) => {
    let pool1 = Kefir.pool();
    let pool2 = Kefir.pool();

    let observable = combineTemplate({
      test : ['foo', pool1, 'baz'],
      qux  : pool2
    });

    observable.onValue((v) => {
      if (v != null && v.qux === 'FOO') {
        assert(v.test[0] === 'foo');
        assert(v.test[1] === 'BAR');
        assert(v.test[2] === 'baz');
        assert(v.qux === 'FOO');
        pool2._emitValue('END');
      }
      if (v != null && v.qux === 'END') {
        assert(v.test[0] === 'foo');
        assert(v.test[1] === 'BAR');
        assert(v.test[2] === 'baz');
        assert(v.qux === 'END');
        done();
      }
    });

    pool1._emitValue('BAR');
    pool2._emitValue('FOO');
  });
});
