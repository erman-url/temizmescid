/* =========================
API URL
========================= */

const API_URL =
"https://spring-violet-7aa7.temizmescid.workers.dev";

// =========================
// INIT (DOM READY)
// =========================

document.addEventListener(
"DOMContentLoaded",
()=>{

  initSlider();

  initStars();

  updateDateTime();

  updatePrayerState();

  setInterval(
    updateDateTime,
    1000
  );

  setInterval(
    updatePrayerState,
    60000
  );

  loadTopMescids();

}
);


// =========================
// SLIDER
// =========================
let sliderIndex = 0;
let sliderInterval = null;
let slides = [];

function initSlider(){

  slides =
  document.querySelectorAll(".slide");

  if(!slides.length) return;

  showSlide(sliderIndex);

  if(sliderInterval){
    clearInterval(sliderInterval);
  }

  sliderInterval = setInterval(()=>{

    sliderIndex =
    (sliderIndex + 1) % slides.length;

    showSlide(sliderIndex);

  }, 10000);

}

function showSlide(index){

  slides.forEach((slide, i)=>{

    slide.classList.toggle(
      "active",
      i === index
    );

  });

}


// =========================
// STAR INIT
// =========================
function initStars(){

  document
  .querySelectorAll(".star")
  .forEach(el=>{

    if(el.dataset.initialized) return;

    el.dataset.initialized = "true";

    for(let i = 1; i <= 5; i++){

      const s =
      document.createElement("span");

      s.innerText = "★";

      s.addEventListener("click", ()=>{

        el.dataset.val = i;

        [...el.children]
        .forEach((c, idx)=>{

          c.classList.toggle(
            "active",
            idx < i
          );

        });

      });

      el.appendChild(s);

    }

  });

}


// =========================
// MODAL
// =========================
let scrollY = 0;

function startForm(){

  const modal =
  document.getElementById("formModal");

  if(!modal) return;

 const isMobile =

/Android|iPhone|iPad|iPod/i
.test(navigator.userAgent);

/* DESKTOP TEST MODE */

const isSimulator =

window.innerWidth <= 900;

/* BLOCK ONLY REAL DESKTOP */

if(!isMobile && !isSimulator){

alert(
"Bu özellik mobil kullanım için optimize edilmiştir."
);

}

  scrollY = window.scrollY;

  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  document.body.classList.add("modal-open");

  modal.classList.remove("hidden");

  goStep(1);

}


// =========================
// MODAL CLOSE
// =========================
function closeForm(){

  const modal =
  document.getElementById("formModal");

  if(!modal) return;

  modal.classList.add("hidden");

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";

  document.body.classList.remove("modal-open");

  window.scrollTo(0, scrollY);

}


// =========================
// STEP MANAGER
// =========================
function goStep(step){

  document
  .querySelectorAll(".step")
  .forEach(s=>{
    s.classList.remove("active");
  });

  document
  .getElementById("s"+step)
  ?.classList.add("active");

  const bar =
  document.getElementById("bar");

  if(bar){

    bar.style.width =
    (step * 33) + "%";

  }

}


// =========================
// STEP CONTROL
// =========================
function next(step){

  const imagesInput =
  document.getElementById("images");

  // =========================
  // LEGAL CONTROL
  // =========================

  if(step === 2){

    const approved =
    document.getElementById("legalApprove");

    if(!approved?.checked){

      alert(
        "Devam etmek için kullanım koşullarını kabul etmelisiniz."
      );

      return;

    }

    if(
      !imagesInput ||
      imagesInput.files.length < 1
    ){

      alert(
        "En az 1 fotoğraf yüklemek zorunludur."
      );

      return;

    }

  if(imagesInput.files.length > 5){

  alert(
    "En fazla 5 fotoğraf yükleyebilirsiniz."
  );

  return;

}

  }

  // =========================
  // STEP VALIDATION
  // =========================

 if(
  step === 3 &&
  !validateStep(2)
){
    return;
  }

  if(
    step === 4 &&
    !validateStep(4)
  ){
    return;
  }

  // =========================
  // STEP CHANGE
  // =========================

  document
  .querySelectorAll(".step")
  .forEach(el=>{
    el.classList.remove("active");
  });

  document
  .getElementById("s"+step)
  ?.classList.add("active");

  // =========================
  // PROGRESS BAR
  // =========================

  const bar =
  document.getElementById("bar");

  if(bar){

    const progress =
    Math.min(step * 33, 100);

    bar.style.width =
    progress + "%";

  }

}

