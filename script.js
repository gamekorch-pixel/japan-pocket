// ===============================
// 🇯🇵 Japan Pocket 2.0
// ===============================

const content = document.getElementById("content");
const modal = document.getElementById("modal");
const modalJP = document.getElementById("modalJP");
const modalEN = document.getElementById("modalEN");
const modalHE = document.getElementById("modalHE");
const speakButton = document.getElementById("speak");
const closeButton = document.getElementById("close");

const yenTopInput = document.getElementById("yenTopInput");
const yenTopResult = document.getElementById("yenTopResult");

let currentTab = "phrases";
let currentYenRate = 0.024;

async function fetchLiveYenRate() {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/JPY");
        if (response.ok) {
            const data = await response.json();
            if (data && data.rates && data.rates.ILS) {
                currentYenRate = data.rates.ILS;
            }
        }
    } catch (e) {}
}
fetchLiveYenRate();

if (yenTopInput) {
    yenTopInput.addEventListener("input", () => {
        const yen = parseFloat(yenTopInput.value) || 0;
        yenTopResult.textContent = "₪ " + (yen * currentYenRate).toFixed(2);
    });
}

const database = {
phrases:[
{he:"שלום",en:"Hello",jp:"こんにちは",romaji:"Konnichiwa"},
{he:"בוקר טוב",en:"Good Morning",jp:"おはようございます",romaji:"Ohayou Gozaimasu"},
{he:"ערב טוב",en:"Good Evening",jp:"こんばんは",romaji:"Konbanwa"},
{he:"לילה טוב",en:"Good Night",jp:"おやすみなさい",romaji:"Oyasuminasai"},
{he:"תודה רבה",en:"Thank You",jp:"ありがとうございます",romaji:"Arigatou Gozaimasu"},
{he:"סליחה",en:"Excuse Me",jp:"すみません",romaji:"Sumimasen"},
{he:"כן",en:"Yes",jp:"はい",romaji:"Hai"},
{he:"לא",en:"No",jp:"いいえ",romaji:"Iie"},
{he:"אני לא מבין",en:"I don't understand",jp:"わかりません",romaji:"Wakarimasen"},
{he:"אפשר לעזור לי?",en:"Can you help me?",jp:"助けてください",romaji:"Tasukete Kudasai"},
{he:"איפה השירותים?",en:"Where is the toilet?",jp:"トイレはどこですか？",romaji:"Toire wa Doko Desu Ka"},
{he:"כמה זה עולה?",en:"How much is it?",jp:"いくらですか？",romaji:"Ikura Desu Ka"}
],

food:[
{he:"סושי",en:"Sushi",jp:"寿司",image:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80"},
{he:"ראמן",en:"Ramen",jp:"ラーメン",image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80"},
{he:"אוניגירי",en:"Onigiri",jp:"おにぎり",image:"https://images.unsplash.com/photo-1607301459267-7c063f26fdb4?auto=format&fit=crop&w=600&q=80"},
{he:"טמפורה",en:"Tempura",jp:"天ぷら",image:"https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80"},
{he:"גיוזה",en:"Gyoza",jp:"餃子",image:"https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80"},
{he:"אודון",en:"Udon",jp:"うどん",image:"https://images.unsplash.com/photo-1618841539848-3a58e6584432?auto=format&fit=crop&w=600&q=80"},
{he:"סובה",en:"Soba",jp:"そば",image:"https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80"},
{he:"בנטו",en:"Bento",jp:"弁当",image:"https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80"},
{he:"טאקויאקי",en:"Takoyaki",jp:"たこ焼き",image:"https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80"},
{he:"יאקיטורי",en:"Yakitori",jp:"焼き鳥",image:"https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80"}
],

transport:[],
shopping:[],
emergency:[]
};

function speak(text){
if(!window.speechSynthesis) return;
speechSynthesis.cancel();
const speech = new SpeechSynthesisUtterance(text);
speech.lang = "ja-JP";
speech.rate = 0.9;
const voices = speechSynthesis.getVoices();
const jpVoice = voices.find(v=>v.lang.startsWith("ja"));
if(jpVoice){ speech.voice = jpVoice; }
speechSynthesis.speak(speech);
}

function copy(text){
navigator.clipboard.writeText(text);
}

function copyFeedback(btn,text){
copy(text);
btn.classList.add("copied");
const original=btn.textContent;
btn.textContent="✓";
setTimeout(()=>{
btn.classList.remove("copied");
btn.textContent=original;
},700);
}

function createCard(item){
let imageHtml = "";
if (item.image) {
    imageHtml = `<img src="${item.image}" alt="${item.en || item.he}" class="cardFoodImg" loading="lazy">`;
}

return `
<div class="card" onclick="openModal('${item.jp.replace(/'/g, "\\'")}', '${item.en ? item.en.replace(/'/g, "\\'") : ""}', '${item.he.replace(/'/g, "\\'")}')">
<div>
${imageHtml}
<div class="cardMain">
<div class="cardText">
<div class="cardHe">${item.he}</div>
<div class="cardJp">${item.jp}</div>
${item.romaji ? `<div class="cardRomaji">${item.romaji}</div>` : ""}
</div>
<button class="playBtn" onclick="event.stopPropagation(); speak('${item.jp}')" aria-label="השמע">
<span class="playIcon"></span>
</button>
</div>
${item.en ? `<div class="cardEn">${item.en}</div>` : ""}
</div>
<div class="buttons" onclick="event.stopPropagation();">
<button onclick="speak('${item.jp}')">🔊</button>
<button onclick="copyFeedback(this,'${item.jp}')">📋</button>
</div>
</div>
`;
}

function openModal(jp, en, he) {
    modalJP.textContent = jp;
    modalEN.textContent = en;
    modalHE.textContent = he;
    modal.classList.remove("hidden");
}

if (closeButton) {
    closeButton.addEventListener("click", () => { modal.classList.add("hidden"); });
}

if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) { modal.classList.add("hidden"); }
    });
}

