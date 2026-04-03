// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


class MensaView implements vscode.WebviewViewProvider {
	resolveWebviewView(webviewView: vscode.WebviewView): void {
		webviewView.webview.options = {
			enableScripts: true,
		};

		webviewView.webview.html = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Mensaplan</title>
			</head>
			<body>
				<h1>Mensaplan</h1>
				<p>This view is shown in the sidebar.</p>
			</body>
			</html>
		`;
	}
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "othmensatool" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('othmensatool.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from oth_mensatool!');
	});

	const mensaView = new MensaView();
	const mensaViewRegistration = vscode.window.registerWebviewViewProvider('mensaplan-view', mensaView);


	context.subscriptions.push(disposable);
	context.subscriptions.push(mensaViewRegistration);
}

// This method is called when your extension is deactivated
export function deactivate() {}
