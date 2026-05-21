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

  setInterval(
    updateDateTime,
    1000
  );

  loadTopMescids();

  loadPrayerTimes();

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

async function compressImage(file){

  return new Promise((resolve,reject)=>{

    const img =
    new Image();

    const objectUrl =
    URL.createObjectURL(file);

    img.onload = ()=>{

      URL.revokeObjectURL(
        objectUrl
      );

      const canvas =
      document.createElement(
        "canvas"
      );

      const MAX_SIZE = 1200;

      let width = img.width;
      let height = img.height;

      /* LANDSCAPE */

      if(width > height){

        if(width > MAX_SIZE){

          height = Math.round(
            height *
            (MAX_SIZE / width)
          );

          width = MAX_SIZE;

        }

      }

      /* PORTRAIT */

      else{

        if(height > MAX_SIZE){

          width = Math.round(
            width *
            (MAX_SIZE / height)
          );

          height = MAX_SIZE;

        }

      }

      canvas.width = width;
      canvas.height = height;

      const ctx =
      canvas.getContext("2d");

      ctx.imageSmoothingEnabled =
      true;

      ctx.imageSmoothingQuality =
      "high";

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      /* MOBILE STABLE JPEG */

      canvas.toBlob(

        (blob)=>{

          if(!blob){

            reject(
              new Error(
                "Görsel işlenemedi"
              )
            );

            return;

          }

          resolve(

            new File(

              [blob],

              file.name.replace(
                /\.(jpg|jpeg|png|heic|heif|webp)$/i,
                ".jpg"
              ),

              {
                type:"image/jpeg"
              }

            )

          );

        },

        "image/jpeg",

        0.72

      );

    };

    img.onerror = ()=>{

      URL.revokeObjectURL(
        objectUrl
      );

      reject(
        new Error(
          "Görsel yüklenemedi"
        )
      );

    };

    img.src = objectUrl;

  });

}

async function submitForm(){



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

`https://spring-violet-7aa7.temizmescid.workers.dev/api/mescid/create?t=${Date.now()}`,

{
  method:"POST",
  body:formData,
  cache:"no-store"
}

);

let data = {};

try{

  data =
  await res.json();

}catch(e){

  alert(
    "Sunucu yanıtı okunamadı"
  );

  return;

}

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

`${API_URL}/api/mescid/${targetSlug}?t=${Date.now()}`,

{
  cache:"no-store"
}

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

`${API_URL}/api/mescids/top?t=${Date.now()}`,

{
  cache:"no-store"
}

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

let imageUrl = "";

/* =========================
PRIORITY IMAGE PICK
========================= */

if(
  Array.isArray(item.images) &&
  item.images.length
){

  imageUrl =
  item.images[0];

}

else if(
  typeof item.images === "string" &&
  item.images.startsWith("[")
){

  try{

    const parsed =
    JSON.parse(item.images);

    if(
      Array.isArray(parsed) &&
      parsed.length
    ){

      imageUrl =
      parsed[0];

    }

  }catch(e){}

}

else if(
  item.image_url &&
  item.image_url !== "null" &&
  item.image_url !== "undefined"
){

  imageUrl =
  item.image_url;

}

else if(
  item.image &&
  item.image !== "null" &&
  item.image !== "undefined"
){

  imageUrl =
  item.image;

}

else if(
  Array.isArray(item.photos) &&
  item.photos.length
){

  imageUrl =
  item.photos[0];

}

else if(
  Array.isArray(item.gallery) &&
  item.gallery.length
){

  imageUrl =
  item.gallery[0];

}

/* =========================
FINAL FALLBACK
========================= */

if(
  !imageUrl ||
  typeof imageUrl !== "string"
){

  imageUrl =
  "assets/img/default.jpg";

}

imageUrl =
imageUrl.trim();

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
"https://cdn.temizmescid.com.tr";

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

console.log(item);
console.log(imageUrl);

