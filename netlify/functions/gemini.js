// netlify/functions/gemini.js

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    // 1. Obtener el historial de la conversación enviado desde el frontend
    const { conversationHistory } = JSON.parse(event.body);
    
    // 2. Obtener la API Key de las variables de entorno de Netlify (¡el secreto!)
    const API_KEY = process.env.GEMINI_API_KEY;
    
    const MODEL_NAME = "gemini-pro";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    try {
        // 3. Llamar a la API de Google Gemini desde el servidor de Netlify
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: conversationHistory,
            }),
        });

        if (!response.ok) {
            // Si hay un error, lo pasamos al frontend para que lo muestre
            const errorData = await response.json();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorData.error.message }),
            };
        }

        const data = await response.json();
        
        // 4. Devolver la respuesta de Gemini al frontend
        return {
            statusCode: 200,
            body: JSON.stringify(data), // Enviamos la respuesta completa
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno en la función del servidor.' }),
        };
    }
};