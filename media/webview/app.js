const vscode = acquireVsCodeApi();

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.getAttribute("data-action");

    if (action === "setWeek") {
      vscode.postMessage({
        type: "setWeek",
        week: button.getAttribute("data-week"),
      });
      return;
    }

    if (action === "setDay") {
      vscode.postMessage({
        type: "setDay",
        dayIndex: Number(button.getAttribute("data-day-index")),
      });
      return;
    }

    if (action === "showWeek") {
      vscode.postMessage({ type: "showWeek" });
      return;
    }

    if (action === "refresh") {
      vscode.postMessage({ type: "refresh" });
    }
  });
});