if (speakButton) {
    speakButton.addEventListener("click", () => { speak(modalJP.textContent); });
}

function renderCards(list){
    content.innerHTML="";
    if(list.length===0){
        content.innerHTML=`<div class="card"><h2>😕</h2><p>לא נמצאו תוצאות</p></div>`;
        return;
    }
    list.forEach(item=>{ content.innerHTML+=createCard(item); });
}

function render(){
    switch(currentTab){
        case "phrases": renderCards(database.phrases); break;
        case "food": renderCards(database.food); break;
        case "transport": renderCards(database.transport); break;
        case "shopping": renderCards(database.shopping); break;
        case "emergency": renderCards(database.emergency); break;
    }
}

document.querySelectorAll(".tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
        document.querySelectorAll(".tab").forEach(btn=>{ btn.classList.remove("active"); });
        tab.classList.add("active");
        currentTab=tab.dataset.tab;
        render();
    });
});

database.transport = [
{he:"רכבת",en:"Train",jp:"電車"},
{he:"תחנה",en:"Station",jp:"駅"},
{he:"רציף",en:"Platform",jp:"ホーム"},
{he:"יציאה",en:"Exit",jp:"出口"},
{he:"כניסה",en:"Entrance",jp:"入口"},
{he:"שינקנסן",en:"Shinkansen",jp:"新幹線"},
{he:"מטרו",en:"Metro",jp:"地下鉄"},
{he:"אוטובוס",en:"Bus",jp:"バス"},
{he:"מונית",en:"Taxi",jp:"タクシー"},
{he:"שדה תעופה",en:"Airport",jp:"空港"},
{he:"כרטיס",en:"Ticket",jp:"切符"},
{he:"מכונת כרטיסים",en:"Ticket Machine",jp:"券売機"},
{he:"רכבת אחרונה",en:"Last Train",jp:"終電"},
{he:"מדרגות נעות",en:"Escalator",jp:"エスカレーター"},
{he:"מעלית",en:"Elevator",jp:"エレベーター"}
];

