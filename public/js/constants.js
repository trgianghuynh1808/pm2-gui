const PROCESS_ACTION = {
  START: "start",
  RESTART: "restart",
  DELETE: "delete",
  STOP: "stop",
  SETTING: "setting",
};

const PROCESS_STATUS = {
  NOT_START: "not_start",
  STARTED: "started",
  STOPPED: "stopped",
};

const BTN_TYPE = {
  ACTION: "action",
  SAVE_SETTING: "save_setting",
  SAVE_PROCESS_SETTING: "save_process_setting",
};

const DEFAULT_NONE_VALUE = "N/A";

const FOCUSED_PROCESS_STORAGE_KEY = "current-process";

const ENV_MODAL_ID = "envModal";
const PROCESS_CONFIG_MODAL_ID = "processConfigModal";
const EDITOR_ELE_ID = "editor";
const PROCESS_CONFIFG_EDITOR_ELE_ID = "process-config-editor";
