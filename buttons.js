((s, n, t) => {
  const $ = (selector) => n.querySelector(selector);
  const $$ = (selector) => [...n.querySelectorAll(selector)];
  const textFormat = (text) => {
    const textReplace = text
      .replace(/\(.+!?\)/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s+$/g, '')
      .replace(/^\s+/g, '');
    return textReplace;
  };
  const copy = (text) => s.navigator.clipboard.writeText(text);
  const refInsert = $('.header');
  const titleElement = $('.title-content h1');
  const singerElement = $('.title-content .textStyle-secondary');
  const lyricElement = $('.lyric-original');
  const adsSelector = $$('ins,.fc-ab-root');

  if (titleElement && singerElement && lyricElement) {
    refInsert.insertAdjacentHTML(
      'beforeend',
      `
      <style>
        #body {padding-top: 160px;}
        ${t} {display: flex;padding: 8px;column-gap: 8px;background-color: #fff;}
        [data-${t}-button] {flex: 1;padding: 16px;font-size: 32px;line-height: normal;border-radius: 8px;background-color: #d9dd00;color: #000;text-transform: uppercase;font-weight: bolder;}
        [data-${t}-thumb] {width: 56px;height: 56px;background-color: #000;border-radius: 50%;align-self: center;text-align: center;line-height: 56px;overflow: hidden;}
        [data-${t}-thumb-img] {width: inherit;height: inherit;object-fit: contain;}
      </style>
      <${t}>
        <div data-${t}-thumb>
          <img data-${t}-thumb-img src="https://cdns-images.dzcdn.net/images/talk/98453d8d2a642f70892b131eed53b3f1/1000x1000.jpg" alt="" aria-hidden="true" />
        </div>
        <button type="button" data-${t}-button="title">Copiar título</button>
        <button type="button" data-${t}-button="lyric">Copiar letra</button>
      </${t}>
      `
    );

    [...$$(`[data-${t}-button]`)].forEach((item) => {
      item.addEventListener('click', (e) => {
        const type = e.target.getAttribute(`data-${t}-button`);
        const typeConfig = {
          title: () => {
            const { innerText: title } = titleElement;
            const { innerText: singer } = singerElement;
            const titleFormat = textFormat(title);
            const singerFormat = textFormat(singer);
            const titleContent = `${titleFormat} - ${singerFormat}`;
            copy(titleContent);
          },
          lyric: () => {
            const { innerText: lyric } = lyricElement;
            const verse = [];
            const lyricSplit = lyric.split(/\n/g);
            const lines = lyricSplit.map((item) => textFormat(item)).filter((item) => item);
            lines.forEach((item, i) => {
              i % 2 === 0 ? verse.push([item]) : verse.at(-1).push(item);
            });
            const verseJoin = verse.map((item) => item.join('\n'));
            const verseFinal = [...new Set(verseJoin)].join('\n\n');
            copy(verseFinal);
          },
        };
        typeConfig[type] ? typeConfig[type]() : null;
      });
    });
  }

  setTimeout(() => {
    adsSelector.forEach((item) => {
      if (item) {
        item.remove();
      }
    });
  }, 600);
})(globalThis, document, 'lyrics-extension');
