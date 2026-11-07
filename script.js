<script>
/* ===== LALÉ + SUPABASE ===== */
const SUPABASE_URL="https://ccfpolggvqcojzbsohyy.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_FyCV1ZuXD7JK_3O_-QXqIg_AuFPj6YT";
const BUCKET="products";

const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>Number(n||0).toLocaleString("tr-TR")+" ₺";
const toast=m=>{
 const t=$("toast");t.textContent=m;t.style.display="block";
 clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display="none",3000);
};

const DEMO_ADMIN={email:"admin@lale.com",pass:"lale2026"};

function art(seed){
 const h=[345,350,330,20,310,40,355,320][seed%8];
 const p=(k,l)=>`hsl(${h+k},55%,${l}%)`;
 let s=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'><defs><radialGradient id='g' cx='50%' cy='40%' r='80%'><stop offset='0' stop-color='${p(0,32)}'/><stop offset='1' stop-color='#2a1119'/></radialGradient></defs><rect width='400' height='500' fill='url(#g)'/>`;
 const fl=[[200,210,1.3],[110,320,.8],[300,330,.85],[230,400,.6],[90,180,.55]];
 fl.forEach((f,i)=>{
  s+=`<g transform='translate(${f[0]},${f[1]}) scale(${f[2]})'><rect x='-3' y='20' width='6' height='260' fill='#2f4a3a' opacity='.8'/>`;
  for(let k=0;k<10;k++)s+=`<ellipse rx='24' ry='62' cy='-44' fill='${p(i*8,60-k%3*7)}' opacity='.9' transform='rotate(${k*36})'/>`;
  s+=`<circle r='16' fill='#C6A36A'/></g>`;
 });
 return "data:image/svg+xml,"+encodeURIComponent(s+"</svg>");
}

/* ===== VARSAYILAN VERİLER ===== */
const DEF={
 settings:{
  brand:"LALÉ",
  slogan:"Duyguların en zarif hali.",
  heroTitle:"Sevdiklerinize <em>unutulmaz</em> bir dokunuş bırakın",
  heroSub:"El yapımı aranjmanlar, seçkin çiçekler ve zarafetle hazırlanan özel tasarımlar.",
  phone:"+90 212 555 01 23",
  whatsapp:"905325550123",
  instagram:"lale.florist",
  address:"Nişantaşı, Abdi İpekçi Cd. No:24, Şişli / İstanbul",
  hours:"Pazartesi – Cumartesi: 09:00 – 20:00\nPazar: 10:00 – 18:00",
  storyTitle:"Bir çiçek, bin <em>duygu</em>",
  storyText:"LALÉ, çiçeğin sessiz dilini en zarif biçimde konuşturmak için doğdu. Her gün taze gelen seçkin çiçekleri ustalarımız tek tek ellerimizle işler; her aranjman bir duygunun hikâyesini taşır. Lüksü gösterişte değil, ince detaylarda ararız.",
  logo:""
 },
 cats:[
  {id:"gul",name:"Gül Buketleri"},
  {id:"premium",name:"Premium Aranjmanlar"},
  {id:"orkide",name:"Orkideler"},
  {id:"kutu",name:"Kutuda Çiçekler"},
  {id:"kir",name:"Kır Çiçekleri"},
  {id:"ozel",name:"Özel Günler"}
 ],
 products:[
  ["Rouge Éternel","gul",1450,"Kırmızı kadife güllerden 25'li el buketi. Altın ipek kurdele ile sunulur.",1,"sevgililer"],
  ["Blanc Poème","gul",1280,"Beyaz güller ve okaliptüsle hazırlanan sade ve zamansız buket.",0,""],
  ["Rose Poudrée","gul",1190,"Pudra pembesi garden güller, mevsimlik yeşillikler.",0,"dogum"],
  ["Grand Salon","premium",2950,"Cam vazoda 40 dal karışık sezon çiçeği; salon ve lobiler için.",1,""],
  ["Maison Bordeaux","premium",2490,"Bordo ve krem tonlarında pivoine, ranunkulus ve gül aranjmanı.",0,"yildonumu"],
  ["Orchidée Royale","orkide",1750,"Seramik saksıda çift dallı beyaz Phalaenopsis orkide.",1,"anneler"],
  ["Orchidée Noire","orkide",1950,"Bordo Phalaenopsis, mat siyah saksıda lüks sunum.",0,""],
  ["Boîte Velours","kutu",1650,"Kadife kutuda 18 gül; kutu yeniden kullanılabilir.",1,"sevgililer"],
  ["Boîte Dorée","kutu",1890,"Altın şeritli yuvarlak kutuda pudra tonlu gül ve ranunkulus.",0,"dogum"],
  ["Prairie d'Été","kir",890,"Papatya, lisyantus ve çoban püskülünden doğal, özgür buket.",0,""],
  ["Jardin Sauvage","kir",950,"Vintage kraft sarımlı mevsim kır çiçekleri demeti.",0,"anneler"],
  ["Coffret Anniversaire","ozel",2290,"Yıldönümü için özel hazırlanan bordo gül ve kişisel not kartı.",1,"yildonumu"]
 ].map((a,i)=>({
  id:"p"+i,name:a[0],cat:a[1],price:a[2],descr:a[3],
  best:!!a[4],occ:a[5],pub:true,img:""
 }))
};

