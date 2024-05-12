(function ($, window, document) {
  $(async function () {
    async function fetchProcesses() {
      const response = await fetch("/processes");
      const processes = await response.json();

      const trs = getValidArray(processes).map((process) =>
        renderProcess(process),
      );

      $("#tbl-processes tbody").html(trs.join(""));
    }

    fetchProcesses();

    // *INFO: refetch process info every 15 minutes
    setInterval(() => {
      fetchProcesses();
    }, 15 * 1000);

    $(document).on("click", "button", async function () {
      const self = $(this);
      const action = self.data("action");
      const process = self.parents("tr").attr("id");
      const env = "dev";

      console.log(self, action, process);

      if (action && process) {
        try {
          const response = await fetch(`/process/${process}/${action}/${env}`, {
            method: "POST",
          });
          const data = await response.json();

          if (response.status !== 200) {
            throw new Error(data.message);
          }

          fetchProcesses();
        } catch (error) {
          alert(error.message);
        }
      }
    });
  });
})(window.jQuery, window, document);
