import React, { useState } from 'react';
import { Plus, Minus, Users, MapPin, Activity, Trash2 } from 'lucide-react';
import { useClubs } from './hooks/useClubs';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const { clubs, loading, error, addClub, updateAdherents, deleteClub, refetch } = useClubs();
  const [newClub, setNewClub] = useState({
    name: '',
    adherents: '',
    location: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClub.name.trim() || !newClub.adherents || !newClub.location.trim()) {
      return;
    }

    setSubmitting(true);
    const result = await addClub({
      name: newClub.name,
      adherents: parseInt(newClub.adherents),
      location: newClub.location
    });

    if (result.success) {
      setNewClub({ name: '', adherents: '', location: '' });
    }
    setSubmitting(false);
  };

  const handleUpdateAdherents = async (id: string, change: number) => {
    const club = clubs.find(c => c.id === id);
    if (club) {
      await updateAdherents(id, club.adherents + change);
    }
  };

  const totalAdherents = clubs.reduce((sum, club) => sum + club.adherents, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Official Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-6 mb-8">
            {/* Official Logo */}
            <div className="relative">
              <img 
                src="/Logo don sang 2021-4.jpg" 
                alt="Logo Amicale pour le Don de Sang Bénévole des Pays de Daoulas Le Fou"
                className="w-48 h-48 object-contain drop-shadow-lg"
              />
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 leading-tight mb-2">
                Amicale pour le Don de Sang Bénévole
              </h1>
              <p className="text-2xl text-red-600 font-semibold mb-4">
                des Pays de Daoulas Le Fou
              </p>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-red-100">
                <p className="text-gray-700 text-xl font-medium mb-2">
                  Tableau de Suivi des Collectes de Dons du Sang
                </p>
                <p className="text-gray-600 text-lg">
                  "Donnez votre sang, donnez pour votre club !"
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Merci de signaler votre association à l'équipe d'accueil
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={refetch} />
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Adhérents Présents</p>
                <p className="text-3xl font-bold text-gray-800">{totalAdherents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Clubs Participants</p>
                <p className="text-3xl font-bold text-gray-800">{clubs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Lieux de Collecte</p>
                <p className="text-3xl font-bold text-gray-800">
                  {new Set(clubs.map(club => club.location)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Club Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Plus className="w-6 h-6 text-red-600" />
            </div>
            Enregistrer un Club
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Club / Association
              </label>
              <input
                type="text"
                value={newClub.name}
                onChange={(e) => setNewClub(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Ex: FC Daoulas"
                required
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'Adhérents Présents
              </label>
              <input
                type="number"
                min="0"
                value={newClub.adherents}
                onChange={(e) => setNewClub(prev => ({ ...prev, adherents: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Ex: 25"
                required
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu de Collecte
              </label>
              <input
                type="text"
                value={newClub.location}
                onChange={(e) => setNewClub(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Ex: Salle des Fêtes Daoulas"
                required
                disabled={submitting}
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-red-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Clubs Table */}
        {clubs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b bg-gradient-to-r from-red-50 to-blue-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                Clubs Participants
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Club / Association
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Adhérents Présents
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Lieu de Collecte
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clubs.map((club, index) => (
                    <tr 
                      key={club.id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{club.name}</p>
                            <p className="text-sm text-gray-500">
                              Enregistré le {new Date(club.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleUpdateAdherents(club.id, -1)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={club.adherents === 0}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3 rounded-lg min-w-[80px] text-center shadow-inner">
                            <span className="text-2xl font-bold text-gray-800">
                              {club.adherents}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleUpdateAdherents(club.id, 1)}
                            className="bg-green-100 hover:bg-green-200 text-green-600 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-800">{club.location}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => deleteClub(club.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                          title="Supprimer le club"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {clubs.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400 mx-auto mt-1" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucun club enregistré
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par enregistrer le premier club participant à la collecte.
            </p>
            <p className="text-sm text-gray-500 italic">
              "Ensemble, sauvons des vies grâce au don du sang"
            </p>
          </div>
        )}

        {/* Footer with Awards Reference */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-red-100">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img 
                src="/Awards.png" 
                alt="Awards 2025" 
                className="h-16 object-contain"
              />
            </div>
            <p className="text-gray-700 font-medium mb-2">
              Amicale pour le Don de Sang Bénévole des Pays de Daoulas Le Fou
            </p>
            <p className="text-gray-600 text-sm mb-2">
              Du 01 juin 2025 au 31 octobre 2025
            </p>
            <p className="text-gray-500 text-xs">
              Inscrivez votre club au pré-accueil • Ensemble pour sauver des vies 🩸❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;