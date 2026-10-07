/**
 * UpperCrust Wealth — lead & enquiry collector (Google Apps Script)
 * Receives the website's enquiry letters, document downloads and research-room unlocks and
 * appends them to a Google Sheet. Optionally emails NOTIFY_EMAIL for each one.
 *
 * Setup (5 minutes), signed in as social@uppercrustwealth.com:
 *  1. Create a Google Sheet named "UpperCrust Website Leads".
 *  2. In that Sheet: Extensions → Apps Script → paste this whole file → Save.
 *  3. Pick "testLead" in the function list at the top and press Run. Allow the permissions when asked.
 *     Check the Sheet: an "Enquiries" tab with a TEST row should appear. (Press Run on doPost? No: it needs a web request.)
 *  4. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone → Deploy.
 *  5. Copy the Web app URL (https://script.google.com/macros/s/…/exec) into content/site.json as "leadEndpoint".
 * After any later change to this file: Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.
 * The URL stays the same.
 */
var NOTIFY_EMAIL = 'social@uppercrustwealth.com';   // an email for every new lead; leave '' to switch it off

function doPost(e) {
  if (!e || !e.postData) return out_({ ok: false, error: 'No data received. This function is called by the website, not run by hand.' });
  var data = {};
  try { data = JSON.parse(e.postData.contents || '{}'); } catch (err) { data = { raw: e.postData.contents }; }
  var type = data.type || 'enquiry';

  if (type === 'download') {
    var dsheet = sheetFor_('Downloads', ['Received', 'Name', 'Mobile', 'Email', 'Document', 'News and updates', 'Page']);
    var drow = [new Date(), data.name || '', data.phone || '', data.email || '', data.document || '', data.subscribe || 'No', data.page || ''];
    dsheet.appendRow(drow);
    notify_('download of ' + (data.document || 'a document'), data.name, drow);
    return out_({ ok: true });
  }

  var sheet = sheetFor_(type === 'resources' ? 'Research room' : 'Enquiries');
  var row = [new Date(), data.name || '', data.phone || '', data.email || '', data.topic || '', data.prefer || '',
             data.assets || '', data.fund || '', data.letter || '', data.page || ''];
  sheet.appendRow(row);
  notify_(type === 'resources' ? 'research-room lead' : 'enquiry', data.name, row);
  return out_({ ok: true });
}

// Opening the web app link in a browser shows this, so you can see the deployment is alive.
function doGet() { return out_({ ok: true, service: 'UpperCrust lead collector', note: 'POST only' }); }

// ---- Test buttons: choose one in the function list above and press Run. Rows are marked TEST. ----
function testLead() {
  doPost({ postData: { contents: JSON.stringify({ type: 'enquiry', name: 'TEST Visitor', phone: '+91 90000 00000', email: 'test@example.com',
    topic: 'a test enquiry', prefer: 'a call', letter: 'This is a test row created from the Apps Script editor.', page: '/test' }) } });
}
function testDownload() {
  doPost({ postData: { contents: JSON.stringify({ type: 'download', name: 'TEST Visitor', phone: '+91 90000 00000', email: 'test@example.com',
    document: 'Test document', subscribe: 'No', page: '/test' }) } });
}

function out_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

function notify_(what, who, row) {
  if (!NOTIFY_EMAIL) return;
  try { MailApp.sendEmail(NOTIFY_EMAIL, 'New website ' + what + (who ? ': ' + who : ''), row.map(String).join('\n')); } catch (err) { /* a mail problem must never lose the lead */ }
}

// The sheet this script is attached to. If the script was created on its own (not from a Sheet's Extensions menu),
// a "UpperCrust Website Leads" Sheet is created in the same Google account the first time and reused afterwards.
function book_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;
  var props = PropertiesService.getScriptProperties(), id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  ss = SpreadsheetApp.create('UpperCrust Website Leads');
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function sheetFor_(name, headers) {
  var ss = book_(), sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers || ['Received', 'Name', 'Mobile', 'Email', 'Topic', 'Prefers', 'Assets', 'Fund', 'Letter', 'Page']);
    sh.setFrozenRows(1);
  }
  return sh;
}
