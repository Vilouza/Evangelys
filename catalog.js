/* Catalogue Evangelys : modèles, prix, liens Stripe et interaction des fiches. */
const CONTACT="contact@evangelys.fr";
const ROOT=window.EVANGELYS_ROOT||"";
const STRIPE={
  creche:{"9p":"https://buy.stripe.com/cNidR80Ap8vt1BZ0e4gUM00"},
  lourdes:{9:"https://buy.stripe.com/28E9ASaaZ3b9fsP5yogUM01",12:"https://buy.stripe.com/7sY28q5UJbHFfsP9OEgUM02",15:"https://buy.stripe.com/3cI4gy2Ix2750xV6CsgUM03"},
  miraculeuse:{9:"https://buy.stripe.com/00wbJ03MBh1Z0xVd0QgUM04",12:"https://buy.stripe.com/4gM9ASfvj5jh6Wj4ukgUM05",15:"https://buy.stripe.com/bJe6oGgznfXVfsP9OEgUM06"},
  famille:{9:"https://buy.stripe.com/3cI14m6YN4fd4Obgd2gUM07",12:"https://buy.stripe.com/14AbJ02Ix9zxfsP0e4gUM08"}
};
/* Lots de Vierges : chaque Vierge en plus coûte 2 € de moins. */
const LOTS={
  lourdes:{9:{2:"https://buy.stripe.com/bJe7sK5UJ8vt5Sf5yogUM09",3:"https://buy.stripe.com/aFadR83MBh1Z2G34ukgUM0a"},
           12:{2:"https://buy.stripe.com/bJe14m2Ix275dkH1i8gUM0b",3:"https://buy.stripe.com/5kQ3cu0ApdPN4Obe4UgUM0c"},
           15:{2:"https://buy.stripe.com/4gM5kCerf6nlfsPd0QgUM0d",3:"https://buy.stripe.com/fZu9ASfvjaDB1BZ2mcgUM0e"}},
  miraculeuse:{9:{2:"https://buy.stripe.com/aFaaEWerfbHF1BZ9OEgUM0f",3:"https://buy.stripe.com/14A4gydnbeTR4Ob3qggUM0g"},
           12:{2:"https://buy.stripe.com/eVq00igzn4fd5Sf0e4gUM0h",3:"https://buy.stripe.com/7sY9ASgzneTR2G39OEgUM0i"},
           15:{2:"https://buy.stripe.com/4gM28qaaZ3b95Sf4ukgUM0j",3:"https://buy.stripe.com/28E3cu82R8vta8v0e4gUM0k"}}
};
const lotPrice=(base,n)=>base*n-2*(n-1);
const lab=z=>z.label||`${z.cm} cm`;
const src=p=>`${ROOT}cut/${p}.webp`;
const pageHref=slug=>`${ROOT}${slug}/`;

const MODELS=[
  {id:"creche",slug:"creche-de-noel-9-pieces",name:"La crèche de Noël",kind:"9 pièces",
   text:"Une crèche de Noël moderne en 9 pièces : l'arche à l'étoile, Joseph, Marie, l'Enfant dans sa mangeoire, l'âne, le bœuf et les trois Rois mages. Des formes simples et douces, toutes en blanc, pour une crèche moderne sur une étagère ou une cheminée.",
   colors:[{name:"Blanc",hex:"#f4f4f2",photos:["creche-2","creche-1","creche-3"]}],
   sizes:[{cm:"9p",label:"Les 9 pièces",price:16}]},
  {id:"lourdes",slug:"statue-notre-dame-de-lourdes",name:"Notre-Dame de Lourdes",kind:"Mains jointes · chapelet",
   text:"Statue de Notre-Dame de Lourdes telle qu'elle est apparue à Bernadette : le voile tombant sur les épaules, les mains jointes, le chapelet glissé au bras et une rose à chaque pied, posée sur le rocher de la grotte.",
   colors:[
     {name:"Blanc",hex:"#f4f4f2",photos:["lourdes-blanc-1","lourdes-blanc-2","lourdes-blanc-3"]},
     {name:"Or mat",hex:"#b8973f",photos:["lourdes-ormat-1","lourdes-ormat-2","lourdes-ormat-3"]},
     {name:"Or satiné",hex:"#d9a35a",photos:["lourdes-orsatin-1","lourdes-orsatin-2","lourdes-orsatin-3"]},
     {name:"Gris",hex:"#7d7f85",photos:["lourdes-gris-1","lourdes-gris-2","lourdes-gris-3"]},
     {name:"Bleu ciel",hex:"#4fb3d9",photos:["lourdes-bleu-1","lourdes-bleu-2","lourdes-bleu-3"]}],
   sizes:[{cm:9,price:7},{cm:12,price:9},{cm:15,price:12}]},
  {id:"miraculeuse",slug:"statue-vierge-miraculeuse",name:"La Vierge Miraculeuse",kind:"Mains ouvertes",
   text:"Statue de la Vierge Miraculeuse, les bras ouverts et les mains tendues vers ceux qui la prient, d'après l'apparition de la rue du Bac. Le manteau s'ouvre en larges plis jusqu'au socle.",
   colors:[
     {name:"Or",hex:"#d8a542",photos:["miraculeuse-or"]},
     {name:"Blanc",hex:"#f4f4f2",photos:["miraculeuse-blanc"]},
     {name:"Anthracite",hex:"#4a4d52",photos:["miraculeuse-anthracite"]},
     {name:"Noir",hex:"#151515",photos:["miraculeuse-noir"]}],
   sizes:[{cm:9,price:7},{cm:12,price:9},{cm:15,price:12}]},
  {id:"famille",slug:"statue-sainte-famille",name:"La Sainte Famille",kind:"Joseph, Marie et l'Enfant",
   text:"Statue de la Sainte Famille : Joseph et Marie penchés l'un vers l'autre, l'Enfant entre leurs mains. Des visages à peine esquissés, pour une statue douce et moderne qui trouve sa place partout.",
   colors:[{name:"Blanc",hex:"#f4f4f2",photos:["famille-studio","famille-2","famille-1","famille-3"]}],
   sizes:[{cm:9,price:10},{cm:12,price:12}]}
];

