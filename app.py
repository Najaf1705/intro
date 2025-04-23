import fitz
from flask import Flask, request, jsonify
from ollama import Client
import logging
from flask_cors import CORS  # Add CORS to allow frontend requests
import json  # Import json module for JSON operations

# Configure logging
logging.basicConfig(level=logging.DEBUG)

client = Client(host='http://localhost:11434')
MODEL_NAME = 'llama2:7b'
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# 💾 In-memory session (you can replace with db later)
session_data = {
    "resume_text": "",
    "job_role": "",
    "experience": "",
    "questions": [],
    "answers": [],
    "current_q_index": 0
}

# Core LLM interaction
def ask_llama(prompt: str) -> str:
    logging.debug(f"Sending prompt to LLM: {prompt}")
    try:
        res = client.chat(model=MODEL_NAME, messages=[{'role': 'user', 'content': prompt}])
        response = res['message']['content'].strip()
        logging.debug(f"Received response from LLM: {response}")
        return response
    except Exception as e:
        logging.error(f"Error communicating with LLM: {e}")
        return "Error: Unable to process the request."

# PDF Reader
def extract_text_from_pdf(pdf_path):
    logging.debug(f"Extracting text from PDF: {pdf_path}")
    try:
        doc = fitz.open(pdf_path)
        text = "".join([page.get_text() for page in doc])
        doc.close()
        logging.debug(f"Extracted text (truncated): {text[:500]}")  # Log first 500 characters
        return text.strip()[:2000]
    except Exception as e:
        logging.error(f"Error extracting text from PDF: {e}")
        return ""

def extract_job_role(text):
    logging.debug("Extracting job role from resume text.")
    prompt = f"""Extract the most relevant job role the candidate is suited for from the resume below.
Return only the job title in one or two words. Do not include any additional text.

Resume:
{text}"""
    response = ask_llama(prompt)
    logging.debug(f"Job role extracted: {response}")
    return response

def extract_experience_years(text):
    logging.debug("Extracting experience years from resume text.")
    prompt = f"""Estimate the total years of professional experience from the resume below.
Return only a single number (e.g., 2 or 3.5). Do not include any additional text.

Resume:
{text}"""
    response = ask_llama(prompt)
    logging.debug(f"Experience years extracted: {response}")
    return response

def generate_questions(text, role, experience):
    logging.debug(f"Generating questions for role: {role}, experience: {experience}")
    prompt = f"""Generate 5 tailored and relevant interview questions in JSON format.
Each question should be a separate entry in the JSON array. Do not include any additional text.

Job Role: {role}
Experience: {experience} years

Resume:
{text}

Return only the JSON array of questions."""
    response = ask_llama(prompt)
    logging.debug(f"Questions generated: {response}")
    return response

def evaluate_answer(question, answer):
    logging.debug(f"Evaluating answer for question: {question}")
    prompt = f"""Evaluate this interview answer based on:
- Correctness (50%)
- Clarity (25%)
- Relevance (25%)

Question: {question}
Answer: {answer}

Return a score out of 10 and a short feedback."""
    return ask_llama(prompt)

# 🎯 API 1: Resume Upload
@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    logging.debug("Received request to upload resume.")
    if 'resume' not in request.files:
        logging.error("No file part in the request.")
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['resume']
    if file.filename == '':
        logging.error("No selected file.")
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith('.pdf'):
        logging.error("Invalid file type. Only PDFs are allowed.")
        return jsonify({"error": "Invalid file type. Only PDFs are allowed."}), 400

    path = f'temp_{file.filename}'
    try:
        logging.debug(f"Saving uploaded file to: {path}")
        file.save(path)

        resume_text = extract_text_from_pdf(path)
        if not resume_text:
            return jsonify({"error": "Failed to extract text from the PDF."}), 500

        job_role = extract_job_role(resume_text)
        experience = extract_experience_years(resume_text)
        questions_and_answers_raw = generate_questions(resume_text, job_role, experience)

        # Parse questions and answers from JSON response
        try:
            questions_and_answers = json.loads(questions_and_answers_raw)
            logging.debug(f"Parsed questions and answers: {questions_and_answers}")
        except json.JSONDecodeError as e:
            logging.error(f"Error parsing questions and answers JSON: {e}")
            return jsonify({"error": "Failed to parse questions and answers from the response."}), 500

        # Save session data
        session_data.update({
            "resume_text": resume_text,
            "job_role": job_role,
            "experience": experience,
            "questions": questions_and_answers,
            "answers": [],
            "current_q_index": 0
        })

        logging.info("Resume processed successfully.")
        return jsonify({
            "message": "Resume processed successfully",
            "job_role": job_role,
            "experience_years": experience,
            "questions_and_answers": questions_and_answers
        })
    except Exception as e:
        logging.error(f"Error processing resume: {e}")
        return jsonify({"error": "An error occurred while processing the resume."}), 500

# 🎯 API 2: Get One Question at a Time
@app.route('/get_question', methods=['GET'])
def get_question():
    logging.debug("Received request to get a question.")
    index = session_data["current_q_index"]
    if index < len(session_data["questions"]):
        question = session_data["questions"][index]
        logging.debug(f"Returning question: {question}")
        return jsonify({"question": question})
    else:
        logging.warning("All questions served.")
        return jsonify({"message": "All questions served."}), 404

# 🎯 API 3: Submit Answer
@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    logging.debug("Received request to submit an answer.")
    data = request.json
    answer = data.get("answer")
    index = session_data["current_q_index"]

    if index >= len(session_data["questions"]):
        logging.error("No more questions to answer.")
        return jsonify({"message": "No more questions to answer."}), 400

    question = session_data["questions"][index]
    feedback = evaluate_answer(question, answer)

    session_data["answers"].append({
        "question": question,
        "answer": answer,
        "feedback": feedback
    })

    session_data["current_q_index"] += 1
    logging.info(f"Answer submitted. Feedback: {feedback}")
    return jsonify({"message": "Answer submitted", "feedback": feedback})

# 🎯 API 4: Final Feedback Summary
@app.route('/get_feedback', methods=['GET'])
def get_feedback():
    logging.debug("Received request to get feedback summary.")
    return jsonify({
        "answers": session_data["answers"],
        "final_remark": f"Interview completed for {session_data['job_role']} with {session_data['experience']} years of experience."
    })

# Add a root route
@app.route('/')
def home():
    logging.debug("Received request for root route.")
    return jsonify({"message": "Welcome to the Resume Processing API!"})

# Optionally handle favicon.ico requests
@app.route('/favicon.ico')
def favicon():
    return '', 204  # Return no content for favicon requests

# 🧪 Run
if __name__ == '__main__':
    logging.info("Starting Flask app.")
    app.run(debug=True)