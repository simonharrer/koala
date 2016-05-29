export class KoalaPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('koala-app h1')).getText();
  }
}
