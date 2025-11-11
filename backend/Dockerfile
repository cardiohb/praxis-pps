FROM python:3.11-slim

WORKDIR /app

# System dependencies (minimal)
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

# FIX #3: Non-root User erstellen
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App code
COPY app/ ./app/

# Ownership an appuser übertragen
RUN chown -R appuser:appgroup /app

# FIX #3: Als appuser starten (nicht root)
USER appuser

# Cloud Run nutzt PORT Env-Var
ENV PORT=8080
EXPOSE 8080

# Gunicorn (Production WSGI)
CMD exec gunicorn --bind :$PORT --workers 1 --threads 2 --worker-class uvicorn.workers.UvicornWorker app.main:app
