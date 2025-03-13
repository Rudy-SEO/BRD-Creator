import os
import json
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Google API configuration
CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')
SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/documents.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
]

def authenticate_google():
    """
    Create Google OAuth authentication URL
    
    Returns:
        str: Authentication URL
    """
    flow = Flow.from_client_config(
        {
            'web': {
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'redirect_uris': [REDIRECT_URI],
                'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                'token_uri': 'https://oauth2.googleapis.com/token'
            }
        },
        scopes=SCOPES
    )
    
    flow.redirect_uri = REDIRECT_URI
    
    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    
    return authorization_url

def get_credentials_from_token(token):
    """
    Create credentials object from token
    
    Args:
        token (str): OAuth token
        
    Returns:
        Credentials: Google API credentials
    """
    return Credentials(token)

def process_google_doc(doc_id, token):
    """
    Extract content from a Google Doc
    
    Args:
        doc_id (str): Google Doc ID
        token (str): OAuth token
        
    Returns:
        str: Document content
    """
    try:
        credentials = get_credentials_from_token(token)
        docs_service = build('docs', 'v1', credentials=credentials)
        
        document = docs_service.documents().get(documentId=doc_id).execute()
        doc_content = document.get('body').get('content')
        
        text_content = ""
        for element in doc_content:
            if 'paragraph' in element:
                for paragraph_element in element['paragraph']['elements']:
                    if 'textRun' in paragraph_element:
                        text_content += paragraph_element['textRun']['content']
        
        return text_content
    
    except HttpError as error:
        raise Exception(f"Error accessing Google Doc: {error}")

def process_google_sheet(sheet_id, token):
    """
    Extract content from a Google Sheet
    
    Args:
        sheet_id (str): Google Sheet ID
        token (str): OAuth token
        
    Returns:
        str: Sheet content as text
    """
    try:
        credentials = get_credentials_from_token(token)
        sheets_service = build('sheets', 'v4', credentials=credentials)
        
        sheet = sheets_service.spreadsheets().get(spreadsheetId=sheet_id).execute()
        sheet_titles = [s['properties']['title'] for s in sheet['sheets']]
        
        all_data = []
        for sheet_title in sheet_titles:
            range_name = f"'{sheet_title}'!A1:Z1000"  # Adjust range as needed
            result = sheets_service.spreadsheets().values().get(
                spreadsheetId=sheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            if values:
                all_data.append(f"Sheet: {sheet_title}")
                for row in values:
                    all_data.append(','.join([str(cell) for cell in row]))
                all_data.append("\n")
        
        return "\n".join(all_data)
    
    except HttpError as error:
        raise Exception(f"Error accessing Google Sheet: {error}")