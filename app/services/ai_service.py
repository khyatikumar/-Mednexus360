import json
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from app.core.config import settings


MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_MODEL = "mistral-small-latest"


def _create_chat_completion(
    prompt: str,
    temperature: float
) -> str:

    payload = json.dumps(
        {
            "model": MISTRAL_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": temperature
        }
    ).encode("utf-8")

    request = Request(
        MISTRAL_API_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {settings.MISTRAL_API_KEY}",
            "Content-Type": "application/json"
        },
        method="POST"
    )

    try:
        with urlopen(request, timeout=30) as response:
            response_data = json.loads(
                response.read().decode("utf-8")
            )

    except HTTPError as exc:
        error_detail = exc.read().decode("utf-8")
        raise RuntimeError(
            f"Mistral API request failed: {error_detail}"
        ) from exc

    return response_data["choices"][0]["message"]["content"]


def analyze_symptoms(
    symptoms: str
):

    prompt = f"""
You are a healthcare assistant.

Analyze the following symptoms:

{symptoms}

Return ONLY valid JSON.

Example:

{{
    "possible_conditions": [
        "Condition 1",
        "Condition 2"
    ],
    "recommended_specialist":
    "General Physician",
    "urgency_level":
    "Low"
}}

Do not include markdown.
Do not include explanations.
Return JSON only.
"""

    result = _create_chat_completion(
        prompt,
        temperature=0.2
    )

    return json.loads(result)


def get_specialist(
    symptoms: str
):

    prompt = f"""
Symptoms:

{symptoms}

Return ONLY the medical specialist.

Examples:

fever, cough
General Physician

chest pain
Cardiologist

skin rash
Dermatologist

Return specialist only.
"""

    return _create_chat_completion(
        prompt,
        temperature=0
    ).strip()