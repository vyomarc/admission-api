/**
 * Vercel Serverless Function - Admission Form Handler
 */

const { google } = require('googleapis');

// Service Account Credentials (from environment variable)
const CREDENTIALS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || '{}');

const SPREADSHEET_ID = '1yw05g5lCweQAmhUCLFzOITIdm5fwttcUuSfXb6HISZM';
const SHEET_NAME = 'Admission Leads';
const SCHOOL_NAME = 'Devine Light Public School';

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

async function appendToSheet(data) {
  const sheets = await getSheetsClient();
  
  const rowData = [
    new Date().toISOString(),
    data.fullName || '',
    data.fatherName || '',
    data.motherName || '',
    data.mobileNo || '',
    data.dob || '',
    data.aadharNo || '',
    data.disability || 'None',
    data.caste || '',
    data.category || '',
    data.religion || '',
    data.previousSchool || 'N/A',
    data.fullAddress || '',
    data.state || '',
    data.pincode || '',
    data.admissionClass || '',
    data.bloodGroup || '',
    data.identificationMark || '',
    SCHOOL_NAME
  ];
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:S`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [rowData] }
  });
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'Devine Light Public School - Admission API',
      version: '1.0.0'
    });
  }
  
  if (req.method === 'POST') {
    try {
      await appendToSheet(req.body);
      
      return res.status(200).json({
        result: 'success',
        message: 'Thank you! Your admission enquiry has been submitted successfully.'
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        result: 'error',
        message: 'Submission failed. Please try again.'
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};