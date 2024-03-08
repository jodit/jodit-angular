import { AppPage } from './app.po';

describe('template spec', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  })

  it('should display Jodit html editor', () => {
  
    page.navigateTo();

    // Must be exists Jodit container & workplace class styles
    page.getJoditContainer().should('be.visible');
    page.getJoditWorkplace().should('be.visible').and('contain', 'Hello world');

  });

})