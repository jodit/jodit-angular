import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getJoditContainer() {
    return element(by.css('.jodit_container'));
  }

  getJoditWorkplace() {
    return element(by.css('.jodit_workplace'));
  }
}
