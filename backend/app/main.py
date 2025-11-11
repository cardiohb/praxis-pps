from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
import app.firestore_service as firestore
import app.storage_service as storage
import app.gemini_service as gemini
import app.export_service as export
from app.models import ProcessCreate, Process, ProcessInDB, DetailedStep
import io

app = FastAPI(
    title="Praxis-Prozess-Dokumentation (PPS) API",
    description="Backend für das V3-Final Master-Konzept.",
    version="3.0.0"
)

# === PROZESS-ROUTEN ===

@app.post("/api/processes", response_model=Process, status_code=201)
def api_create_process(process_data: ProcessCreate):
    """Legt einen neuen Prozess-Stub an."""
    return firestore.create_process(process_data)

@app.get("/api/processes", response_model=List[ProcessInDB])
def api_list_processes():
    """Listet alle existierenden Prozesse auf."""
    return firestore.list_processes()

@app.get("/api/processes/{process_id}", response_model=ProcessInDB)
def api_get_process(process_id: str):
    """Holt die Details eines einzelnen Prozesses."""
    process = firestore.get_process(process_id)
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    return process

@app.put("/api/processes/{process_id}", response_model=ProcessInDB)
def api_update_process(process_id: str, update_data: Dict[str, Any]):
    """
    Aktualisiert einen Prozess. 
    Wird typischerweise verwendet, um 'detailedSteps' zu speichern.
    """
    process = firestore.update_process(process_id, update_data)
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    return process

# === SERVICE-ROUTEN (GEMINI, UPLOAD, EXPORT) ===

@app.post("/api/processes/{process_id}/gemini", response_model=ProcessInDB)
def api_run_gemini_structuring(process_id: str):
    """
    Triggert den Gemini-Service, um 'quickSteps' in 'detailedSteps' umzuwandeln.
    """
    process = firestore.get_process(process_id)
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
        
    # Gemini aufrufen
    try:
        detailed_steps_data = gemini.structure_process(process)
        # Pydantic validiert die Gemini-Antwort
        detailed_steps = [DetailedStep(**step) for step in detailed_steps_data]
        
        # In Firestore speichern
        update_data = {"detailedSteps": [step.model_dump() for step in detailed_steps]}
        updated_process = firestore.update_process(process_id, update_data)
        return updated_process
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini processing failed: {e}")

@app.post("/api/upload", response_model=Dict[str, str])
def api_upload_screenshot(file: UploadFile = File(...)):
    """Lädt einen Screenshot hoch und gibt die GCS-URL zurück."""
    try:
        gcs_url = storage.upload_file_to_gcs(file)
        return {"gcs_url": gcs_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {e}")

@app.post("/api/processes/{process_id}/export")
def api_export_process_as_word(process_id: str):
    """Generiert ein Word-Dokument (DOCX) für den Prozess."""
    process = firestore.get_process(process_id)
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
        
    try:
        word_bytes = export.export_to_word(process)
        
        return StreamingResponse(
            io.BytesIO(word_bytes),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f"attachment; filename={process.name.replace(' ', '_')}.docx"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {e}")

# === HEALTH CHECK ===

@app.get("/health", response_model=Dict[str, str])
def health_check():
    """Einfacher Health-Check-Endpunkt."""
    return {"status": "ok"}
