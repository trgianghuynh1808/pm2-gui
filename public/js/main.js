(function ($, window, document) {
  $(async function () {
    async function showProcesses() {
      const processes = await fetchProcessesAPI();

      const trs = getValidArray(processes).map((process) =>
        renderProcess(process),
      );

      $("#tbl-processes tbody").html(trs.join(""));
    }

    function handleOnClickProcessSettingBtn(appName) {
      window.sessionStorage.setItem(FOCUSED_PROCESS_STORAGE_KEY, appName);
      $(`#${PROCESS_CONFIG_MODAL_ID}`).modal("show", { appName });
    }

    async function handleOnClickActionBtn(self) {
      const action = self.data("action");
      const name = self.parents("tr").attr("id");
      const env = "dev";

      if (action && name) {
        if (action === PROCESS_ACTION.SETTING) {
          handleOnClickProcessSettingBtn(name);
          return;
        }

        try {
          const response = await excActionAPI(name, action, env);

          if (response.status !== 200) {
            throw new Error(response.data.message);
          }

          showProcesses();
        } catch (error) {
          alert(error.message);
        }
      }
    }

    function main() {
      showProcesses();
      // *INFO: refetch process info every REFETCH_TIME seconds
      setInterval(() => {
        showProcesses();
      }, REFETCH_TIME * 1000);
    }

    main();

    $(document).on("click", "button", async function () {
      const self = $(this);
      const btnType = self.data("btn-type");

      switch (btnType) {
        case BTN_TYPE.ACTION: {
          await handleOnClickActionBtn(self);
          return;
        }
        case BTN_TYPE.SAVE_SETTING: {
          await onSaveEditor(() => {
            showProcesses();
          });
          return;
        }
        case BTN_TYPE.SAVE_PROCESS_SETTING: {
          await onSaveProcessEditor(() => {
            showProcesses();
          });
          return;
        }
        default:
          break;
      }
    });
  });
})(window.jQuery, window, document);