// =========================
// SCORE CALCULATION
// =========================
function calculateScore(){

  let starTotal = 0;
  let starCount = 0;

  let boolTotal = 0;
  let boolCount = 0;

  const ablution =
  document.getElementById("ablution")?.value;

  // =========================
  // STAR
  // =========================

  document
  .querySelectorAll(".star")
  .forEach(el=>{

    const key =
    el.dataset.key;

    const val =
    Number(el.dataset.val || 0);

    if(
      ablution === "Hayır" &&
      (
        key === "ablution_clean" ||
        key === "floor"
      )
    ){
      return;
    }

    if(val){

      starTotal += val;
      starCount++;

    }

  });

  // =========================
  // BOOLEAN
  // =========================

  const bools = [

    {id:"staff"},

    {id:"reported"},

    {
      id:"paper",
      depends:true
    },

    {id:"library"}

  ];

  bools.forEach(b=>{

    if(
      b.depends &&
      ablution === "Hayır"
    ){
      return;
    }

    const el =
    document.getElementById(b.id);

    if(!el) return;

    if(el.value === "Evet"){

      boolTotal += 1;

    }

    boolCount++;

  });

  const starAvg =
  starCount
    ? (starTotal / starCount)
    : 0;

  const boolAvg =
  boolCount
    ? (boolTotal / boolCount)
    : 0;

  const finalScore =
  (starAvg * 0.85) +
  (boolAvg * 5 * 0.15);

  return Number(
    finalScore.toFixed(2)
  );

}


// =========================
// SCORE LABEL
// =========================
function getScoreLabel(score){

  if(score >= 4.5){
    return "Mükemmel";
  }

  if(score >= 3.8){
    return "Çok İyi";
  }

  if(score >= 3.0){
    return "İyi";
  }

  if(score >= 2.0){
    return "Orta";
  }

  return "Zayıf";

}

