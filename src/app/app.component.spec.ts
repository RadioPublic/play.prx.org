// import {AppComponent} from './app.component';
//
// describe('application', () => {
//   it('has main app component', () => expect(AppComponent).not.toBeNull());
// });
//

import {
  describe,
  expect,
  it
} from 'angular2/testing';

describe('the test', () => {
  it('should pass', () => {
    expect(1).toEqual(1);
  });

  it('should fail', () => {
    expect(1).toEqual(0);
  });
});
