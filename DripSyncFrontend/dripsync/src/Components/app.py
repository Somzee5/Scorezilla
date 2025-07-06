from flask import Flask, request, jsonify
from PIL import Image, ImageDraw, ImageFont
from flask_cors import CORS
import io
import os
import base64

app = Flask(__name__)
CORS(app)

# Load the font and template paths
font_path = os.path.abspath('amsterdam-four.ttf')  # Absolute path for font
template_paths = {
    "1": os.path.abspath('1.png'),  # Participant template
    "2": os.path.abspath('2.png'),  # Winner template
    "3": os.path.abspath('3.png')   # Runner-up template
}

# Adjusted font size
font_size = 80  
font = ImageFont.truetype(font_path, font_size)

@app.route('/generate_certificate', methods=['POST'])
def generate_certificate():
    data = request.json

    # Check if data is received
    if not data or 'teamName' not in data or 'position' not in data:
        return jsonify({"error": "Team name and position are required."}), 400

    team_name = data["teamName"]
    position = str(data["position"])

    # Choose the appropriate template based on position
    template_path = template_paths.get(position, template_paths["1"])  # Default to participant template if position is not 1 or 2

    # Load the certificate template
    try:
        image = Image.open(template_path)
    except Exception as e:
        return jsonify({"error": f"Error loading template: {str(e)}"}), 500

    draw = ImageDraw.Draw(image)

    # Define the text position and draw the text
    text_position = (643, 593)  # Adjusted position
    draw.text(text_position, team_name, font=font, fill="black")

    # Save the image to a BytesIO object and encode it to base64
    img_io = io.BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)
    img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')

    # Return the image as a base64 string in JSON
    return jsonify({"certificate": img_base64})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
