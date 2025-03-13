import os
import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Import processing modules
from processors.pdf_processor import process_pdf
from processors.text_processor import process_text
from processors.google_drive import authenticate_google, process_google_doc, process_google_sheet
from ai_engine.analyzer import analyze_content
from ai_engine.brd_generator import generate_brd

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)

# Configuration
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB default
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'csv'}

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        # Process file based on type
        file_extension = filename.rsplit('.', 1)[1].lower()
        content = None
        
        try:
            if file_extension == 'pdf':
                content = process_pdf(filepath)
            elif file_extension in ['txt', 'doc', 'docx']:
                content = process_text(filepath)
            else:
                return jsonify({'error': 'Unsupported file type'}), 400
            
            # Analyze content with AI
            analysis = analyze_content(content)
            
            # Generate BRD
            brd = generate_brd(analysis)
            
            # Save BRD to file
            brd_id = str(uuid.uuid4())
            brd_filename = f"brd_{brd_id}.json"
            brd_path = os.path.join(app.config['UPLOAD_FOLDER'], brd_filename)
            
            with open(brd_path, 'w') as f:
                json.dump({
                    'id': brd_id,
                    'original_filename': filename,
                    'created_at': datetime.now().isoformat(),
                    'brd': brd
                }, f)
            
            return jsonify({
                'success': True,
                'brd_id': brd_id,
                'message': 'File processed successfully'
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/google/auth', methods=['GET'])
def google_auth():
    auth_url = authenticate_google()
    return jsonify({'auth_url': auth_url})

@app.route('/api/google/process', methods=['POST'])
def process_google_file():
    data = request.json
    if not data or 'fileId' not in data or 'fileType' not in data or 'token' not in data:
        return jsonify({'error': 'Missing required parameters'}), 400
    
    file_id = data['fileId']
    file_type = data['fileType']
    token = data['token']
    
    try:
        content = None
        if file_type == 'document':
            content = process_google_doc(file_id, token)
        elif file_type == 'spreadsheet':
            content = process_google_sheet(file_id, token)
        else:
            return jsonify({'error': 'Unsupported Google file type'}), 400
        
        # Analyze content with AI
        analysis = analyze_content(content)
        
        # Generate BRD
        brd = generate_brd(analysis)
        
        # Save BRD to file
        brd_id = str(uuid.uuid4())
        brd_filename = f"brd_{brd_id}.json"
        brd_path = os.path.join(app.config['UPLOAD_FOLDER'], brd_filename)
        
        with open(brd_path, 'w') as f:
            json.dump({
                'id': brd_id,
                'original_source': f"google_{file_type}_{file_id}",
                'created_at': datetime.now().isoformat(),
                'brd': brd
            }, f)
        
        return jsonify({
            'success': True,
            'brd_id': brd_id,
            'message': 'Google file processed successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/brd/<brd_id>', methods=['GET'])
def get_brd(brd_id):
    brd_filename = f"brd_{brd_id}.json"
    brd_path = os.path.join(app.config['UPLOAD_FOLDER'], brd_filename)
    
    if not os.path.exists(brd_path):
        return jsonify({'error': 'BRD not found'}), 404
    
    with open(brd_path, 'r') as f:
        brd_data = json.load(f)
    
    return jsonify(brd_data)

# Serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)