// Função para carregar o arquivo JSON
async function carregarDominiosSuspeitos() {
    const response = await fetch(chrome.runtime.getURL("dados.json"));
    const dominios = await response.json();
    return dominios;
  }
  
  function extrairDominio(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }
  
  let dominiosSuspeitos = [];
  
  async function marcarResultados() {
    if (dominiosSuspeitos.length === 0) {
      dominiosSuspeitos = await carregarDominiosSuspeitos();
    }
  
    const resultados = document.querySelectorAll("a:not([data-verificado])");
  
    resultados.forEach(link => {
      const dominio = extrairDominio(link.href);
      if (dominiosSuspeitos.includes(dominio)) {
        const alerta = document.createElement("span");
        alerta.textContent = " ❌ SITE JA VISITADO";
        alerta.className = "alerta-dominio";
        link.parentNode.appendChild(alerta);
      }
      // Marcar o link como já verificado
      link.setAttribute("data-verificado", "true");
    });
  }
  
  // Executar inicialmente
  document.addEventListener("DOMContentLoaded", marcarResultados());
  
  // Observer para mudanças dinâmicas no DOM
  const observer = new MutationObserver(() => {
    marcarResultados();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  