import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, X, Plus, Trash2 } from 'lucide-react';
import { processApi, getErrorMessage } from '../services/api';
import { useProcess } from '../hooks/useProcess';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProcessNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { process: existingProcess, loading: loadingExisting } = useProcess(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Anmeldung',
    description: '',
    status: 'draft',
    steps: [],
  });
  const [quickStepsText, setQuickStepsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form with existing process data when editing
  useState(() => {
    if (existingProcess && isEditMode) {
      setFormData({
        name: existingProcess.name || '',
        category: existingProcess.category || 'Anmeldung',
        description: existingProcess.description || '',
        status: existingProcess.status || 'draft',
        steps: existingProcess.steps || [],
      });
      // Convert existing steps to quick text
      if (existingProcess.steps && existingProcess.steps.length > 0) {
        const quickText = existingProcess.steps.map(s => s.title).join('\n');
        setQuickStepsText(quickText);
      }
    }
  }, [existingProcess, isEditMode]);

  const categories = [
    'Anmeldung',
    'Aufnahme',
    'Untersuchung',
    'Befundung',
    'Abrechnung',
    'Dokumentation',
    'Sonstiges',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickStepsConvert = () => {
    const lines = quickStepsText.split('\n').filter(line => line.trim());
    const steps = lines.map((line, index) => ({
      order: index + 1,
      title: line.trim(),
      description: '',
      responsible: 'MFA',
      duration: null,
      critical: false,
    }));
    setFormData(prev => ({ ...prev, steps }));
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const handleAddStep = () => {
    const newStep = {
      order: formData.steps.length + 1,
      title: '',
      description: '',
      responsible: 'MFA',
      duration: null,
      critical: false,
    };
    setFormData(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const handleRemoveStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    // Reorder steps
    newSteps.forEach((step, i) => {
      step.order = i + 1;
    });
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      if (isEditMode) {
        await processApi.update(id, formData);
      } else {
        await processApi.create(formData);
      }

      navigate('/');
    } catch (err) {
      console.error('Error saving process:', err);
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loadingExisting && isEditMode) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner text="Prozess wird geladen..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Zurück zur Übersicht</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Prozess bearbeiten' : 'Neuen Prozess erstellen'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditMode ? 'Aktualisiere die Prozess-Informationen' : 'Erstelle einen neuen Praxis-Prozess in 3 Schritten'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage error={error} />
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-2 text-gray-600">
                  {step === 1 && 'Basis'}
                  {step === 2 && 'Quick Steps'}
                  {step === 3 && 'Details'}
                </span>
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prozessname *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="z.B. Patientenaufnahme"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Beschreibe den Prozess..."
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 Zeichen
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Entwurf</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Aktiv</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Quick Steps */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schnelle Schritt-Erfassung
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Gib jeden Schritt in einer neuen Zeile ein. Diese können im nächsten Schritt detailliert werden.
              </p>
              <textarea
                value={quickStepsText}
                onChange={(e) => setQuickStepsText(e.target.value)}
                placeholder="Termin prüfen&#10;Stammdaten anlegen&#10;Versicherung prüfen"
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
            <button
              onClick={handleQuickStepsConvert}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              In Schritte umwandeln ({quickStepsText.split('\n').filter(l => l.trim()).length} Schritte)
            </button>
          </div>
        )}

        {/* Step 3: Detailed Steps */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detaillierte Schritte ({formData.steps.length})
              </h3>
              <button
                onClick={handleAddStep}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Schritt hinzufügen</span>
              </button>
            </div>

            {formData.steps.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">Keine Schritte definiert</p>
                <button
                  onClick={handleAddStep}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Ersten Schritt hinzufügen
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.steps.map((step, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Schritt {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveStep(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titel *
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                          placeholder="z.B. Termin prüfen"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Beschreibung
                        </label>
                        <textarea
                          value={step.description}
                          onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                          placeholder="Detaillierte Beschreibung..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Zuständigkeit
                          </label>
                          <select
                            value={step.responsible}
                            onChange={(e) => handleStepChange(index, 'responsible', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Arzt">Arzt</option>
                            <option value="MFA">MFA</option>
                            <option value="Verwaltung">Verwaltung</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dauer (min)
                          </label>
                          <input
                            type="number"
                            value={step.duration || ''}
                            onChange={(e) => handleStepChange(index, 'duration', parseInt(e.target.value) || null)}
                            placeholder="z.B. 5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={step.critical || false}
                            onChange={(e) => handleStepChange(index, 'critical', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Kritischer Schritt</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Zurück</span>
        </button>

        <div className="flex space-x-3">
          <Link
            to="/"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Abbrechen
          </Link>

          {currentStep < 3 ? (
            <button
              onClick={() => {
                if (currentStep === 2) {
                  handleQuickStepsConvert();
                }
                setCurrentStep(currentStep + 1);
              }}
              disabled={currentStep === 1 && !formData.name}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentStep === 1 && !formData.name
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <span>Weiter</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving || !formData.name}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                saving || !formData.name
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {saving ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Speichert...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Speichern</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessNew;