let DB=null,sb=null,admin=false;
let tab="products",fcat="all",focc="";
let appReady=false;

/* ===== SUPABASE BAĞLANTISI ===== */
async function connectSupabase(){
 if(sb)return sb;

 await new Promise((resolve,reject)=>{
  if(window.supabase)return resolve();
  const s=document.createElement("script");
  s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  s.onload=resolve;
  s.onerror=()=>reject(new Error("Supabase kütüphanesi yüklenemedi."));
  document.head.appendChild(s);
 });

 sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
 return sb;
}

function checkError(result){
 if(result.error)throw result.error;
 return result.data;
}

async function fetchData(){
 const [p,c,s]=await Promise.all([
  sb.from("products").select("*").order("created_at"),
  sb.from("categories").select("*").order("sort"),
  sb.from("settings").select("*").eq("id",1).maybeSingle()
 ]);

 const products=checkError(p)||[];
 const categories=checkError(c)||[];
 const settingsRow=checkError(s);

 return {
  products,
  cats:categories,
  settings:Object.assign({},DEF.settings,settingsRow?.data||{})
 };
}

async function seedDefaults(data){
 if(!data.cats.length){
  const r=await sb.from("categories").upsert(
   DEF.cats.map((c,i)=>({...c,sort:i}))
  );
  checkError(r);
 }

 if(!data.products.length){
  const r=await sb.from("products").upsert(DEF.products);
  checkError(r);
 }

 if(!data.settings || Object.keys(data.settings).length===0){
  const r=await sb.from("settings").upsert({id:1,data:DEF.settings});
  checkError(r);
 }
}

async function load(){
 await connectSupabase();

 let data=await fetchData();

 // İlk kurulumda örnek içerikleri veritabanına ekle.
 if(!data.products.length || !data.cats.length || !data.settings){
  await seedDefaults({
   products:data.products,
   cats:data.cats,
   settings:data.settings
  });
  data=await fetchData();
 }

 DB=data;
}

async function refreshData(){
 const data=await fetchData();
 DB=data;
}

/* ===== VERİ KAYDETME ===== */
async function saveProduct(p){
 const result=await sb.from("products").upsert(p);
 if(result.error){
  toast("Ürün kaydedilemedi: "+result.error.message);
  throw result.error;
 }

 const i=DB.products.findIndex(x=>x.id===p.id);
 if(i>-1)DB.products[i]=p;
 else DB.products.push(p);
}

async function delProduct(id){
 const result=await sb.from("products").delete().eq("id",id);
 if(result.error){
  toast("Silme hatası: "+result.error.message);
  throw result.error;
 }
 DB.products=DB.products.filter(p=>p.id!==id);
}

async function saveCats(){
 const result=await sb.from("categories").upsert(
  DB.cats.map((c,i)=>({...c,sort:i}))
 );
 if(result.error){
  toast("Kategori kaydedilemedi: "+result.error.message);
  throw result.error;
 }
}

