module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  res.status(200).json({
    status: 'active',
    service: 'Devine Light Public School - Admission API',
    version: '1.0.0',
    endpoints: {
      health: '/',
      admission: '/api/admission'
    },
    timestamp: new Date().toISOString()
  });
};