card.innerHTML = `

<img
loading="eager"
decoding="sync"
fetchpriority="high"
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

/* =========================
AUTO SLIDE
========================= */

const cards =
slider.querySelectorAll(".top-card");

let currentIndex = 0;

if(window.topSliderInterval){

  clearInterval(
    window.topSliderInterval
  );

}

window.topSliderInterval =
setInterval(()=>{

  currentIndex++;

  if(currentIndex >= cards.length){

    currentIndex = 0;

  }

  slider.style.transform =
  `translateX(-${currentIndex * 100}%)`;

},7000);




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

/* =========================
PRAYER TIMES
========================= */

async function loadPrayerTimes(){

  try{

    /* =========================
    CACHE
    ========================= */

    const cached =
      localStorage.getItem(
        "tm_prayer_times"
      );

    if(cached){

     const parsed =
  JSON.parse(cached);

const isFresh =

Date.now() -
parsed.createdAt <

1000 * 60 * 60 * 6;

if(
  isFresh &&
  parsed.timings
){

  renderPrayerTimes(
    parsed.timings
  );

}

    }

    /* =========================
    LOCATION
    ========================= */

    navigator.geolocation.getCurrentPosition(

      async(position)=>{

        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;

        /* =========================
        API
        ========================= */

        const res =
          await fetch(

`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=13`

          );

        const data =
          await res.json();

        const timings =
          data?.data?.timings;

        if(!timings){
          return;
        }

        /* =========================
        SAVE CACHE
        ========================= */

     localStorage.setItem(

  "tm_prayer_times",

  JSON.stringify({

    createdAt:Date.now(),

    timings

  })

);

        /* =========================
        RENDER
        ========================= */

        renderPrayerTimes(
          timings
        );

      },

 ()=>{

  console.log(
    "Konum alınamadı"
  );

  renderPrayerTimes({

    Fajr:"04:30",

    Dhuhr:"13:00",

    Asr:"16:45",

    Maghrib:"19:35",

    Isha:"21:00"

  });

},

      {

        enableHighAccuracy:false,

        timeout:10000,

        maximumAge:1000 * 60 * 60

      }

    );

  }

  catch(e){

    console.log(
      "Prayer Error",
      e
    );

  }

}

/* =========================
RENDER
========================= */

function renderPrayerTimes(
  timings
){

  const setText = (
    id,
    value
  )=>{

    const el =
      document.getElementById(id);

    if(el){

      el.textContent =
        (value || "--:--")
          .split(" ")[0];

    }

  };

  setText(
    "fajrTime",
    timings.Fajr
  );

  setText(
    "dhuhrTime",
    timings.Dhuhr
  );

  setText(
    "asrTime",
    timings.Asr
  );

  setText(
    "maghribTime",
    timings.Maghrib
  );

  setText(
    "ishaTime",
    timings.Isha
  );

}


/* =========================
HIJRI COUNTDOWN
========================= */
function initHijriCard(){

  const countdownEl =
  document.getElementById(
    "hijriCountdown"
  );

  if(!countdownEl){
    return;
  }

  const eventDate =
  new Date(
    "2026-05-27T00:00:00"
  );

  function update(){

    const now =
    new Date();

    const diff =
    eventDate - now;

    if(diff <= 0){

      countdownEl.textContent =
      "Kurban Bayramı Başladı";

      return;

    }

    const days =
    Math.floor(
      diff / (1000*60*60*24)
    );

    const hours =
    Math.floor(
      (diff / (1000*60*60)) % 24
    );

    const mins =
    Math.floor(
      (diff / (1000*60)) % 60
    );

    countdownEl.textContent =

`${days} Gün ${hours} Saat ${mins} Dk. Kaldı`;

  }

  update();

  setInterval(
    update,
    60000
  );

}

document.addEventListener(
  "DOMContentLoaded",
  ()=>{
    initHijriCard();
  }
);