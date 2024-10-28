import React, { useState, useEffect } from 'react';

function OsintSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState({ folders: [], allItems: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch('/arf.json');
      const data = await response.json();
      const processed = processData(data);
      setSearchData(processed);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  function processData(data) {
    const folders = [];
    const allItems = [];
    
    function extractItems(node, path = '') {
      const currentPath = path ? `${path} > ${node.name}` : node.name;
      
      if (node.type === 'folder') {
        folders.push({
          name: node.name,
          path: currentPath
        });
      }
      
      if (node.type === 'url') {
        allItems.push({
          name: node.name,
          url: node.url,
          path: currentPath
        });
      }

      if (node.children) {
        node.children.forEach(child => extractItems(child, currentPath));
      }
    }

    if (data.children) {
      data.children.forEach(child => extractItems(child));
    }

    return { folders, allItems };
  }

  // Función para resaltar el texto que coincide con la búsqueda
  function highlightText(text, highlight) {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <span key={index} className="bg-accent text-base">{part}</span> : 
        part
    );
  }

  const filteredResults = searchTerm
    ? searchData.allItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.path.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  return (
    <div className="osint-wrapper">
      <div className="sticky top-0 z-50 py-4 shadow-sm">
        <div className="w-full md:max-w-2xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar herramientas..."
              className="w-full p-4 pr-12 rounded-lg border-2 border-secondary focus:border-secondary outline-none bg-base"
              autoComplete="off"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
                aria-label="Limpiar búsqueda"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-8">
        {searchTerm ? (
          <div className="max-w-2xl mx-auto mt-8 space-y-4">
            <h2 className="text-xl font-bold mb-4">
              Resultados de búsqueda
              <span className="text-base font-normal text-gray-500 ml-2">
                ({filteredResults.length} {filteredResults.length === 1 ? 'resultado' : 'resultados'})
              </span>
            </h2>
            <div className="space-y-4">
              {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <div key={index} className="p-4 bg-base-300 rounded-lg shadow">
                    <div className="text-sm text-white mb-1">
                      {highlightText(result.path, searchTerm)}
                    </div>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline font-semibold"
                    >
                      {highlightText(result.name, searchTerm)}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No se encontraron resultados</p>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4">Categorías disponibles</h2>
            <div className="grid gap-4">
              {searchData.folders.map((folder, index) => (
                <div key={index} className="p-4 bg-base-300  rounded-lg shadow">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <span className="text-xl">📁</span>
                    <span>{folder.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OsintSearch;