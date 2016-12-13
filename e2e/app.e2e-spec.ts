import { PlayPrxOrgPage } from './app.po';

describe('play-prx-org App', function() {
  let page: PlayPrxOrgPage;

  beforeEach(() => {
    page = new PlayPrxOrgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
