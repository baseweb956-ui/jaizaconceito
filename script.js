const productImages = {
  1:'img_cards/567420527_1144961967602736_8874762468840010518_n.jpg',
  2:'img_cards/591144681_18384592357177451_7013950209212524001_n.jpg',
  3:'img_cards/591701399_18385361119177451_6745676727611225088_n.jpg',
  4:'img_cards/598137597_18385440679177451_1465029758249146469_n.jpg',
  5:'img_cards/600202973_18385441084177451_5067659837274146723_n.jpg',
  6:'img_cards/602852493_18386070226177451_4926305459904790948_n.jpg',
  7:'img_cards/602886303_18386070994177451_6624943540345244496_n.jpg',
  8:'img_cards/602914470_18386072935177451_535697872179074505_n.jpg',
  9:'img_cards/608407994_18387249676177451_8525447257459499286_n.jpg',
  10:'img_cards/608639599_18387249787177451_3920591695737815582_n.jpg',
  11:'img_cards/715549785_1370217318253114_8778606233882939885_n.jpg',
  12:'img_cards/715550143_18411833824177451_2549475589609607944_n.jpg'
};

const products = [
  {id:1,name:'Vestido Longo Marsala',category:'feminino',label:'DESTAQUE',tone:'Marsala · longo · ombro a ombro',description:'Vestido longo marsala com decote ombro a ombro e tecido drapeado.',cardDescription:'Modelo longo com caimento drapeado e decote ombro a ombro.',contactOnly:true},
  {id:2,name:'Macacão Azul Claro',category:'feminino',label:'NOVO',tone:'Azul claro · pantalona · detalhe na cintura',description:'Macacão pantalona azul claro com parte superior transpassada e cinto com fivela.',cardDescription:'Macacão pantalona com cintura marcada por fivela.',contactOnly:true},
  {id:3,name:'Vestido Verde Menta',category:'feminino',label:'NOVO',tone:'Verde menta · curto · com cinto',description:'Vestido curto verde menta sem mangas, com cinto e bolsos frontais.',cardDescription:'Vestido curto com cinto e bolsos frontais.',contactOnly:true},
  {id:4,name:'Vestido Verde',category:'feminino',label:'NOVO',tone:'Verde · curto · alças finas',description:'Vestido curto verde de alças finas com detalhe drapeado na lateral.',cardDescription:'Modelo curto de alças finas com detalhe drapeado.',contactOnly:true},
  {id:5,name:'Conjunto Rosa',category:'feminino',label:'NOVO',tone:'Rosa · top tomara que caia e calça pantalona',description:'Conjunto rosa com top tomara que caia com recortes e calça pantalona.',cardDescription:'Top com recortes combinado com calça pantalona.',contactOnly:true},
  {id:6,name:'Vestido Longo Terracota',category:'feminino',label:'NOVO',tone:'Terracota · longo · manga única',description:'Vestido longo terracota de um ombro só, com manga longa e fenda lateral.',cardDescription:'Vestido de manga única com fenda lateral.',contactOnly:true},
  {id:7,name:'Vestido Longo Vermelho',category:'feminino',label:'NOVO',tone:'Vermelho · longo · decote coração',description:'Vestido longo vermelho com busto estruturado e decote coração.',cardDescription:'Modelo longo com busto estruturado e decote coração.',contactOnly:true},
  {id:8,name:'Conjunto Rosa com Saia',category:'feminino',label:'NOVO',tone:'Rosa · cropped frente única e saia longa',description:'Conjunto rosa com cropped frente única franzido e saia longa com amarração.',cardDescription:'Cropped frente única com saia longa combinando.',contactOnly:true},
  {id:9,name:'Vestido Branco Curto',category:'feminino',label:'NOVO',tone:'Branco · curto · alças largas',description:'Vestido branco curto de alças largas, com detalhe de babado nos ombros.',cardDescription:'Modelo curto com alças largas e babados nos ombros.',contactOnly:true},
  {id:10,name:'Vestido Amarelo Curto',category:'feminino',label:'NOVO',tone:'Amarelo claro · curto · tomara que caia',description:'Vestido amarelo claro curto tomara que caia com laço no busto.',cardDescription:'Tomara que caia com detalhe de laço frontal.',contactOnly:true},
  {id:11,name:'Vestido Preto com Renda',category:'feminino',label:'NOVO',tone:'Preto · curto · saia com renda',description:'Vestido preto curto de alças finas com saia assimétrica e detalhe de renda.',cardDescription:'Alças finas e saia assimétrica com renda.',contactOnly:true},
  {id:12,name:'Blusa Preta e Short Jeans',category:'feminino',label:'NOVO',tone:'Preto · manga longa · short jeans',description:'Blusa preta de manga longa e ombro a ombro combinada com short jeans claro.',cardDescription:'Blusa ombro a ombro com short jeans claro.',contactOnly:true}
];

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const safeRead = (k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??f}catch{return f}};

