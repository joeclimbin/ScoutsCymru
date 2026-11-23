const STORAGE_KEY = 'wds_learning_hub_progress';

// ── Decision tree ──
const treeSteps = ['step0','step1yes','step1no'];
function treeGo(step) {
  ['treeStep0','treeStep1yes','treeStep1no','treeResult'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  var showId = step === 'step0'    ? 'treeStep0'
             : step === 'step1yes' ? 'treeStep1yes'
             : step === 'step1no'  ? 'treeStep1no'
             : 'treeStep0';
  var target = document.getElementById(showId);
  if (target) target.style.display = 'block';
}

const treeResults = {
  helper: {
    cls: 'grey',
    title: 'You are a Helper',
    desc: 'You are helping out informally without being on the SMS. Make sure you are always supervised by a Team Member or Team Leader when with young people. If you are coming along regularly, speak to your GLV or Team Leader about being added to SMS as an NMND.',
    anchor: 'roleHelper'
  },
  nmnd: {
    cls: 'blue',
    title: 'You are an NMND - Non-Member Needs Disclosure',
    desc: 'You are registered on SMS and have a DBS check but are not going through the full volunteer joining journey. You can help unsupervised and attend overnights once your DBS is complete. If you are helping regularly, consider becoming a full Team Member.',
    anchor: 'roleNmnd'
  },
  member: {
    cls: 'teal',
    title: 'You are a Team Member',
    desc: 'You have completed the volunteer joining journey and are a full Scout volunteer. You can plan and deliver the programme, work unsupervised, and attend all events. If you are already coordinating the team, you might be ready to become a Team Leader.',
    anchor: 'roleMember'
  },
  memberinprogress: {
    cls: 'teal',
    title: 'You are a Team Member - joining journey in progress',
    desc: 'You are on SMS and working through the volunteer joining journey. You are already a Team Member - keep going with the learning and your Welcome Conversation will complete the process. Check the Your Journey tab to see what is still to do.',
    anchor: 'roleMember'
  },
  newjoin: {
    cls: '',
    title: 'Welcome - let us get you started!',
    desc: 'Your GLV or Team Leader will add you to the Scout Membership System to begin your volunteer joining journey. Head to the Your Journey tab for a full guide to what to expect and when.',
    anchor: null
  }
};

function treeResult(key) {
  ['treeStep0','treeStep1yes','treeStep1no'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  var r = treeResults[key];
  var box = document.getElementById('treeResult');
  var scrollLink = '';
  if (r.anchor) {
    scrollLink = '<a href="#" onclick="scrollToRole(\'' + r.anchor + '\');return false;" style="font-size:0.82rem;font-weight:600;color:var(--purple);">&darr; See full role description below</a><br>';
  }
  box.innerHTML =
    '<div class="tree-result-box ' + r.cls + '">' +
      '<div class="tree-result-title">' + r.title + '</div>' +
      '<div class="tree-result-desc">' + r.desc + '</div>' +
      scrollLink +
      '<button class="tree-btn tree-btn-ghost" style="margin-top:10px;font-size:0.8rem;" onclick="treeReset()">&larr; Start again</button>' +
    '</div>';
  box.style.display = 'block';
}

function scrollToRole(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

function treeReset() {
  treeGo('step0');
}

function switchTab(tab, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  if (btn) btn.classList.add('active');
}

function toggleTask(card) {
  card.classList.toggle('checked');
  saveProgress();
  updateProgress();
}

function updateProgress() {
  const all = document.querySelectorAll('#tab-journey .task-card');
  const done = document.querySelectorAll('#tab-journey .task-card.checked');
  const pct = Math.round((done.length / all.length) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressCount').textContent = done.length + ' / ' + all.length;
}

function saveProgress() {
  const cards = document.querySelectorAll('#tab-journey .task-card');
  const state = Array.from(cards).map(c => c.classList.contains('checked'));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch(e) {}
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const state = JSON.parse(saved);
    const cards = document.querySelectorAll('#tab-journey .task-card');
    cards.forEach((card, i) => {
      if (state[i]) card.classList.add('checked');
    });
  } catch(e) {}
  updateProgress();
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  document.querySelectorAll('#tab-journey .task-card').forEach(c => c.classList.remove('checked'));
  updateProgress();
}

// Initialise on load
loadProgress();
