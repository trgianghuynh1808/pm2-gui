const EDITOR_ELE_ID = "editor";

const editor = ace.edit(EDITOR_ELE_ID);

// set style
const editorEle = document.getElementById(EDITOR_ELE_ID);
editorEle.style.fontSize = "24px";

editor.setTheme("ace/theme/dracula");
editor.session.setMode("ace/mode/json");
editor.session.setUseWrapMode(true);

// disabe toggle comment with JSON file
editor.commands.removeCommand("togglecomment");

editor.session.on("change", function (delta) {
  console.log({
    value: editor.getValue(),
  });
  // delta.start, delta.end, delta.lines, delta.action
});

$("#envModal").on("show.bs.modal", async function (event) {
  const rawContent = await fetchPM2Config();

  editor.setValue(rawContent, -1);

  console.log(rawContent);
});

async function fetchPM2Config() {
  const response = await fetch("/pm2-config");
  const rawContent = await response.json();

  return rawContent;
}
