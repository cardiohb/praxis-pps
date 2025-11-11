# gemini_service.py
from google.genai import Client
from google.genai.types import GenerateContentConfig
import os
import json
from app.models import Process

# Client initialisieren (Vertex AI Backend)
# Umgebungsvariablen werden vom Cloud Run Service bereitgestellt
client = Client(
    vertexai=True,
    project=os.environ.get('GCP_PROJECT_ID'),
    location=os.environ.get('GCP_REGION', 'europe-west3')
)

def structure_process(process_data: Process) -> list:
    """
    Nutzt Gemini 2.5 Flash, um Quick-Steps in detaillierte Schritte umzuwandeln.
    """
    prompt = f"""
Du bist ein Prozessdokumentations-Experte.

PROZESS: {process_data.name}
KATEGORIE: {process_data.category}

GROBE SCHRITTE:
{'\n'.join([f"{i+1}. {s}" for i, s in enumerate(process_data.quickSteps)])}

AUFGABE: Wandle in detaillierte Schritte um.
Für jeden Schritt: Titel, Beschreibung (200 Wörter), Klickpfad, Ergebnis, Dauer.

FORMAT: JSON-Array, kein Markdown.

BEISPIEL:
[
  {{
    "id": "step-1",
    "title": "Schritt 1: Software öffnen",
    "description": "...",
    "clickPath": ["Menü", "Abrechnung"],
    "expectedResult": "Bildschirm X sichtbar",
    "duration": "2 Min",
    "screenshots": [],
    "branches": [],
    "subProcessLinks": []
  }}
]
    """
    
    # Neuer API-Call (google-genai SDK)
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=GenerateContentConfig(
            temperature=0.2,
            max_output_tokens=2048
        )
    )
    
    # Parse JSON aus Response
    response_text = response.text.strip()
    response_text = response_text.replace("```json", "").replace("```", "").strip()
    
    return json.loads(response_text)