async function submitForm(){

async function compressImage(file){

  return new Promise((resolve)=>{

    const img = new Image();

    img.onload = ()=>{

      const canvas =
      document.createElement("canvas");

      const maxWidth = 1200;

      let width = img.width;
      let height = img.height;

      if(width > maxWidth){

        height *= maxWidth / width;
        width = maxWidth;

      }

      canvas.width = width;
      canvas.height = height;

      const ctx =
      canvas.getContext("2d");

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      canvas.toBlob(

        (blob)=>{

          resolve(
            new File(
              [blob],
              file.name.replace(
                /\.(jpg|jpeg|png)$/i,
                ".webp"
              ),
              {
                type:"image/webp"
              }
            )
          );

        },

        "image/webp",
        0.7

      );

    };

    img.src =
    URL.createObjectURL(file);

  });

}

  if(!validateStep(4)){
    return;
  }

  try{

    const imagesInput =
      document.getElementById("images");

    if(
      !imagesInput ||
      imagesInput.files.length < 1
    ){

      alert(
        "En az 1 fotoğraf gerekli"
      );

      return;

    }

    if(imagesInput.files.length > 5){

      alert(
        "En fazla 5 fotoğraf yükleyebilirsiniz"
      );

      return;

    }

    const formData =
      new FormData();

    formData.append(
      "name",
      document.getElementById("mescidName")
      ?.value
      ?.trim()
    );

    formData.append(
      "city",
      document.getElementById("city")
      ?.value
      ?.trim()
    );

    formData.append(
      "district",
      document.getElementById("district")
      ?.value
      ?.trim()
    );

    formData.append(
      "category",
      document.getElementById("type")
      ?.value
    );

formData.append(
  "address",
  document.getElementById("desc")
  ?.value
  ?.trim()
);



formData.append(
  "has_ablution",

  document.getElementById(
    "ablution"
  )?.value === "Evet"

    ? 1

    : 0
);

formData.append(
  "lat",
  41.0082
);

    formData.append(
      "lng",
      28.9784
    );

/* =========================
STAR SCORES
========================= */

document
.querySelectorAll(".star")
.forEach(el=>{

const key =
el.dataset.key;

const val =
Number(el.dataset.val || 0);

const scoreMap = {

location:
"location_score",

cleanliness:
"cleanliness_score",

air:
"climate_score",

sound:
"peace_score",

light:
"light_score",

floor:
"carpet_score",

ablution_clean:
"ablution_clean_score",

wet_floor:
"wet_floor_score"

};

const dbKey =
scoreMap[key];

if(dbKey){

formData.append(
dbKey,
val
);

}

});
/* =========================
BOOLEAN FIELDS
========================= */

const binaryMap = {

library:
"library_exists",

staff:
"staff_exists",

airCondition:
"air_condition_exists",

womenArea:
"women_area_exists",

paper:
"paper_towel_exists"

};

Object.entries(binaryMap)
.forEach(([inputId, dbKey])=>{

const value =
document.getElementById(inputId)?.value;

if(value){

formData.append(

dbKey,

value === "Evet" ? 1 : 0

);

}

});

/* =========================
GENERAL SCORE
========================= */

formData.append(
"average_score",
calculateScore()
);

/* =========================
COMMENT
========================= */

formData.append(
"comment",
document.getElementById("extraNote")
?.value
?.trim() || ""
);


for(const file of imagesInput.files){

  const compressed =
  await compressImage(file);

  formData.append(
    "images",
    compressed
  );

}

const res = await fetch(

"https://spring-violet-7aa7.temizmescid.workers.dev/api/mescid/create",

{

method:"POST",

body:formData

}

);

const data =
await res.json();

if(!res.ok){

alert(
data.error ||
"Mescid eklenemedi"
);

return;

}

alert(
"Mescid başarıyla eklendi"
);

closeForm();

if(!data.slug){

alert(
"Mescid oluşturuldu fakat slug alınamadı."
);

location.href =
"mescidler.html";

return;

}

const targetSlug =
encodeURIComponent(data.slug);

let ready = false;

for(let i=0;i<10;i++){

try{

const check = await fetch(
`${API_URL}/api/mescid/${targetSlug}`
);

if(check.ok){

ready = true;

break;

}

}
catch(e){}

await new Promise(resolve=>
setTimeout(resolve,700)
);

}

if(!ready){

alert(
"Mescid oluşturuldu fakat detay sayfası henüz hazır değil."
);

location.href =
"mescidler.html";

return;

}

location.href =
`mescid_detay.html?slug=${targetSlug}`;

}

catch(err){

console.error(err);

alert(
"Bağlantı hatası oluştu"
);

}

}

// =========================
// DATE + TIME
// =========================
function updateDateTime(){

  const dateEl =
  document.getElementById("date");

  const timeEl =
  document.getElementById("time");

  if(!dateEl || !timeEl){
    return;
  }

  const now = new Date();

  dateEl.innerText =
  now.toLocaleDateString("tr-TR", {

    weekday:"long",

    day:"numeric",

    month:"long"

  });

  timeEl.innerText =
  now.toLocaleTimeString("tr-TR", {

    hour:"2-digit",

    minute:"2-digit"

  });

}


// =========================
// NAMAZ SMART SYSTEM
// =========================
const prayerTimes = {

  imsak:"04:12",

  ogle:"13:05",

  ikindi:"16:45",

  aksam:"19:32",

  yatsi:"20:55"

};

function getMinutes(t){

  const [h,m] =
  t.split(":").map(Number);

  return (h * 60) + m;

}

