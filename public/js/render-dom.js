function renderStatusBadge(status) {
  let badgeClass = "badge ";
  const statusText = status.replaceAll("_", " ");

  switch (status) {
    case PROCESS_STATUS.STOPPED:
      badgeClass += " badge-danger";
      break;
    case PROCESS_STATUS.STARTED:
      badgeClass += " badge-success";
      break;
    case PROCESS_STATUS.NOT_START:
      badgeClass += " badge-default";
      break;
    default:
      break;
  }

  return `<span class="${badgeClass}">${statusText}</span>`;
}

function renderActionButton(status) {
  let playBtn = `
          <button type="button" class="btn btn-outline-primary" data-action="${PROCESS_ACTION.START}" title="start">
            <i class="bi bi-play-circle"></i>
          </button>
      `;

  if (status === PROCESS_STATUS.STARTED) {
    playBtn = `
      <button
        type="button"
        class="btn btn-outline-danger"
        data-action="${PROCESS_ACTION.STOP}"
        title="${PROCESS_ACTION.STOP}"
      >
        <i class="bi bi-pause-circle"></i>
      </button>`;
  }

  const restartBtn = `
          <button type="button" class="btn btn-outline-success" data-action="${PROCESS_ACTION.RESTART}" title="${PROCESS_ACTION.RESTART}">
            <i class="bi bi-arrow-repeat"></i>
           </button>
       `;

  return `
    ${playBtn}
    ${restartBtn}
  `;
}

function renderProcess(process) {
  const cpuText = process.monit ? process.monit.cpu : DEFAULT_NONE_VALUE;
  const memoryText = process.monit
    ? (process.monit.memory / (1024 * 1024)).toFixed(1) + " MB"
    : DEFAULT_NONE_VALUE;

  return `
    <tr id="${process.name}">
        <td>${process.name}</td>
        <td>${renderStatusBadge(process.status)}</td>
        <td>
          <div class="btn-group">
            <button type="button" class="btn btn-default btn-sm">
              CPU: ${cpuText}
            </button>
            <button type="button" class="btn btn-default btn-sm">
              RAM: ${memoryText}
            </button>
          </div>
        </td>
        <td>
          ${renderActionButton(process.status)}
        </td>
    </tr>
`;
}