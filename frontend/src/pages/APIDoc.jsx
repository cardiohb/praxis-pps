import { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';

const APIDoc = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const API_BASE_URL = 'https://pps-api-290754206795.europe-west3.run.app';

  const endpoints = [
    {
      method: 'GET',
      path: '/api/processes',
      description: 'Liste aller Prozesse abrufen',
      request: null,
      response: `{
  "processes": [
    {
      "id": "1",
      "name": "Patientenaufnahme",
      "status": "active",
      "category": "Anmeldung",
      "description": "...",
      "steps": [...],
      "created_at": "2025-11-12T20:00:00Z",
      "updated_at": "2025-11-12T20:00:00Z"
    }
  ]
}`,
      curl: `curl -X GET ${API_BASE_URL}/api/processes`,
    },
    {
      method: 'GET',
      path: '/api/processes/{id}',
      description: 'Einzelnen Prozess abrufen',
      request: null,
      response: `{
  "process": {
    "id": "1",
    "name": "Patientenaufnahme",
    "status": "active",
    "category": "Anmeldung",
    "description": "...",
    "steps": [...],
    "created_at": "2025-11-12T20:00:00Z",
    "updated_at": "2025-11-12T20:00:00Z"
  }
}`,
      curl: `curl -X GET ${API_BASE_URL}/api/processes/1`,
    },
    {
      method: 'POST',
      path: '/api/processes',
      description: 'Neuen Prozess erstellen',
      request: `{
  "name": "Neuer Prozess",
  "category": "Anmeldung",
  "description": "Prozessbeschreibung",
  "status": "draft",
  "steps": [
    {
      "order": 1,
      "title": "Erster Schritt",
      "description": "...",
      "responsible": "MFA"
    }
  ]
}`,
      response: `{
  "process": {
    "id": "2",
    "name": "Neuer Prozess",
    ...
  }
}`,
      curl: `curl -X POST ${API_BASE_URL}/api/processes \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Neuer Prozess",
    "category": "Anmeldung",
    "description": "Prozessbeschreibung",
    "status": "draft"
  }'`,
    },
    {
      method: 'PUT',
      path: '/api/processes/{id}',
      description: 'Prozess aktualisieren',
      request: `{
  "name": "Aktualisierter Name",
  "status": "active",
  ...
}`,
      response: `{
  "process": {
    "id": "1",
    "name": "Aktualisierter Name",
    ...
  }
}`,
      curl: `curl -X PUT ${API_BASE_URL}/api/processes/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Aktualisierter Name",
    "status": "active"
  }'`,
    },
    {
      method: 'DELETE',
      path: '/api/processes/{id}',
      description: 'Prozess löschen',
      request: null,
      response: `{
  "message": "Process deleted successfully"
}`,
      curl: `curl -X DELETE ${API_BASE_URL}/api/processes/1`,
    },
  ];

  const copyToClipboard = (text, endpoint) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'POST':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Dokumentation</h1>
        <p className="text-gray-600">
          Interaktive Dokumentation für die Praxis PPS API
        </p>
      </div>

      {/* Base URL */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h2>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
          <code className="text-blue-600">{API_BASE_URL}</code>
        </div>
      </div>

      {/* Authentication Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Authentication</h3>
        <p className="text-blue-800">
          Die API ist aktuell öffentlich zugänglich (--allow-unauthenticated).
          Für Produktions-Umgebungen sollte IAM-Authentifizierung aktiviert werden.
        </p>
      </div>

      {/* Endpoints */}
      <div className="space-y-6">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Endpoint Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded border ${getMethodColor(
                      endpoint.method
                    )}`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>
            </div>

            {/* Endpoint Body */}
            <div className="p-6">
              {/* Request */}
              {endpoint.request && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">Request Body</h4>
                    <button
                      onClick={() => copyToClipboard(endpoint.request, `${index}-request`)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      {copiedEndpoint === `${index}-request` ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Kopiert!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Kopieren</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <code>{endpoint.request}</code>
                  </pre>
                </div>
              )}

              {/* Response */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">Response</h4>
                  <button
                    onClick={() => copyToClipboard(endpoint.response, `${index}-response`)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {copiedEndpoint === `${index}-response` ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Kopieren</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                  <code>{endpoint.response}</code>
                </pre>
              </div>

              {/* cURL Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">cURL Beispiel</h4>
                  <button
                    onClick={() => copyToClipboard(endpoint.curl, `${index}-curl`)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {copiedEndpoint === `${index}-curl` ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Kopieren</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                  <code>{endpoint.curl}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Code Examples */}
      <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Code-Beispiele</h2>

        <div className="space-y-6">
          {/* JavaScript */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Code className="h-5 w-5 mr-2" />
              JavaScript (axios)
            </h3>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <code>{`import axios from 'axios';

const api = axios.create({
  baseURL: '${API_BASE_URL}',
  headers: { 'Content-Type': 'application/json' }
});

// Get all processes
const processes = await api.get('/api/processes');

// Create new process
const newProcess = await api.post('/api/processes', {
  name: 'Neuer Prozess',
  category: 'Anmeldung',
  status: 'draft'
});`}</code>
            </pre>
          </div>

          {/* Python */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Python (requests)
            </h3>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <code>{`import requests

API_URL = '${API_BASE_URL}'

# Get all processes
response = requests.get(f'{API_URL}/api/processes')
processes = response.json()

# Create new process
new_process = requests.post(
    f'{API_URL}/api/processes',
    json={
        'name': 'Neuer Prozess',
        'category': 'Anmeldung',
        'status': 'draft'
    }
)`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDoc;
