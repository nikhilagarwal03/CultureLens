const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
  { code: "pt", label: "Portuguese" },
  { code: "ar", label: "Arabic" },
];

type Props = {
  value: string;
  onChange: (code: string) => void;
  id?: string;
  className?: string;
};

export function LanguageSelector({ value, onChange, id, className }: Props) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`surface-input w-full rounded-xl px-4 py-3 text-sm outline-none ring-1 focus:ring-accent ${className ?? ""}`}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