function updatePrayerState(){

  const now = new Date();

  const currentMin =
  (now.getHours() * 60) +
  now.getMinutes();

  const entries =
  Object.entries(prayerTimes);

  let current = null;
  let next = null;

  for(let i=0;i<entries.length;i++){

    const [name,time] =
    entries[i];

    const min =
    getMinutes(time);

    if(currentMin >= min){

      current = {
        name,
        time,
        min
      };

      next =
      entries[i+1]

      ? {

        name:entries[i+1][0],

        time:entries[i+1][1],

        min:getMinutes(
          entries[i+1][1]
        )

      }

      : null;

    }

  }

  document
  .querySelectorAll(".prayer-item")
  .forEach(el=>{

    el.classList.remove("active");

    if(
      el.dataset.name === current?.name
    ){

      el.classList.add("active");

    }

  });

  const countdownEl =
  document.getElementById("countdown");

  if(!countdownEl){
    return;
  }

  if(next){

    const diff =
    next.min - currentMin;

    const h =
    Math.floor(diff / 60);

    const m =
    diff % 60;

    countdownEl.innerText =
    `${next.name} ${h}s ${m}dk`;

  }

  else{

    countdownEl.innerText =
    "Yarın";

  }

}

// =========================
// STEP VALIDATION
// =========================
function validateStep(step){

  // STEP 2

  if(step === 2){

    const type =
    document.getElementById("type")
    ?.value;

    if(!type){

      alert(
        "Konum seçmek zorunlu"
      );

      return false;

    }

  }
  // STEP 3

  if(step === 4){

    let allRated = true;

    document
    .querySelectorAll(".star")
    .forEach(el=>{

      const key =
      el.dataset.key;

      const val =
      Number(el.dataset.val || 0);

      const ablution =
      document.getElementById("ablution")
      ?.value;

      if(
        ablution === "Hayır" &&
        (
          key === "ablution_clean" ||
          key === "floor"
        )
      ){
        return;
      }

      if(val === 0){

        allRated = false;

      }

    });

    if(!allRated){

      alert(
        "Lütfen tüm puanlamaları tamamlayın."
      );

      return false;

    }

    return true;

  }

  return true;

}


// =========================
// TOGGLE BINARY
// =========================
function toggleBinary(el,inputId){

  const input =
  document.getElementById(inputId);

  if(!input) return;

  // DEFAULT -> YES

  if(el.classList.contains("default")){

    el.classList.remove("default");

    el.classList.add("active-yes");

input.value = "Evet";

updateAblutionArea();

return;

  }
  // YES -> NO

  if(el.classList.contains("active-yes")){

    el.classList.remove("active-yes");

    el.classList.add("active-no");

    input.value = "Hayır";

    updateAblutionArea();

    return;

  }
  // NO -> YES

  el.classList.remove("active-no");

  el.classList.add("active-yes");

  input.value = "Evet";

  updateAblutionArea();

}


// =========================
// ABDESTHANE AREA
// =========================
function updateAblutionArea(){

  const ablution =
  document.getElementById("ablution");

  const area =
  document.getElementById("ablutionArea");

  if(!ablution || !area){
    return;
  }

  area.style.display =
  ablution.value === "Evet"
    ? "block"
    : "none";

}



// =========================
// LEGAL MODAL
// =========================
function openLegalModal(){

  document
  .getElementById("legalModal")
  ?.classList.add("show");

}

function closeLegalModal(){

  document
  .getElementById("legalModal")
  ?.classList.remove("show");

}


/* =========================
TOP MESCIDS
========================= */

