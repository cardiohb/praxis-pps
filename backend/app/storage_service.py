from google.cloud import storage
import os
import uuid
from fastapi import UploadFile

# Umgebungsvariablen werden vom Cloud Run Service bereitgestellt (siehe cloudbuild.yaml)
BUCKET_NAME = os.environ.get("BUCKET_NAME")

# Storage-Client initialisieren
storage_client = storage.Client()

def upload_file_to_gcs(file: UploadFile) -> str:
    """
    Lädt eine Datei in den GCS-Bucket hoch und gibt die 'gs://' URL zurück.
    """
    if not BUCKET_NAME:
        raise ValueError("BUCKET_NAME Umgebungsvariable nicht gesetzt.")
        
    bucket = storage_client.bucket(BUCKET_NAME)
    
    # Eindeutigen Dateinamen generieren, um Überschreibungen zu verhindern
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
    blob_name = f"screenshots/{uuid.uuid4()}.{file_extension}"
    blob = bucket.blob(blob_name)
    
    # Dateiinhalt in den Blob streamen
    blob.upload_from_file(file.file)
    
    # gs:// URL für die Referenz in Firestore zurückgeben
    return f"gs://{BUCKET_NAME}/{blob_name}"
