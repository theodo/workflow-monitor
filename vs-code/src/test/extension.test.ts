import * as assert from 'assert';
import * as caspr from '../extension';
import * as vscode from 'vscode';

describe("Extension Tests", function() {
    afterEach(() => { caspr.cleanUp();});

    it("When timer is below 0, the VS Code Interface should turn red", async function() {
        await caspr.setAlertLevel('red');

        let workspace = vscode.workspace.getConfiguration('workbench');
        let config = workspace.get('colorCustomizations') as any;

        if (config && config['activityBar.background']) {
            assert.equal(config['activityBar.background'], "#ff0033dd");
        } else {
            assert.fail('Tested configuration not found');
        }
    });
});