async function delCat(id){
 const result=await sb.from("categories").delete().eq("id",id);
 if(result.error){
  toast("Kategori silinemedi: "+result.error.message);
  throw result.error;
 }
 DB.cats=DB.cats.filter(c=>c.id!==id);
}

async function saveSettings(){
 const result=await sb.from("settings").upsert({
  id:1,
  data:DB.settings
 });
 if(result.error){
  toast("Ayarlar kaydedilemedi: "+result.error.message);
  throw result.error;
 }
}

/* ===== GÖRSEL YÜKLEME ===== */
async function upload(file){
 if(!file)return "";

 const d=await new Promise((resolve,reject)=>{
  const reader=new FileReader();

  reader.onerror=()=>reject(new Error("Dosya okunamadı."));
  reader.onload=()=>{
   const im=new Image();

   im.onerror=()=>reject(new Error("Görsel açılamadı."));
   im.onload=()=>{
    const scale=Math.min(1,1200/Math.max(im.width,im.height));
    const canvas=document.createElement("canvas");
    canvas.width=Math.round(im.width*scale);
    canvas.height=Math.round(im.height*scale);

    canvas.getContext("2d").drawImage(
     im,0,0,canvas.width,canvas.height
    );

    canvas.toBlob(blob=>{
     if(!blob)return reject(new Error("Görsel dönüştürülemedi."));
     resolve(blob);
    },"image/jpeg",.84);
   };
   im.src=reader.result;
  };
  reader.readAsDataURL(file);
 });

 const filename=Date.now()+"-"+Math.random().toString(36).slice(2)+".jpg";

 const result=await sb.storage.from(BUCKET).upload(
  filename,d,
  {contentType:"image/jpeg",upsert:false}
 );

 if(result.error){
  toast("Fotoğraf yüklenemedi: "+result.error.message);
  throw result.error;
 }

 return sb.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl;
}

/* ===== SİTE ===== */
const imgOf=(p,i)=>p.img||art(Math.max(0,DB.products.indexOf(p)+1));
const catName=id=>(DB.cats.find(c=>c.id===id)||{}).name||"";

const wa=msg=>{
 const number=String(DB.settings.whatsapp||"").replace(/\D/g,"");
 return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
};

function card(p){
 return `<div class="card rv" data-id="${esc(p.id)}">
  <div class="im">
   <img loading="lazy" src="${imgOf(p)}" alt="${esc(p.name)}">
   ${p.best?'<span class="tag">Çok Satan</span>':""}
  </div>
  <div class="bd">
   <small>${esc(catName(p.cat))}</small>
   <h3>${esc(p.name)}</h3>
   <div class="pr">${fmt(p.price)}</div>
   <button class="btn dark">Detay</button>
  </div>
 </div>`;
}

