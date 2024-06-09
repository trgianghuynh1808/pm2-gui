const EDITOR_ELE_ID = "editor";

const editor = ace.edit(EDITOR_ELE_ID);

// set style
const editorEle = document.getElementById(EDITOR_ELE_ID);
editorEle.style.fontSize = "18px";

editor.setTheme("ace/theme/dracula");
editor.session.setMode("ace/mode/json");
editor.session.setUseWrapMode(true);
editor.session.setTabSize(2);

// disabe toggle comment with JSON file
editor.commands.removeCommand("togglecomment");

// editor.session.on("change", function (delta) {
//   console.log({
//     value: editor.getValue(),
//   });
//   // delta.start, delta.end, delta.lines, delta.action
// });

$("#envModal").on("show.bs.modal", async function (event) {
  const rawContent = await fetchPM2Config();

  editor.setValue(rawContent, -1);
});

async function fetchPM2Config() {
  const response = await fetch("/pm2-config");
  const rawContent = await response.json();

  return rawContent;
}

async function fetchUpdatePM2Config(payload) {
  const response = await fetch("/pm2-config", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  return result;
}

async function onSaveEditor(callback) {
  const currentValue = editor.getValue();

  const res = await fetchUpdatePM2Config({
    content: currentValue,
  });

  if (!res.status) {
    alert("Update setting failed!");
    return;
  }

  if (callback) {
    await callback();
  }
  //
  // hide editor modal
  $("#envModal").modal("hide");
}
