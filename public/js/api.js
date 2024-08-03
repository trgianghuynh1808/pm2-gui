async function fetchProcessesAPI() {
  const response = await fetch("/processes");
  const processes = await response.json();

  return processes;
}

async function fetchProcessDetailsAPI(appName) {
  const response = await fetch(`/processes/${appName}`);
  const details = await response.json();

  return details;
}

async function excActionAPI(name, action, env) {
  const response = await fetch(`/processes/${name}/${action}/${env}`, {
    method: "POST",
  });
  const data = await response.json();

  return {
    status: response.status,
    data,
  };
}

async function fetchPM2ConfigAPI() {
  const response = await fetch("/pm2-config");
  const rawContent = await response.json();

  return rawContent;
}

async function updatePM2ConfigAPI(payload) {
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
