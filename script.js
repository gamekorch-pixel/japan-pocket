// ================= ELEMENTS =================
const content = document.getElementById('content');
const modal = document.getElementById('modal');
const modalJP = document.getElementById('modalJP');
const closeModal = document.getElementById('closeModal');
const speakModal = document.getElementById('speakModal');

const yenInput = document.getElementById('yenInput');
const yenResult = document.getElementById('yenResult');

const darkCheckbox = document.getElementById('darkCheckbox');

// ================= YEN RATE =================
let yenRate = 0.024;

// ================= FAVORITES =================
let favorites = new Set(
  JSON.parse(localStorage.getItem('japan_pocket_favs') || '[]')
);

// ================= DATABASE =================
const database = {
  phrases: [
    { he:'שלום', en:'Hello', jp:'こんにちは', romaji:'Konnichiwa' },
    { he:'תודה רבה', en:'Thank You', jp:'ありがとうございます', romaji:'Arigatou Gozaimasu' },
    { he:'איפה השירותים?', en:'Where is the toilet?', jp:'トイレはどこですか？', romaji:'Toire wa doko desu ka' },
    { he:'כמה זה עולה?', en:'How much is it?', jp:'いくらですか？', romaji:'Ikura desu ka' }
  ],

  food: [
    { he:'סושי', en:'Sushi', jp:'寿司' },
    { he:'ראמן', en:'Ramen', jp:'ラーメン' },
    { he:'טמפורה', en:'Tempura', jp:'天ぷら' }
  ],

  transport: [
    { he:'רכבת', en:'Train', jp:'電車' },
    { he:'תחנה', en:'Station', jp:'駅' },
    { he:'שינקנסן', en:'Shinkansen', jp:'新幹線' }
  ],

  shopping: [
    { he:'כרטיס אשראי', en:'Credit Card', jp:'クレジットカード' },
    { he:'מזומן', en:'Cash', jp:'現金' },
    { he:'קבלה', en:'Receipt', jp:'レシート' }
  ],

  emergency: [
    { he:'משטרה', en:'Police', jp:'警察' },
    { he:'אמבולנס', en:'Ambulance', jp:'救急車' },
    { he:'בית חולים', en:'Hospital', jp:'病院' }
  ]
};

// ================= SPEAK =================
function speak(text){
  if(!window.speechSynthesis) return;

  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  utter.rate = 0.9;

  const voices = speechSynthesis.getVoices();
  const jpVoice = voices.find(v => v.lang.startsWith('ja'));
  if(jpVoice) utter.voice = jpVoice;

  speechSynthesis.speak(utter);
}

// ================= MODAL =================
function openModal(jp){
  modalJP.textContent = jp;
  modal.classList.remove('hidden');
}

closeModal.onclick = () => modal.classList.add('hidden');

modal.addEventListener('click', e => {
  if(e.target === modal){
    modal.classList.add('hidden');
  }
});

speakModal.onclick = () => speak(modalJP.textContent);

// ================= FAVORITES =================
function toggleFavorite(jp){
  if(favorites.has(jp)){
    favorites.delete(jp);
  }else{
    favorites.add(jp);
  }

  localStorage.setItem(
    'japan_pocket_favs',
    JSON.stringify([...favorites])
  );

  render();
}

// ================= CARD =================
function createCard(item){

  const isFav = favorites.has(item.jp);

  return `
    <div class="card">
      <div class="card-top">
        <div>
          <div class="card-he">${item.he}</div>
          <div class="card-jp">${item.jp}</div>
          ${item.romaji ? `<div class="card-romaji">${item.romaji}</div>` : ''}
        </div>

        <button class="fav-btn ${isFav ? 'active' : ''}"
                onclick="toggleFavorite('${item.jp}')">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>

      ${item.en ? `<div class="card-en">${item.en}</div>` : ''}

      <div class="card-actions">
        <button onclick="speak('${item.jp}')">🔊 השמע</button>
        <button onclick="openModal('${item.jp}')">👁️ הצג</button>
      </div>
    </div>
  `;
}

// ================= RENDER =================
let currentTab = 'phrases';

function getCurrentList(){

  if(currentTab === 'favorites'){
    const all = Object.values(database).flat();
    return all.filter(item => favorites.has(item.jp));
  }

  return database[currentTab];
}

function render(){

  const list = getCurrentList();

  if(list.length === 0){
    content.innerHTML = `
      <div class="card" style="grid-column:1/-1;text-align:center">
        <h2>🤍</h2>
        <p>אין עדיין פריטים במועדפים</p>
      </div>
    `;
    return;
  }

  content.innerHTML = list.map(createCard).join('');
}

// ================= TABS =================
document.querySelectorAll('.tab').forEach(tab => {

  tab.addEventListener('click', () => {

    document.querySelectorAll('.tab')
      .forEach(t => t.classList.remove('active'));

    tab.classList.add('active');

    currentTab = tab.dataset.tab;

    render();
  });
});

// ================= DARK MODE =================
if(localStorage.getItem('dark_mode') === 'true'){
  document.body.classList.add('dark');
  darkCheckbox.checked = true;
}

darkCheckbox.addEventListener('change', () => {

  document.body.classList.toggle('dark', darkCheckbox.checked);

  localStorage.setItem('dark_mode', darkCheckbox.checked);
});

// ================= YEN CONVERTER =================
yenInput.addEventListener('input', () => {

  const yen = parseFloat(yenInput.value) || 0;

  yenResult.textContent = (yen * yenRate).toFixed(2) + ' ₪';
});

// ================= LIVE RATE =================
async function fetchRate(){

  try{
    const res = await fetch('https://open.er-api.com/v6/latest/JPY');
    const data = await res.json();

    if(data?.rates?.ILS){
      yenRate = data.rates.ILS;
    }

  }catch(e){
    yenRate = 0.024;
  }
}

fetchRate();

// ================= INIT =================
render();

// כדי שפונקציות יעבדו מתוך HTML
window.speak = speak;
window.openModal = openModal;
window.toggleFavorite = toggleFavorite;