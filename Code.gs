/**
 * Number Splitter Pro - Web App Entry Point
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Number Splitter Pro')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
