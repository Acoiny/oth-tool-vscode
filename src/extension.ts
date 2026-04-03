// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Mensaplan } from "./Mensaplan";

class MensaView implements vscode.WebviewViewProvider {
  private Mensaplan: Mensaplan = new Mensaplan(
    "https://stwno.de/infomax/daten-extern/html/",
    "speiseplan-render.php",
    true,
  );

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.options = {
      enableScripts: true,
    };

	this.Mensaplan.fetchDay(new Date()).then(() => {
	  webviewView.webview.html = this.Mensaplan.to_html_str();
	}).catch((err) => {
	  console.error("Failed to fetch mensaplan:", err);
	  webviewView.webview.html = `<h1>Fehler beim Laden des Mensaplans</h1><p>${err.message}</p>`;
	});

    // webviewView.webview.html = this.Mensaplan.to_html_str();
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "othmensatool" is now active!');

  const mensaView = new MensaView();

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "othmensatool.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from oth_mensatool!");
    },
  );

  const mensaViewRegistration = vscode.window.registerWebviewViewProvider(
    "mensaplan-view",
    mensaView,
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(mensaViewRegistration);
}

// This method is called when your extension is deactivated
export function deactivate() {}
