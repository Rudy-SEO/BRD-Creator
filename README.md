# BRD Creator

An application that analyzes various document types and generates comprehensive Business Requirements Documents (BRDs) for AI Agent automation specialists.

## Features

- Upload and process multiple file types (PDF, text files, etc.)
- Connect to Google Drive to access Docs, Sheets, and folders
- AI-powered analysis of document content
- Generate structured BRDs with key requirements
- Export BRDs in multiple formats

## How It Works

1. **Upload Documents**: Upload PDF files, Word documents, text files, or connect to Google Drive
2. **AI Analysis**: Our AI engine analyzes the content to extract key business requirements
3. **BRD Generation**: A comprehensive Business Requirements Document is generated with all necessary sections
4. **Review & Export**: Review the generated BRD and export it in your preferred format

## Technology Stack

- **Frontend**: React with Material-UI
- **Backend**: Python Flask API
- **AI Engine**: OpenAI GPT-4 for document analysis and BRD generation
- **File Processing**: PyPDF2, python-docx, and other libraries for handling various file formats
- **Google Integration**: Google Drive API for accessing Google Docs and Sheets

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Python 3.9+
- Google Cloud API credentials (for Google Drive integration)
- OpenAI API key

### Installation

1. Clone this repository
   ```
   git clone https://github.com/Rudy-SEO/BRD-Creator.git
   cd BRD-Creator
   ```

2. Install frontend dependencies
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies
   ```
   cd ../backend
   pip install -r requirements.txt
   ```

4. Set up environment variables
   - Create a `.env` file in the backend directory based on `.env.example`
   - Add your OpenAI API key and Google API credentials

5. Start the development servers
   - Frontend: `npm start` (in the frontend directory)
   - Backend: `python app.py` (in the backend directory)

## Usage

### Uploading Files

1. Navigate to the Upload page
2. Drag and drop your file or click to select a file
3. Click "Upload & Generate BRD"
4. Wait for the AI to process your document
5. View and download your generated BRD

### Connecting to Google Drive

1. Navigate to the Upload page and select the Google Drive tab
2. Enter the URL of your Google Doc or Sheet
3. Click "Connect to Google Drive"
4. Authenticate with your Google account
5. Wait for the AI to process your document
6. View and download your generated BRD

## BRD Structure

The generated BRDs include the following sections:

1. Executive Summary
2. Project Background
3. Business Objectives
4. Scope
5. Current Process Analysis
6. Requirements (Functional, Non-Functional, Technical)
7. Stakeholders
8. Success Criteria
9. Constraints
10. Assumptions
11. Risks and Mitigation
12. Timeline
13. Budget
14. Approval

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- Google for the Drive API integration
- All contributors and users of this application