function renderSite(){
 if(!DB)return;

 const s=DB.settings;
 const P=DB.products.filter(p=>p.pub);

 document.title=s.brand+" – "+s.slogan;

 $("navLogo").innerHTML=(s.logo?`<img src="${s.logo}" alt="">`:"")+esc(s.brand);
 $("hSlogan").textContent=s.slogan;
 $("hTitle").innerHTML=s.heroTitle;
 $("hSub").textContent=s.heroSub;
 $("heroBg").style.backgroundImage=`url("${art(0)}")`;

 $("cats").innerHTML=DB.cats.slice(0,6).map((c,i)=>`
  <div class="cat rv" data-c="${esc(c.id)}">
   <img loading="lazy" src="${art(i+2)}" alt="">
   <h3>${esc(c.name)}</h3>
  </div>
 `).join("");

 $("best").innerHTML=P.filter(p=>p.best).slice(0,4).map(card).join("")||"<p>Yakında</p>";

 $("filters").innerHTML=[
  ["all","Tümü"],
  ...DB.cats.map(c=>[c.id,c.name])
 ].map(([id,n])=>`
  <button data-f="${esc(id)}" class="${fcat===id&&!focc?"on":""}">
   ${esc(n)}
  </button>
 `).join("");

 const L=P.filter(p=>
  (fcat==="all"||p.cat===fcat)&&(!focc||p.occ===focc)
 );

 $("all").innerHTML=L.map(card).join("")||
  "<p style='grid-column:1/-1;text-align:center'>Bu seçimde ürün bulunamadı.</p>";

 $("custom").innerHTML=P.filter(p=>p.cat==="premium").map(card).join("");

 $("stT").innerHTML=s.storyTitle;
 $("stX").textContent=s.storyText;
 $("stImg").src=art(4);

 $("insta").innerHTML=[1,3,5,2,6,7].map(i=>`
  <div><img loading="lazy" src="${art(i)}" alt=""></div>
 `).join("");

 const ig="https://instagram.com/"+s.instagram.replace("@","");
 $("igLink").href=ig;

 $("fBrand").textContent=s.brand;
 $("fSlogan").textContent=s.slogan;
 $("fCont").innerHTML=`
  ${esc(s.address)}<br>
  ${esc(s.phone)}<br>
  <a href="${ig}" target="_blank">@${esc(s.instagram.replace("@",""))}</a>
 `;

 $("fHours").innerHTML=esc(s.hours).replace(/\n/g,"<br>");
 $("waFloat").href=wa(`Merhaba ${s.brand}, bilgi almak istiyorum.`);
 $("customWa").href=wa(`Merhaba ${s.brand}, özel tasarım aranjman talep etmek istiyorum.`);
 $("yr").textContent=new Date().getFullYear();

 observe();
}

function observe(){
 const io=new IntersectionObserver(entries=>{
  entries.forEach(x=>{
   if(x.isIntersecting){
    x.target.classList.add("in");
    io.unobserve(x.target);
   }
  });
 },{threshold:.12});

 document.querySelectorAll(".rv:not(.in)").forEach(el=>io.observe(el));
}

function openP(id){
 const p=DB.products.find(x=>x.id===id);
 if(!p)return;

 $("pmI").src=imgOf(p);
 $("pmC").textContent=catName(p.cat);
 $("pmN").textContent=p.name;
 $("pmP").textContent=fmt(p.price);
 $("pmD").textContent=p.descr;

 $("pmW").href=wa(
  `Merhaba ${DB.settings.brand}, şu ürünü sipariş etmek istiyorum:\n\n${p.name}\nFiyat: ${fmt(p.price)}`
 );

 $("pm").classList.add("on");
 document.body.style.overflow="hidden";
}

function closeM(){
 $("pm").classList.remove("on");
 document.body.style.overflow="";
}

document.addEventListener("click",e=>{
 const c=e.target.closest(".card[data-id]");
 if(c)return openP(c.dataset.id);

 const k=e.target.closest(".cat");
 if(k){
  fcat=k.dataset.c;
  focc="";
  renderSite();
  return $("all").scrollIntoView({behavior:"smooth",block:"center"});
 }

 const f=e.target.closest("[data-f]");
 if(f){
  fcat=f.dataset.f;
  focc="";
  return renderSite();
 }

 const o=e.target.closest(".occ div");
 if(o){
  focc=o.dataset.o;
  fcat="all";
  renderSite();
  return $("all").scrollIntoView({behavior:"smooth",block:"center"});
 }

 if(e.target.classList.contains("modal")){
  e.target.classList.remove("on");
  document.body.style.overflow="";
 }
});

document.addEventListener("keydown",e=>{
 if(e.key==="Escape"){
  document.querySelectorAll(".modal").forEach(m=>m.classList.remove("on"));
  document.body.style.overflow="";
 }
});

addEventListener("scroll",()=>$("nav").classList.toggle("s",scrollY>60),{passive:true});

/* ===== YÖNETİM PANELİ ===== */
async function route(){
 const isA=location.hash==="#admin";

 document.body.style.opacity=0;
 await new Promise(r=>setTimeout(r,200));

 $("site").style.display=isA?"none":"block";
 $("admin").style.display=isA?"block":"none";

 if(isA){
  await checkAuth();
  renderAdmin();
 }else{
  renderSite();
 }

 scrollTo(0,0);
 document.body.style.opacity=1;
}

