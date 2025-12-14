const SHEET_ID = '1UpZymDhskCgYFLdTzS73JrvRzSqv6Ovl6umLdcy_pRs';
const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE'; // Replace this with your Google Sheets API key from Google Cloud Console
const MODELS_RANGE = 'Sheet1!A:A';
const STOCK_RANGE = 'Sheet1!A:C'; // Assuming: A=Model, B=Stock, C=Status
const SALES_RANGE = 'Sheet1!A:E'; // Assuming: A=Model, B=Stock, C=Status, D=Sales, E=Revenue

export const googleSheetsService = {
  getModels: async () => {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${MODELS_RANGE}?key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.values) {
        return data.values
          .flat()
          .filter(model => model && model.trim() !== '' && model !== 'Model')
          .map(model => model.trim());
      }
      return [];
    } catch (error) {
      console.error('Error fetching models from Google Sheets:', error);
      return ['Air Max', 'Stan Smith', 'Ultraboost', 'Classic', 'Sport'];
    }
  },

  getStock: async () => {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${STOCK_RANGE}?key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.values) {
        const [header, ...rows] = data.values;
        return rows.map(row => ({
          model: row[0] || '',
          stock: parseInt(row[1]) || 0,
          status: row[2] || 'Available'
        })).filter(item => item.model.trim() !== '');
      }
      return [];
    } catch (error) {
      console.error('Error fetching stock from Google Sheets:', error);
      return [];
    }
  },

  getSalesAnalytics: async () => {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SALES_RANGE}?key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.values) {
        const [header, ...rows] = data.values;
        return rows.map(row => ({
          model: row[0] || '',
          stock: parseInt(row[1]) || 0,
          status: row[2] || 'Available',
          sales: parseInt(row[3]) || 0,
          revenue: parseFloat(row[4]) || 0
        })).filter(item => item.model.trim() !== '');
      }
      return [];
    } catch (error) {
      console.error('Error fetching sales analytics from Google Sheets:', error);
      return [];
    }
  }
};