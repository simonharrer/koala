import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { KoalaAppComponent } from '../app/koala.component';

beforeEachProviders(() => [KoalaAppComponent]);

describe('App: Koala', () => {
  it('should create the app',
      inject([KoalaAppComponent], (app: KoalaAppComponent) => {
    expect(app).toBeTruthy();
  }));

});
