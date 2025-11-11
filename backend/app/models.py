from pydantic import BaseModel, Field
from typing import List, Optional
import datetime

class DetailedStep(BaseModel):
    id: str = Field(..., example="step-1")
    title: str = Field(..., example="Schritt 1: Software öffnen")
    description: str = Field(..., example="Detaillierte Beschreibung...")
    clickPath: List[str] = Field(default_factory=list, example=["Menü", "Abrechnung"])
    expectedResult: str = Field(..., example="Bildschirm X sichtbar")
    duration: str = Field(..., example="2 Min")
    screenshots: List[str] = Field(default_factory=list, example=["gs://bucket/file.png"])
    branches: List[str] = Field(default_factory=list)
    subProcessLinks: List[str] = Field(default_factory=list)

class ProcessBase(BaseModel):
    name: str = Field(..., example="KV-Quartalsmeldung")
    category: str = Field(..., example="Finanzen")
    subcategory: str = Field(..., example="KV-Abrechnung")
    responsible: str = Field(..., example="GF")
    quickSteps: List[str] = Field(default_factory=list, example=["Schritt 1", "Schritt 2"])

class ProcessCreate(ProcessBase):
    pass

class Process(ProcessBase):
    id: str
    detailedSteps: List[DetailedStep] = Field(default_factory=list)
    createdAt: datetime.datetime

class ProcessInDB(Process):
    pass # In diesem Modell ist 'id' garantiert vorhanden
