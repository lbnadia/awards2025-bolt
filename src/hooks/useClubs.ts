import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Club {
  id: string;
  name: string;
  adherents: number;
  location: string;
  created_at: string;
  updated_at: string;
}

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les clubs depuis Supabase
  const fetchClubs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClubs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Erreur lors du chargement des clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un nouveau club
  const addClub = async (clubData: { name: string; adherents: number; location: string }) => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .insert([{
          name: clubData.name.trim(),
          adherents: clubData.adherents,
          location: clubData.location.trim(),
        }])
        .select()
        .single();

      if (error) throw error;
      
      setClubs(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout';
      setError(errorMessage);
      console.error('Erreur lors de l\'ajout du club:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Mettre à jour le nombre d'adhérents
  const updateAdherents = async (id: string, newCount: number) => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .update({ 
          adherents: Math.max(0, newCount),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClubs(prev => prev.map(club => 
        club.id === id ? { ...club, adherents: data.adherents, updated_at: data.updated_at } : club
      ));
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      console.error('Erreur lors de la mise à jour:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Supprimer un club
  const deleteClub = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clubs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClubs(prev => prev.filter(club => club.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      console.error('Erreur lors de la suppression:', err);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return {
    clubs,
    loading,
    error,
    addClub,
    updateAdherents,
    deleteClub,
    refetch: fetchClubs
  };
}