async function loadTopMescids(){

const slider =
document.getElementById(
  "topSlider"
);

if(!slider) return;

/* LOADING */

slider.innerHTML = `
<div class="top-loading">

  <div class="top-skeleton"></div>

  <div class="top-skeleton"></div>

</div>
`;

try{

/* API */

const res = await fetch(
`${API_URL}/api/mescids/top`
);

if(!res.ok){

throw new Error(
"Top mescid fetch failed"
);

}

const data =
await res.json();

/* EMPTY */

if(
!Array.isArray(data) ||
data.length === 0
){

slider.innerHTML = `
<p style="
color:#94a3b8;
padding:20px 0;
font-size:14px;
">
Henüz öne çıkan mescid bulunmuyor.
</p>
`;

return;

}

/* RENDER */

slider.innerHTML = "";

data.forEach(item=>{

let imageUrl =

item.image ||

item.image_url ||

item.images?.[0] ||

item.photos?.[0] ||

item.gallery?.[0] ||

"https://placehold.co/600x400?text=Mescid";

/* STRING ARRAY FIX */

if(
typeof imageUrl === "string" &&
imageUrl.startsWith("[")
){

try{

imageUrl =
JSON.parse(imageUrl)?.[0]
||
"assets/img/default.jpg";

}catch(e){

imageUrl =
"assets/img/default.jpg";

}

}

/* OBJECT FIX */

if(
typeof imageUrl === "object" &&
imageUrl?.image_url
){

imageUrl =
imageUrl.image_url;

}

/* EMPTY FIX */

if(
!imageUrl ||
imageUrl === "undefined" ||
imageUrl === "null"
){

imageUrl =
"assets/img/default.jpg";

}

imageUrl =
String(imageUrl).trim();

/* RELATIVE URL FIX */

if(
!imageUrl.startsWith("http") &&
!imageUrl.startsWith("assets/")
){

const R2_BASE =
"https://pub-383b8df02aad4d3589d64a0709ff5b71.r2.dev";

imageUrl =
`${R2_BASE}/${imageUrl.replace(/^\/+/,"")}`;

}

/* CARD */

const card =
document.createElement(
"article"
);

card.className =
"top-card";

/* CLICK */

card.onclick = ()=>{

if(!item.slug){

alert(
"Bu mescid detay sayfası henüz hazır değil."
);

return;

}

location.href =
`mescid_detay.html?slug=${item.slug}`;

};

/* HTML */

card.innerHTML = `

<img
loading="lazy"
decoding="async"
src="${imageUrl}"

alt="${
item.name || "Mescid"
}"

style="
position:absolute;
inset:0;
width:100%;
height:100%;
object-fit:cover;
display:block;
z-index:1;
background:#111827;
"

onerror="
this.onerror=null;
this.src='assets/img/default.jpg';
"
>

<div class="top-overlay"></div>

<div class="top-content">

<div class="top-badge">
⭐ ${
Number(
item.average_score || 0
).toFixed(1)
}
</div>

<h3>
${item.name || "Mescid"}
</h3>

<div class="top-meta">

<span>
${item.district || "-"}
</span>

<div class="top-dot"></div>

<span>
${item.category || "-"}
</span>

</div>

</div>
`;

slider.appendChild(card);

});

/* AUTO SLIDE */


if(window.topSliderInterval){

clearInterval(
window.topSliderInterval
);

}

window.topSliderInterval =
setInterval(()=>{

slider.scrollBy({
left:320,
behavior:"smooth"
});

if(
slider.scrollLeft +
slider.clientWidth >=
slider.scrollWidth - 30
){

slider.scrollTo({
left:0,
behavior:"smooth"
});

}

},7000);



/* STOP ON TOUCH */

slider.addEventListener(
"touchstart",
()=>{

clearInterval(
window.topSliderInterval
);

},
{ passive:true }
);



}catch(err){

console.error(err);

slider.innerHTML = `
<p style="
color:#ef4444;
padding:20px 0;
font-size:14px;
">
Öne çıkan mescidler yüklenemedi.
</p>
`;

}

}



/* =========================
DAILY VERSE
========================= */

const verseEl =
document.getElementById(
"dailyVerse"
);

if(
verseEl &&
window.VERSES?.length
){

const day =
new Date().getDate();

const verse =
window.VERSES[
day % window.VERSES.length
];

verseEl.innerHTML = `
“${verse.text}”
`;

const sourceEl =
document.getElementById(
"dailyVerseSource"
);

if(sourceEl){

sourceEl.innerHTML =
`— ${verse.source}`;

}

}