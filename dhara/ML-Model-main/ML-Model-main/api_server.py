"""
Dhara - Ayurveda ML Chatbot API
Flask service wrapping the ML model for the Dhara platform.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from ayurveda_bot import (
    calculate_dosha,
    get_imbalance,
    get_advice,
    extract_symptoms,
    get_advanced_questions,
    calculate_advanced_dosha,
)

app = Flask(__name__)
CORS(app)


# ── Quick Option Responses ──
QUICK_OPTIONS = {
    "1": "START_QUIZ",
    "2": "Stress may indicate Vata imbalance. Try warm tea, deep breathing & early sleep.",
    "3": "Eat warm, freshly cooked meals. Avoid processed & cold foods.",
    "4": "Sleep tip: Oil massage feet, avoid screens before bed, drink warm milk.",
    "5": "Boost energy with ginger tea, morning sunlight & light exercise.",
    "6": "Seasonal tip: Eat according to weather. Prefer cooling foods in summer & warm foods in winter.",
}


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "dhara-ml-chatbot"})


@app.route("/api/chatbot/query", methods=["POST"])
def chatbot_query():
    """
    Main chatbot endpoint.
    Accepts: { "message": "...", "context": "..." }
    Returns: { "response": "...", "type": "text|quiz|analysis", "data": {...} }
    """
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Message is required"}), 400

    message = data["message"].strip()
    context = data.get("context", "")

    # ── Handle Quiz Submission ──
    if message == "QUIZ_SUBMISSION" and context and "answers" in context:
        answers = context["answers"]
        # Convert to list of tuples if needed, or assume correct format
        # js format: [[q_idx, o_idx], ...]
        answer_tuples = [(a[0], a[1]) for a in answers]
        
        scores = calculate_advanced_dosha(answer_tuples)
        imbalance = get_imbalance(scores)
        advice = get_advice(imbalance)

        return jsonify({
            "response": f"Your dosha assessment is complete! Detected imbalance: **{imbalance}**",
            "type": "analysis",
            "data": {
                "scores": scores,
                "imbalance": imbalance,
                "advice": {
                    "diet": advice["diet"],
                    "lifestyle": advice["lifestyle"],
                    "avoid": advice["avoid"],
                },
            },
        })

    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    # ── Check for quick options (1-7) ──
    if message in QUICK_OPTIONS:
        reply = QUICK_OPTIONS[message]
        if reply == "START_QUIZ":
            questions = get_advanced_questions()
            formatted_questions = []
            for q in questions:
                formatted_questions.append({
                    "question": q["question"],
                    "options": [opt[0] for opt in q["options"]],
                })
            return jsonify({
                "response": "Let's assess your dosha balance. Please answer the following questions.",
                "type": "quiz",
                "data": {"questions": formatted_questions},
            })
        return jsonify({"response": reply, "type": "text"})

    # ── Check for greetings ──
    lower = message.lower()
    if lower in ["hello", "hi", "hey", "namaste"]:
        return jsonify({
            "response": "Namaste! 🙏 I'm Dhara, your Ayurveda wellness assistant. How can I help you today? You can describe your symptoms, ask about diet, or type a number (1-6) for quick options.",
            "type": "text",
        })

    if lower in ["exit", "bye", "quit"]:
        return jsonify({
            "response": "Stay healthy & balanced. Namaste 🙏",
            "type": "text",
        })

    # ── Natural symptom detection ──
    symptoms = extract_symptoms(message)

    if symptoms:
        scores = calculate_dosha(symptoms)
        imbalance = get_imbalance(scores)
        advice = get_advice(imbalance)

        return jsonify({
            "response": f"Based on your symptoms, I detect a potential **{imbalance}** imbalance.",
            "type": "analysis",
            "data": {
                "scores": scores,
                "imbalance": imbalance,
                "advice": {
                    "diet": advice["diet"],
                    "lifestyle": advice["lifestyle"],
                    "avoid": advice["avoid"],
                },
                "symptoms_detected": symptoms,
            },
        })

    # ── Fallback ──
    return jsonify({
        "response": "I understand. Ayurveda focuses on balance. Could you describe your symptoms (e.g., 'I feel anxious and have dry skin') or choose a quick option (1-6)?",
        "type": "text",
    })


@app.route("/api/chatbot/quiz", methods=["POST"])
def chatbot_quiz():
    """
    Process quiz answers.
    Accepts: { "answers": [[q_idx, o_idx], ...] }
    Returns: dosha analysis with advice
    """
    data = request.get_json()
    if not data or "answers" not in data:
        return jsonify({"error": "Answers are required"}), 400

    answers = data["answers"]
    # Convert to list of tuples
    answer_tuples = [(a[0], a[1]) for a in answers]

    scores = calculate_advanced_dosha(answer_tuples)
    imbalance = get_imbalance(scores)
    advice = get_advice(imbalance)

    return jsonify({
        "response": f"Your dosha assessment is complete! Detected imbalance: **{imbalance}**",
        "type": "analysis",
        "data": {
            "scores": scores,
            "imbalance": imbalance,
            "advice": {
                "diet": advice["diet"],
                "lifestyle": advice["lifestyle"],
                "avoid": advice["avoid"],
            },
        },
    })


@app.route("/api/chatbot/questions", methods=["GET"])
def get_questions():
    """Returns the advanced dosha quiz questions."""
    questions = get_advanced_questions()
    formatted = []
    for q in questions:
        formatted.append({
            "question": q["question"],
            "options": [opt[0] for opt in q["options"]],
        })
    return jsonify({"questions": formatted})


if __name__ == "__main__":
    print("🌿 Dhara ML Chatbot API starting on port 5001...")
    app.run(host="0.0.0.0", port=5001, debug=True)
