// ============================
// YOGA WITH BINDU — Google Apps Script
// Paste this into script.google.com
// ============================

// SETUP INSTRUCTIONS:
// 1. Go to script.google.com
// 2. Create a new project, name it "Yoga With Bindu Form"
// 3. Delete any existing code and paste this entire file
// 4. Click Save
// 5. Click Deploy > New Deployment
// 6. Type: Web App
// 7. Execute as: Me
// 8. Who has access: Anyone
// 9. Click Deploy and copy the Web App URL
// 10. Paste that URL into form.js where it says 'YOUR_APPS_SCRIPT_URL_HERE'

const SHEET_ID = '1xphJXoGYsWYYOA6Rva79C6DSnQUqwN3_QuLwM2fKbnw';
// To find your Sheet ID: open your Google Sheet,
// the ID is the long string in the URL between /d/ and /edit

function doPost(e) {
  try {
    // Handle both JSON and URL-encoded form data
    let data;
    if (e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else {
      // URL-encoded form data
      data = {};
      const params = e.parameter;
      Object.keys(params).forEach(key => {
        data[key] = params[key];
      });
    }
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Email',
        'Full Name',
        'Address',
        'Phone',
        'Date of Birth',
        'Medical Care Notes',
        'Service',
        'Reiki — Received Before?',
        'Reiki — Intention',
        'Reiki — Session Selected',
        'Yoga — Session Selected',
        'Yoga — Notes',
        'Dots — Event Type',
        'Dots — Guest Count',
        'Dots — Preferred Date',
        'Dots — Location',
        'Dots — Additional Notes',
        'Payment Method',
        'Cash/Check Note',
        'Waiver Date',
        'Electronic Signature',
        'Waiver Agreed',
      ]);

      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, 23);
      headerRange.setBackground('#b8962e');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Append the submission
    sheet.appendRow([
      data.timestamp || '',
      data.email || '',
      data.fullName || '',
      data.address || '',
      data.phone || '',
      data.dateOfBirth || '',
      data.medicalCare || '',
      data.service || '',
      data.reikiSessionBefore || '',
      data.reikiIntention || '',
      data.reikiSession || '',
      data.yogaSession || '',
      data.yogaNotes || '',
      data.eventType || '',
      data.eventGuests || '',
      data.eventDate || '',
      data.eventLocation || '',
      data.eventNotes || '',
      data.paymentMethod || '',
      data.cashNote || '',
      data.waiverDate || '',
      data.electronicSignature || '',
      data.waiverAgreed || '',
    ]);

    // Auto-resize columns
    sheet.autoResizeColumns(1, 23);

    // Send email notification to Bindu
    MailApp.sendEmail({
      to: 'yogawithbindu@gmail.com',
      subject: `New Registration — ${data.fullName} (${data.service})`,
      htmlBody: `
        <h2 style="font-family: Georgia, serif; color: #1c1612;">New Registration — Yoga With Bindu</h2>
        <table style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; width: 100%;">
          <tr style="background: #f2ede4;">
            <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #e8e0d3;">Name</td>
            <td style="padding: 8px 12px; border: 1px solid #e8e0d3;">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #e8e0d3;">Email</td>
            <td style="padding: 8px 12px; border: 1px solid #e8e0d3;">${data.email}</td>
          </tr>
          <tr style="background: #f2ede4;">
            <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #e8e0d3;">Phone</td>
            <td style="padding: 8px 12px; border: 1px solid #e8e0d3;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #e8e0d3;">Service</td>
            <td style="padding: 8px 12px; border: 1px solid #e8e0d3;">${data.service}</td>
          </tr>
          <tr style="background: #f2ede4;">
            <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #e8e0d3;">Session</td>
            <td style="padding: 8px 12px; border: 1px solid #e8e0d3;">${data.reikiSession || data.yogaSession || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #e8e0d3;">Payment</td>
            <td style="padding: 8px 12px; border: 1px solid #e8e0d3;">${data.paymentMethod}</td>
          </tr>
          <tr style="background: #f2ede4;">
            <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #e8e0d3;">Signed</td>
            <td style="padding: 8px 12px; border: 1px solid #e8e0d3;">${data.electronicSignature} — ${data.waiverDate}</td>
          </tr>
        </table>
        <p style="font-family: Arial, sans-serif; font-size: 13px; color: #9a8f82; margin-top: 16px;">
          Full details saved to your Google Sheet.
        </p>
      `
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Yoga With Bindu — Form endpoint is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}