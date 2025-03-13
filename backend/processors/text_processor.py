import os
import docx

def process_text(filepath):
    """
    Extract text content from a text file or Word document
    
    Args:
        filepath (str): Path to the text file or Word document
        
    Returns:
        str: Extracted text content
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Text file not found: {filepath}")
    
    file_extension = filepath.rsplit('.', 1)[1].lower()
    text_content = ""
    
    try:
        if file_extension == 'txt':
            with open(filepath, 'r', encoding='utf-8') as file:
                text_content = file.read()
        
        elif file_extension in ['doc', 'docx']:
            # For simplicity, we're only handling docx here
            # For doc files, additional libraries would be needed
            if file_extension == 'docx':
                doc = docx.Document(filepath)
                text_content = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
            else:
                raise Exception("Legacy .doc format not supported. Please convert to .docx")
    
    except Exception as e:
        raise Exception(f"Error processing text file: {str(e)}")
    
    return text_content