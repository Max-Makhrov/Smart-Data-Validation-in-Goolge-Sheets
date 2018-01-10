



/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen() {

  ui.createMenu('Smart Data Validation')
      .addItem('Set/Update', 'setDv')
      //.addItem('Test Trigger', 'test_dvOnEdit')
      //.addSeparator()
      //.addSubMenu(ui.createMenu('Sub-menu')
      //    .addItem('Second item', 'menuItem2'))
      .addToUi();


//   var ui = SpreadsheetApp.getUi(); 
//   ui.createAddonMenu('Smart Data Validation')
//      .addItem('Set/Update', 'setDv')
//      //.addItem('Test Trigger', 'test_dvOnEdit')
//      //.addSeparator()
//      //.addSubMenu(ui.createMenu('Sub-menu')
//      //    .addItem('Second item', 'menuItem2'))
//      .addToUi();
}


///**
// * Runs when the add-on is installed.
// * This method is only used by the regular add-on, and is never called by
// * the mobile add-on version.
// *
// * @param {object} e The event parameter for a simple onInstall trigger. To
// *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
// *     running in, inspect e.authMode. (In practice, onInstall triggers always
// *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
// *     AuthMode.NONE.)
// */
//function onInstall(e) {
//  onOpen(e);
//}
