// ===============================
// 🇯🇵 JAPAN POCKET 2.0
// ===============================

const content = document.getElementById("content");
const modal = document.getElementById("modal");
const modalJP = document.getElementById("modalJP");
const speakButton = document.getElementById("speak");

const yenTopInput = document.getElementById("yenTopInput");
const yenTopResult = document.getElementById("yenTopResult");

let currentTab = "phrases";
let currentYenRate = 0.024;

let clickCounts = {};
let warningTimeout = null;
let lastWarningTime = 0;

// יצירת אלמנט הודעת אזהרה מעוצב לפי עיצוב הכפתור המבוקש
const volumeWarning = document.createElement("div");
volumeWarning.style.cssText = `
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 25px;
    border: unset;
    border-radius: 15px;
    color: #212121;
    z-index: 1000;
    background: #e8e8e8;
    position: fixed;
    font-weight: 1000;
    font-size: 17px;
    box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    transition: all 250ms;
    overflow: hidden;
    display: none;
    direction: rtl;
    text-align: center;
    cursor: default;
`;
volumeWarning.textContent = "ייתכן שהווליום במכשיר שלך מכובה או על שקט";
document.body.appendChild(volumeWarning);

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
    yenTopInput.setAttribute("maxlength", "10");
    yenTopInput.addEventListener("input", () => {
        if(yenTopInput.value.length > 10) {
            yenTopInput.value = yenTopInput.value.slice(0, 10);
        }
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
{he:"סושי",en:"Sushi",jp:"寿司"},
{he:"ראמן",en:"Ramen",jp:"ラーメン"},
{he:"אוניגירי",en:"Onigiri",jp:"おにぎり"},
{he:"טמפורה",en:"Tempura",jp:"天ぷら"},
{he:"גיוזה",en:"Gyoza",jp:"餃子"},
{he:"אודון",en:"Udon",jp:"うどん"},
{he:"סובה",en:"Soba",jp:"そば"},
{he:"בנטו",en:"Bento",jp:"弁当"},
{he:"טאקויאקי",en:"Takoyaki",jp:"たこ焼き"},
{he:"יאקיטורי",en:"Yakitori",jp:"焼き鳥"}
],

transport:[
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
],

shopping:[
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
],

emergency:[
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
]

};

function speak(text){
if(!window.speechSynthesis) return;

const now = Date.now();
clickCounts[text] = (clickCounts[text] || 0) + 1;

// הצגת האזהרה אם לחץ 3 פעמים, וגם מאפשר הצגה חוזרת אחרי 10 שניות
if(clickCounts[text] >= 3 && (now - lastWarningTime > 10000)){
    volumeWarning.style.display = "block";
    lastWarningTime = now;
    if(warningTimeout) clearTimeout(warningTimeout);
    warningTimeout = setTimeout(()=>{
        volumeWarning.style.display = "none";
    }, 4000);
}

speechSynthesis.cancel();
const speech = new SpeechSynthesisUtterance(text);
speech.lang = "ja-JP";
speech.rate = 0.9;
const voices = speechSynthesis.getVoices();
const jpVoice = voices.find(v=>v.lang.startsWith("ja"));
if(jpVoice){ speech.voice = jpVoice; }
speechSynthesis.speak(speech);
}

function openModal(jp) {
    if(modalJP) modalJP.textContent = jp;
    if(modal) modal.classList.remove("hidden");
}

if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) { modal.classList.add("hidden"); }
    });
}

if (speakButton) {
    speakButton.addEventListener("click", () => { speak(modalJP.textContent); });
}

function createCard(item){
return `
<div class="card" onclick="openModal('${item.jp.replace(/'/g, "\\'")}')">
<div style="width: 100%; box-sizing: border-box;">
<div class="cardMain" style="width: 100%; box-sizing: border-box;">
<div class="cardText" style="min-width: 0; overflow: hidden; text-overflow: ellipsis;">
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
</div>
</div>
`;
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

database.food.push(
  {he:"קארי",en:"Japanese Curry",jp:"カレー"},
  {he:"מוצ'י",en:"Mochi",jp:"餅"},
  {he:"דנגו",en:"Dango",jp:"団子"},
  {he:"אוקונומיאקי",en:"Okonomiyaki",jp:"お好み焼き"},
  {he:"יאקיסובה",en:"Yakisoba",jp:"焼きそば"},
  {he:"טונקאטסו",en:"Tonkatsu",jp:"とんかつ"},
  {he:"שאבו שאבו",en:"Shabu Shabu",jp:"しゃぶしゃぶ"},
  {he:"סוקיאקי",en:"Sukiyaki",jp:"すき焼き"},
  {he:"אדממה",en:"Edamame",jp:"枝豆"},
  {he:"דונבורי",en:"Donburi",jp:"丼"}
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