/**
 * GOOGLE APPS SCRIPT BACKEND CODE (V2 - MEGA UPGRADE)
 * 
 * INSTRUCTIONS:
 * 1. Open your existing Google Sheet.
 * 2. Create a new tab named "Reviews".
 * 3. Add headers to "Reviews": Name, Rating, Comment, Date.
 * 4. Add some sample reviews (e.g., "Alice", "5", "Amazing coffee!", "2024-11-25").
 * 5. Go to Extensions > Apps Script.
 * 6. Replace ALL existing code with this new code.
 * 7. Click "Deploy" > "Manage deployments".
 * 8. Click the "Edit" (pencil) icon next to your active deployment.
 * 9. Version: Select "New version".
 * 10. Click "Deploy".
 * 11. (Optional) Your URL should stay the same, but verify it.
 */

function doGet(e) {
  const action = e.parameter.action;
  
```javascript
/**
 * GOOGLE APPS SCRIPT BACKEND CODE (V2 - MEGA UPGRADE)
 * 
 * INSTRUCTIONS:
 * 1. Open your existing Google Sheet.
 * 2. Create a new tab named "Reviews".
 * 3. Add headers to "Reviews": Name, Rating, Comment, Date.
 * 4. Add some sample reviews (e.g., "Alice", "5", "Amazing coffee!", "2024-11-25").
 * 5. Go to Extensions > Apps Script.
 * 6. Replace ALL existing code with this new code.
 * 7. Click "Deploy" > "Manage deployments".
 * 8. Click the "Edit" (pencil) icon next to your active deployment.
 * 9. Version: Select "New version".
 * 10. Click "Deploy".
 * 11. (Optional) Your URL should stay the same, but verify it.
 */

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getMenu') {
    return getMenu();
  } else if (action === 'getReviews') {
    return getReviews();
  } else if (action === 'getReservations') {
    return getReservations();
  } else if (action === 'getEvents') {
    return getEvents();
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Invalid action'})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    
    if (action === 'createReservation') {
      return createReservation(postData.data);
    } else if (action === 'addSubscriber') {
      return addSubscriber(postData.data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Invalid action'})).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function getMenu() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Menu');
  // If the sheet doesn't exist, return an empty array or an error.
  // For now, let's assume it exists or handle it gracefully.
  if (!sheet) return successResponse([]); 
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove header row
  
  const menuItems = data.map(row => ({
    category: row[0],
    name: row[1],
    description: row[2],
    price: row[3],
    image: row[4]
  }));
  
  return successResponse(menuItems);
}

function getReviews() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reviews');
  if (!sheet) return successResponse([]); // Return empty if no sheet yet
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const reviews = data.map(row => ({
    name: row[0],
    rating: row[1],
    comment: row[2],
    date: row[3]
  }));
  
  return successResponse(reviews);
}

function getReservations() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reservations');
  if (!sheet) return errorResponse('Reservations sheet not found');
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const reservations = data.map(row => ({
    timestamp: row[0],
    name: row[1],
    email: row[2],
    date: row[3],
    time: row[4],
    guests: row[5]
  }));
  
  // Return most recent first
  return successResponse(reservations.reverse());
}

function getEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Events');
  if (!sheet) return successResponse([]);
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const events = data.map(row => ({
    name: row[0],
    date: row[1],
    time: row[2],
    description: row[3],
    price: row[4],
    image: row[5]
  }));
  
  return successResponse(events);
}

function createReservation(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reservations');
  if (!sheet) return errorResponse('Reservations sheet not found');
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.date,
    data.time,
    data.guests
  ]);
  
  return successResponse({message: 'Reservation created successfully'});
}

function addSubscriber(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Subscribers');
  if (!sheet) {
    // Create sheet if it doesn't exist
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Subscribers');
    newSheet.appendRow(['Email', 'Name', 'Date Joined']);
    return addSubscriber(data); // Retry
  }
  
  sheet.appendRow([
    data.email,
    data.name,
    new Date()
  ]);
  
  return successResponse({message: 'Welcome to the Reserve Society'});
}

function successResponse(data) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: data
  })).setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: message
  })).setMimeType(ContentService.MimeType.JSON);
}
```
