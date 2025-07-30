const OpenAI = require('openai');
const prisma = require('./prismaClient');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class MedicalAIBot {
  constructor() {
    this.systemPrompt = `You are a medical AI assistant that helps analyze patient medical records and provides general health recommendations. 

IMPORTANT DISCLAIMERS:
- You are NOT a replacement for professional medical advice
- All recommendations should encourage consulting with healthcare providers
- Never provide specific diagnoses or emergency medical advice
- Focus on general wellness and follow-up suggestions

Your role is to:
1. Analyze medical records (diagnosis, treatment, medications, notes)
2. Provide simple, general recommendations for next steps
3. Suggest lifestyle improvements or follow-up care
4. Identify potential concerns that should be discussed with a doctor

Always be supportive, clear, and emphasize the importance of professional medical care.`;
  }

  async analyzePatientRecords(patientId, userId) {
    try {
      // Verify user has access to this patient's records
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          user: true,
          records: {
            include: {
              doctor: {
                include: { user: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!patient) {
        throw new Error('Patient not found');
      }

      // Check if user is the patient or has doctor access
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { Doctor: true, Patient: true }
      });

      let hasAccess = false;
      
      if (user.Patient && user.Patient.id === patientId) {
        hasAccess = true; // Patient viewing their own records
      } else if (user.Doctor) {
        // Check if doctor has approved access
        const accessRequest = await prisma.accessRequest.findFirst({
          where: {
            doctorId: user.Doctor.id,
            patientId: patientId,
            status: 'APPROVED'
          }
        });
        hasAccess = !!accessRequest;
      }

      if (!hasAccess) {
        throw new Error('Access denied to patient records');
      }

      if (patient.records.length === 0) {
        return {
          recommendation: "No medical records found for this patient. Consider scheduling a comprehensive health check-up with a healthcare provider to establish baseline health metrics.",
          summary: "No medical history available",
          nextSteps: [
            "Schedule initial consultation with primary care physician",
            "Discuss medical history and current health concerns",
            "Establish baseline health metrics"
          ]
        };
      }

      // Prepare records data for AI analysis
      const recordsData = patient.records.map(record => ({
        date: record.createdAt.toISOString().split('T')[0],
        title: record.title,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        medications: record.medications,
        notes: record.notes,
        doctor: record.doctor.user.name
      }));

      const patientInfo = {
        age: patient.dateOfBirth ? Math.floor((Date.now() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : 'Unknown',
        bloodType: patient.bloodType,
        allergies: patient.allergies,
        emergencyContact: patient.emergencyContact
      };

      // Generate AI recommendation
      const analysisPrompt = `
Patient Information:
- Age: ${patientInfo.age}
- Blood Type: ${patientInfo.bloodType || 'Not specified'}
- Known Allergies: ${patientInfo.allergies || 'None specified'}

Recent Medical Records (most recent first):
${recordsData.map((record, index) => `
Record ${index + 1} (${record.date}):
- Title: ${record.title}
- Diagnosis: ${record.diagnosis || 'Not specified'}
- Treatment: ${record.treatment || 'Not specified'}
- Medications: ${record.medications || 'None specified'}
- Notes: ${record.notes || 'No additional notes'}
- Attending Doctor: ${record.doctor}
`).join('\n')}

Based on this medical history, provide:
1. A brief summary of the patient's current health status
2. General recommendations for next steps
3. Lifestyle or follow-up suggestions
4. Any areas that might benefit from discussion with healthcare providers

Remember to emphasize that this is general guidance and professional medical consultation is always recommended.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: analysisPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const aiResponse = completion.choices[0].message.content;
      
      // Parse the AI response to extract structured recommendations
      const recommendation = this.parseAIResponse(aiResponse);
      
      return {
        ...recommendation,
        recordsCount: patient.records.length,
        lastRecordDate: patient.records[0]?.createdAt.toISOString().split('T')[0]
      };

    } catch (error) {
      console.error('Error analyzing patient records:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  parseAIResponse(response) {
    // Simple parsing - in production you might want more sophisticated parsing
    const lines = response.split('\n').filter(line => line.trim());
    
    let summary = '';
    let recommendation = '';
    let nextSteps = [];
    
    let currentSection = '';
    
    for (const line of lines) {
      if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('status')) {
        currentSection = 'summary';
        continue;
      } else if (line.toLowerCase().includes('recommendation') || line.toLowerCase().includes('next steps')) {
        currentSection = 'recommendation';
        continue;
      } else if (line.toLowerCase().includes('suggestions') || line.toLowerCase().includes('lifestyle')) {
        currentSection = 'steps';
        continue;
      }
      
      if (currentSection === 'summary' && line.trim() && !line.startsWith('-')) {
        summary += line.trim() + ' ';
      } else if (currentSection === 'recommendation' && line.trim() && !line.startsWith('-')) {
        recommendation += line.trim() + ' ';
      } else if ((currentSection === 'steps' || line.startsWith('-')) && line.trim()) {
        nextSteps.push(line.replace(/^-\s*/, '').trim());
      }
    }
    
    // Fallback parsing if structured parsing fails
    if (!summary && !recommendation) {
      const sentences = response.split('.').filter(s => s.trim());
      summary = sentences.slice(0, 2).join('. ') + '.';
      recommendation = sentences.slice(2, 5).join('. ') + '.';
      nextSteps = sentences.slice(5).map(s => s.trim()).filter(s => s);
    }
    
    return {
      summary: summary.trim() || 'Medical records reviewed.',
      recommendation: recommendation.trim() || response.substring(0, 200) + '...',
      nextSteps: nextSteps.length > 0 ? nextSteps : [
        'Follow up with your healthcare provider',
        'Monitor symptoms and report any changes',
        'Maintain healthy lifestyle habits'
      ]
    };
  }

  async askQuestion(patientId, userId, question) {
    try {
      // Get patient records first
      const analysis = await this.analyzePatientRecords(patientId, userId);
      
      const questionPrompt = `
Based on the patient's medical history and current health status, please answer this specific question:

Question: ${question}

Context: ${analysis.summary}

Provide a helpful response while emphasizing the importance of consulting with healthcare professionals for specific medical advice.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: questionPrompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return {
        answer: completion.choices[0].message.content,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error(`Failed to answer question: ${error.message}`);
    }
  }
}

module.exports = new MedicalAIBot();