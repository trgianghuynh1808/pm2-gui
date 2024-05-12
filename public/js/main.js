(function ($, window, document) {
  $(async function () {
    async function fetchProcesses() {
      const response = await fetch("/processes");
      const processes = await response.json();

      const trs = [];
      for (const process of processes) {
        trs.push(renderProcess(process));
      }

      $("#tbl-processes tbody").html(trs.join(""));
    }

    fetchProcesses();

    // *INFO: refetch process info every 15 minutes
    setInterval(() => {
      fetchProcesses();
    }, 15 * 1000);

    // $(document).on("click", "button", async function () {
    //   const self = $(this);
    //   const action = self.data("action");
    //   const process = self.parents("tr").attr("id");
    //
    //   if (
    //     action &&
    //     process &&
    //     ["start", "stop", "restart"].indexOf(action) >= 0
    //   ) {
    //     try {
    //       const response = await fetch(`/miners/${process}/${action}`, {
    //         method: "PUT",
    //       });
    //       const data = await response.json();
    //       if (response.status !== 200) {
    //         throw new Error(data.message);
    //       }
    //       updateMinersStatus();
    //     } catch (error) {
    //       alert(error.message);
    //     }
    //   }
    // });
  });
})(window.jQuery, window, document);
