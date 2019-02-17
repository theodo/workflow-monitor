import * as vscode from 'vscode';

let context:vscode.ExtensionContext|null = null;

function setContext(cont: vscode.ExtensionContext) {
    context = cont;
}

function getToken(): string|undefined {
    if (!context) {
        return;
    }

    return context.workspaceState.get('token');
}

async function askCredentials(): Promise<void> {
    if (getToken() || !context) {
        return;
    }

    const token = await vscode.window.showInputBox({
        prompt: 'Enter your JWT token (Go to http://caspr.theo.do > Settings > Copy CLI token) :',
        placeHolder: 'JWT token',
        ignoreFocusOut: true
    });

    await context.workspaceState.update('token', token);
    vscode.window.showInformationMessage('Login token stored!');

    return;
}

export default {
    getToken,
    askCredentials,
    setContext
};