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
});


// =========================
// SLIDER
// =========================
let sliderIndex = 0;
let sliderInterval = null;
let slides = [];

function initSlider(){
  slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  showSlide(sliderIndex);

  if (sliderInterval) clearInterval(sliderInterval);

  sliderInterval = setInterval(() => {
    sliderIndex = (sliderIndex + 1) % slides.length;
    showSlide(sliderIndex);
  }, 10000);
}

function showSlide(index){
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}


// =========================
// STAR INIT (SAFE)
// =========================
function initStars(){
  document.querySelectorAll(".star").forEach(el => {

    if (el.dataset.initialized) return;
    el.dataset.initialized = "true";

    for(let i = 1; i <= 5; i++){
      const s = document.createElement("span");
      s.innerText = "★";

      s.addEventListener("click", () => {
        el.dataset.val = i;

        [...el.children].forEach((c, idx) => {
          c.classList.toggle("active", idx < i);
        });
      });

      el.appendChild(s);
    }
  });
}


// =========================
// MODAL (PRO)
// =========================

let scrollY = 0;

function startForm(){

  const modal = document.getElementById("formModal");
  if(!modal) return;

  // 📱 Mobil kontrol (proje kuralına uygun)
  if(!/Android|iPhone|iPad/i.test(navigator.userAgent)){
    alert("Sadece mobil cihazdan değerlendirme yapılabilir");
    return;
  }

  // 🔒 Scroll pozisyonunu kaydet
  scrollY = window.scrollY;

  // 🔒 Body lock (kayma fix)
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  document.body.classList.add("modal-open");

  // 🎯 Modal aç
  modal.classList.remove("hidden");

  // 🧭 Her zaman ilk step ile başlat
  goStep(1);
}


// =========================
// MODAL CLOSE
// =========================
function closeForm(){

  const modal = document.getElementById("formModal");
  if(!modal) return;

  modal.classList.add("hidden");

  // 🔓 Body unlock (kayma fix)
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";

  document.body.classList.remove("modal-open");

  // 🔁 Scroll geri yükle
  window.scrollTo(0, scrollY);
}


// =========================
// STEP MANAGER (PRO)
// =========================
function goStep(step){

  document.querySelectorAll(".step").forEach(s=>{
    s.classList.remove("active");
  });

  document.getElementById("s"+step)?.classList.add("active");

  const bar = document.getElementById("bar");
  if(bar){
    bar.style.width = (step * 33) + "%";
  }
}


// =========================
// STEP CONTROL
// =========================
function next(step){

  const imagesInput = document.getElementById("images");

  if(step === 2){
    if(!imagesInput || imagesInput.files.length < 1){
      alert("En az 1 fotoğraf zorunlu");
      return;
    }

    if(imagesInput.files.length > 4){
      alert("Max 4 fotoğraf");
      return;
    }
  }

  document.querySelectorAll(".step").forEach(s=>{
    s.classList.remove("active");
  });

  document.getElementById("s"+step)?.classList.add("active");

  const bar = document.getElementById("bar");
  if(bar){
    bar.style.width = (step * 33) + "%";
  }
}


// =========================
// ABDEST CONTROL
// =========================
function toggleAblution(){
  const ablution = document.getElementById("ablution")?.value;
  const area = document.getElementById("ablutionArea");

  if(!area) return;

  area.style.display = ablution === "Yok" ? "none" : "block";
}


// =========================
// SCORE CALCULATION (PRO)
// =========================
function calculateScore(){

  let starTotal = 0;
  let starCount = 0;

  let boolTotal = 0;
  let boolCount = 0;

  const ablution = document.getElementById("ablution")?.value;

  // ⭐ STAR
  document.querySelectorAll(".star").forEach(el=>{
    const key = el.dataset.key;
    const val = Number(el.dataset.val || 0);

    if(ablution === "Yok" && (key === "ablution_clean" || key === "floor")){
      return;
    }

    if(val){
      starTotal += val;
      starCount++;
    }
  });
    
  const bools = [
    {id:"staff"},
    {id:"reported"},
    {id:"paper", depends:true},
    {id:"library"} // ✅ YENİ
  ];

 
  bools.forEach(b=>{
    if(b.depends && ablution === "Yok") return;

    const el = document.getElementById(b.id);
    if(!el) return;

    if(el.value === "Evet"){
      boolTotal += 1;
    }

    boolCount++;
  });

  const starAvg = starCount ? (starTotal / starCount) : 0;
  const boolAvg = boolCount ? (boolTotal / boolCount) : 0;

  // 🎯 FINAL SCORE
  const finalScore = (starAvg * 0.85) + (boolAvg * 5 * 0.15);

  return Number(finalScore.toFixed(2));
}


