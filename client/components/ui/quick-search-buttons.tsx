"use client";

type Props = {
  prompts: string[];
  onSelect: (prompt: string) => void;
};

export function QuickSearchButtons({ prompts, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="tag-chip px-3 py-1.5 text-sm"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