function enhanceModel(el,m){
  const buy=el.querySelector("a.cta"),links=STRIPE[m.id]||{};
  if(Object.keys(links).length){buy.target="_blank";buy.rel="noopener";buy.textContent="Acheter";}
  const lots=LOTS[m.id],qtyBlock=el.querySelector(".qty-block"),qtysEl=el.querySelector(".qtys"),qtyLabel=el.querySelector(".qty-label"),hint=el.querySelector(".hint");
  let qty=1;
  const sizesEl=el.querySelector(".sizes:not(.qtys)"),sizeLabel=el.querySelector(".size-label"),priceEl=el.querySelector(".price");
  let size=m.sizes[0];
  function refresh(){
    const n=lots?qty:1,total=lotPrice(size.price,n);
    priceEl.innerHTML=n>1?`${total} € <s>${size.price*n} €</s>`:`${total} €`;
    buy.href=(n>1?lots[size.cm][n]:links[size.cm])||`${ROOT}#commander`;
    if(qtyLabel) qtyLabel.textContent=n>1?`${n} Vierges`:"1 Vierge";
    if(qtysEl) [...qtysEl.children].forEach(b=>b.setAttribute("aria-pressed",+b.dataset.n===n));
    if(hint&&m.colors.length>1&&links[size.cm]){hint.hidden=false;hint.textContent=n>1?"Vous choisirez la couleur de chaque Vierge sur la page de paiement : vous pouvez les varier.":"Vous choisirez la couleur sur la page de paiement.";}
  }
  if(lots&&qtyBlock&&qtysEl){
    qtyBlock.hidden=false;
    qtysEl.innerHTML="";
    [1,2,3].forEach(n=>{const b=document.createElement("button");b.type="button";b.className="size";b.dataset.n=n;b.textContent=n;b.onclick=()=>{qty=n;refresh();};qtysEl.appendChild(b);});
  }
  if(sizesEl){
    sizesEl.innerHTML="";
    function setSize(sz){
      size=sz;if(sizeLabel) sizeLabel.textContent=lab(sz);refresh();
      [...sizesEl.children].forEach(b=>b.setAttribute("aria-pressed",b.dataset.cm==sz.cm));
    }
    m.sizes.forEach(sz=>{
      const b=document.createElement("button");b.type="button";b.className="size";b.dataset.cm=sz.cm;
      b.textContent=lab(sz);b.onclick=()=>setSize(sz);sizesEl.appendChild(b);
    });
    setSize(size);
    if(sizesEl.parentElement) sizesEl.parentElement.hidden=m.sizes.length<2;
  }else{
    refresh();
  }
  const img=el.querySelector(".frame img"),thumbs=el.querySelector(".thumbs"),
        chips=el.querySelector(".chips"),label=el.querySelector(".label b");
  let current=m.colors[0];
  function show(color,i){
    current=color;
    img.src=src(color.photos[i]);
    img.alt=photoAlt(m,color,i);
    if(label) label.textContent=color.name;
    if(chips) [...chips.children].forEach(c=>c.setAttribute("aria-pressed",c.dataset.c===color.name));
    if(thumbs){
      thumbs.innerHTML="";thumbs.hidden=color.photos.length<2;
      color.photos.forEach((p,j)=>{
        const b=document.createElement("button");b.type="button";
        b.setAttribute("aria-label",`Vue ${j+1}`);b.setAttribute("aria-pressed",j===i);
        b.innerHTML=`<img src="${src(p)}" alt="" loading="lazy">`;
        b.onclick=()=>show(color,j);thumbs.appendChild(b);
      });
    }
  }
  if(chips){
    chips.innerHTML="";
    m.colors.forEach(c=>{
      const b=document.createElement("button");b.type="button";b.className="chip";
      b.dataset.c=c.name;b.style.background=c.hex;b.setAttribute("aria-label",c.name);b.title=c.name;
      b.onclick=()=>show(c,0);chips.appendChild(b);
    });
    if(m.colors.length<2) chips.hidden=true;
  }
  const ask=el.querySelector("a.ask");
  if(ask){
    ask.addEventListener("click",()=>{
      const fModel=document.getElementById("f-model"),fColor=document.getElementById("f-color"),fSize=document.getElementById("f-size");
      if(!fModel||typeof fillColors!=="function") return;
      fModel.value=m.id;fillColors();if(fColor) fColor.value=current.name;if(fSize) fSize.value=size.cm;
    });
  }
  show(current,0);
}

function photoAlt(m,color,i){
  const view=color.photos.length>1?`, vue ${i+1}`:"";
  return `${m.name}, ${color.name.toLowerCase()}${view}`;
}

function enhanceCatalog(){
  document.documentElement.classList.add("js");
  MODELS.forEach(m=>{
    const el=document.getElementById(m.id);
    if(el) enhanceModel(el,m);
  });
}
