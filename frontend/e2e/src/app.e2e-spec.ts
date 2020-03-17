import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });

  describe('a button-link on the toolbar', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    describe('to LinkedIn', () => {
      it('should show button text', () => {
        page.navigateTo();
        expect(page.getToolbarLinkedinButton().getText()).toEqual('  LinkedIn');
      });

      it('should contain a LinkedIn link to a new tab', () => {
        // TODO: because we ignoreSync in two tests on a single running instance, we
        // must stagger them by time frame to avoid conflict. Creates race condition.
        // Look into splitting them into separate instances with forkNewDriverInstance
        setTimeout(() => {
          browser.waitForAngularEnabled(false);
          page.getToolbarLinkedinButton().click().then(() => {
            browser.getAllWindowHandles().then((handles) => {
              browser.switchTo().window(handles[1]).then(() => {
                expect(browser.getCurrentUrl()).toMatch(/linkedin/);
                browser.waitForAngularEnabled(true);
              });
            });
          });
        }, 6000);
      });
    });

    describe('to Github', () => {
      it('should show button text', () => {
        expect(page.getToolbarGithubButton().getText()).toEqual('  GitHub');
      });

      it('should contain a GitHub link to a new tab', () => {
        browser.waitForAngularEnabled(false);
        page.getToolbarGithubButton().click().then(() => {
          browser.getAllWindowHandles().then((handles) => {
            browser.switchTo().window(handles[1]).then(() => {
              expect(browser.getCurrentUrl()).toMatch(/github/);
              browser.waitForAngularEnabled(true);
            });
          });
        });
      });
    });
  });
});
