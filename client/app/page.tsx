import { LandingPage } from "@/components/landing/landing-page";

const siteUrl = "https://culturelensai.vercel.app";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "CultureLens",
      alternateName: "CultureLens AI",
      url: siteUrl,
      description:
        "CultureLens helps you understand cultural references from songs, movies, memes, slang, and global moments through their origin, meaning, cultural impact, and local context.",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "CultureLens",
      url: siteUrl,
      logo: `${siteUrl}/logo_2.png`,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <LandingPage />
    </>
  );
}