import { log } from "./logger";

export type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export type EmailSendResult = {
  ok: boolean;
  provider: "mock" | "webhook";
  messageId: string;
};

function makeMessageId(): string {
  return `mail_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function sendViaWebhook(payload: EmailPayload): Promise<EmailSendResult> {
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      ok: true,
      provider: "mock",
      messageId: makeMessageId(),
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "noreply@culturelens.app",
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email webhook failed with status ${response.status}`);
  }

  return {
    ok: true,
    provider: "webhook",
    messageId: makeMessageId(),
  };
}

export async function sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
  const result = await sendViaWebhook(payload);
  log({
    level: "info",
    scope: "email",
    message: "email.sent",
    meta: {
      to: payload.to,
      subject: payload.subject,
      provider: result.provider,
      messageId: result.messageId,
    },
  });
  return result;
}