database.shopping = [
{he:"כמה זה עולה?",en:"How much?",jp:"いくらですか？"},
{he:"כרטיס אשראי",en:"Credit Card",jp:"クレジットカード"},
{he:"מזומן",en:"Cash",jp:"現金"},
{he:"קבלה",en:"Receipt",jp:"レシート"},
{he:"שקית",en:"Bag",jp:"袋"},
{he:"מבצע",en:"Sale",jp:"セール"},
{he:"פתוח",en:"Open",jp:"営業中"},
{he:"סגור",en:"Closed",jp:"閉店"},
{he:"קטן",en:"Small",jp:"小さい"},
{he:"בינוני",en:"Medium",jp:"中"},
{he:"גדול",en:"Large",jp:"大きい"},
{he:"אני רק מסתכל",en:"Just Looking",jp:"見ているだけです"},
{he:"אפשר למדוד?",en:"Can I Try It On?",jp:"試着できますか？"},
{he:"זול",en:"Cheap",jp:"安い"},
{he:"יקר",en:"Expensive",jp:"高い"}
];

database.emergency = [
{he:"משטרה",en:"Police",jp:"警察"},
{he:"אמבולנס",en:"Ambulance",jp:"救急車"},
{he:"בית חולים",en:"Hospital",jp:"病院"},
{he:"בית מרקחת",en:"Pharmacy",jp:"薬局"},
{he:"רופא",en:"Doctor",jp:"医者"},
{he:"אני צריך עזרה",en:"Help",jp:"助けてください"},
{he:"אני חולה",en:"I'm Sick",jp:"気分が悪いです"},
{he:"אני אלרגי",en:"I Have Allergies",jp:"アレルギーがあります"},
{he:"אש",en:"Fire",jp:"火事"},
{he:"סכנה",en:"Danger",jp:"危険"},
{he:"איבדתי את הדרכון",en:"I Lost My Passport",jp:"パスポートをなくしました"},
{he:"תתקשר למשטרה",en:"Call The Police",jp:"警察を呼んでください"},
{he:"תתקשר לאמבולנס",en:"Call An Ambulance",jp:"救急車を呼んでください"}
];

// Append more food items safely using .push() with spread or direct objects
database.food.push(
  {he:"קארי",en:"Japanese Curry",jp:"カレー",image:"https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80"},
  {he:"מוצ'י",en:"Mochi",jp:"餅",image:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80"},
  {he:"דנגו",en:"Dango",jp:"団子",image:"https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"},
  {he:"אוקונומיאקי",en:"Okonomiyaki",jp:"お好み焼き",image:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"},
  {he:"יאקיסובה",en:"Yakisoba",jp:"焼きそば",image:"https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80"},
  {he:"טונקאטסו",en:"Tonkatsu",jp:"とんかつ",image:"https://images.unsplash.com/photo-1604908176997-125f2596f378?auto=format&fit=crop&w=600&q=80"},
  {he:"שאבו שאבו",en:"Shabu Shabu",jp:"しゃぶしゃぶ",image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"},
  {he:"סוקיאקי",en:"Sukiyaki",jp:"すき焼き",image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80"},
  {he:"אדממה",en:"Edamame",jp:"枝豆",image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80"},
  {he:"דונבורי",en:"Donburi",jp:"丼",image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80"}
);

database.phrases.push(
{he:"אני מישראל",en:"I'm from Israel",jp:"イスラエルから来ました",romaji:"Isuraeru kara kimashita"},
{he:"אפשר מים?",en:"Water Please",jp:"水をください",romaji:"Mizu o kudasai"},
{he:"אפשר את החשבון?",en:"The Bill Please",jp:"お会計お願いします",romaji:"Okaikei onegaishimasu"},
{he:"טעים מאוד",en:"Very Delicious",jp:"とてもおいしいです",romaji:"Totemo oishii desu"},
{he:"איפה התחנה?",en:"Where Is The Station?",jp:"駅はどこですか？",romaji:"Eki wa doko desu ka"},
{he:"אפשר Wi-Fi?",en:"Do You Have Wi-Fi?",jp:"Wi-Fiはありますか？",romaji:"Wi-Fi wa arimasu ka"},
{he:"אני לא אוכל בשר",en:"I Don't Eat Meat",jp:"肉を食べません",romaji:"Niku o tabemasen"},
{he:"אני צמחוני",en:"I'm Vegetarian",jp:"私はベジタリアンです",romaji:"Watashi wa bejitarian desu"},
{he:"אני טבעוני",en:"I'm Vegan",jp:"私はヴィーガンです",romaji:"Watashi wa vegan desu"},
{he:"אפשר תמונה?",en:"Can I Take A Photo?",jp:"写真を撮ってもいいですか？",romaji:"Shashin o totte mo ii desu ka"}
);

render();