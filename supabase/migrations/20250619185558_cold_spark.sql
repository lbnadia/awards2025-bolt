/*
  # Création de la table des clubs pour le suivi des collectes de don du sang

  1. Nouvelle Table
    - `clubs`
      - `id` (uuid, clé primaire)
      - `name` (text, nom du club/association)
      - `adherents` (integer, nombre d'adhérents présents)
      - `location` (text, lieu de collecte)
      - `created_at` (timestamp, date de création)
      - `updated_at` (timestamp, date de dernière modification)

  2. Sécurité
    - Activer RLS sur la table `clubs`
    - Ajouter une politique pour permettre à tous les utilisateurs de lire et modifier les données
    - Pas d'authentification requise pour cette application publique
*/

CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  adherents integer NOT NULL DEFAULT 0,
  location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations (lecture, insertion, mise à jour, suppression)
-- Sans authentification pour cette application publique
CREATE POLICY "Allow all operations on clubs"
  ON clubs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS clubs_created_at_idx ON clubs(created_at DESC);
CREATE INDEX IF NOT EXISTS clubs_name_idx ON clubs(name);