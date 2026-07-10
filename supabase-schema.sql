-- Signals table
CREATE TABLE signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pair TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  entry_price DECIMAL(10,5) NOT NULL,
  stop_loss DECIMAL(10,5) NOT NULL,
  take_profit DECIMAL(10,5) NOT NULL,
  result TEXT CHECK (result IN ('WIN', 'LOSS', 'PENDING')),
  pips INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

-- Stats table (single row, updated regularly)
CREATE TABLE stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  win_rate INTEGER NOT NULL,
  pips_month INTEGER NOT NULL,
  monthly_return DECIMAL(5,2) NOT NULL,
  active_traders INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  member_type TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security: public read access for website
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read signals" ON signals FOR SELECT USING (true);
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);

-- Insert default stats
INSERT INTO stats (win_rate, pips_month, monthly_return, active_traders)
VALUES (87, 2450, 14.2, 500);

-- Insert sample testimonials
INSERT INTO testimonials (name, location, quote, member_type) VALUES
('Ahmed K.', 'Dubai', 'FX Research Desk completely changed how I trade. The signals are precise and the risk management alone saved my account.', 'Premium Member • 6 months'),
('Maria S.', 'London', 'Went from consistent losses to 12% monthly gains. The quarterly plan paid for itself in the first week.', 'Premium Member • 1 year'),
('James O.', 'New York', 'Best investment I''ve made. The lifetime plan is a no-brainer if you''re serious about forex.', 'Free Member → Premium');
