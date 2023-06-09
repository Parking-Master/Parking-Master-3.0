(function() {
  let levels = [];
  LevelMapping = {};
  for (let i = 0; i < 12; i++) {
    if (i % 3 === 0 && i != 0) {
      levels.push("bonus/bonus" + ((i / 3) - 1));
    }
    levels.push("level" + i);
  }
  console.log(levels);
  let nextLevel = levels[levels.indexOf(location.pathname.replace(".html", "").split("/").splice(2).join("/")) + 1];
  let nextNextLevel = levels[levels.indexOf(location.pathname.replace(".html", "").split("/").splice(2).join("/")) + 2];
  LevelMapping.nextLevel = `/levels/${nextLevel}.html`;
  LevelMapping.nextNextLevel = `/levels/${nextNextLevel}.html`;
  LevelMapping.allLevels = levels;
  LevelMapping.currentLevel = LevelMapping.allLevels.indexOf(location.pathname.split("/").pop().split(".")[0]) + 1;
})();