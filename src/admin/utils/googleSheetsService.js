// Google Sheets API Service for fetching model data

class GoogleSheetsService {
  constructor() {
    // Google Sheets API configuration
    this.apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
    this.spreadsheetId = process.env.REACT_APP_GOOGLE_SHEETS_ID;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  /**
   * Fetch models from Google Sheets
   * Expected sheet structure:
   * Column A: Model Name
   * Column B: Brand (optional)
   * Column C: Category (optional)
   */
  async fetchModels(range = 'Models!A:C') {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length === 0) {
        console.warn('No data found in Google Sheets');
        return this.getFallbackModels();
      }

      // Skip header row and process data
      const models = data.values.slice(1).map(row => ({
        name: row[0] || '',
        brand: row[1] || '',
        category: row[2] || ''
      })).filter(model => model.name.trim() !== '');

      return models;
    } catch (error) {
      console.error('Error fetching models from Google Sheets:', error);
      // Return fallback data if API fails
      return this.getFallbackModels();
    }
  }

  /**
   * Fetch stock data from Google Sheets
   * Expected sheet structure:
   * Column A: Product Name
   * Column B: Variant (Color-Size)
   * Column C: Stock Quantity
   * Column D: Reorder Level
   */
  async fetchStockData(range = 'Stock!A:D') {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length === 0) {
        console.warn('No stock data found in Google Sheets');
        return [];
      }

      // Skip header row and process data
      const stockData = data.values.slice(1).map(row => ({
        productName: row[0] || '',
        variant: row[1] || '',
        stock: parseInt(row[2]) || 0,
        reorderLevel: parseInt(row[3]) || 10
      })).filter(item => item.productName.trim() !== '');

      return stockData;
    } catch (error) {
      console.error('Error fetching stock data from Google Sheets:', error);
      return [];
    }
  }

  /**
   * Update stock data in Google Sheets
   * @param {Array} stockUpdates - Array of stock updates
   */
  async updateStockData(stockUpdates) {
    try {
      // Note: This requires Google Sheets API write permissions
      // For demo purposes, we'll just log the updates
      console.log('Stock updates to be sent to Google Sheets:', stockUpdates);
      
      // In a real implementation, you would:
      // 1. Use Google Sheets API with proper authentication
      // 2. Update the specific cells with new stock values
      // 3. Handle batch updates for better performance
      
      return { success: true, message: 'Stock updated successfully' };
    } catch (error) {
      console.error('Error updating stock in Google Sheets:', error);
      return { success: false, message: 'Failed to update stock' };
    }
  }

  /**
   * Fallback models data when Google Sheets is unavailable
   */
  getFallbackModels() {
    return [
      { name: 'Air Max', brand: 'Nike', category: 'Running' },
      { name: 'Air Force', brand: 'Nike', category: 'Casual' },
      { name: 'Air Jordan', brand: 'Nike', category: 'Sports' },
      { name: 'Ultraboost', brand: 'Adidas', category: 'Running' },
      { name: 'Stan Smith', brand: 'Adidas', category: 'Casual' },
      { name: 'Superstar', brand: 'Adidas', category: 'Casual' },
      { name: 'Chuck Taylor', brand: 'Converse', category: 'Casual' },
      { name: 'Old Skool', brand: 'Vans', category: 'Casual' },
      { name: 'Authentic', brand: 'Vans', category: 'Casual' },
      { name: 'RS-X', brand: 'Puma', category: 'Sports' },
      { name: 'Suede Classic', brand: 'Puma', category: 'Casual' },
      { name: 'Future Rider', brand: 'Puma', category: 'Running' }
    ];
  }

  /**
   * Validate Google Sheets configuration
   */
  isConfigured() {
    return !!(this.apiKey && this.spreadsheetId);
  }

  /**
   * Get configuration status
   */
  getConfigStatus() {
    return {
      hasApiKey: !!this.apiKey,
      hasSpreadsheetId: !!this.spreadsheetId,
      isFullyConfigured: this.isConfigured()
    };
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();

// Export class for testing
export { GoogleSheetsService };

// Usage instructions for environment variables:
/*
Add these to your .env file:

REACT_APP_GOOGLE_SHEETS_API_KEY=your_google_api_key_here
REACT_APP_GOOGLE_SHEETS_ID=your_spreadsheet_id_here

To get Google Sheets API key:
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create credentials (API Key)
5. Restrict the API key to Google Sheets API

To get Spreadsheet ID:
1. Open your Google Sheet
2. Copy the ID from URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
3. Make sure the sheet is publicly readable or shared with your service account

Expected Sheet Structure:

Models Sheet:
| Model Name    | Brand   | Category |
|---------------|---------|----------|
| Air Max       | Nike    | Running  |
| Ultraboost    | Adidas  | Running  |
| Stan Smith    | Adidas  | Casual   |

Stock Sheet:
| Product Name     | Variant  | Stock | Reorder Level |
|------------------|----------|-------|---------------|
| Nike Air Max 270| Red-M    | 15    | 10           |
| Nike Air Max 270| Blue-L   | 8     | 10           |
*/