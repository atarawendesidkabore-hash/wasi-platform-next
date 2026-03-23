// AFEX All-54 Sovereign-State Instrument Library
// Africa Export Index Family — integrated into WASI DEX

export type AfexInstrument = {
  code: string;
  country: string;
  iso3: string;
  currency: string;
  subfamily: string;
  subfamilyName: string;
  model: "coastal_export_model" | "landlocked_corridor_model" | "island_export_model";
  detail: "detailed_prototype_ready" | "starter_profile";
  role: string;
  commodities: string[];
  note: string;
};

export type AfexSubfamily = {
  code: string;
  name: string;
  color: string;
};

export const AFEX_SUBFAMILIES: AfexSubfamily[] = [
  { code: "NAEX", name: "North Africa", color: "#f59e0b" },
  { code: "WAEX", name: "West Africa", color: "#22c55e" },
  { code: "CAEX", name: "Central Africa", color: "#a78bfa" },
  { code: "EAEX", name: "East Africa", color: "#3b82f6" },
  { code: "SAEX", name: "Southern Africa", color: "#ef4444" },
];

export const MODEL_LABELS: Record<string, string> = {
  coastal_export_model: "Coastal",
  landlocked_corridor_model: "Landlocked",
  island_export_model: "Island",
};

export const AFEX_INSTRUMENTS: AfexInstrument[] = [
  // NAEX — North Africa (6)
  { code: "ALGEX", country: "Algeria", iso3: "DZA", currency: "DZD", subfamily: "NAEX", subfamilyName: "North Africa", model: "coastal_export_model", role: "energy_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Condensates", "Iron Ore", "Phosphates"], note: "Energy export benchmark with secondary mining exposure." },
  { code: "EGYEX", country: "Egypt", iso3: "EGY", currency: "EGP", subfamily: "NAEX", subfamilyName: "North Africa", model: "coastal_export_model", role: "diversified_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Gold", "Raw Cotton", "Phosphates"], note: "Energy, mining, and agricultural export logic." },
  { code: "LBYEX", country: "Libya", iso3: "LBY", currency: "LYD", subfamily: "NAEX", subfamilyName: "North Africa", model: "coastal_export_model", role: "energy_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Condensates", "Petrochemical Feedstocks"], note: "Highly concentrated energy benchmark." },
  { code: "MAREX", country: "Morocco", iso3: "MAR", currency: "MAD", subfamily: "NAEX", subfamilyName: "North Africa", model: "coastal_export_model", role: "diversified_coastal_member", detail: "starter_profile", commodities: ["Phosphates", "Fish and Seafood", "Citrus", "Lead and Zinc Concentrates"], note: "Phosphates and fisheries with diversified-coastal profile." },
  { code: "TUNEX", country: "Tunisia", iso3: "TUN", currency: "TND", subfamily: "NAEX", subfamilyName: "North Africa", model: "coastal_export_model", role: "coastal_diversified_member", detail: "starter_profile", commodities: ["Olive Oil", "Phosphates", "Crude Oil", "Dates"], note: "Energy, phosphates, and agro-exports." },
  { code: "SUDEX", country: "Sudan", iso3: "SDN", currency: "SDG", subfamily: "NAEX", subfamilyName: "North Africa", model: "coastal_export_model", role: "agri_and_minerals_member", detail: "starter_profile", commodities: ["Gold", "Gum Arabic", "Livestock", "Sesame Seeds", "Raw Cotton"], note: "Mining and agricultural export logic with conflict-risk caution." },

  // WAEX — West Africa (16)
  { code: "BENEX", country: "Benin", iso3: "BEN", currency: "XOF", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "coastal_corridor_member", detail: "starter_profile", commodities: ["Raw Cotton", "Cashew Nuts", "Soybeans", "Shea Nuts"], note: "Coastal exporter and corridor interface for Sahel trade." },
  { code: "BUREX", country: "Burkina Faso", iso3: "BFA", currency: "XOF", subfamily: "WAEX", subfamilyName: "West Africa", model: "landlocked_corridor_model", role: "landlocked_corridor_member", detail: "detailed_prototype_ready", commodities: ["Other Oily Seeds", "Cashew Nuts", "Raw Cotton", "Sesame Seeds", "Zinc Ore", "Gold"], note: "Detailed prototype. Corridor-based trade with six-country overlay." },
  { code: "CABEX", country: "Cabo Verde", iso3: "CPV", currency: "CVE", subfamily: "WAEX", subfamilyName: "West Africa", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Fish and Seafood", "Salt", "Marine Products"], note: "Smaller raw-material base with diversification warning." },
  { code: "CIREX", country: "Cote d'Ivoire", iso3: "CIV", currency: "XOF", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "coastal_anchor_member", detail: "detailed_prototype_ready", commodities: ["Cocoa Beans", "Natural Rubber", "Cashew Nuts", "Crude Oil", "Manganese", "Palm Oil", "Raw Cotton", "Coffee", "Nickel", "Gold", "Diamonds"], note: "Detailed prototype. Port-led export economy with cocoa anchor." },
  { code: "GMBEX", country: "The Gambia", iso3: "GMB", currency: "GMD", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "river_coastal_member", detail: "starter_profile", commodities: ["Groundnuts", "Fish and Seafood", "Sesame Seeds", "Cashew Nuts"], note: "Narrow agricultural and fisheries export base." },
  { code: "GHAEX", country: "Ghana", iso3: "GHA", currency: "GHS", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "coastal_anchor_member", detail: "detailed_prototype_ready", commodities: ["Cocoa Beans", "Gold", "Crude Oil", "Manganese", "Bauxite", "Timber"], note: "Detailed prototype. Dual cocoa-mining profile with corridor relevance to Burkina Faso." },
  { code: "GUIEX", country: "Guinea", iso3: "GIN", currency: "GNF", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "minerals_anchor_member", detail: "starter_profile", commodities: ["Bauxite", "Gold", "Diamonds", "Iron Ore"], note: "Mining-heavy export logic." },
  { code: "GNBEX", country: "Guinea-Bissau", iso3: "GNB", currency: "XOF", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "single_crop_member", detail: "starter_profile", commodities: ["Cashew Nuts", "Fish and Seafood", "Groundnuts"], note: "Concentration warning: heavy cashew reliance." },
  { code: "LIBEX", country: "Liberia", iso3: "LBR", currency: "LRD", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "minerals_and_agriculture_member", detail: "starter_profile", commodities: ["Natural Rubber", "Iron Ore", "Gold", "Palm Oil", "Timber"], note: "Mining and plantation export logic." },
  { code: "MALIEX", country: "Mali", iso3: "MLI", currency: "XOF", subfamily: "WAEX", subfamilyName: "West Africa", model: "landlocked_corridor_model", role: "landlocked_corridor_member", detail: "starter_profile", commodities: ["Gold", "Raw Cotton", "Livestock", "Sesame Seeds", "Shea Nuts"], note: "Corridor logic with gold and livestock mix." },
  { code: "MRTEX", country: "Mauritania", iso3: "MRT", currency: "MRU", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "minerals_and_fisheries_member", detail: "starter_profile", commodities: ["Iron Ore", "Gold", "Copper Concentrate", "Fish and Seafood"], note: "Mining exports blended with fisheries." },
  { code: "NEREX", country: "Niger", iso3: "NER", currency: "XOF", subfamily: "WAEX", subfamilyName: "West Africa", model: "landlocked_corridor_model", role: "landlocked_corridor_member", detail: "starter_profile", commodities: ["Uranium", "Crude Oil", "Livestock", "Cowpeas", "Onions"], note: "Landlocked corridor: mineral and agricultural exports." },
  { code: "NGAEX", country: "Nigeria", iso3: "NGA", currency: "NGN", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "energy_anchor_member", detail: "detailed_prototype_ready", commodities: ["Crude Oil", "Natural Gas", "Cocoa Beans", "Sesame Seeds", "Natural Rubber", "Urea"], note: "Detailed prototype. Africa's largest economy. Energy-dominant benchmark (~86% oil+gas by tonnage)." },
  { code: "SENEX", country: "Senegal", iso3: "SEN", currency: "XOF", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "coastal_diversified_member", detail: "starter_profile", commodities: ["Phosphates", "Gold", "Fish and Seafood", "Groundnuts", "Zircon"], note: "Mining and fisheries exposure." },
  { code: "SLEX", country: "Sierra Leone", iso3: "SLE", currency: "SLE", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "minerals_member", detail: "starter_profile", commodities: ["Diamonds", "Iron Ore", "Rutile", "Bauxite", "Cocoa"], note: "Mining commodities with smaller agricultural exposure." },
  { code: "TOGEX", country: "Togo", iso3: "TGO", currency: "XOF", subfamily: "WAEX", subfamilyName: "West Africa", model: "coastal_export_model", role: "coastal_corridor_member", detail: "starter_profile", commodities: ["Phosphates", "Raw Cotton", "Soybeans", "Cashew Nuts"], note: "Export country and corridor interface for Sahel trade." },

  // CAEX — Central Africa (8)
  { code: "CAMEX", country: "Cameroon", iso3: "CMR", currency: "XAF", subfamily: "CAEX", subfamilyName: "Central Africa", model: "coastal_export_model", role: "diversified_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Cocoa Beans", "Timber", "Raw Cotton", "Coffee", "Natural Gas"], note: "Energy, timber, and agricultural exports." },
  { code: "CAFEX", country: "Central African Republic", iso3: "CAF", currency: "XAF", subfamily: "CAEX", subfamilyName: "Central Africa", model: "landlocked_corridor_model", role: "minerals_and_forest_member", detail: "starter_profile", commodities: ["Timber", "Gold", "Diamonds", "Raw Cotton"], note: "Landlocked corridor with governance-risk caution." },
  { code: "CHAEX", country: "Chad", iso3: "TCD", currency: "XAF", subfamily: "CAEX", subfamilyName: "Central Africa", model: "landlocked_corridor_model", role: "energy_and_livestock_member", detail: "starter_profile", commodities: ["Crude Oil", "Livestock", "Sesame Seeds", "Gum Arabic", "Raw Cotton"], note: "Crude oil with agricultural and livestock exports." },
  { code: "COGEX", country: "Republic of the Congo", iso3: "COG", currency: "XAF", subfamily: "CAEX", subfamilyName: "Central Africa", model: "coastal_export_model", role: "energy_member", detail: "starter_profile", commodities: ["Crude Oil", "Timber", "Iron Ore", "Potash"], note: "Oil-led coastal benchmark with forest and mining secondary." },
  { code: "DRCEX", country: "DR Congo", iso3: "COD", currency: "CDF", subfamily: "CAEX", subfamilyName: "Central Africa", model: "landlocked_corridor_model", role: "minerals_anchor_member", detail: "starter_profile", commodities: ["Copper", "Cobalt", "Gold", "Tin Ore", "Coltan", "Diamonds"], note: "Mining-heavy with multi-corridor transport model." },
  { code: "EQGEX", country: "Equatorial Guinea", iso3: "GNQ", currency: "XAF", subfamily: "CAEX", subfamilyName: "Central Africa", model: "coastal_export_model", role: "energy_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Methanol", "Timber", "Cocoa Beans"], note: "Concentrated energy export benchmark." },
  { code: "GABEX", country: "Gabon", iso3: "GAB", currency: "XAF", subfamily: "CAEX", subfamilyName: "Central Africa", model: "coastal_export_model", role: "energy_and_metals_member", detail: "starter_profile", commodities: ["Crude Oil", "Manganese", "Timber", "Gold"], note: "Oil, manganese, and timber exposure." },
  { code: "STPEX", country: "Sao Tome and Principe", iso3: "STP", currency: "STN", subfamily: "CAEX", subfamilyName: "Central Africa", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Cocoa Beans", "Fish and Seafood", "Palm Products"], note: "Small-market and concentration warning." },

  // EAEX — East Africa (11)
  { code: "BDIEX", country: "Burundi", iso3: "BDI", currency: "BIF", subfamily: "EAEX", subfamilyName: "East Africa", model: "landlocked_corridor_model", role: "agri_and_minerals_member", detail: "starter_profile", commodities: ["Coffee", "Tea", "Gold", "Nickel Ore"], note: "Agriculture and mining with landlocked corridor." },
  { code: "COMREX", country: "Comoros", iso3: "COM", currency: "KMF", subfamily: "EAEX", subfamilyName: "East Africa", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Vanilla", "Cloves", "Ylang-Ylang", "Fish and Seafood"], note: "Narrow island agro-export benchmark." },
  { code: "DJIEX", country: "Djibouti", iso3: "DJI", currency: "DJF", subfamily: "EAEX", subfamilyName: "East Africa", model: "coastal_export_model", role: "trade_gateway_member", detail: "starter_profile", commodities: ["Salt", "Livestock", "Fish and Seafood"], note: "Strategic trade-gateway with small raw-material base." },
  { code: "ERIEX", country: "Eritrea", iso3: "ERI", currency: "ERN", subfamily: "EAEX", subfamilyName: "East Africa", model: "coastal_export_model", role: "metals_member", detail: "starter_profile", commodities: ["Gold", "Copper", "Zinc", "Potash", "Salt"], note: "Smaller mining-heavy benchmark." },
  { code: "ETHEX", country: "Ethiopia", iso3: "ETH", currency: "ETB", subfamily: "EAEX", subfamilyName: "East Africa", model: "landlocked_corridor_model", role: "agri_anchor_member", detail: "starter_profile", commodities: ["Coffee", "Gold", "Sesame Seeds", "Oilseeds", "Livestock"], note: "Landlocked corridor with diversified agriculture." },
  { code: "KENEX", country: "Kenya", iso3: "KEN", currency: "KES", subfamily: "EAEX", subfamilyName: "East Africa", model: "coastal_export_model", role: "diversified_anchor_member", detail: "starter_profile", commodities: ["Tea", "Coffee", "Soda Ash", "Titanium Ore", "Cut Flowers"], note: "Agricultural and mining exports with logistics-hub status." },
  { code: "RWAEX", country: "Rwanda", iso3: "RWA", currency: "RWF", subfamily: "EAEX", subfamilyName: "East Africa", model: "landlocked_corridor_model", role: "minerals_and_agri_member", detail: "starter_profile", commodities: ["Gold", "Tin Ore", "Tantalum", "Tungsten", "Coffee", "Tea"], note: "Landlocked corridor and specialty-metals exporter." },
  { code: "SOMEX", country: "Somalia", iso3: "SOM", currency: "SOS", subfamily: "EAEX", subfamilyName: "East Africa", model: "coastal_export_model", role: "livestock_member", detail: "starter_profile", commodities: ["Livestock", "Sesame Seeds", "Frankincense", "Fish and Seafood"], note: "High-fragility caution. Livestock and sesame exports." },
  { code: "SSDEX", country: "South Sudan", iso3: "SSD", currency: "SSP", subfamily: "EAEX", subfamilyName: "East Africa", model: "landlocked_corridor_model", role: "energy_member", detail: "starter_profile", commodities: ["Crude Oil", "Gum Arabic", "Livestock", "Sesame Seeds"], note: "Landlocked oil exporter with elevated fragility risk." },
  { code: "TZAEX", country: "Tanzania", iso3: "TZA", currency: "TZS", subfamily: "EAEX", subfamilyName: "East Africa", model: "coastal_export_model", role: "diversified_anchor_member", detail: "starter_profile", commodities: ["Gold", "Cashew Nuts", "Coffee", "Raw Cotton", "Tobacco", "Natural Gas"], note: "Mining, agriculture, and gas exposure." },
  { code: "UGAEX", country: "Uganda", iso3: "UGA", currency: "UGX", subfamily: "EAEX", subfamilyName: "East Africa", model: "landlocked_corridor_model", role: "agri_anchor_member", detail: "starter_profile", commodities: ["Coffee", "Gold", "Raw Cotton", "Tea", "Fish and Seafood"], note: "Landlocked corridor with coffee-led agriculture." },

  // SAEX — Southern Africa (13)
  { code: "ANGEX", country: "Angola", iso3: "AGO", currency: "AOA", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "coastal_export_model", role: "energy_anchor_member", detail: "starter_profile", commodities: ["Crude Oil", "Natural Gas", "Diamonds", "Iron Ore", "Coffee"], note: "Oil-led benchmark with diamonds secondary." },
  { code: "BOTEX", country: "Botswana", iso3: "BWA", currency: "BWP", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "landlocked_corridor_model", role: "diamonds_member", detail: "starter_profile", commodities: ["Diamonds", "Copper", "Nickel", "Soda Ash", "Beef"], note: "Diamonds and mining with landlocked corridor." },
  { code: "ESWEX", country: "Eswatini", iso3: "SWZ", currency: "SZL", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "landlocked_corridor_model", role: "agri_industrial_member", detail: "starter_profile", commodities: ["Sugar", "Wood Pulp", "Citrus", "Coal"], note: "Agro-industrial and forestry-linked exports." },
  { code: "LESEX", country: "Lesotho", iso3: "LSO", currency: "LSL", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "landlocked_corridor_model", role: "small_minerals_member", detail: "starter_profile", commodities: ["Wool", "Mohair", "Diamonds"], note: "Small-market caution. Wool, mohair, and diamonds." },
  { code: "MDGEX", country: "Madagascar", iso3: "MDG", currency: "MGA", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "island_export_model", role: "agri_and_minerals_member", detail: "starter_profile", commodities: ["Vanilla", "Nickel and Cobalt", "Cloves", "Chromium Ore", "Ilmenite"], note: "Specialty agriculture with mining secondary." },
  { code: "MWIEX", country: "Malawi", iso3: "MWI", currency: "MWK", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "landlocked_corridor_model", role: "agri_member", detail: "starter_profile", commodities: ["Tobacco", "Tea", "Sugar", "Macadamia Nuts"], note: "Agricultural benchmark with corridor dependence." },
  { code: "MUSEX", country: "Mauritius", iso3: "MUS", currency: "MUR", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Sugar", "Fish and Seafood", "Molasses"], note: "Limited raw-material base with diversification warning." },
  { code: "MOZEX", country: "Mozambique", iso3: "MOZ", currency: "MZN", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "coastal_export_model", role: "energy_and_mining_member", detail: "starter_profile", commodities: ["Coal", "Natural Gas", "Graphite", "Heavy Mineral Sands", "Aluminum"], note: "Energy and mining with regional corridor role." },
  { code: "NAMEX", country: "Namibia", iso3: "NAM", currency: "NAD", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "coastal_export_model", role: "minerals_member", detail: "starter_profile", commodities: ["Diamonds", "Uranium", "Zinc", "Copper", "Fish and Seafood"], note: "Mining and fisheries exposure." },
  { code: "SEYEX", country: "Seychelles", iso3: "SYC", currency: "SCR", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "island_export_model", role: "island_member", detail: "starter_profile", commodities: ["Fish and Seafood", "Tuna", "Cinnamon", "Vanilla"], note: "Fisheries-led island benchmark." },
  { code: "ZAFEX", country: "South Africa", iso3: "ZAF", currency: "ZAR", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "coastal_export_model", role: "continental_anchor_member", detail: "starter_profile", commodities: ["Gold", "Platinum Group Metals", "Coal", "Iron Ore", "Manganese", "Chromium"], note: "Continental anchor: depth, scale, and commodity diversity." },
  { code: "ZMBEX", country: "Zambia", iso3: "ZMB", currency: "ZMW", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "landlocked_corridor_model", role: "copper_anchor_member", detail: "starter_profile", commodities: ["Copper", "Cobalt", "Emeralds", "Sugar"], note: "Copper and cobalt with corridor-dependent exports." },
  { code: "ZIMEX", country: "Zimbabwe", iso3: "ZWE", currency: "ZWG", subfamily: "SAEX", subfamilyName: "Southern Africa", model: "landlocked_corridor_model", role: "minerals_anchor_member", detail: "starter_profile", commodities: ["Gold", "Platinum", "Lithium", "Tobacco", "Nickel"], note: "Mining and agricultural exports. Extra currency-governance review." },
];

export function getAfexStats() {
  const all = AFEX_INSTRUMENTS;
  return {
    total: all.length,
    detailed: all.filter((i) => i.detail === "detailed_prototype_ready").length,
    starter: all.filter((i) => i.detail === "starter_profile").length,
    subfamilies: AFEX_SUBFAMILIES.length,
    commodities: new Set(all.flatMap((i) => i.commodities)).size,
    currencies: new Set(all.map((i) => i.currency)).size,
    coastal: all.filter((i) => i.model === "coastal_export_model").length,
    landlocked: all.filter((i) => i.model === "landlocked_corridor_model").length,
    island: all.filter((i) => i.model === "island_export_model").length,
  };
}
