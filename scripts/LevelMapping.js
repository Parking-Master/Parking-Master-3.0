(function() {
  let levels = [];
  LevelMapping = {};
  for (let i = 0; i < 50; i++) {
    if (i % 3 === 0 && i != 0) {
      levels.push("bonus/bonus" + (i / 3));
    } else levels.push("level" + i);
  }
  console.log(levels);
  let nextLevel = levels[levels.indexOf(location.pathname.replace(".html", "").split("/").splice(2).join("/")) + 1];
  LevelMapping.nextLevel = `/levels/${nextLevel}.html`;
})();