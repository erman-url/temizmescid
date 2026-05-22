/* =========================
CITY SYSTEM ONLY FINAL
81 İL
DISTRICT = TEXT INPUT
========================= */

function normalizeTR(text){

return String(text || "")

.toLocaleLowerCase("tr-TR")

.normalize("NFC")

.trim();

}

function initCitySystem(){

const citySelect =
document.getElementById("city");

const districtInput =
document.getElementById("district");

/* =========================
ELEMENT CHECK
========================= */

if(
!citySelect ||
!districtInput
){
return;
}

/* =========================
81 CITY LIST
========================= */

const cities = [

"Adana",
"Adıyaman",
"Afyonkarahisar",
"Ağrı",
"Amasya",
"Ankara",
"Antalya",
"Artvin",
"Aydın",
"Balıkesir",
"Bilecik",
"Bingöl",
"Bitlis",
"Bolu",
"Burdur",
"Bursa",
"Çanakkale",
"Çankırı",
"Çorum",
"Denizli",
"Diyarbakır",
"Edirne",
"Elazığ",
"Erzincan",
"Erzurum",
"Eskişehir",
"Gaziantep",
"Giresun",
"Gümüşhane",
"Hakkari",
"Hatay",
"Isparta",
"Mersin",
"İstanbul",
"İzmir",
"Kars",
"Kastamonu",
"Kayseri",
"Kırklareli",
"Kırşehir",
"Kocaeli",
"Konya",
"Kütahya",
"Malatya",
"Manisa",
"Kahramanmaraş",
"Mardin",
"Muğla",
"Muş",
"Nevşehir",
"Niğde",
"Ordu",
"Rize",
"Sakarya",
"Samsun",
"Siirt",
"Sinop",
"Sivas",
"Tekirdağ",
"Tokat",
"Trabzon",
"Tunceli",
"Şanlıurfa",
"Uşak",
"Van",
"Yozgat",
"Zonguldak",
"Aksaray",
"Bayburt",
"Karaman",
"Kırıkkale",
"Batman",
"Şırnak",
"Bartın",
"Ardahan",
"Iğdır",
"Yalova",
"Karabük",
"Kilis",
"Osmaniye",
"Düzce"

]

.sort((a,b)=>

a.localeCompare(
b,
"tr"
)

);

/* =========================
RESET
========================= */

citySelect.innerHTML = `
<option value="">
Şehir Seçiniz
</option>
`;

/* =========================
APPEND
========================= */

const fragment =
document.createDocumentFragment();

cities.forEach(city=>{

const option =
document.createElement("option");

option.value = city;

option.textContent = city;

fragment.appendChild(option);

});

citySelect.appendChild(
fragment
);

/* =========================
DISTRICT INPUT SETTINGS
========================= */

districtInput.disabled = false;

districtInput.placeholder =
"İlçe Giriniz";

districtInput.maxLength = 60;

districtInput.setAttribute(
"autocomplete",
"off"
);

districtInput.setAttribute(
"autocapitalize",
"words"
);

/* =========================
DISTRICT CLEAN
========================= */

districtInput.addEventListener(
"input",
()=>{

districtInput.value =

districtInput.value

.replace(/\s{2,}/g," ")

.replace(/[0-9]/g,"")

.slice(0,60);

}
);

}