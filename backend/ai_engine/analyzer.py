import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI API
openai.api_key = os.getenv('OPENAI_API_KEY')

def analyze_content(content):
    """
    Analyze document content using OpenAI API
    
    Args:
        content (str): Document content to analyze
        
    Returns:
        dict: Analysis results
    """
    if not content or len(content.strip()) == 0:
        raise ValueError("Empty content provided for analysis")
    
    try:
        # Create a system message that instructs the AI on how to analyze the content
        system_message = """
        You are an expert AI automation specialist. Analyze the provided document content and extract key information 
        needed for creating a Business Requirements Document (BRD) for an AI automation project. Focus on:
        
        1. Business objectives and goals
        2. Current processes that need automation
        3. Pain points and challenges
        4. Key stakeholders
        5. Success metrics and KPIs
        6. Technical constraints or requirements
        7. Timeline expectations
        8. Budget considerations
        9. Compliance or regulatory requirements
        10. Integration needs with existing systems
        
        Structure your analysis as a JSON object with these categories.
        """
        
        # Prepare content for analysis (truncate if too long)
        max_tokens = 16000  # Adjust based on model limits
        if len(content) > max_tokens * 4:  # Rough character to token ratio
            content = content[:max_tokens * 4] + "\n\n[Content truncated due to length]\n\n"
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4",  # Use appropriate model
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": content}
            ],
            temperature=0.2,  # Lower temperature for more focused analysis
            max_tokens=2000,  # Adjust as needed
            response_format={"type": "json_object"}
        )
        
        # Extract and parse the analysis
        analysis_text = response.choices[0].message.content
        analysis = eval(analysis_text)  # Convert string to dict
        
        return analysis
    
    except Exception as e:
        raise Exception(f"Error analyzing content with AI: {str(e)}")