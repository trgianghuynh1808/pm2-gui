(function ($, window, document) {
  $(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const appName = urlParams.get("pm_name");

    async function showProcessDetails() {
      const details = await fetchProcessDetails(appName);

      $("#title").text(appName);
      $("#process-details").html(renderProcessDetails(details));
      $("#action-group").html(renderActionButton(details.status));
    }

    function renderHeadTitle() {
      document.title = `${appName} - PM2 GUI`;
    }

    async function handleOnClickActionBtn(self) {
      const action = self.data("action");
      const env = "dev";

      if (action && appName) {
        try {
          const response = await excAction(appName, action, env);

          if (response.status !== 200) {
            throw new Error(response.data.message);
          }

          showProcessDetails();
        } catch (error) {
          alert(error.message);
        }
      }
    }

    function main() {
      renderHeadTitle();
      showProcessDetails();

      // *INFO: refetch process info every REFETCH_TIME seconds
      setInterval(() => {
        showProcessDetails();
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
    });
  });
})(window.jQuery, window, document);