async function checkAuth(){
 admin=false;

 const {data,error}=await sb.auth.getSession();
 if(error||!data.session)return;

 const user=data.session.user;
 const result=await sb.from("admin_users")
  .select("user_id")
  .eq("user_id",user.id)
  .maybeSingle();

 if(result.error||!result.data){
  await sb.auth.signOut();
  admin=false;
  return;
 }

 admin=true;

 // Yönetici girişinde gizli ürünleri de yeniden yükle.
 await refreshData();
}

function renderAdmin(){
 const A=$("admin");

 if(!admin){
  A.innerHTML=`
   <div class="login">
    <h2 class="serif">LALÉ Yönetim</h2>
    <p style="color:#888;font-size:13px;margin:6px 0 10px">Yönetici girişi</p>
    <label>E-posta</label>
    <input id="le" type="email" autocomplete="username">
    <label>Şifre</label>
    <input id="lp" type="password" autocomplete="current-password">
    <br><br>
    <button class="btn dark" style="width:100%" onclick="login()">Giriş Yap</button>
    <br><br>
    <a href="#" style="font-size:13px;color:var(--b)">← Siteye dön</a>
   </div>
  `;
  return;
 }

 const T=[
  ["products","Ürünler"],
  ["cats","Kategoriler"],
  ["brand","Marka & İletişim"],
  ["home","Ana Sayfa Metinleri"]
 ];

 let h=`
  <div class="ah">
   <b>LALÉ</b>
   <div>
    <a href="#" class="sm" style="color:#fff;border-color:#fff">Siteyi Gör</a>
    <button class="sm" style="color:#fff;border-color:#fff" onclick="logout()">Çıkış</button>
   </div>
  </div>
  <div class="tabs">
   ${T.map(t=>`
    <button class="${tab===t[0]?"on":""}" onclick="tab='${t[0]}';renderAdmin()">
     ${t[1]}
    </button>
   `).join("")}
  </div>
  <div class="ab"><div class="panel">
 `;

 if(tab==="products"){
  h+=`
   <button class="btn dark" onclick="editP()">+ Yeni Ürün</button>
   <br><br>
   <table>
    <tr><th></th><th>Ürün</th><th>Kategori</th><th>Fiyat</th><th>Durum</th><th></th></tr>
    ${DB.products.map(p=>`
     <tr>
      <td><img src="${imgOf(p)}"></td>
      <td>${esc(p.name)}</td>
      <td>${esc(catName(p.cat))}</td>
      <td>${fmt(p.price)}</td>
      <td>${p.pub?"Yayında":"Gizli"}</td>
      <td>
       <button class="sm" onclick="editP('${p.id}')">Düzenle</button>
       <button class="sm" onclick="togP('${p.id}')">${p.pub?"Yayından Kaldır":"Yayınla"}</button>
       <button class="sm d" onclick="rmP('${p.id}')">Sil</button>
      </td>
     </tr>
    `).join("")}
   </table>
  `;
 }

 if(tab==="cats"){
  h+=`
   <div class="fr">
    <div>
     <label>Yeni kategori</label>
     <input id="nc" placeholder="Kategori adı">
    </div>
    <div>
     <label>&nbsp;</label>
     <button class="btn dark" onclick="addC()">Ekle</button>
    </div>
   </div>
   <br>
   <table>
    ${DB.cats.map(c=>`
     <tr>
      <td><input value="${esc(c.name)}" onchange="renC('${c.id}',this.value)"></td>
      <td style="width:90px"><button class="sm d" onclick="rmC('${c.id}')">Sil</button></td>
     </tr>
    `).join("")}
   </table>
  `;
 }

 const S=DB.settings;
 const f=(k,l,t)=>`
  <label>${l}</label>
  ${t?`<textarea data-k="${k}">${esc(S[k])}</textarea>`:`<input data-k="${k}" value="${esc(S[k])}">`}
 `;

 if(tab==="brand"){
  h+=`
   <div class="fr">
    <div>
     ${f("brand","Marka adı")}
     ${f("slogan","Slogan")}
     ${f("phone","Telefon")}
     ${f("whatsapp","WhatsApp (905xx…)")}
    </div>
    <div>
     ${f("instagram","Instagram kullanıcı adı")}
     ${f("address","Adres",1)}
     ${f("hours","Çalışma saatleri",1)}
     <label>Logo</label>
     <input type="file" accept="image/*" onchange="logoUp(this)">
     ${S.logo?`
      <img src="${S.logo}" style="height:50px;width:auto;margin-top:8px;background:#431D28;padding:6px">
      <button class="sm d" onclick="removeLogo()">Logoyu kaldır</button>
     `:""}
    </div>
   </div>
   <br>
   <button class="btn dark" onclick="saveS()">Kaydet</button>
  `;
 }

 if(tab==="home"){
  h+=`
   ${f("heroTitle","Hero başlığı (<em>vurgu</em> kullanılabilir)",1)}
   ${f("heroSub","Hero alt metni",1)}
   ${f("storyTitle","Hikâye başlığı")}
   ${f("storyText","Hikâye metni",1)}
   <br>
   <button class="btn dark" onclick="saveS()">Kaydet</button>
  `;
 }

 A.innerHTML=h+"</div></div>";
}

