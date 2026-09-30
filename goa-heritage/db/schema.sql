CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  district TEXT NOT NULL,
  duration TEXT NOT NULL,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  description TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  query TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  map_area TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((latitude IS NULL AND longitude IS NULL) OR (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180))
);

CREATE INDEX IF NOT EXISTS experiences_public_order_idx
  ON experiences (status, sort_order, title);

INSERT INTO experiences (
  id, title, subtitle, category, district, duration, image, image_alt,
  description, source_name, source_url, query, tags, latitude, longitude,
  map_area, status, sort_order
) VALUES
(
  'fontainhas', 'A slow walk through Fontainhas', 'Panaji''s old Latin Quarter', 'Places', 'North Goa', '2–3 hours',
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80',
  'Colourful old European-style buildings on a quiet street',
  'Follow the narrow lanes, painted façades and old balconies of Panaji''s historic quarter. Go early, walk quietly, and remember that this is a living neighbourhood.',
  'Wikipedia · Fontainhas', 'https://en.wikipedia.org/wiki/Fontainhas_(Panaji)', 'Fontainhas Panaji Goa',
  ARRAY['Architecture','Heritage','Walkable'], 15.4995, 73.8278, 'Fontainhas, Panaji · approximate story area', 'published', 10
),
(
  'feni', 'The story behind a glass of feni', 'A Goan spirit with deep roots', 'Food & drink', 'South Goa', 'Ask a local maker',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80',
  'A locally made drink served in a small glass',
  'Learn about Goa''s cashew and coconut spirits from a licensed local producer. Ask how it is made, where the fruit comes from and how to enjoy it responsibly.',
  'Wikipedia · Feni', 'https://en.wikipedia.org/wiki/Feni_(liquor)', 'Feni liquor Goa',
  ARRAY['Foodways','Local makers','Drink responsibly'], 15.15, 74.03, 'South Goa · approximate region, not a host address', 'published', 20
),
(
  'chorao', 'A quieter morning on Chorao', 'Island paths & mangrove edges', 'Places', 'North Goa', 'Half day',
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
  'A calm tropical river edged with green mangroves',
  'Take the local ferry to Chorao and explore at an unhurried pace. Check ferry timings before you go, respect private property and keep a respectful distance from wildlife.',
  'Wikipedia · Chorao', 'https://en.wikipedia.org/wiki/Chor%C3%A3o', 'Chorao island Goa',
  ARRAY['Island','Nature','Slow travel'], 15.535, 73.874, 'Chorao Island · approximate story area', 'published', 30
),
(
  'azulejos', 'Tiles that tell a story', 'Goa''s painted azulejo tradition', 'Makers', 'North Goa', 'Meet a local studio',
  'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=80',
  'Hand-painted blue and white decorative ceramic tiles',
  'Look for hand-painted tiles in homes and public spaces, and seek out a local ceramic artist to hear how the craft is being carried forward today.',
  'Wikipedia · Azulejo', 'https://en.wikipedia.org/wiki/Azulejo', 'Azulejo tiles Goa',
  ARRAY['Craft','Art','Meet a maker'], 15.498, 73.827, 'Panaji · approximate story area', 'published', 40
),
(
  'sao-joao', 'Monsoon, music & São João', 'A June celebration in the villages', 'Living culture', 'North Goa', 'Seasonal · June',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=80',
  'A colourful community celebration at dusk',
  'Around the feast of St John, villages celebrate the monsoon with music and community gatherings. Traditions vary by place; ask before photographing people or entering private celebrations.',
  'Wikipedia · São João', 'https://en.wikipedia.org/wiki/S%C3%A3o_Jo%C3%A3o', 'Sao Joao festival Goa',
  ARRAY['Festival','Monsoon','Community'], 15.58, 73.83, 'North Goa · approximate region, not a venue', 'published', 50
),
(
  'kumbhar', 'Meet a village potter', 'Clay, craft & everyday objects', 'Makers', 'South Goa', 'Arrange ahead',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
  'A craftsperson shaping a clay vessel on a pottery wheel',
  'Go beyond the souvenir shelf and learn how functional clay objects are shaped. Contact a workshop ahead of time, buy directly where possible, and let the maker set the pace.',
  'Wikipedia · Pottery', 'https://en.wikipedia.org/wiki/Pottery', 'Pottery Goa India',
  ARRAY['Craft','Workshop','Community'], 15.15, 74.03, 'South Goa · approximate region, not a provider location', 'published', 60
)
ON CONFLICT (id) DO NOTHING;
