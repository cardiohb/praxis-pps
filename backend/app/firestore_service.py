from google.cloud import firestore
import datetime
from typing import List, Dict, Any
from app.models import ProcessCreate, ProcessInDB, DetailedStep, Process

# Firestore-Client initialisieren
# Die Authentifizierung erfolgt automatisch über das Runtime Service Account in Cloud Run
db = firestore.Client()
PROCESSES_COLLECTION = "processes"

def create_process(process_data: ProcessCreate) -> Process:
    """Erstellt einen neuen Prozess in Firestore."""
    doc_ref = db.collection(PROCESSES_COLLECTION).document()
    
    process_dict = process_data.model_dump()
    process_dict["createdAt"] = datetime.datetime.now(datetime.timezone.utc)
    process_dict["detailedSteps"] = [] # Startet leer
    
    doc_ref.set(process_dict)
    
    return Process(id=doc_ref.id, **process_dict)

def get_process(process_id: str) -> Optional[ProcessInDB]:
    """Holt einen einzelnen Prozess anhand seiner ID."""
    doc = db.collection(PROCESSES_COLLECTION).document(process_id).get()
    if not doc.exists:
        return None
    
    data = doc.to_dict()
    data["id"] = doc.id
    return ProcessInDB(**data)

def list_processes() -> List[ProcessInDB]:
    """Listet alle Prozesse auf (vereinfacht)."""
    processes = []
    docs = db.collection(PROCESSES_COLLECTION).order_by(
        "createdAt", direction=firestore.Query.DESCENDING
    ).stream()
    
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        processes.append(ProcessInDB(**data))
        
    return processes

def update_process(process_id: str, update_data: Dict[str, Any]) -> Optional[ProcessInDB]:
    """Aktualisiert einen Prozess (z.B. detailedSteps)."""
    doc_ref = db.collection(PROCESSES_COLLECTION).document(process_id)
    
    # Sicherstellen, dass das Dokument existiert, bevor es aktualisiert wird
    if not doc_ref.get().exists:
        return None
    
    # Firestore 'update' verwenden, um Felder zu überschreiben oder hinzuzufügen
    doc_ref.update(update_data)
    
    # Die aktualisierten Daten abrufen und zurückgeben
    return get_process(process_id)
