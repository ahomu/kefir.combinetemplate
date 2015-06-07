# Kefir.combineTemplate

[![npm version][npm-image]][npm-url] [![build status][circle-image]][circle-url] [![Dependency Status][deps-image]][deps-url]

Generate values  based on the Observable and object template. Similar to [`Bacon.combineTemplate`](https://github.com/baconjs/bacon.js#observable-combine).

## Usage

### Install

```bash
npm install --save kefir.combinetemplate
```

### Basics

```javascript
import combineTemplate from 'kefir.combinetemplate';
import * as Kefir from 'kefir';

let bus1 = Kefir.Bus();
let bus2 = Kefir.Bus();

combineTemplate({
  foo : 'bar',
  baz : {
    foo : ['bar', bus1 'qux']
  },
  qux : {
    foo : {
     foo : 'bar'
     baz : bus2
    }
  }
}).subscribe((value)=> {
  console.log(value);
  /* === output ===
  {
    foo : 'bar',
    baz : {
      foo : ['bar', 'BAZ' 'qux']
    },
    qux : {
      foo : {
       foo : 'bar'
       baz : 'QUX'
      }
    }
  }
  */
});

bus1.emit('BAZ');
bus2.emit('QUX');
```

### with React

State is updated automatically receives a value from the observables.

```javascript
componentWillMount() {
  combineTemplate({
    items : store.itemsObservable$,
    count : store.itemsObservable$.map((items) => items.length)
  }).onValue(this.setState.bind(this));
}
```

## Tests

```
npm test
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT

[npm-image]: https://img.shields.io/npm/v/kefir.combinetemplate.svg
[npm-url]: https://npmjs.org/package/kefir.combinetemplate
[circle-image]: https://circleci.com/gh/ahomu/kefir.combinetemplate.svg?style=shield&circle-token=b12ab2a48027a249724e0b1924ccec8152d3068a
[circle-url]: https://circleci.com/gh/ahomu/kefir.combinetemplate
[deps-image]: https://david-dm.org/ahomu/kefir.combinetemplate.svg
[deps-url]: https://david-dm.org/ahomu/kefir.combinetemplate