// =========================
// SCORE LABEL (UX)
// =========================
function getScoreLabel(score){

  if(score >= 4.5) return "Mükemmel";
  if(score >= 3.8) return "Çok İyi";
  if(score >= 3.0) return "İyi";
  if(score >= 2.0) return "Orta";
  return "Zayıf";
}
// =========================
// FORM SUBMIT (PRO)
// =========================
function submitForm(){

  // 🔒 VALIDATION
  if(!validateStep(4)) return;

  const ablution = document.getElementById("ablution")?.value;

  const score = calculateScore();

  const data = {
    type: document.getElementById("type")?.value,
    desc: document.getElementById("desc")?.value?.trim(),
    score,
    label: getScoreLabel(score),

    ratings: {},

    boolean: {
      staff: document.getElementById("staff")?.value === "Evet",
      reported: document.getElementById("reported")?.value === "Evet",

      // ✅ SADECE abdest varsa dahil
      paper: ablution !== "Yok" 
        ? document.getElementById("paper")?.value === "Evet"
        : null,

      // ✅ YENİ EKLENDİ
      library: document.getElementById("library")?.value === "Evet"
    }
  };

  // ⭐ STAR DATASI
  document.querySelectorAll(".star").forEach(el=>{
    const key = el.dataset.key;
    const val = Number(el.dataset.val || 0);

    // 🔒 Abdest yoksa ilgili ratingleri atla
    if(ablution === "Yok" && (key === "ablution_clean" || key === "floor")){
      return;
    }

    data.ratings[key] = val;
  });

  console.log("DATA:", data);

  alert(`⭐ ${score} - ${data.label}`);
}

// =========================
// DATE + TIME
// =========================
function updateDateTime(){
  const dateEl = document.getElementById("date");
  const timeEl = document.getElementById("time");

  if (!dateEl || !timeEl) return;

  const now = new Date();

  dateEl.innerText = now.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  timeEl.innerText = now.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}


// =========================
// NAMAZ SMART SYSTEM
// =========================
const prayerTimes = {
 imsak: "04:12",
 ogle: "13:05",
 ikindi: "16:45",
 aksam: "19:32",
 yatsi: "20:55"
};

function getMinutes(t){
 const [h,m] = t.split(":").map(Number);
 return h*60+m;
}

function updatePrayerState(){

 const now = new Date();
 const currentMin = now.getHours()*60 + now.getMinutes();

 const entries = Object.entries(prayerTimes);

 let current = null;
 let next = null;

 for(let i=0;i<entries.length;i++){
   const [name,time] = entries[i];
   const min = getMinutes(time);

   if(currentMin >= min){
     current = {name,time,min};
     next = entries[i+1]
       ? {name:entries[i+1][0],time:entries[i+1][1],min:getMinutes(entries[i+1][1])}
       : null;
   }
 }

 document.querySelectorAll(".prayer-item").forEach(el=>{
   el.classList.remove("active");
   if(el.dataset.name === current?.name){
     el.classList.add("active");
   }
 });

 const countdownEl = document.getElementById("countdown");

 if(countdownEl){
   if(next){
     const diff = next.min - currentMin;
     const h = Math.floor(diff/60);
     const m = diff%60;

     countdownEl.innerText = `${next.name} ${h}s ${m}dk`;
   } else {
     countdownEl.innerText = "Yarın";
   }
 }
}

function validateStep(step){

  // STEP 2
  if(step === 3){
    const type = document.getElementById("type")?.value;
    const desc = document.getElementById("desc")?.value?.trim();

    if(!type){
      alert("Konum seçmek zorunlu");
      return false;
    }

    if(!desc || desc.length < 5){
      alert("Açıklama en az 5 karakter olmalı");
      return false;
    }
  }

  // STEP 3
  if(step === 4){

    let allRated = true;

    document.querySelectorAll(".star").forEach(el=>{
      const key = el.dataset.key;
      const val = Number(el.dataset.val || 0);

      const ablution = document.getElementById("ablution")?.value;

      if(ablution === "Yok" && (key === "ablution_clean" || key === "floor")){
        return;
      }

      if(val === 0){
        allRated = false;
      }
    });

    if(!allRated){
      alert("Tüm puanlamaları yapmak zorunlu");
      return false;
    }

    return true;
  }

  return true;
}

