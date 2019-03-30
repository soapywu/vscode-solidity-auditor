/** 
 * @author github.com/tintinweb
 * @license MIT
 * 
 * 
 * */

const vscode = require('vscode');

async function createNewUnittestStubForCurrentContractCommand(document, g_parser){
    let sourceUnit = g_parser.sourceUnits[document.uri.path]
    if(!sourceUnit || Object.keys(sourceUnit.contracts).length<=0){
        vscode.window.showErrorMessage(`[Solidity VA] unable to create unittest stub for current contract. missing analysis for source-unit: ${active.document.uri.path}`)
        return
    }

    let contract = {
        name: Object.keys(sourceUnit.contracts)[0],
        path: document.uri.path
    }
    let content = `
/**
 * 
 * autogenerated by solidity-visual-auditor
 * 
 * execute with: 
 *  #> truffle test <path/to/this/test.js>
 * 
 * */
var ${contract.name} = artifacts.require("${contract.path}");

contract('${contract.name}', (accounts) => {
var creatorAddress = accounts[0];
var firstOwnerAddress = accounts[1];
var secondOwnerAddress = accounts[2];
var externalAddress = accounts[3];
var unprivilegedAddress = accounts[4]
/* create named accounts for contract roles */

it('should revert if ...', () => {
    return ${contract.name}.deployed()
        .then(instance => {
            return instance.publicOrExternalContractMethod(argument1, argument2, {from:externalAddress});
        })
        .then(result => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, "assert.fail()", "Reason ...");
        });
    });

});
`;

    vscode.workspace.openTextDocument({content: content, language: "javascript"})
        .then(doc => vscode.window.showTextDocument(doc))
}

module.exports = {
    createNewUnittestStubForCurrentContractCommand:createNewUnittestStubForCurrentContractCommand
}