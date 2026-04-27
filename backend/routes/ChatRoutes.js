require('dotenv').config();
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/message', async (req, res) => {
  try {
    const { messages } = req.body;

    const model = genAI.getGenerativeModel({
     model: 'gemini-2.5-flash',
systemInstruction: `Tu es un assistant expert en Clean Architecture et développement backend.
      Quand l'utilisateur décrit son projet, tu dois analyser et générer un modèle JSON structuré.
      
      Si l'utilisateur décrit un projet, réponds avec une explication courte ET génère le JSON entre les balises <MODEL> et </MODEL>.
      
      Le JSON doit suivre exactement ce format:
      {
        "projectName": "nom-du-projet",
        "entities": [
          {
            "name": "NomEntite",
            "fields": [
              { "name": "nomChamp", "type": "String", "required": true }
            ]
          }
        ]
      }
      
      Types valides: String, Number, Boolean, Date
      
      Si l'utilisateur pose une question générale, réponds normalement sans JSON.`
    });

    // Filtrer les messages valides uniquement
    const validMessages = messages.filter(m => 
      (m.role === 'user' || m.role === 'assistant') && 
      m.content && 
      m.content.trim() !== ''
    );

    // Prendre seulement le dernier message user
    const lastUserMessage = validMessages.filter(m => m.role === 'user').pop();
    
    if (!lastUserMessage) {
      return res.status(400).json({ error: 'No user message found' });
    }

    const result = await model.generateContent(lastUserMessage.content);
    const text = result.response.text();

    res.json({ content: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;