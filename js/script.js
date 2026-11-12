/* ==================================================================
   ÍNDICE
   1. Animação ao rolar (revelar elementos)
   2. Barra de progresso e cabeçalho
   3. Menu lateral
   4. Tema claro/escuro
   5. Foto de perfil (upload)
   ================================================================== */


/* ------------------------------------------------------------------
   1. ANIMAÇÃO AO ROLAR
   Observa todos os elementos com data-reveal="..." e, quando eles
   entram na tela, adiciona a classe "visivel" (veja o CSS, seção 8).
   ------------------------------------------------------------------ */
(function iniciarAnimacaoDeRolagem() {
  const itens = document.querySelectorAll('[data-reveal]');
  if (!itens.length) return;

  // Em grupos com data-stagger (grades de cards, habilidades), cada item
  // entra um pouquinho depois do anterior. Mude 0.12 para ajustar (segundos).
  const ATRASO_ENTRE_ITENS = 0.12;
  document.querySelectorAll('[data-stagger]').forEach((grupo) => {
    grupo.querySelectorAll(':scope > [data-reveal]').forEach((el, i) => {
      el.style.transitionDelay = (i % 6) * ATRASO_ENTRE_ITENS + 's';
    });
  });

  // Sem suporte ao IntersectionObserver: mostra tudo de uma vez.
  if (!('IntersectionObserver' in window)) {
    itens.forEach((el) => el.classList.add('visivel'));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          observador.unobserve(entrada.target); // anima só uma vez
        }
      });
    },
    {
      threshold: 0.15,                 // % do elemento visível para disparar
      rootMargin: '0px 0px -40px 0px'  // dispara um pouco antes de chegar embaixo
    }
  );

  itens.forEach((el) => observador.observe(el));
})();


/* ------------------------------------------------------------------
   2. BARRA DE PROGRESSO E CABEÇALHO
   ------------------------------------------------------------------ */
(function iniciarBarraECabecalho() {
  const barra = document.getElementById('progresso');
  const cabecalho = document.getElementById('cabecalho');
  let aguardando = false;

  function atualizar() {
    const rolagem = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (barra) barra.style.transform = 'scaleX(' + (total > 0 ? rolagem / total : 0) + ')';
    if (cabecalho) cabecalho.classList.toggle('rolou', rolagem > 20);
    aguardando = false;
  }

  window.addEventListener('scroll', () => {
    if (!aguardando) {
      aguardando = true;
      requestAnimationFrame(atualizar);
    }
  }, { passive: true });

  atualizar();
})();


/* ------------------------------------------------------------------
   3. MENU LATERAL
   ------------------------------------------------------------------ */
(function iniciarMenu() {
  const botao = document.getElementById('btnMenu');
  const menu = document.getElementById('menu');
  const fundo = document.getElementById('menuFundo');
  if (!botao || !menu || !fundo) return;

  function definir(aberto) {
    menu.classList.toggle('aberto', aberto);
    fundo.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
  }

  botao.addEventListener('click', () => definir(!menu.classList.contains('aberto')));
  fundo.addEventListener('click', () => definir(false));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => definir(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') definir(false); });
})();


/* ------------------------------------------------------------------
   4. TEMA CLARO / ESCURO
   A escolha fica salva no navegador.
   ------------------------------------------------------------------ */
(function iniciarTema() {
  const botao = document.getElementById('btnTema');
  const raiz = document.documentElement;

  try {
    if (localStorage.getItem('tema') === 'claro') raiz.setAttribute('data-tema', 'claro');
  } catch (e) { /* armazenamento indisponível: segue sem salvar */ }

  if (!botao) return;
  botao.addEventListener('click', () => {
    const claro = raiz.getAttribute('data-tema') === 'claro';
    if (claro) raiz.removeAttribute('data-tema');
    else raiz.setAttribute('data-tema', 'claro');
    try { localStorage.setItem('tema', claro ? 'escuro' : 'claro'); } catch (e) {}
  });
})();


/* ------------------------------------------------------------------
   5. FOTO DE PERFIL (UPLOAD)

   Como funciona:
   - Ao abrir o site, procura a foto nesta ordem:
       1) a foto que você enviou neste navegador (salva no localStorage)
       2) o arquivo  assets/foto.jpg  (a forma PERMANENTE)
   - Ao clicar na foto e escolher uma imagem, ela aparece na hora.

   IMPORTANTE: o upload pelo clique fica salvo só no SEU navegador.
   Quem visitar o site pela Vercel só vê a foto do arquivo assets/foto.jpg.
   Para publicar, salve sua foto em  assets/foto.jpg  e envie ao GitHub.
   ------------------------------------------------------------------ */
(function iniciarFoto() {
  const CAMINHO_FOTO_PERMANENTE = 'assets/foto.jpg'; // <<< troque se usar .png
  const TAMANHO_MAXIMO = 800;                        // px (reduz fotos grandes)

  const input = document.getElementById('inputFoto');
  const img = document.getElementById('fotoPerfil');
  const vazio = document.getElementById('fotoVazia');
  const moldura = img ? img.closest('.foto') : null;
  if (!input || !img || !vazio || !moldura) return;

  function mostrar(src) {
    img.src = src;
    img.hidden = false;
    vazio.hidden = true;
    moldura.classList.add('tem-foto');
  }

  function mostrarPlaceholder() {
    img.hidden = true;
    vazio.hidden = false;
    moldura.classList.remove('tem-foto');
  }

  // 1) foto enviada anteriormente neste navegador
  let salva = null;
  try { salva = localStorage.getItem('fotoPerfil'); } catch (e) {}

  if (salva) {
    mostrar(salva);
  } else {
    // 2) foto permanente (só mostra se o arquivo existir)
    const teste = new Image();
    teste.onload = () => mostrar(CAMINHO_FOTO_PERMANENTE);
    teste.onerror = mostrarPlaceholder;
    teste.src = CAMINHO_FOTO_PERMANENTE;
  }

  // Quando o usuário escolhe um arquivo
  input.addEventListener('change', () => {
    const arquivo = input.files && input.files[0];
    if (!arquivo || !arquivo.type.startsWith('image/')) return;

    const leitor = new FileReader();
    leitor.onload = () => {
      const original = new Image();
      original.onload = () => {
        // reduz a imagem para não estourar o limite do navegador
        const escala = Math.min(1, TAMANHO_MAXIMO / Math.max(original.width, original.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(original.width * escala);
        canvas.height = Math.round(original.height * escala);
        canvas.getContext('2d').drawImage(original, 0, 0, canvas.width, canvas.height);

        const dados = canvas.toDataURL('image/jpeg', 0.9);
        mostrar(dados);
        try { localStorage.setItem('fotoPerfil', dados); } catch (e) {}
      };
      original.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });
})();
