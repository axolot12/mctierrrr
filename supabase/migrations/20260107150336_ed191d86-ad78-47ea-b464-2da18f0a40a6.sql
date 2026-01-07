-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  skin_url TEXT NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT true,
  game_modes JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_tested BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  featured_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create users table for Discord auth
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_id TEXT NOT NULL UNIQUE,
  is_owner BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game_modes table
CREATE TABLE public.game_modes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default game modes
INSERT INTO public.game_modes (name) VALUES 
  ('Sword'),
  ('UHC'),
  ('Pot'),
  ('SMP'),
  ('Crystal'),
  ('Axe'),
  ('Neth Pot');

-- Enable RLS but allow public read for all tables
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_modes ENABLE ROW LEVEL SECURITY;

-- Public read access for players (everyone can see)
CREATE POLICY "Anyone can read players" ON public.players FOR SELECT USING (true);

-- Public read access for users (everyone can see)
CREATE POLICY "Anyone can read users" ON public.users FOR SELECT USING (true);

-- Public read access for game_modes (everyone can see)
CREATE POLICY "Anyone can read game_modes" ON public.game_modes FOR SELECT USING (true);

-- Allow anyone to insert/update/delete (since auth is Discord ID based, not Supabase auth)
CREATE POLICY "Anyone can insert players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete players" ON public.players FOR DELETE USING (true);

CREATE POLICY "Anyone can insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete users" ON public.users FOR DELETE USING (true);

CREATE POLICY "Anyone can insert game_modes" ON public.game_modes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete game_modes" ON public.game_modes FOR DELETE USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_modes;