async function login(){
 const e=$("le").value.trim();
 const p=$("lp").value;

 if(!e||!p)return toast("E-posta ve şifre gir.");

 const {data,error}=await sb.auth.signInWithPassword({
  email:e,
  password:p
 });

 if(error)return toast("Giriş başarısız: "+error.message);

 const user=data.user;
 const result=await sb.from("admin_users")
  .select("user_id")
  .eq("user_id",user.id)
  .maybeSingle();

 if(result.error||!result.data){
  await sb.auth.signOut();
  return toast("Bu hesapta yönetici yetkisi bulunmuyor.");
 }

 admin=true;

 try{
  await refreshData();
  renderAdmin();
  toast("Yönetici girişi başarılı.");
 }catch(err){
  toast("Veriler yüklenemedi: "+err.message);
 }
}

async function logout(){
 await sb.auth.signOut();
 admin=false;
 renderAdmin();
 toast("Çıkış yapıldı.");
}

async function saveS(){
 try{
  document.querySelectorAll("[data-k]").forEach(i=>{
   DB.settings[i.dataset.k]=i.value;
  });
  await saveSettings();
  renderAdmin();
  toast("Ayarlar kaydedildi ✓");
 }catch(e){}
}

async function logoUp(i){
 if(!i.files[0])return;
 try{
  DB.settings.logo=await upload(i.files[0]);
  await saveSettings();
  renderAdmin();
  toast("Logo güncellendi ✓");
 }catch(e){}
}

async function removeLogo(){
 DB.settings.logo="";
 try{
  await saveSettings();
  renderAdmin();
  toast("Logo kaldırıldı.");
 }catch(e){}
}

async function togP(id){
 const p=DB.products.find(x=>x.id===id);
 if(!p)return;

 const updated={...p,pub:!p.pub};

 try{
  await saveProduct(updated);
  renderAdmin();
  toast("Ürün durumu güncellendi.");
 }catch(e){}
}

async function rmP(id){
 if(!confirm("Bu ürün silinsin mi?"))return;

 try{
  await delProduct(id);
  renderAdmin();
  toast("Ürün silindi.");
 }catch(e){}
}

async function addC(){
 const n=$("nc").value.trim();
 if(!n)return toast("Kategori adı yaz.");

 const c={id:"c"+Date.now(),name:n};
 DB.cats.push(c);

 try{
  await saveCats();
  renderAdmin();
  toast("Kategori eklendi ✓");
 }catch(e){
  DB.cats=DB.cats.filter(x=>x.id!==c.id);
 }
}

async function renC(id,v){
 const c=DB.cats.find(x=>x.id===id);
 if(!c)return;

 const old=c.name;
 c.name=v.trim();

 if(!c.name){
  c.name=old;
  renderAdmin();
  return toast("Kategori adı boş olamaz.");
 }

 try{
  await saveCats();
  toast("Kategori güncellendi ✓");
 }catch(e){
  c.name=old;
  renderAdmin();
 }
}

