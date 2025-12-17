import { GOOGLE_SHEETS_SCRIPT_URL } from '../constants';

export const logDownloadToSheet = async (data: { school: string; name: string; email: string }) => {
    if (!GOOGLE_SHEETS_SCRIPT_URL) {
        console.warn("Google Sheets Script URL is not configured. Skipping cloud logging.");
        return;
    }

    try {
        // We use fetch with 'no-cors' mode to avoid CORS errors from Google's redirect.
        // Note: With 'no-cors', we cannot read the response status/body, but the request will execute.
        await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log("Data sent to Google Sheets successfully");
    } catch (error) {
        console.error("Error logging to Google Sheets:", error);
        // We do not throw the error to avoid interrupting the user flow (download/PDF generation)
    }
};
