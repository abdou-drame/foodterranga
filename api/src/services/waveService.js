const https = require('https');

class WaveService {
  constructor() {
    this.apiKey = process.env.WAVE_API_KEY;
    this.baseUrl = process.env.WAVE_API_URL || 'https://api.wave.com/v1';
  }

  async initierPaiement(commande) {
    if (!this.apiKey) {
      throw new Error('WAVE_API_KEY non configurée');
    }

    const payload = {
      amount: commande.montantTotal,
      currency: 'XOF',
      checkout_status: 'pending',
      client_reference: commande._id.toString(),
      business_name: 'TerrangaFood',
      business_logo: '',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/commandes/${commande._id}/paiement/success`,
      error_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/commandes/${commande._id}/paiement/error`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/commandes/${commande._id}`,
      webhook_url: `${process.env.API_URL || 'http://localhost:3001'}/api/webhooks/wave`
    };

    try {
      const response = await this.makeRequest('/checkout/sessions', 'POST', payload);

      return {
        id: response.id,
        wave_launch_url: response.wave_launch_url,
        checkout_status: response.checkout_status
      };
    } catch (error) {
      console.error('Erreur Wave API:', error);
      throw new Error(`Échec initialisation paiement Wave: ${error.message}`);
    }
  }

  async verifierStatutPaiement(wavePaymentId) {
    if (!this.apiKey) {
      throw new Error('WAVE_API_KEY non configurée');
    }

    try {
      const response = await this.makeRequest(`/checkout/sessions/${wavePaymentId}`, 'GET');

      return {
        id: response.id,
        checkout_status: response.checkout_status,
        payment_status: response.payment_status,
        transaction_id: response.transaction_id,
        amount: response.amount,
        when_completed: response.when_completed
      };
    } catch (error) {
      console.error('Erreur vérification Wave:', error);
      throw new Error(`Échec vérification paiement: ${error.message}`);
    }
  }

  makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);

      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);

            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(parsed.message || `Erreur HTTP ${res.statusCode}`));
            }
          } catch (error) {
            reject(new Error(`Réponse invalide: ${body}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  verifierSignatureWebhook(payload, signature) {
    const crypto = require('crypto');
    const secret = process.env.WAVE_WEBHOOK_SECRET;

    if (!secret) {
      console.warn('WAVE_WEBHOOK_SECRET non configurée - signature non vérifiée');
      return true;
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    const calculatedSignature = hmac.digest('hex');

    return calculatedSignature === signature;
  }
}

module.exports = new WaveService();