async function rmC(id){
 if(DB.products.some(p=>p.cat===id))
  return toast("Bu kategoride ürün var. Önce ürünleri başka kategoriye taşı.");

 if(!confirm("Bu kategori silinsin mi?"))return;

 try{
  await delCat(id);
  renderAdmin();
  toast("Kategori silindi.");
 }catch(e){}
}

function editP(id){
 const existing=DB.products.find(x=>x.id===id);

 const p=existing?{...existing}:{
  id:"p"+Date.now(),
  name:"",
  cat:DB.cats[0]?.id||"",
  price:"",
  descr:"",
  img:"",
  pub:true,
  best:false,
  occ:""
 };

 window._p=p;

 $("fmB").innerHTML=`
  <h2 class="serif" style="font-size:32px;color:var(--db)">
   ${id?"Ürünü Düzenle":"Yeni Ürün"}
  </h2>

  <label>Ürün adı</label>
  <input id="fn" value="${esc(p.name)}">

  <div class="fr">
   <div>
    <label>Fiyat (₺)</label>
    <input id="fp" type="number" min="0" value="${p.price}">
   </div>
   <div>
    <label>Kategori</label>
    <select id="fc">
     ${DB.cats.map(c=>`
      <option value="${esc(c.id)}" ${c.id===p.cat?"selected":""}>
       ${esc(c.name)}
      </option>
     `).join("")}
    </select>
   </div>
  </div>

  <label>Açıklama</label>
  <textarea id="fd">${esc(p.descr)}</textarea>

  <div class="fr">
   <div>
    <label>Özel gün</label>
    <select id="fo">
     ${[
      ["","Yok"],
      ["sevgililer","Sevgililer Günü"],
      ["anneler","Anneler Günü"],
      ["dogum","Doğum Günü"],
      ["yildonumu","Yıldönümü"]
     ].map(o=>`
      <option value="${o[0]}" ${o[0]===p.occ?"selected":""}>${o[1]}</option>
     `).join("")}
    </select>
   </div>
   <div>
    <label>Fotoğraf</label>
    <input type="file" id="ff" accept="image/*">
    ${p.img?`<img src="${p.img}" style="width:70px;height:70px;object-fit:cover;margin-top:8px">`:""}
   </div>
  </div>

  <label>
   <input type="checkbox" id="fb" style="width:auto" ${p.best?"checked":""}>
   Çok satan olarak göster
  </label>

  <label>
   <input type="checkbox" id="fu" style="width:auto" ${p.pub?"checked":""}>
   Yayında
  </label>

  <br>
  <button class="btn dark" id="saveProductBtn" onclick="submitP()">Kaydet</button>
 `;

 $("fm").classList.add("on");
}

async function submitP(){
 const p=window._p;
 const n=$("fn").value.trim();
 const pr=parseFloat($("fp").value);

 if(!n||!Number.isFinite(pr)||pr<0)
  return toast("Ürün adı ve geçerli fiyat zorunlu.");

 const btn=$("saveProductBtn");
 btn.disabled=true;
 btn.textContent="Kaydediliyor...";

 try{
  const file=$("ff").files[0];
  if(file)p.img=await upload(file);

  Object.assign(p,{
   name:n,
   price:pr,
   cat:$("fc").value,
   descr:$("fd").value,
   occ:$("fo").value,
   best:$("fb").checked,
   pub:$("fu").checked
  });

  await saveProduct(p);

  $("fm").classList.remove("on");
  renderAdmin();
  toast("Ürün kaydedildi ✓");
 }catch(e){
  btn.disabled=false;
  btn.textContent="Kaydet";
 }
}

/* ===== BAŞLAT ===== */
addEventListener("hashchange",()=>{
 if(location.hash==="#admin"||$("admin").style.display==="block")route();
});

(async()=>{
 try{
  await load();
  appReady=true;

  if(location.hash==="#admin")await route();
  else renderSite();

  document.body.style.opacity=1;
  setTimeout(()=>$("pre").classList.add("off"),1200);
 }catch(e){
  console.error("LALÉ başlatma hatası:",e);
  $("pre").classList.add("off");
  toast("Veritabanı bağlantısı kurulamadı: "+e.message);
 }
})();
</script>