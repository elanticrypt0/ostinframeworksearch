<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let searchTerm = '';  // Sin $state porque puede causar problemas en Astro
  let items = [];
  let filteredItems = [];

  function processData(data, parentPath = '') {
    let result = [];
    let counter = 0; // Contador global para asegurar IDs únicos
    
    function traverse(node, path) {
      const currentPath = path ? `${path} > ${node.name}` : node.name;
      counter++; // Incrementamos el contador para cada item
      
      // Agregamos counter al ID para garantizar unicidad
      const uniqueId = `${counter}-${node.name}-${node.type}`;
      
      result.push({
        id: uniqueId,
        name: node.name,
        type: node.type,
        url: node.url,
        path: currentPath
      });

      if (node.children) {
        node.children.forEach(child => {
          traverse(child, currentPath);
        });
      }
    }

    traverse(data, parentPath);
    return result;
  }

  function filterItems(term) {
    if (!term.trim()) {
      filteredItems = items;
      return;
    }
    
    const searchLower = term.toLowerCase();
    filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.path.toLowerCase().includes(searchLower)
    );
  }

  function highlightText(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<span class="bg-accent text-black">$1</span>');
  }

  function getIcon(type) {
    return type === 'folder' ? '📁' : '🔗';
  }

  // Manejo de la búsqueda
  function handleSearch(event) {
    searchTerm = event.target.value;
    filterItems(searchTerm);
  }

  onMount(async () => {
    try {
      const response = await fetch('/arf.json');
      const data = await response.json();
      items = processData(data);
      filteredItems = items; // Inicialmente mostramos todos los items
      console.log('Datos cargados:', items.length); // Debug
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  });
</script>

<div>
  <header class="mb-8 w-full max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-white mb-4">Buscador de <a href="https://osintframework.com/" target="_blank">OSINT Framework</a></h1>
    
    <div class="relative">
      <input
        type="text"
        value={searchTerm}
        on:input={handleSearch}
        placeholder="Buscar herramientas OSINT..."
        class="w-full px-4 py-3 input input-bordered input-secondary"
        autofocus
      />
      {#if searchTerm}
        <button
          on:click={() => {
            searchTerm = '';
            filterItems('');
          }}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      {/if}
    </div>
  </header>
</div>

<div class="mx-auto p-6">
  <div class="space-y-3">
    {#if items.length > 0}
      {#each filteredItems as item, index (index + '-' + item.path + '-' + (item.url || ''))}
        <div 
          transition:fade|local
          class="bg-base-300  rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
        >
          <div class="text-sm text-gray-100 mb-2 font-semibold">
            {@html highlightText(item.path, searchTerm)}
          </div>
          
          <div class="flex items-center gap-3">
            <span class="text-xl">{getIcon(item.type)}</span>
            <div class="flex-1">
              {#if item.type === 'url'}
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:text-accent hover:underline"
                >
                  {@html highlightText(item.name, searchTerm)}
                </a>
              {:else}
                <span class="text-gray-100">
                  {@html highlightText(item.name, searchTerm)}
                </span>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <div class="text-center py-8">
        <p class="text-gray-500">Cargando datos...</p>
      </div>
    {/if}

    {#if searchTerm && filteredItems.length === 0 && items.length > 0}
      <div class="text-center py-8">
        <p class="text-gray-500 text-lg">
          No se encontraron resultados para "{searchTerm}"
        </p>
      </div>
    {/if}
  </div>
</div>