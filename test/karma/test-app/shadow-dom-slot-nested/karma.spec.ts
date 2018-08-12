import { setupDomTests } from '../util';

describe('shadow-dom-slot-nested', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/shadow-dom-slot-nested/index.html');
  });
  afterEach(tearDownDom);

  it('renders children', async () => {
    let elm = app.querySelector('main');
    expect(window.getComputedStyle(elm).color).toBe('rgb(0, 0, 255)');

    elm = app.querySelector('shadow-dom-slot-nested-root');
    expect(elm.shadowRoot).toBeDefined();

    if ('attachShadow' in HTMLElement.prototype) {
      expect(elm.shadowRoot.nodeType).toBe(11);
      expect(elm.shadowRoot.firstElementChild.nodeName.toLowerCase()).toBe('style')
      expect(elm.shadowRoot.firstElementChild.textContent).toContain(':host');
      expect(elm.shadowRoot.firstElementChild.textContent).toContain('green');

      const section = elm.shadowRoot.querySelector('section');
      expect(window.getComputedStyle(section).color).toBe('rgb(0, 128, 0)');

      const article = elm.shadowRoot.querySelector('article');
      expect(window.getComputedStyle(article).color).toBe('rgb(0, 128, 0)');

      expect(article.children.length).toBe(3);

      const testShadowNested = function(i: number) {
        const nestedElm = article.children[i];
        const shadowRoot = nestedElm.shadowRoot;
        expect(shadowRoot.firstElementChild.nodeName.toLowerCase()).toBe('style');
        expect(shadowRoot.firstElementChild.textContent).toContain('red');

        const header = shadowRoot.querySelector('header');
        expect(header.textContent.trim()).toBe('shadow dom: ' + i);
        expect(window.getComputedStyle(header).color).toBe('rgb(255, 0, 0)');

        const footer = shadowRoot.querySelector('footer');
        const footerSlot = footer.firstElementChild;
        expect(footerSlot.nodeName.toLowerCase()).toBe('slot');
        expect(footerSlot.childNodes.length).toBe(0);
        expect(footerSlot.textContent.trim()).toBe('');

        expect(nestedElm.textContent.trim()).toBe('light dom: ' + i);
        expect(window.getComputedStyle(nestedElm).color).toBe('rgb(0, 128, 0)');
      };

      testShadowNested(0);
      testShadowNested(1);
      testShadowNested(2);

    } else {
      expect(elm.shadowRoot).toBe(elm);
      expect(elm.className).toBe('scs-shadow-dom-slot-nested-root-h hydrated');

      const section = elm.querySelector('section');
      expect(section.className).toBe('scs-shadow-dom-slot-nested-root');
      expect(section.textContent.trim()).toBe('shadow-dom-slot-nested');
      expect(window.getComputedStyle(section).color).toBe('rgb(0, 128, 0)');

      const article = elm.querySelector('article');
      expect(article.className).toBe('scs-shadow-dom-slot-nested-root');
      expect(window.getComputedStyle(article).color).toBe('rgb(0, 128, 0)');

      expect(article.children.length).toBe(3);

      const testSlotPolyfillNested = function(i: number) {
        const nestedElm = article.children[i];
        expect(nestedElm.className).toBe('scs-shadow-dom-slot-nested-root scs-shadow-dom-slot-nested-h hydrated');

        const header = nestedElm.querySelector('header');
        expect(header.className).toBe('scs-shadow-dom-slot-nested');
        expect(header.textContent.trim()).toBe('shadow dom: ' + i);
        expect(window.getComputedStyle(header).color).toBe('rgb(255, 0, 0)');

        const footer = nestedElm.querySelector('footer');
        expect(footer.className).toBe('scs-shadow-dom-slot-nested scs-shadow-dom-slot-nested-s');
        expect(footer.textContent.trim()).toBe('light dom: ' + i);
        expect(window.getComputedStyle(footer).color).toBe('rgb(0, 128, 0)');
      };

      testSlotPolyfillNested(0);
      testSlotPolyfillNested(1);
      testSlotPolyfillNested(2);
    }

  });

});
