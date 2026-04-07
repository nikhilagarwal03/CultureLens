import { DEFAULT_SHARE_CARD_TEMPLATE, SECTION_ICONS, toShareCardSections, type ShareCardData } from "./card-template";

function short(text: string, max = 1200): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 3).trimEnd()}...`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type LayoutSection = {
  label: string;
  icon: string;
  lines: string[];
  y: number;
  height: number;
};

type CardLayout = {
  width: number;
  totalHeight: number;
  cardX: number;
  cardY: number;
  cardW: number;
  cardH: number;
  queryLines: string[];
  queryStartY: number;
  sections: LayoutSection[];
  footerY: number;
};

function getMeasureContext(): CanvasRenderingContext2D {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  return context;
}

function splitTokenByWidth(ctx: CanvasRenderingContext2D, token: string, maxWidth: number): string[] {
  if (ctx.measureText(token).width <= maxWidth) return [token];
  const chunks: string[] = [];
  let chunk = "";
  for (const ch of token) {
    const next = `${chunk}${ch}`;
    if (ctx.measureText(next).width > maxWidth && chunk) {
      chunks.push(chunk);
      chunk = ch;
    } else {
      chunk = next;
    }
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

function clampLastLineWithEllipsis(ctx: CanvasRenderingContext2D, line: string, maxWidth: number): string {
  let value = line.replace(/[\s\.]+$/g, "");
  while (value.length > 0 && ctx.measureText(`${value}...`).width > maxWidth) {
    value = value.slice(0, -1);
  }
  return value ? `${value}...` : "...";
}

function wrapByWidth(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines?: number): string[] {
  const rawTokens = text.split(" ").filter(Boolean);
  const tokens = rawTokens.flatMap((token) => splitTokenByWidth(ctx, token, maxWidth));

  const lines: string[] = [];
  let line = "";

  for (const token of tokens) {
    const test = line ? `${line} ${token}` : token;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = token;
    }
  }
  if (line) lines.push(line);

  if (maxLines && lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    trimmed[maxLines - 1] = clampLastLineWithEllipsis(ctx, trimmed[maxLines - 1], maxWidth);
    return trimmed;
  }

  return lines;
}

function computeLayout(data: ShareCardData): CardLayout {
  const template = DEFAULT_SHARE_CARD_TEMPLATE;
  const measure = getMeasureContext();

  const width = template.width;
  const cardX = 80;
  const cardY = 60;
  const cardW = width - 160;

  const queryStartY = cardY + 160;
  measure.font = "500 30px 'Inter', 'Segoe UI', sans-serif";
  const queryLines = wrapByWidth(measure, short(data.query, 260), cardW - 96, 3);

  const sectionGap = 12;
  const sectionStartY = queryStartY + queryLines.length * 36 + 24;

  measure.font = "400 24px 'Inter', 'Segoe UI', sans-serif";
  let cursorY = sectionStartY;
  const sections = toShareCardSections(data).map((section) => {
    const valueLines = wrapByWidth(measure, short(section.value), cardW - 116);
    const safeLines = valueLines.length > 0 ? valueLines : ["-"];
    const sectionHeight = Math.max(126, 84 + safeLines.length * 30);
    const entry: LayoutSection = {
      label: section.label,
      icon: SECTION_ICONS[section.label] || "*",
      lines: safeLines,
      y: cursorY,
      height: sectionHeight,
    };
    cursorY += sectionHeight + sectionGap;
    return entry;
  });

  const contentBottom = cursorY + 8;
  const minCardH = template.height - 120;
  const cardH = Math.max(minCardH, contentBottom - cardY + 48);
  const footerY = cardY + cardH - 28;
  const totalHeight = cardY + cardH + 60;

  return {
    width,
    totalHeight,
    cardX,
    cardY,
    cardW,
    cardH,
    queryLines,
    queryStartY,
    sections,
    footerY,
  };
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function buildShareCardPngDataUrl(data: ShareCardData): string {
  const template = DEFAULT_SHARE_CARD_TEMPLATE;
  const layout = computeLayout(data);
  const canvas = document.createElement("canvas");
  canvas.width = layout.width;
  canvas.height = layout.totalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas unavailable");
  }

  const gradient = ctx.createLinearGradient(0, 0, layout.width, layout.totalHeight);
  gradient.addColorStop(0, template.backgroundStart);
  gradient.addColorStop(1, template.backgroundEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, layout.width, layout.totalHeight);

  const cardX = layout.cardX;
  const cardY = layout.cardY;
  const cardW = layout.cardW;
  const cardH = layout.cardH;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
  ctx.fillStyle = "#071523";
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 28;
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(142,168,195,0.24)";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, cardX + 1, cardY + 1, cardW - 2, cardH - 2, 31);
  ctx.stroke();

  ctx.fillStyle = template.textPrimary;
  ctx.font = "700 52px 'Segoe UI', 'Inter', Arial, sans-serif";
  ctx.fillText("CultureLens", cardX + 48, cardY + 98);

  ctx.strokeStyle = template.accent;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cardX + 48, cardY + 114);
  ctx.lineTo(cardX + 310, cardY + 114);
  ctx.stroke();

  ctx.font = "500 30px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = template.accent;
  layout.queryLines.forEach((line, i) => {
    ctx.fillText(line, cardX + 48, layout.queryStartY + i * 34);
  });

  for (const section of layout.sections) {
    const y = section.y;

    ctx.fillStyle = "#0d2033";
    drawRoundedRect(ctx, cardX + 34, y, cardW - 68, section.height, 18);
    ctx.fill();

    ctx.strokeStyle = "rgba(142,168,195,0.20)";
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, cardX + 34, y, cardW - 68, section.height, 18);
    ctx.stroke();

    ctx.font = "600 18px 'Inter', 'Segoe UI', sans-serif";
    ctx.fillStyle = template.textMuted;
    ctx.fillText(`${section.icon} ${section.label}`, cardX + 58, y + 34);

    ctx.font = "400 24px 'Inter', 'Segoe UI', sans-serif";
    ctx.fillStyle = template.textPrimary;
    section.lines.forEach((line, i) => {
      ctx.fillText(line, cardX + 58, y + 72 + i * 30);
    });
  }

  ctx.fillStyle = template.textMuted;
  ctx.font = "600 18px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillText("Generated by culturelensai.vercel.app", cardX + 48, layout.footerY);

  return canvas.toDataURL("image/png");
}

export function buildShareCardSvg(data: ShareCardData): string {
  const template = DEFAULT_SHARE_CARD_TEMPLATE;
  const layout = computeLayout(data);
  const cardX = layout.cardX;
  const cardY = layout.cardY;
  const cardW = layout.cardW;
  const cardH = layout.cardH;

  const queryLines = layout.queryLines
    .map((line, idx) => `<tspan x="${cardX + 48}" y="${layout.queryStartY + idx * 34}">${escapeXml(line)}</tspan>`)
    .join("");

  const sectionRows = layout.sections
    .map((section) => {
      const valueLines = section.lines
        .map((line, idx) => `<tspan x="${cardX + 58}" y="${section.y + 72 + idx * 30}">${escapeXml(line)}</tspan>`)
        .join("");
      return `
        <rect x="${cardX + 34}" y="${section.y}" width="${cardW - 68}" height="${section.height}" rx="18" fill="#0d2033" stroke="rgba(142,168,195,0.20)" stroke-width="1.5" />
        <text x="${cardX + 58}" y="${section.y + 34}" font-size="18" font-weight="600" fill="${template.textMuted}" font-family="'Inter', 'Segoe UI', sans-serif">${escapeXml(`${section.icon} ${section.label}`)}</text>
        <text font-size="24" fill="${template.textPrimary}" font-family="'Inter', 'Segoe UI', sans-serif">${valueLines}</text>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.totalHeight}" viewBox="0 0 ${layout.width} ${layout.totalHeight}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${template.backgroundStart}"/>
      <stop offset="100%" stop-color="${template.backgroundEnd}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect x="0" y="0" width="${layout.width}" height="${layout.totalHeight}" fill="url(#bg)"/>
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="32" fill="#071523" stroke="rgba(142,168,195,0.24)" stroke-width="2" filter="url(#shadow)"/>
  <text x="${cardX + 48}" y="${cardY + 98}" font-size="52" font-weight="700" fill="${template.textPrimary}" font-family="'Inter', 'Segoe UI', sans-serif">CultureLens</text>
  <line x1="${cardX + 48}" y1="${cardY + 114}" x2="${cardX + 310}" y2="${cardY + 114}" stroke="${template.accent}" stroke-width="5" />
  <text font-size="30" font-weight="500" fill="${template.accent}" font-family="'Inter', 'Segoe UI', sans-serif">${queryLines}</text>
  ${sectionRows}
  <text x="${cardX + 48}" y="${layout.footerY}" font-size="18" font-weight="600" fill="${template.textMuted}" font-family="'Inter', 'Segoe UI', sans-serif">Generated by culturelensai.vercel.app</text>
</svg>`;
}
