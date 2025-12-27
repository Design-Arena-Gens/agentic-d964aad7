'use client';

import { useState } from 'react';
import { Mail, Send, AlertCircle, CheckCircle, Trash2, Edit, FileText, Clock, User, Briefcase } from 'lucide-react';

interface EmailResponse {
  subject: string;
  body: string;
  remarks: string;
  category: 'professional' | 'personal' | 'urgent';
  tone: string;
}

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  category?: 'professional' | 'personal' | 'urgent';
  timestamp: Date;
}

export default function Home() {
  const [emailInput, setEmailInput] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  const [response, setResponse] = useState<EmailResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailHistory, setEmailHistory] = useState<Email[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editedResponse, setEditedResponse] = useState('');

  const analyzeEmail = (content: string, subject: string): EmailResponse => {
    const lowerContent = content.toLowerCase();
    const lowerSubject = subject.toLowerCase();

    // Determine category
    let category: 'professional' | 'personal' | 'urgent' = 'personal';
    const urgentKeywords = ['urgent', 'asap', 'immédiat', 'rapidement', 'important'];
    const professionalKeywords = ['réunion', 'meeting', 'projet', 'contrat', 'facture', 'devis', 'société', 'entreprise'];

    if (urgentKeywords.some(kw => lowerContent.includes(kw) || lowerSubject.includes(kw))) {
      category = 'urgent';
    } else if (professionalKeywords.some(kw => lowerContent.includes(kw) || lowerSubject.includes(kw))) {
      category = 'professional';
    }

    // Detect tone and intent
    const isQuestion = content.includes('?');
    const isRequest = lowerContent.includes('pouvez-vous') || lowerContent.includes('pourriez-vous') ||
                      lowerContent.includes('merci de') || lowerContent.includes('please');
    const isComplaint = lowerContent.includes('problème') || lowerContent.includes('erreur') ||
                        lowerContent.includes('déçu') || lowerContent.includes('insatisfait');

    // Generate appropriate response
    let responseBody = '';
    let remarks = '';
    let tone = 'professionnel et bienveillant';

    if (category === 'urgent') {
      tone = 'réactif et efficace';
      responseBody = `Bonjour,

Je vous remercie pour votre message. J'ai bien pris note du caractère urgent de votre demande.

${isQuestion ? 'Concernant votre question, ' : ''}${isRequest ? 'Je vais traiter votre demande en priorité et ' : ''}Je reviendrai vers vous dans les plus brefs délais avec une réponse détaillée.

Dans l'intervalle, n'hésitez pas à me contacter si vous avez besoin d'informations complémentaires.

Cordialement,
[Votre nom]`;
      remarks = '⚠️ Email marqué comme urgent - réponse priorisée. Vérifiez si des actions immédiates sont nécessaires.';
    } else if (category === 'professional') {
      if (isComplaint) {
        tone = 'empathique et professionnel';
        responseBody = `Bonjour,

Je vous remercie d'avoir pris le temps de me contacter.

Je comprends votre préoccupation et je suis désolé(e) pour les désagréments que vous avez rencontrés. Votre retour est précieux et me permet d'améliorer mes services.

Je vais examiner la situation en détail et vous proposer une solution adaptée dans les meilleurs délais.

Je reste à votre disposition pour toute information complémentaire.

Cordialement,
[Votre nom]`;
        remarks = '💼 Email professionnel avec réclamation - ton empathique recommandé. Proposez une solution concrète si possible.';
      } else if (isRequest) {
        responseBody = `Bonjour,

Je vous remercie pour votre message.

J'ai bien pris note de votre demande concernant ${subject || 'ce sujet'}. Je vais l'étudier attentivement et reviendrai vers vous avec les informations nécessaires.

${isQuestion ? 'Pour répondre à votre question, je dois rassembler quelques éléments. ' : ''}Je m'engage à vous fournir une réponse complète d'ici [préciser délai].

Restant à votre disposition,

Cordialement,
[Votre nom]`;
        remarks = '💼 Email professionnel avec demande. Personnalisez le délai de réponse et ajoutez des détails spécifiques si nécessaire.';
      } else {
        responseBody = `Bonjour,

Je vous remercie pour votre message.

J'ai bien pris connaissance de votre email et des informations que vous m'avez transmises.

${isQuestion ? 'Concernant votre question, je vais vous apporter une réponse détaillée sous peu.' : 'Je reviendrai vers vous prochainement avec un retour complet.'}

N'hésitez pas à me recontacter si vous avez des questions complémentaires.

Cordialement,
[Votre nom]`;
        remarks = '💼 Email professionnel standard. Adaptez le contenu selon le contexte spécifique de l\'échange.';
      }
    } else {
      // Personal email
      tone = 'chaleureux et bienveillant';
      if (isQuestion) {
        responseBody = `Bonjour,

Merci beaucoup pour ton message !

${isRequest ? 'Bien sûr, je vais regarder ça avec plaisir. ' : 'Concernant ta question, '}Je vais te répondre plus en détail très bientôt.

N'hésite pas si tu as d'autres questions !

Amicalement,
[Votre prénom]`;
        remarks = '👤 Email personnel avec question. Vous pouvez adopter un ton plus détendu et personnalisé.';
      } else {
        responseBody = `Bonjour,

Merci pour ton message, ça me fait plaisir d'avoir de tes nouvelles !

Je te remercie pour ces informations. Je prends note et je reviens vers toi très vite.

À bientôt !

Amicalement,
[Votre prénom]`;
        remarks = '👤 Email personnel. N\'hésitez pas à adapter le ton selon votre relation avec l\'expéditeur.';
      }
    }

    return {
      subject: `Re: ${subject}`,
      body: responseBody,
      remarks,
      category,
      tone
    };
  };

  const generateResponse = () => {
    if (!emailInput.trim()) return;

    setIsGenerating(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const generatedResponse = analyzeEmail(emailInput, emailSubject);
      setResponse(generatedResponse);
      setEditedResponse(generatedResponse.body);
      setIsGenerating(false);

      // Add to history
      const newEmail: Email = {
        id: Date.now().toString(),
        from: emailFrom || 'Expéditeur inconnu',
        subject: emailSubject || 'Sans objet',
        body: emailInput,
        category: generatedResponse.category,
        timestamp: new Date()
      };
      setEmailHistory([newEmail, ...emailHistory]);
    }, 1500);
  };

  const approveResponse = () => {
    if (response) {
      alert('✅ Réponse approuvée ! Dans une version complète, cette réponse serait envoyée via votre client email.');
      resetForm();
    }
  };

  const resetForm = () => {
    setEmailInput('');
    setEmailSubject('');
    setEmailFrom('');
    setResponse(null);
    setEditMode(false);
    setEditedResponse('');
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'professional':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'personal':
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Assistant Email Professionnel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gestion intelligente et rédaction assistée de vos emails
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Panel - Email Input */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Email reçu
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    De (optionnel)
                  </label>
                  <input
                    type="text"
                    value={emailFrom}
                    onChange={(e) => setEmailFrom(e.target.value)}
                    placeholder="nom@example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Objet
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Objet de l'email..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contenu de l'email
                  </label>
                  <textarea
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Collez ici le contenu de l'email reçu..."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <button
                  onClick={generateResponse}
                  disabled={!emailInput.trim() || isGenerating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Générer une réponse
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response Section */}
            {response && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Réponse proposée
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                      {response.category === 'urgent' && '⚡ Urgent'}
                      {response.category === 'professional' && '💼 Professionnel'}
                      {response.category === 'personal' && '👤 Personnel'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Objet du mail
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                      <p className="text-gray-800 dark:text-white">{response.subject}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ton adopté : <span className="text-indigo-600">{response.tone}</span>
                    </label>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Réponse
                      </label>
                      {!editMode && (
                        <button
                          onClick={() => setEditMode(true)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </button>
                      )}
                    </div>
                    {editMode ? (
                      <textarea
                        value={editedResponse}
                        onChange={(e) => setEditedResponse(e.target.value)}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                        <pre className="whitespace-pre-wrap text-gray-800 dark:text-white font-sans">
                          {editedResponse}
                        </pre>
                      </div>
                    )}
                  </div>

                  {response.remarks && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Remarques
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {response.remarks}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={approveResponse}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      ✅ Approuver et envoyer
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Email History */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Historique
              </h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {emailHistory.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                    Aucun email traité pour le moment
                  </p>
                ) : (
                  emailHistory.map((email) => (
                    <div
                      key={email.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(email.category)}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {email.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white mb-1 truncate">
                        {email.subject}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        De: {email.from}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            ℹ️ Comment ça fonctionne ?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-medium text-gray-800 dark:text-white mb-1">1. Analyse intelligente</p>
              <p>L'assistant analyse le ton, le contexte et les intentions de chaque email reçu.</p>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white mb-1">2. Réponse adaptée</p>
              <p>Une réponse professionnelle est générée avec le ton approprié (personnel, professionnel, urgent).</p>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white mb-1">3. Validation humaine</p>
              <p>Vous pouvez modifier et valider chaque réponse avant l'envoi. Le contrôle reste entre vos mains.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
