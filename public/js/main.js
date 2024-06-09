async function fetchProcesses() {
  const response = await fetch("/processes");
  const processes = await response.json();

  return processes;
}

async function excAction(name, action, env) {
  const response = await fetch(`/processes/${name}/${action}/${env}`, {
    method: "POST",
  });
  const data = await response.json();

  return {
    status: response.status,
    data,
  };
}

(function ($, window, document) {
  $(async function () {
    async function showProcesses() {
      const processes = await fetchProcesses();

      const trs = getValidArray(processes).map((process) =>
        renderProcess(process),
      );

      $("#tbl-processes tbody").html(trs.join(""));
    }

    async function handleOnClickActionBtn(self) {
      const action = self.data("action");
      const name = self.parents("tr").attr("id");
      const env = "dev";

      if (action && name) {
        try {
          const response = await excAction(name, action, env);

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

      // *INFO: handle onClick action btn
      if (btnType === BTN_TYPE.ACTION) {
        await handleOnClickActionBtn(self);
        return;
      }

      if (btnType === BTN_TYPE.SAVE_SETTING) {
        await onSaveEditor(() => {
          showProcesses();
        });
        return;
      }
    });
  });
})(window.jQuery, window, document);
