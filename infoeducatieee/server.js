const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// AI Agent API Proxy — calls Anthropic API
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, language } = req.body;
    const isRomanian = language === 'ro';

    const systemPrompt = isRomanian
      ? `Ești GeoAI, un asistent expert în geografie politică și geopolitică. Răspunzi în română, concis și precis. Ești specializat în: state suverane, sisteme de guvernare, granițe, organizații internaționale (ONU, NATO, UE, ASEAN, BRICS), centre de putere globală (SUA, China, UE, Rusia). Dai răspunsuri educaționale potrivite pentru un olimpic la geografie clasa 10-12. Ești direct, factual și interesant.`
      : `You are GeoAI, an expert AI assistant in political geography and geopolitics. You answer concisely and precisely in English. You specialize in: sovereign states, governance systems, borders, international organizations (UN, NATO, EU, ASEAN, BRICS), global power centers (USA, China, EU, Russia). You give educational answers appropriate for a high school olympiad student. Be direct, factual, and engaging.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(500).json({ error: 'API error' });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'No response received.';
    res.json({ reply });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Eroare la procesarea mesajului AI." });
  }
});

app.listen(PORT, () => {
  console.log(`TerraQuest server running at http://localhost:${PORT}`);
});
