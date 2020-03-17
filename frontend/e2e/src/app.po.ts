import { browser, by, element, ElementFinder } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getToolbarGithubButton(): ElementFinder {
    return element(by.name('github_button')) as ElementFinder;
  }

  getToolbarLinkedinButton(): ElementFinder {
    return element(by.name('linkedin_button')) as ElementFinder;
  }
}
