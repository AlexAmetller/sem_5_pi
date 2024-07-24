import { OAuth2Client } from 'google-auth-library';
import config from '../../config';

const clientId = config.googleClientId;
const client = new OAuth2Client(clientId);

// https://developers.google.com/identity/sign-in/web/backend-auth#using-a-google-api-client-library
// verifies aud, exp and iss claims
export async function verifyGoogleToken(token: string): Promise<{ mail: string } | null> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    const mail = payload['email'];
    return { mail };
  } catch (err) {
    return null;
  }
}
