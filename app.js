// =========================
// INIT (DOM READY)
// =========================
document.addEventListener("DOMContentLoaded", () => {

  initSlider();
  initStars();

  updateDateTime();
  updatePrayerState();

  setInterval(updateDateTime, 1000);
  setInterval(updatePrayerState, 60000);

  loadTopMescids();

});


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

  if(
    !/Android|iPhone|iPad/i
    .test(navigator.userAgent)
  ){

    alert(
      "Sadece mobil cihazdan değerlendirme yapılabilir"
    );

    return;

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
      ablution === "Yok" &&
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
      ablution === "Yok"
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
      "lat",
      41.0082
    );

    formData.append(
      "lng",
      28.9784
    );

    Array
    .from(imagesInput.files)
    .forEach(file=>{

      formData.append(
        "images",
        file
      );

    });

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

    location.href =
`mescid_detay.html?slug=${data.slug}`;

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

    const desc =
    document.getElementById("desc")
    ?.value
    ?.trim();

    if(!type){

      alert(
        "Konum seçmek zorunlu"
      );

      return false;

    }

  if(
  desc &&
  desc.length > 0 &&
  desc.length < 5
){
  alert(
    "Açıklama en az 5 karakter olmalı"
  );

  return false;
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
        ablution === "Yok" &&
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
        "Tüm puanlamaları yapmak zorunlu"
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

    input.value =
    inputId === "ablution"
      ? "Var"
      : "Evet";

    updateAblutionArea();

    return;

  }

  // YES -> NO

  if(el.classList.contains("active-yes")){

    el.classList.remove("active-yes");

    el.classList.add("active-no");

    input.value =
    inputId === "ablution"
      ? "Yok"
      : "Hayır";

    updateAblutionArea();

    return;

  }

  // NO -> YES

  el.classList.remove("active-no");

  el.classList.add("active-yes");

  input.value =
  inputId === "ablution"
    ? "Var"
    : "Evet";

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
  ablution.value === "Var"
    ? "block"
    : "none";

}


// =========================
// LOAD TOP MESCIDS
// =========================
async function loadTopMescids(){

  try{

    const res = await fetch(
      "https://spring-violet-7aa7.temizmescid.workers.dev/api/mescids/top"
    );

    const data =
    await res.json();

    console.log(
      "CANLI MESCIDLER:",
      data
    );

  }

  catch(err){

    console.error(err);

  }

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
