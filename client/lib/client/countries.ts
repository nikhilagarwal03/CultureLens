export type CountryOption = {
  code: string;
  name: string;
  region: string;
};

export const COUNTRIES: CountryOption[] = [
  { code: "AR", name: "Argentina", region: "South America" },
  { code: "AU", name: "Australia", region: "Oceania" },
  { code: "BD", name: "Bangladesh", region: "Asia" },
  { code: "BE", name: "Belgium", region: "Europe" },
  { code: "BR", name: "Brazil", region: "South America" },
  { code: "CA", name: "Canada", region: "North America" },
  { code: "CL", name: "Chile", region: "South America" },
  { code: "CN", name: "China", region: "Asia" },
  { code: "CO", name: "Colombia", region: "South America" },
  { code: "DE", name: "Germany", region: "Europe" },
  { code: "EG", name: "Egypt", region: "Africa" },
  { code: "ES", name: "Spain", region: "Europe" },
  { code: "FR", name: "France", region: "Europe" },
  { code: "GB", name: "United Kingdom", region: "Europe" },
  { code: "GH", name: "Ghana", region: "Africa" },
  { code: "ID", name: "Indonesia", region: "Asia" },
  { code: "IE", name: "Ireland", region: "Europe" },
  { code: "IN", name: "India", region: "Asia" },
  { code: "IT", name: "Italy", region: "Europe" },
  { code: "JP", name: "Japan", region: "Asia" },
  { code: "KE", name: "Kenya", region: "Africa" },
  { code: "KR", name: "South Korea", region: "Asia" },
  { code: "LK", name: "Sri Lanka", region: "Asia" },
  { code: "MX", name: "Mexico", region: "North America" },
  { code: "MY", name: "Malaysia", region: "Asia" },
  { code: "NG", name: "Nigeria", region: "Africa" },
  { code: "NL", name: "Netherlands", region: "Europe" },
  { code: "NP", name: "Nepal", region: "Asia" },
  { code: "NZ", name: "New Zealand", region: "Oceania" },
  { code: "PE", name: "Peru", region: "South America" },
  { code: "PH", name: "Philippines", region: "Asia" },
  { code: "PK", name: "Pakistan", region: "Asia" },
  { code: "PL", name: "Poland", region: "Europe" },
  { code: "PT", name: "Portugal", region: "Europe" },
  { code: "SA", name: "Saudi Arabia", region: "Asia" },
  { code: "SE", name: "Sweden", region: "Europe" },
  { code: "SG", name: "Singapore", region: "Asia" },
  { code: "TH", name: "Thailand", region: "Asia" },
  { code: "TR", name: "Turkey", region: "Asia" },
  { code: "UA", name: "Ukraine", region: "Europe" },
  { code: "US", name: "United States", region: "North America" },
  { code: "VN", name: "Vietnam", region: "Asia" },
  { code: "ZA", name: "South Africa", region: "Africa" },
];

export function findCountryByName(name: string): CountryOption | undefined {
  return COUNTRIES.find((item) => item.name.toLowerCase() === name.toLowerCase());
}
