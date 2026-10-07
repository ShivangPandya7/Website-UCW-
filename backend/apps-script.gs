/**
 * UpperCrust Wealth — lead & enquiry collector (Google Apps Script)
 * Receives the website's document downloads, research-room unlocks and enquiry letters and appends them to a Google Sheet.
 *
 * Setup (5 minutes):
 *  1. Create a Google Sheet named "UpperCrust Website Leads".
 *  2. Extensions → Apps Script → paste this file → Save.
 *  3. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone → Deploy.
 *  4. Copy the Web app URL (https://script.google.com/macros/s/…/exec).
 *  5. Paste it in /admin → Contact, event and firm details → "Lead & enquiry endpoint". Done.
 * Optional: set NOTIFY_EMAIL below to receive an email for every new lead.
 */
var NOTIFY_EMAIL = 'social@uppercrustwealth.com';   // an email for every new lead; leave '' to switch it off

function doPost(e) {
  var data = {};
  try { data = JSON.parse(e.postData.contents || '{}'); } catch (err) { data = { raw: e.postData && e.postData.contents }; }
  var type = data.type || 'enquiry';
  if (type === 'download') {
    var dsheet = sheetFor_('Downloads', ['Received', 'Name', 'Mobile', 'Email', 'Document', 'Interest', 'Investable amount', 'Based in', 'Follow-up', 'News and updates', 'Page']);
    var drow = [new Date(), data.name || '', data.phone || '', data.email || '', data.document || '', data.interest || '', data.amount || '', data.based || '', data.followup || '', data.subscribe || 'No', data.page || ''];
    dsheet.appendRow(drow);
    notify_('download of ' + (data.document || 'a document'), data.name, drow);
    return ok_();
  }
  var sheet = sheetFor_(type === 'resources' ? 'Research room' : 'Enquiries');
  var row = [new Date(), data.name || '', data.phone || '', data.email || '', data.topic || '', data.prefer || '',
             data.assets || '', data.fund || '', data.letter || '', data.page || ''];
  sheet.appendRow(row);
  notify_(type === 'resources' ? 'research-room lead' : 'enquiry', data.name, row);
  return ok_();
}

function ok_() { return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON); }

function notify_(what, who, row) {
  if (!NOTIFY_EMAIL) return;
  MailApp.sendEmail(NOTIFY_EMAIL, 'New website ' + what + (who ? ': ' + who : ''), row.map(String).join('\n'));
}

function sheetFor_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers || ['Received', 'Name', 'Mobile', 'Email', 'Topic', 'Prefers', 'Assets', 'Fund', 'Letter', 'Page']);
    sh.setFrozenRows(1);
  }
  return sh;
}
