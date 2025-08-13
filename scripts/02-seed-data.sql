-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Articles about technology, programming, and digital innovation'),
  ('Lifestyle', 'lifestyle', 'Articles about lifestyle, health, and personal development'),
  ('Business', 'business', 'Articles about business, entrepreneurship, and finance'),
  ('Travel', 'travel', 'Articles about travel, destinations, and experiences')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample admin user (this will be created when someone signs up)
-- The actual user creation happens through Supabase Auth