const productIds = new Set(products.map(product=>product.id));
const shopWhatsAppNumber = '5511927188376';
const savedIds = key => {
  const value=safeRead(key,[]);
  return Array.isArray(value) ? [...new Set(value.map(Number).filter(id=>productIds.has(id)))] : [];
};
let cart = savedIds('ameimodassCart');
let favorites = savedIds('ameimodassWishlist');
let activeCategory='all', searchTerm='', sortMode='featured', favoriteMode=false;
let modalReturnFocus=null;

const categoryName = {corsets:'Corsets',tops:'Blusas & tops',jeans:'Jeans'};
const productRevealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        productRevealObserver.unobserve(entry.target);
      }
    }),{threshold:.14,rootMargin:'0px 0px -35px 0px'})
  : null;

function toast(msg){
  const n=$('#toast'); n.textContent=msg; n.classList.add('show');
  clearTimeout(toast.t); toast.t=setTimeout(()=>n.classList.remove('show'),2200);
}
function persist(){
  try{
    localStorage.setItem('ameimodassCart',JSON.stringify(cart));
    localStorage.setItem('ameimodassWishlist',JSON.stringify(favorites));
  }catch{}
}

function filteredProducts(){
  const list = products.filter(p=>{
    const okCat = activeCategory==='all' || activeCategory==='feminino' || p.category===activeCategory;
    const okQ = !searchTerm || `${p.name} ${p.category} ${p.tone}`.toLowerCase().includes(searchTerm.toLowerCase());
    return okCat && okQ && (!favoriteMode || favorites.includes(p.id));
  });
  const categoryOrder = {corsets:0,tops:1,jeans:2};
  return sortMode==='newest' ? list.sort((a,b)=>b.id-a.id) : list.sort((a,b)=>categoryOrder[a.category]-categoryOrder[b.category] || a.id-b.id);
}

