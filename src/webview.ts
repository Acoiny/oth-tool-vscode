import * as vscode from "vscode";
import { getWeekDates, Mensaplan } from "./Mensaplan";

export class MensaView implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  private readonly baseUrl = "https://stwno.de/infomax/daten-extern/html/";
  private readonly restUrl = "speiseplan-render.php";
  private readonly fetchAbendmensa = true;

  private webviewView?: vscode.WebviewView;
  private useNextWeek = false;
  private selectedMode: "day" | "week" = "day";
  private selectedDayIndex = this.getDefaultDayIndex();
  private renderVersion = 0;

  private getDefaultDayIndex(): number {
    const day = new Date().getDay(); // 0 = Sunday ... 6 = Saturday

    if (day === 0) {
      return 0;
    }

    if (day >= 6) {
      return 4;
    }

    return day - 1;
  }

  private getPlanner(): Mensaplan {
    return new Mensaplan(this.baseUrl, this.restUrl, this.fetchAbendmensa);
  }

  private async renderWebview(): Promise<void> {
    if (!this.webviewView) {
      return;
    }

    const currentRender = ++this.renderVersion;
    const plan = this.getPlanner();
    const weekDates = getWeekDates(this.useNextWeek);
    const targetDates = this.selectedMode === "week"
      ? weekDates
      : [weekDates[this.selectedDayIndex]];

    try {
      await Promise.all(targetDates.map((date) => plan.fetchDay(date)));

      if (currentRender !== this.renderVersion) {
        return;
      }

      this.webviewView.webview.html = this.getWebviewHtml(
        this.webviewView.webview,
        plan.to_html_str(),
      );
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unbekannter Fehler";

      if (currentRender !== this.renderVersion) {
        return;
      }

      this.webviewView.webview.html = this.getWebviewHtml(
        this.webviewView.webview,
        `<h1>Fehler beim Laden des Mensaplans</h1><p>${error}</p>`,
      );
    }
  }

  private getWebviewHtml(webview: vscode.Webview, content: string): string {
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "webview", "styles.css"),
    );
    const jsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "webview", "app.js"),
    );
    const weekdays = ["Mo", "Di", "Mi", "Do", "Fr"];
    const weekDates = getWeekDates(this.useNextWeek);
    const dayButtons = weekdays
      .map((label, index) => {
        const active = this.selectedMode === "day" && this.selectedDayIndex === index;
        const dateLabel = weekDates[index].toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
        });

        return `<button class="seg-btn ${active ? "active" : ""}" data-action="setDay" data-day-index="${index}">${label}<span>${dateLabel}</span></button>`;
      })
      .join("");

    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${cssUri}">
</head>
<body>
  <div class="toolbar">
    <div class="segment" role="group" aria-label="Woche wählen">
      <button class="seg-btn ${this.useNextWeek ? "" : "active"}" data-action="setWeek" data-week="current">Diese Woche</button>
      <button class="seg-btn ${this.useNextWeek ? "active" : ""}" data-action="setWeek" data-week="next">Nächste Woche</button>
    </div>
    <div class="segment" role="group" aria-label="Tag wählen">
      ${dayButtons}
    </div>
    <div class="toolbar-actions">
      <button class="action-btn ${this.selectedMode === "week" ? "active" : ""}" data-action="showWeek">Ganze Woche</button>
      <button class="action-btn" data-action="refresh">Aktualisieren</button>
    </div>
  </div>
  ${content}
  <script src="${jsUri}"></script>
</body>
</html>`;
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.webviewView = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, "media"),
      ],
    };

    webviewView.webview.onDidReceiveMessage((message: unknown) => {
      if (!message || typeof message !== "object") {
        return;
      }

      const data = message as {
        type?: string;
        week?: string;
        dayIndex?: number;
      };

      if (data.type === "setWeek") {
        this.useNextWeek = data.week === "next";
        void this.renderWebview();
        return;
      }

      if (data.type === "setDay" && typeof data.dayIndex === "number") {
        if (data.dayIndex >= 0 && data.dayIndex <= 4) {
          this.selectedDayIndex = data.dayIndex;
          this.selectedMode = "day";
          void this.renderWebview();
        }
        return;
      }

      if (data.type === "showWeek") {
        this.selectedMode = "week";
        void this.renderWebview();
        return;
      }

      if (data.type === "refresh") {
        void this.renderWebview();
      }
    });

    void this.renderWebview();

    // webviewView.webview.html = this.Mensaplan.to_html_str();
  }
}