const editor = ace.edit(EDITOR_ELE_ID);
const processConfigEditor = ace.edit(PROCESS_CONFIFG_EDITOR_ELE_ID);

const configMap = {
  FONT_SIZE: "18px",
  THEME: "ace/theme/dracula",
  MODE: "ace/mode/json",
  USE_WRAP_MODE: true,
  TAB_SIZE: 2,
};

// set setting editor style
const editorEle = document.getElementById(EDITOR_ELE_ID);

editorEle.style.fontSize = configMap.FONT_SIZE;
editor.setTheme(configMap.THEME);
editor.session.setMode(configMap.MODE);
editor.session.setUseWrapMode(configMap.USE_WRAP_MODE);
editor.session.setTabSize(configMap.TAB_SIZE);
//  disabe toggle comment with JSON file
editor.commands.removeCommand("togglecomment");

// set process setting editor style
const processConfigEditorEle = document.getElementById(
  PROCESS_CONFIFG_EDITOR_ELE_ID,
);

processConfigEditorEle.style.fontSize = configMap.FONT_SIZE;
processConfigEditor.setTheme(configMap.THEME);
processConfigEditor.session.setMode(configMap.MODE);
processConfigEditor.session.setUseWrapMode(configMap.USE_WRAP_MODE);
processConfigEditor.session.setTabSize(configMap.TAB_SIZE);
processConfigEditor.commands.removeCommand("togglecomment");

// show setting editor modal
$(`#${ENV_MODAL_ID}`).on("show.bs.modal", async function () {
  const rawContent = await fetchPM2ConfigAPI();

  editor.setValue(rawContent, -1);
});

// show process setting editor modal
$(`#${PROCESS_CONFIG_MODAL_ID}`).on("show.bs.modal", async function (event) {
  const eventData = event.relatedTarget;
  const appName = eventData.appName;
  const rawContent = await fetchPM2ProcessConfigAPI(appName);

  processConfigEditor.setValue(rawContent, -1);
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
  $(`#${ENV_MODAL_ID}`).modal("hide");
}

async function onSaveProcessEditor(callback) {
  const focusedProcessName = window.sessionStorage.getItem(
    FOCUSED_PROCESS_STORAGE_KEY,
  );
  const currentValue = processConfigEditor.getValue();

  const res = await updatePM2ProcessConfigAPI(focusedProcessName, {
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
  $(`#${PROCESS_CONFIG_MODAL_ID}`).modal("hide");
}
