const addButton = (selector, options = {}) => {
  const props = { tooltip: "Copiar", addClass: "", copyType: "", ...options };
  const element = document.querySelector(selector);
  if (element) {
    element.classList.add(props.addClass);
    element.insertAdjacentHTML(
      "beforeend",
      `
        <button class="lyrics-extension__button" data-title="${props.tooltip}" data-copy="${props.copyType}">
          &#x2398;
        </button>
      `
    );
  }
};

document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
      .lyrics-extension__title {
        display: flex;
        align-items: flex-start;
        .--type-title{
          flex: 1;
        }
      }
      .lyrics-extension__button {
        font-size: 24px;
        width: 32px;
        height: 32px;
        border: 1px solid #ccc;
        background: #ddd;
        color:#000;
        border-radius: 4px;
        position: relative;
        z-index: 4;
        &:hover {
          &:after,
          &:before {
            filter: opacity(1);
          }
        }
        &:after,
        &:before {
          position: absolute;
          top: 50%;
          left: 100%;
          pointer-events: none;
          filter: opacity(0);
          will-change: filter;
        }
        &:after {
          content: '';
          border: 6px solid transparent;
          border-right-color: #fff;
          transform: translate(-4px, -50%);
          z-index: 3;
        }
        &:before {
          content: attr(data-title);
          white-space: nowrap;
          z-index: 2;
          margin-left: 6px;
          background: #fff;
          font-size: 14px;
          border-radius: 4px;
          transform: translate(0%, -50%);
          box-shadow: 0 0 10px #666;
          padding: 8px 12px;
        }
      }
    </style>
  `
);
addButton(".title-content", {
  tooltip: "Copiar título",
  addClass: "lyrics-extension__title",
  copyType: "title",
});
addButton(".lyric-filter", {
  tooltip: "Copiar letra",
  addClass: "lyrics-extension__lyric",
  copyType: "lyric",
});

[...document.querySelectorAll(".lyrics-extension__button")].forEach((item) => {
  item.addEventListener("click", (e) => {
    const {
      currentTarget: {
        dataset: { copy },
      },
    } = e;
    const types = {
      title: () => {
        const { innerText: title } =
          document.querySelector(".title-content h1");
        const { innerText: singer } = document.querySelector(
          ".title-content .textStyle-secondary"
        );
        const normalizeTitle = title.replace(/\(.+!?\)/, "");
        const titleNoSpace = normalizeTitle.replace(/\s+/, " ");
        const titleContent = `${titleNoSpace} - ${singer}`;
        navigator.clipboard.writeText(titleContent);
      },
      lyric: () => {
        const { innerText } = document.querySelector(".lyric-original");
        const verse = [];
        const regex = innerText.split(/\n/g);
        const lines = regex.filter((item) => item);
        lines.forEach((item, i) => {
          i % 2 === 0 ? verse.push([item]) : verse.at(-1).push(item);
        });
        const verseJoin = verse.map((item) => item.join("\n"));
        const verseFinal = verseJoin.join("\n\n");
        navigator.clipboard.writeText(verseFinal);
      },
    };
    types[copy] ? types[copy]() : null;
  });
});
