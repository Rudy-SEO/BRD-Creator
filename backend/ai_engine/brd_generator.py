import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI API
openai.api_key = os.getenv('OPENAI_API_KEY')

def generate_brd(analysis):
    """
    Generate a Business Requirements Document from analysis
    
    Args:
        analysis (dict): Analysis results from the analyzer
        
    Returns:
        dict: Structured BRD document
    """
    if not analysis:
        raise ValueError("No analysis provided for BRD generation")
    
    try:
        # Create a system message that instructs the AI on how to generate the BRD
        system_message = """
        You are an expert in creating Business Requirements Documents (BRDs) for AI automation projects.
        Using the provided analysis, create a comprehensive BRD with the following sections:
        
        1. Executive Summary
        2. Project Background
        3. Business Objectives
        4. Scope
        5. Current Process Analysis
        6. Requirements
           a. Functional Requirements
           b. Non-Functional Requirements
           c. Technical Requirements
        7. Stakeholders
        8. Success Criteria
        9. Constraints
        10. Assumptions
        11. Risks and Mitigation
        12. Timeline
        13. Budget
        14. Approval
        
        Format the BRD as a structured JSON object with these sections.
        For each section, provide detailed and specific content based on the analysis.
        """
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4",  # Use appropriate model
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": str(analysis)}
            ],
            temperature=0.3,
            max_tokens=4000,  # Adjust as needed
            response_format={"type": "json_object"}
        )
        
        # Extract and parse the BRD
        brd_text = response.choices[0].message.content
        brd = eval(brd_text)  # Convert string to dict
        
        return brd
    
    except Exception as e:
        raise Exception(f"Error generating BRD: {str(e)}")