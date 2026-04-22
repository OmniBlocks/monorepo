<<<<<<< HEAD
import addSmallStageClass from "../../libraries/common/cs/small-stage.js";

=======
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
export default async function ({ addon, console, msg }) {
  let spritesContainer;
  let spriteSelectorContainer;

  const container = document.createElement("div");
<<<<<<< HEAD
  container.className = "sa-search-sprites-container sa-search-sprites-empty";
  addon.tab.displayNoneWhileDisabled(container);
=======
  container.className = "sa-search-sprites-container";
  addon.tab.displayNoneWhileDisabled(container, {
    display: "flex",
  });
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571

  const searchBox = document.createElement("input");
  searchBox.className = "sa-search-sprites-box";
  searchBox.placeholder = msg("placeholder");
  searchBox.autocomplete = "off";
  // search might make more sense, but browsers treat them special in ways that this addon does not handle,
  // so just leave it as a text input. Also note that Scratch uses type=text for its own search inputs in
  // the libraries, so this fits right in.
  searchBox.type = "text";

  const search = (query) => {
    if (!spritesContainer) return;

    query = query.toLowerCase();
    const containsQuery = (str) => str.toLowerCase().includes(query);

    for (const sprite of spritesContainer.children) {
      const visible =
        !query ||
        containsQuery(sprite.children[0].children[1].innerText) ||
<<<<<<< HEAD
        (sprite.children[0].classList.contains("sa-folders-folder") &&
          containsQuery(sprite.children[0].children[2].children[0].innerText));
=======
        (containsQuery(sprite.children[0].children[2].children[0].innerText) &&
          sprite.children[0].classList.contains("sa-folders-folder"));
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
      sprite.style.display = visible ? "" : "none";
    }
  };

  searchBox.addEventListener("input", (e) => {
<<<<<<< HEAD
    container.classList.toggle("sa-search-sprites-empty", !e.target.value);
    search(e.target.value);
  });

  const searchIcon = document.createElement("img");
  searchIcon.className = "sa-search-sprites-icon";
  searchIcon.src = addon.self.getResource("/search-icon.svg");
  searchIcon.alt = "";
  searchIcon.draggable = false;

  const reset = () => {
    search("");
    searchBox.value = "";
    container.classList.add("sa-search-sprites-empty");
=======
    search(e.target.value);
  });

  const reset = () => {
    search("");
    searchBox.value = "";
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
  };

  const resetButton = document.createElement("button");
  resetButton.className = "sa-search-sprites-reset";
<<<<<<< HEAD
  resetButton.addEventListener("click", () => {
    reset();
    searchBox.focus();
  });
  addon.self.addEventListener("disabled", reset);

  const resetIcon = document.createElement("img");
  resetIcon.src = addon.self.getResource("/reset-icon.svg");
  resetIcon.alt = msg("clear");
  resetIcon.draggable = false;
  resetButton.appendChild(resetIcon);

  container.appendChild(searchBox);
  container.appendChild(searchIcon);
  container.appendChild(resetButton);

  addSmallStageClass();

=======
  resetButton.addEventListener("click", reset);
  resetButton.textContent = "×";
  addon.self.addEventListener("disabled", reset);

  container.appendChild(searchBox);
  container.appendChild(resetButton);

>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
  while (true) {
    await addon.tab.waitForElement("div[class^='sprite-selector_items-wrapper']", {
      markAsSeen: true,
      reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED", "scratch-gui/locales/SELECT_LOCALE"],
      reduxCondition: (state) => !state.scratchGui.mode.isPlayerOnly,
    });

    spritesContainer = document.querySelector('[class^="sprite-selector_items-wrapper"]');
<<<<<<< HEAD
    spriteSelectorContainer = document.querySelector('[class^="sprite-selector_sprite-selector"]');
    spriteSelectorContainer.appendChild(container);
=======
    spriteSelectorContainer = document.querySelector('[class^="sprite-selector_scroll-wrapper"]');
    spriteSelectorContainer.insertBefore(container, spritesContainer);
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    reset(); // Clear search box after going outside then inside
  }
}
