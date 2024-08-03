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

$("#envModal").on("show.bs.modal", async function () {
  const rawContent = await fetchPM2ConfigAPI();

  editor.setValue(rawContent, -1);
});

async function onSaveEditor(callback) {
  const currentValue = editor.getValue();

  const res = await updatePM2ConfigAPI({
    content: currentValue,
  });

  if (!res.status) {
    alert("Update setting failed!");
    return;
  }

  if (callback) {
    await callback();
  }

  // hide editor modal
  $("#envModal").modal("hide");
}
