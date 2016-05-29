import { KoalaPage } from './app.po';

describe('koala App', function() {
  let page: KoalaPage;

  beforeEach(() => {
    page = new KoalaPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('koala works!');
  });
});
