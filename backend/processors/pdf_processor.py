import PyPDF2
import os

def process_pdf(filepath):
    """
    Extract text content from a PDF file
    
    Args:
        filepath (str): Path to the PDF file
        
    Returns:
        str: Extracted text content
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"PDF file not found: {filepath}")
    
    text_content = ""
    
    try:
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            
            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                text_content += page.extract_text() + "\n\n"
    
    except Exception as e:
        raise Exception(f"Error processing PDF: {str(e)}")
    
    return text_content