function productCard(p,i){
  const fav = favorites.includes(p.id);
  return `<article class="product-card" style="--i:${i}" data-open-product="${p.id}" tabindex="0" aria-label="Ver detalhes de ${p.name}">
    <div class="product-image">
      <img src="${productImages[p.id]}" alt="${p.name}" loading="lazy">
      <span class="product-label"${p.label==='DESTAQUE'?' data-featured':''}>${p.label}</span>
      <button class="favorite-button ${fav?'is-favorite':''}" data-favorite="${p.id}" aria-label="${fav?'Remover dos favoritos':'Adicionar aos favoritos'}" aria-pressed="${fav}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3Z"/></svg></button>
    </div>
    <div class="product-info">
      <span class="product-category">${categoryName[p.category]||'Moda feminina'}</span>
      <div class="product-title-row"><h3 class="product-title">${p.name}</h3></div>
      <p class="product-card-description">${p.description}</p>
      <div class="product-card-actions">
        <button class="quick-add" data-quick-add="${p.id}">VER DETALHES <span>↗</span></button>
        <button type="button" class="card-add-cart" data-card-add="${p.id}" aria-label="Adicionar ${p.name} à lista" title="Adicionar à lista">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function renderProducts(){
  const list = filteredProducts();
  $('#productGrid').innerHTML = list.map(productCard).join('');
  const cards = $$('.product-card', $('#productGrid'));
  if(productRevealObserver) cards.forEach(card=>productRevealObserver.observe(card));
  else cards.forEach(card=>card.classList.add('is-visible'));
  $('#noResults').hidden = list.length !== 0;
  $('#allCount').textContent = products.length;
  $('#favoriteToggle').setAttribute('aria-pressed',String(favoriteMode));
  $$('.filter-chip').forEach(b=>{
    const selected=b.dataset.category===activeCategory;
    b.classList.toggle('is-selected',selected);
    b.setAttribute('aria-pressed',String(selected));
  });
  $$('.nav-category').forEach(l=>l.classList.toggle('is-active',l.dataset.category===activeCategory));
}

function setCategory(cat){
  activeCategory=cat; favoriteMode=false;
  $('#favoriteToggle').classList.remove('is-selected');
  $('#searchInput').value=''; searchTerm='';
  renderProducts(); closeMobile();
}

function toggleFavorite(id){
  const n = Number(id);
  favorites = favorites.includes(n) ? favorites.filter(i=>i!==n) : [...favorites,n];
  $('#favoriteCount').textContent = favorites.length;
  persist(); renderProducts();
  toast(favorites.includes(n)?'Peça salva':'Peça removida');
}

function renderCart(){
  const items=products.filter(p=>cart.includes(p.id));
  $('#bagCount').textContent=items.length;
  $('#drawerCount').textContent=`(${items.length})`;
  $('#cartItems').innerHTML=items.map(p=>`<div class="selection-item"><img src="${productImages[p.id]}" alt=""><div><strong>${p.name}</strong><small>Consulte valor e disponibilidade</small></div><button type="button" data-remove-selection="${p.id}" aria-label="Remover ${p.name}">Remover</button></div>`).join('');
  $('#cartEmpty').classList.toggle('visible',items.length===0);
  $('#cartFooter').classList.toggle('hidden',items.length===0);
}
function addToCart(id){
  const productId=Number(id);
  if(!cart.includes(productId)) cart.push(productId);
  persist(); renderCart(); toast('Peça adicionada à sua lista');
}
function removeFromCart(id){
  cart=cart.filter(productId=>productId!==Number(id));
  persist(); renderCart();
}

function openProduct(id){
  const p = products.find(x=>x.id===Number(id)); if(!p) return;
  modalReturnFocus=document.activeElement;
  $('#productModal').removeAttribute('inert');
  $('#modalContent').innerHTML = `<div class="modal-product">
    <div class="modal-product-image" style="--product-photo:url('${productImages[p.id]}')"><img src="${productImages[p.id]}" alt="${p.name}"></div>
    <div class="modal-product-info">
      <p class="eyebrow">${categoryName[p.category]||'Moda'} · ${p.label}</p>
      <h2>${p.name}</h2>
      <p class="modal-description">${p.description}</p>
      <p class="modal-description">Consulte pelo WhatsApp o valor, as cores, os tamanhos e a disponibilidade.</p>
      <button type="button" class="button button-outline modal-add" data-add-selection="${p.id}">ADICIONAR À LISTA</button>
      <a class="button modal-add modal-add-whatsapp" href="https://wa.me/${shopWhatsAppNumber}?text=${encodeURIComponent('Olá! Tenho interesse em ' + p.name + '. Pode me informar valor, cores e tamanhos disponíveis?')}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.1L3.5 20l1.2-4.3a8.2 8.2 0 1 1 15.5-4Z"/><path d="M8.2 7.8c.2-.4.5-.5.8-.5h.4c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .6.4.7 1 1.3 1.7 1.7.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .4-.2 1.1-.6 1.4-.4.4-1 .6-1.6.5-1-.1-2.2-.7-3.5-1.8-1.1-1-1.9-2.2-2.1-3.2-.2-.9.1-1.8.5-2.5Z"/></svg>
        CHAMAR NO WHATSAPP <span>↗</span>
      </a>
    </div>
  </div>`;
  $('#productModal').classList.add('open');
  $('#productModal').setAttribute('aria-hidden','false');
  document.body.classList.add('locked');
}
function closeProduct(){
  $('#productModal').classList.remove('open');
  $('#productModal').setAttribute('aria-hidden','true');
  $('#productModal').setAttribute('inert','');
  if(!$('#cartDrawer').classList.contains('open')&&!$('#mobileMenu').classList.contains('open')) document.body.classList.remove('locked');
  if(modalReturnFocus?.isConnected) modalReturnFocus.focus();
  modalReturnFocus=null;
}

function openCart(){ closeMobile(); $('#cartDrawer').removeAttribute('inert'); $('#cartDrawer').classList.add('open'); $('#cartDrawer').setAttribute('aria-hidden','false'); $('#bagToggle').setAttribute('aria-expanded','true'); $('#scrim').classList.add('open'); document.body.classList.add('locked'); }
function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#cartDrawer').setAttribute('aria-hidden','true'); $('#cartDrawer').setAttribute('inert',''); $('#bagToggle').setAttribute('aria-expanded','false'); $('#scrim').classList.remove('open'); if(!$('#mobileMenu').classList.contains('open')&&!$('#productModal').classList.contains('open')) document.body.classList.remove('locked'); }
function openMobile(){ $('#mobileMenu').removeAttribute('inert'); $('#mobileMenu').classList.add('open'); $('#mobileMenu').setAttribute('aria-hidden','false'); $('#menuToggle').setAttribute('aria-expanded','true'); $('#scrim').classList.add('open'); document.body.classList.add('locked'); }
function closeMobile(){ $('#mobileMenu').classList.remove('open'); $('#mobileMenu').setAttribute('aria-hidden','true'); $('#mobileMenu').setAttribute('inert',''); $('#menuToggle').setAttribute('aria-expanded','false'); if(!$('#cartDrawer').classList.contains('open')) $('#scrim').classList.remove('open'); if(!$('#cartDrawer').classList.contains('open')&&!$('#productModal').classList.contains('open')) document.body.classList.remove('locked'); }

document.addEventListener('click', e=>{
  const catLink = e.target.closest('[data-category]');
  if(catLink){ e.preventDefault(); setCategory(catLink.dataset.category); $('#produtos').scrollIntoView({behavior:'smooth'}); return; }
  const fav = e.target.closest('[data-favorite]'); if(fav){ e.stopPropagation(); toggleFavorite(fav.dataset.favorite); return; }
  const cardAdd = e.target.closest('[data-card-add]'); if(cardAdd){ e.stopPropagation(); addToCart(cardAdd.dataset.cardAdd); return; }
  const quick = e.target.closest('[data-quick-add]'); if(quick){ e.stopPropagation(); openProduct(quick.dataset.quickAdd); return; }
  const add = e.target.closest('[data-add-selection]'); if(add){ e.stopPropagation(); addToCart(add.dataset.addSelection); return; }
  const remove = e.target.closest('[data-remove-selection]'); if(remove){ removeFromCart(remove.dataset.removeSelection); return; }
  const card = e.target.closest('[data-open-product]'); if(card){ openProduct(card.dataset.openProduct); return; }
  if(e.target.closest('[data-close-modal]')) closeProduct();
});

$('#sortSelect').addEventListener('change', e=>{ sortMode=e.target.value; renderProducts(); });
$('#searchToggle').addEventListener('click', ()=>{ const open=$('#searchPanel').classList.toggle('open'); $('#searchToggle').setAttribute('aria-expanded',String(open)); if(open) $('#searchInput').focus(); });
$('#searchClose').addEventListener('click', ()=>{ $('#searchPanel').classList.remove('open'); $('#searchToggle').setAttribute('aria-expanded','false'); $('#searchInput').value=''; searchTerm=''; renderProducts(); $('#searchToggle').focus(); });
$('#searchInput').addEventListener('input', e=>{ searchTerm=e.target.value.trim(); favoriteMode=false; renderProducts(); });
$('#favoriteToggle').addEventListener('click', ()=>{
  if(!favorites.length){ toast('Toque no coração de uma peça'); return; }
  favoriteMode=!favoriteMode; activeCategory='all';
  $('#favoriteToggle').classList.toggle('is-selected',favoriteMode);
  renderProducts(); $('#produtos').scrollIntoView({behavior:'smooth'});
});
$('#bagToggle').addEventListener('click', openCart);
$('#cartClose').addEventListener('click', closeCart);
$('#scrim').addEventListener('click', ()=>{ closeCart(); closeMobile(); });
$('#menuToggle').addEventListener('click', openMobile);
$('#mobileClose').addEventListener('click', closeMobile);
$('#mobileMenu').addEventListener('click', e=>{ if(e.target.closest('a:not([data-category])')) closeMobile(); });
$('#mobileFavorites').addEventListener('click', ()=>{
  closeMobile();
  if(!favorites.length){ toast('Toque no coração de uma peça para salvá-la'); return; }
  activeCategory='all'; favoriteMode=true; $('#favoriteToggle').classList.add('is-selected');
  renderProducts(); $('#produtos').scrollIntoView({behavior:'smooth'});
});
$('#continueShopping').addEventListener('click', closeCart);
$('#showAll').addEventListener('click', ()=>setCategory('all'));
document.addEventListener('click', e=>{
  if(!e.target.closest('#searchPanel')&&!e.target.closest('#searchToggle')){
    $('#searchPanel').classList.remove('open');
    $('#searchToggle').setAttribute('aria-expanded','false');
  }
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeCart(); closeMobile(); closeProduct(); $('#searchPanel').classList.remove('open'); $('#searchToggle').setAttribute('aria-expanded','false'); }});
document.addEventListener('keydown', e=>{
  const card=e.target.closest('[data-open-product]');
  if(!card || e.target!==card || !['Enter',' '].includes(e.key)) return;
  e.preventDefault(); openProduct(card.dataset.openProduct);
});

/* ============ CARROSSEL DO HERO ============ */
const heroSlidesData = [
  { num:'01', text:'Corset nude de renda' },
  { num:'02', text:'Look da coleção' },
  { num:'03', text:'Novidades Ameimodass' },
];

function initHeroCarousel(){
  const carousel = $('#heroCarousel');
  const photo = $('#heroPhoto');
  const wipe = $('#heroWipe');
  const glowFollow = $('#heroGlowFollow');
  const badgeRing = $('#heroBadgeRing');
  if(!carousel) return;
  const slides = $$('.hero-slide', carousel);
  const timeline = $$('.hero-tl');
  const captionNum = $('#heroCounterNum');
  const captionText = $('#heroCaptionText');
  if(!slides.length) return;

  const DURATION = 4500;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RING_CIRCUMFERENCE = 2 * Math.PI * 17;
  let current = 0;
  let timer = null;

  function updateBadgeRing(){
    if(!badgeRing) return;
    badgeRing.style.strokeDasharray = RING_CIRCUMFERENCE;
    badgeRing.style.strokeDashoffset = RING_CIRCUMFERENCE;
    void badgeRing.getBoundingClientRect();
    badgeRing.style.transition = 'stroke-dashoffset 4.5s linear';
    badgeRing.style.strokeDashoffset = 0;
  }

  function rollNumber(newVal){
    if(!captionNum) return;
    captionNum.classList.add('rolling');
    setTimeout(()=>{
      captionNum.textContent = newVal;
      captionNum.classList.remove('rolling');
      captionNum.style.transition = 'none';
      captionNum.style.transform = 'translateY(120%)';
      captionNum.style.opacity = '0';
      void captionNum.offsetWidth;
      captionNum.style.transition = '';
      captionNum.style.transform = '';
      captionNum.style.opacity = '';
    }, 320);
  }

  function render(){
    slides.forEach((s, i)=>{
      const active=i===current;
      const next=i===(current+1)%slides.length;
      const prev=i===(current-1+slides.length)%slides.length;
      s.classList.toggle('is-active',active);
      s.classList.toggle('is-next',!active&&next);
      s.classList.toggle('is-prev',!active&&prev);
      s.setAttribute('aria-hidden',String(!active));
    });
    timeline.forEach((t, i)=>{
      t.classList.remove('is-active','is-past');
      if(i<current) t.classList.add('is-past');
      if(i===current){ void t.offsetWidth; t.classList.add('is-active'); }
      t.setAttribute('aria-current',String(i===current));
    });
    const data = heroSlidesData[current] || {};
    const num = data.num || String(current+1).padStart(2,'0');
    if(captionNum) rollNumber(num);
    if(captionText) captionText.textContent = data.text || '';
    updateBadgeRing();
  }

  function fireWipe(){
    if(!wipe) return;
    wipe.classList.remove('is-running');
    void wipe.offsetWidth;
    wipe.classList.add('is-running');
  }

  function goTo(i){
    const prev = current;
    current = (i + slides.length) % slides.length;
    if(prev !== current) fireWipe();
    render();
  }
  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }
  function start(){ stop(); if(!reduceMotion) timer = setInterval(next, DURATION); }
  function stop(){ if(timer) clearInterval(timer); timer = null; }

  $('.hero-arrow-next')?.addEventListener('click', ()=>{ next(); start(); });
  $('.hero-arrow-prev')?.addEventListener('click', ()=>{ prev(); start(); });
  timeline.forEach((t, i)=>t.addEventListener('click', ()=>{ goTo(i); start(); }));

  let sx=0, sy=0;
  carousel.addEventListener('touchstart', e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; stop(); }, {passive:true});
  carousel.addEventListener('touchend', e=>{
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){ dx < 0 ? next() : prev(); }
    start();
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', ()=>{ document.hidden ? stop() : start(); });

  if(photo && window.matchMedia('(hover:hover)').matches){
    photo.addEventListener('mousemove', e=>{
      const rect = photo.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = (x / rect.width  - .5);
      const ny = (y / rect.height - .5);
      const img = photo.querySelector('.hero-slide.is-active img');
      if(img){
        img.style.setProperty('--mx', (-nx * 4).toFixed(2) + 'px');
        img.style.setProperty('--my', (-ny * 4).toFixed(2) + 'px');
      }
      if(glowFollow){
        glowFollow.style.setProperty('--gx', x + 'px');
        glowFollow.style.setProperty('--gy', y + 'px');
      }
    });
    photo.addEventListener('mouseleave', ()=>{
      const img = photo.querySelector('.hero-slide.is-active img');
      if(img){
        img.style.setProperty('--mx','0px');
        img.style.setProperty('--my','0px');
      }
    });
  }

  render();
  start();
}

function initScrollReveal(){
  if(!('IntersectionObserver' in window)){ $$('.reveal').forEach(el=>el.classList.add('in-view')); return; }
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  $$('.reveal').forEach(el=>observer.observe(el));
}

function initHeaderScroll(){
  const header = $('#top');
  const onScroll = ()=> header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
}

$('#favoriteCount').textContent = favorites.length;
renderCart();
renderProducts();
initHeroCarousel();
initScrollReveal();
initHeaderScroll();

/* Imagem que falhar ao carregar: esconde o ícone quebrado e mantém o fundo do card */
document.addEventListener('error', e=>{
  const img=e.target;
  if(img && img.tagName==='IMG'){ img.classList.add('img-broken'); console.warn('Imagem não encontrada:', img.getAttribute('src')); }
}, true);
