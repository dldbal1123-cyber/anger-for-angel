/* ── 페이지 기준 위치 맞춤: data-page-top 값(px)을 페이지 맨 위에서의 위치로 사용 ──
   (첫 화면 높이가 달라도 항상 같은 페이지 위치에 놓이도록)
   픽셀 디졸브가 위치를 읽기 전에 먼저 배치되도록 맨 앞에 둔다. */
(function(){
  const items = document.querySelectorAll('[data-page-top]');
  function place(){
    items.forEach(el => {
      el.style.top = (Number(el.dataset.pageTop) - el.parentElement.offsetTop) + 'px';
    });
  }
  window.addEventListener('resize', place);
  window.addEventListener('load', place);
  place();
})();

/* ── 페이지 끝: 마지막 콘텐츠(진단 영역) 아래 여백을 항상 일정하게 ──
   마지막 검정 영역 높이를 계산해서, 첫 화면 높이가 달라도 아래 여백이 PAGE_BOTTOM_GAP으로 유지되게 함 */
const PAGE_BOTTOM_GAP = 50;
(function(){
  const last = document.querySelector('.diagnose');
  const end = document.querySelector('.black-section--end');
  if(!last || !end) return;
  function fit(){
    const lastBottom = Number(last.dataset.pageTop) + last.offsetHeight;
    const endTop = end.getBoundingClientRect().top + window.scrollY;
    end.style.height = Math.max(0, lastBottom + PAGE_BOTTOM_GAP - endTop) + 'px';
  }
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  fit();
})();

/* ── 스크롤 연동 픽셀 디졸브 ──
   처음엔 아무것도 없다가, 스크롤로 내려올수록 픽셀이 위쪽부터 불규칙하게 나타난다.
   픽셀 색은 캔버스의 data-color, 없으면 첫 화면 배경색.
   진행도는 스크롤 위치로만 계산하므로 위로 스크롤하면 그대로 역순 복원된다. */
(function(){
  const hero = document.querySelector('.hero');
  const canvases = document.querySelectorAll('.pixel-dissolve');
  if(!hero || !canvases.length) return;

  const PIXEL = 7;   // 픽셀 크기(px)
  const FLIP_SLOW = 0.15;   // 영역 사이 전환(--flip)은 화면 높이 × 이 값만큼 더 스크롤해야 끝남 (클수록 천천히). 아래 제목·본문이 보이기 전에 끝나도록 0.15

  const layers = Array.from(canvases, canvas => ({
    canvas, ctx: canvas.getContext('2d'),
    color: canvas.dataset.color || getComputedStyle(hero).backgroundColor,
    W: 0, H: 0, cols: 0, rows: 0, cells: null,
    slow: canvas.classList.contains('pixel-dissolve--flip') ? FLIP_SLOW : 0
  }));
  let ticking = false;

  function build(layer){
    const { canvas, ctx } = layer;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    layer.W = canvas.clientWidth; layer.H = canvas.clientHeight;
    canvas.width = layer.W * DPR; canvas.height = layer.H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    layer.cols = Math.ceil(layer.W / PIXEL); layer.rows = Math.ceil(layer.H / PIXEL);
    // 셀마다 고정 임계값: 위쪽일수록 먼저 나타나고, 랜덤 값으로 불규칙하게
    layer.cells = new Float32Array(layer.cols * layer.rows);
    for(let r = 0; r < layer.rows; r++){
      const fromTop = (r + 0.5) / layer.rows;
      for(let c = 0; c < layer.cols; c++){
        layer.cells[r * layer.cols + c] = Math.random() - fromTop;
      }
    }
  }

  function draw(layer){
    const { canvas, ctx, W, H, cols, rows, cells } = layer;
    // 캔버스 상단이 화면 맨 아래에 닿을 때 0, 캔버스 높이(+ 영역 전환은 화면 높이 × slow)만큼 더 올라왔을 때 1
    const top = canvas.getBoundingClientRect().top;
    const progress = Math.min(Math.max((window.innerHeight - top) / (H + window.innerHeight * layer.slow), 0), 1);
    // 영역 사이 전환(--flip)은 끝까지 진행되면 픽셀이 전부 채워져 다음 영역 색 한 가지로 끝남
    // (예전엔 절반만 채워진 그라데이션 띠가 영역 사이에 계속 남아 경계가 애매해 보였음)
    const limit = layer.slow ? 1 - progress * 2 : 1 - progress;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = layer.color;
    for(let r = 0; r < rows; r++){
      for(let c = 0; c < cols; c++){
        if(cells[r * cols + c] > limit) ctx.fillRect(c * PIXEL, r * PIXEL, PIXEL, PIXEL);
      }
    }
  }

  function drawAll(){ ticking = false; layers.forEach(draw); }
  function buildAll(){ layers.forEach(build); drawAll(); }

  window.addEventListener('scroll', () => {
    if(!ticking){ ticking = true; requestAnimationFrame(drawAll); }
  }, {passive:true});
  window.addEventListener('resize', buildAll);
  window.addEventListener('load', buildAll);
  buildAll();
})();

/* ── 상단바 색 전환: 파란 영역이 상단바 아래로 들어오면 검정 글자/로고 ── */
(function(){
  const bar = document.querySelector('.topbar');
  const blue = document.querySelector('.blue-section');
  if(!bar || !blue) return;
  function update(){
    // 상단바 세로 가운데 지점이 파란 영역 안에 있을 때
    const mid = bar.offsetHeight / 2;
    const r = blue.getBoundingClientRect();
    bar.classList.toggle('topbar--dark', r.top <= mid && r.bottom > mid);
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();

/* ── 발산 단계 데이터: 펼친 카드 처방전 내용 (카드 순서와 동일) ── */
const stages = [
  { id:'SILENT', name:'무음',
    diagnosis:'분노가 느껴지지 않고 감정이 차단된 상태. 몸이 먼저 반응한다.',
    symptom:'무표정, 손발 차가워짐, 순간적인 기억 공백.',
    prescription:'감각을 깨우는 것부터.' },
  { id:'MURMUR', name:'웅얼거림',
    diagnosis:'분노를 느끼지만 혼자 삭히는 패턴. 안으로 돌리며 자책으로 전환되기 쉽다.',
    symptom:'두통, 소화불량, 잦은 한숨.',
    prescription:'표현의 출구 만들기.' },
  { id:'SHOUT', name:'외침',
    diagnosis:'분노가 쌓이고 있다는 것을 알지만 표현이 어렵다. 신체 증상으로 나타난다.',
    symptom:'어깨 결림, 이 악물기, 말끝 흐리기.',
    prescription:'작은 표현부터 연습.' },
  { id:'ROAR', name:'포효',
    diagnosis:'분노가 밖으로 나오기 시작하는 단계. 방향을 찾는 중이며 에너지가 있다.',
    symptom:'목소리 커짐, 심장 박동 상승, 손짓 커짐.',
    prescription:'분노가 가리키는 방향 찾기.' },
  { id:'BLAST', name:'폭음',
    diagnosis:'분노가 자주 강하게 나온다. 에너지가 많고 주변에 영향을 미친다.',
    symptom:'얼굴 붉어짐, 호흡 가빠짐, 언성 높아짐.',
    prescription:'에너지를 쏟을 창구 찾기.' }
];

/* 처방전 템플릿: 레이아웃은 동일, stage 값만 바뀜 */
function renderRxContent(stage, stepNum){
  return `
    <div class="rx-top-row">
      <span>Rx</span>
      <span>STEP ${String(stepNum).padStart(2,'0')}</span>
    </div>
    <div class="rx-title-box">
      <h3>${stage.name}</h3>
      <em>${stage.id}</em>
    </div>
    <div class="rx-block">
      <span class="rx-label">진단</span>
      <span class="rx-text">${stage.diagnosis}</span>
    </div>
    <div class="rx-block">
      <span class="rx-label">증상</span>
      <span class="rx-text">${stage.symptom}</span>
    </div>
    <div class="prescription">
      <div class="prescription-title">처방 방향</div>
      <div class="prescription-text">${stage.prescription}</div>
    </div>
    <img src="Group%20106.svg" alt="" class="rx-wing">
    <button type="button" class="rx-close" aria-label="닫기">✕</button>
  `;
}

/* ── 발산 단계 카드 클릭 펼침 ──
   클릭한 카드 1.4배 + 흰 바탕, 화면 오버레이, 나머지는 거리별로 축소, 단계 그래프 마커 이동.
   첫 화면 단계 버튼을 누르면 해당 카드를 펼친 채로 카드 섹션까지 스크롤.
   억압–발산 그래프의 단계 지점 클릭·다이아몬드 드래그로도 해당 카드 처방전을 열 수 있음.
   같은 카드 다시 클릭 / 닫기(X) / 오버레이 클릭 시 원래대로. */
(function(){
  const cards = Array.from(document.querySelectorAll('.stage-card'));
  const overlay = document.querySelector('.cards-overlay');
  const marker = document.querySelector('.sg-marker');
  if(!cards.length || !overlay) return;

  // 카드마다 처방전 내용 채우기
  cards.forEach((card, i) => {
    const rx = card.querySelector('.sc-rx');
    if(rx && stages[i]) rx.innerHTML = renderRxContent(stages[i], i + 1);
  });

  // 단계 그래프 마커 위치: 5단계 = 그래프에 그려진 기존 눈금 5곳 (양 끝·짧은 눈금 2개·가운데), 선택 없음 = 50%
  const STAGE_POS = ['0%', '27.35%', '50%', '72.6%', '100%'];
  function moveMarker(index){
    if(marker) marker.style.setProperty('--pos', index == null ? '50%' : STAGE_POS[index]);
  }

  let activeIndex = null;
  function close(){
    cards.forEach(c => c.classList.remove('is-active', 'is-near', 'is-far'));
    overlay.classList.remove('is-open');
    moveMarker(null);
    activeIndex = null;
  }

  function open(index){
    cards.forEach((c, i) => {
      const d = Math.abs(i - index);
      c.classList.toggle('is-active', d === 0);
      c.classList.toggle('is-near', d === 1);
      c.classList.toggle('is-far', d >= 2);
    });
    overlay.classList.add('is-open');
    moveMarker(index);
    activeIndex = index;
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', e => {
      e.preventDefault();
      if(e.target.closest('.rx-close') || card.classList.contains('is-active')) close();
      else open(i);
    });
  });
  overlay.addEventListener('click', close);

  // 상단바 메뉴(분해소·로고·연구소 안내·분노 진단)로 이동할 때 펼친 카드가 있으면 닫음 (어두운 막이 남아 클릭을 막지 않게)
  document.querySelectorAll('.topbar a').forEach(a => a.addEventListener('click', () => { if(activeIndex !== null) close(); }));

  // 억압–발산 그래프: 기존 눈금 5곳 클릭 / 다이아몬드 드래그로 처방전 열기 (눈금 위에 보이지 않는 클릭 영역)
  const graph = document.querySelector('.stage-graph');
  if(graph && marker){
    STAGE_POS.forEach((pos, i) => {
      const stop = document.createElement('button');
      stop.type = 'button';
      stop.className = 'sg-stop';
      stop.style.left = pos;
      stop.setAttribute('aria-label', `${stages[i] ? stages[i].name : i + 1} 처방전 보기`);
      stop.addEventListener('click', () => { activeIndex === i ? close() : open(i); });
      graph.insertBefore(stop, marker);
    });

    // 바 위 위치(0~1) → 가장 가까운 눈금의 단계
    const ratioAt = x => { const r = graph.getBoundingClientRect(); return Math.min(1, Math.max(0, (x - r.left) / r.width)); };
    const stops = STAGE_POS.map(p => parseFloat(p) / 100);
    const nearest = t => stops.reduce((best, v, i) => Math.abs(v - t) < Math.abs(stops[best] - t) ? i : best, 0);
    let dragging = false, moved = false;
    marker.addEventListener('pointerdown', e => {
      dragging = true; moved = false;
      marker.setPointerCapture(e.pointerId);
      marker.classList.add('is-dragging');
      e.preventDefault();
    });
    marker.addEventListener('pointermove', e => {
      if(!dragging) return;
      moved = true;
      marker.style.setProperty('--pos', (ratioAt(e.clientX) * 100) + '%');
    });
    const endDrag = e => {
      if(!dragging) return;
      dragging = false;
      marker.classList.remove('is-dragging');
      const i = nearest(ratioAt(e.clientX));
      // 끌었으면 가장 가까운 단계로 붙으며 열기, 제자리 클릭은 열기/닫기 전환
      if(moved || activeIndex !== i) open(i); else close();
    };
    marker.addEventListener('pointerup', endDrag);
    marker.addEventListener('pointercancel', endDrag);
  }

  // 첫 화면 단계 버튼: 해당 카드를 펼친 상태로 먼저 지정한 뒤, 카드 섹션을 화면 중앙으로 부드럽게 스크롤
  const section = document.querySelector('.stage-cards');
  const bar = document.querySelector('.topbar');
  document.querySelectorAll('.hero .stage-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if(!cards[i]) return;
      open(i);
      if(!section) return;
      const barH = bar ? bar.offsetHeight : 0;
      const r = section.getBoundingClientRect();
      // 상단바 아래 남은 화면의 정중앙에 카드 줄의 가운데(=펼친 카드의 가운데)를 맞춤
      const center = barH + (window.innerHeight - barH) / 2;
      window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - center, behavior: 'smooth' });
    });
  });
})();

/* ── 상단바 메뉴: 대상 영역으로 부드럽게 스크롤 (data-scroll-center: 상단바 아래 정중앙 / data-scroll-top: 위에서 지정 거리) ── */
(function(){
  const bar = document.querySelector('.topbar');
  document.querySelectorAll('a[data-scroll-center]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if(!target) return;
      e.preventDefault();
      const barH = bar ? bar.offsetHeight : 0;
      const r = target.getBoundingClientRect();
      const free = window.innerHeight - barH;
      // 대상이 남은 화면보다 크면 상단바 바로 아래에 위쪽을 맞춤
      const offset = r.height < free ? barH + (free - r.height) / 2 : barH;
      window.scrollTo({ top: window.scrollY + r.top - offset, behavior: 'smooth' });
    });
  });
  // 대상의 위쪽을 화면 맨 위에서 지정한 거리(px)에 맞춤 (예: 분노 진단 → 슬로건 위 선이 98px)
  document.querySelectorAll('a[data-scroll-top]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if(!target) return;
      e.preventDefault();
      const gap = Number(link.dataset.scrollTop) || 0;
      window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - gap, behavior: 'smooth' });
    });
  });
})();

/* ── 1분 동안 아무 조작이 없으면 처음 메인화면(첫 화면)으로 ──
   펼쳐진 카드·검사 화면이 열려 있으면 닫고, 맨 위로 바로 이동한다. */
(function(){
  const IDLE_MS = 60 * 1000;
  const overlay = document.querySelector('.cards-overlay');
  let timer = null;

  function goHome(){
    if(overlay && overlay.classList.contains('is-open')) overlay.click();
    if(typeof exitExamSlides === 'function' && document.body.classList.contains('es-immersive')) exitExamSlides();
    window.scrollTo({ top: 0, behavior: 'auto' });
    // 다음 사람을 위해 분노 연구 기록 등장 연출 다시 준비
    if(typeof window.armRecordIntro === 'function') window.armRecordIntro();
  }
  function reset(){
    clearTimeout(timer);
    timer = setTimeout(goHome, IDLE_MS);
  }

  ['mousemove', 'mousedown', 'wheel', 'keydown', 'touchstart', 'scroll'].forEach(type => {
    window.addEventListener(type, reset, { passive: true });
  });
  reset();
})();

/* ── 아무도 조작하지 않을 때 첫 화면에서 '진단해 보세요' 안내를 깜빡임 ──
   첫 화면(맨 위)에 있고 검사 화면이 닫혀 있을 때만. 마우스·키·스크롤이 있으면 바로 숨김. */
(function(){
  const ATTRACT_MS = 8000;   // 이 시간 동안 조작이 없으면 안내 표시
  const el = document.querySelector('.hero-attract');
  if(!el) return;
  let timer = null;
  function show(){
    if(window.scrollY > 50 || document.body.classList.contains('es-immersive')){ arm(); return; }
    el.classList.add('is-on');
  }
  function arm(){
    el.classList.remove('is-on');
    clearTimeout(timer);
    timer = setTimeout(show, ATTRACT_MS);
  }
  ['mousemove', 'mousedown', 'wheel', 'keydown', 'touchstart', 'scroll'].forEach(type => {
    window.addEventListener(type, arm, { passive: true });
  });
  arm();
})();

/* ── 첫 화면 배경 커서 스포트라이트: 마스크 원 중심을 커서 위치로 ── */
(function(){
  const hero = document.querySelector('.hero');
  // 픽셀 브러시가 이미지를 캔버스로 교체하므로 대상은 그때그때 찾음
  const getReveal = () => document.querySelector('.hero-bg-reveal');
  if(!hero || !getReveal()) return;
  let raf = null, x = 0, y = 0;

  hero.addEventListener('mousemove', e => {
    const reveal = getReveal();
    // 배경 이미지는 아래로 40px 옮겨져 있으므로 이미지 기준 좌표로 변환
    const r = reveal.getBoundingClientRect();
    x = e.clientX - r.left; y = e.clientY - r.top;
    reveal.classList.add('is-on');
    if(!raf) raf = requestAnimationFrame(() => {
      raf = null;
      const reveal = getReveal();
      reveal.style.setProperty('--mx', x + 'px');
      reveal.style.setProperty('--my', y + 'px');
    });
  });
  hero.addEventListener('mouseleave', () => getReveal().classList.remove('is-on'));
})();

/* ── 모든 이미지 커서 픽셀 입자 브러시 ──
   평소엔 원본 그대로 선명. 커서 주변만 원본이 작은 사각 입자(원본 조각)로 풀어지고,
   일부 입자는 4~12px 밀려나고 일부는 투명해져 빈틈이 생김. 해당 자리의 원본은 함께 지워
   이미지 위에 입자를 뿌린 것처럼 보이지 않게 함. 커서가 지나가면 입자가 제자리로 돌아오며 원본 복원.
   입자 = 원본에서 그 칸만 잘라낸 조각이라 색·투명도·디테일이 그대로이고, 제자리에선 원본과 동일.
   각 이미지를 같은 클래스·스타일의 캔버스로 교체해 기존 배치/고정/투명도/혼합/호버 효과를 유지.
   큰 제목 글자(첫 화면 제목·OVERVIEW·섹션 제목·슬로건·진단 제목)에도 같은 효과. 아이콘·로고는 제외. 터치 환경·동작 줄이기 설정에서는 브러시를 쓰지 않음. */
const PARTICLE_FX = {
  size: 6,              // 입자 크기 (px)
  radius: 50,           // 브러시 반경 (px)
  pushMin: 4,           // 밀려나는 거리 최소 (px)
  pushMax: 12,          // 밀려나는 거리 최대 (px)
  dropRatio: 0.28,      // 투명해져 빈틈이 되는 입자 비율
  stillRatio: 0.3,      // 제자리에 머무는 입자 비율
  restore: 650,         // 제자리로 돌아오는 시간 (ms, 0.5~0.8초)
  // 등장: 작은 조각들이 제자리로 모이며 완성 (처음 화면에 들어올 때 한 번)
  introTargets: '',     // 비우면 등장 연출 없음 (분노 연구 기록 천사는 RECORD_INTRO가 담당)
  introSpread: 22,      // 시작 시 흩어져 있는 최대 거리 (px)
  introDuration: 520,   // 조각 하나가 모이는 시간 (ms)
  introStagger: 300,    // 조각별 시작 시간차 최대 (ms)
  introThreshold: 0.25  // 이미지가 이만큼 보이면 시작
};

(function(){
  const FX = PARTICLE_FX;
  const EXCLUDE = '.topbar-logo img, .rb-title-icon, .sr-title-icon, .dg-icon, .rx-wing';
  const MAX_PIXELS = 4e6;    // 큰 이미지(배경 등)는 캔버스 해상도 상한

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const brushEnabled = canHover && !reduceMotion;

  const brushes = [];
  const smooth = t => t * t * (3 - 2 * t);

  // object-fit / object-position을 캔버스 그리기 좌표로 계산
  function fitRect(nw, nh, W, H, fit, pos){
    let sx = W / nw, sy = H / nh;
    if(fit === 'contain' || fit === 'scale-down'){ sx = sy = Math.min(sx, sy); if(fit === 'scale-down') sx = sy = Math.min(1, sx); }
    else if(fit === 'cover'){ sx = sy = Math.max(sx, sy); }
    else if(fit === 'none'){ sx = sy = 1; }
    const dw = nw * sx, dh = nh * sy;
    const [px, py] = (pos || '50% 50%').split(' ');
    const off = (v, free) => v.endsWith('%') ? free * parseFloat(v) / 100 : parseFloat(v) || 0;
    return [off(px, W - dw), off(py || '50%', H - dh), dw, dh];
  }

  function setup(img){
    // 같은 클래스·인라인 스타일을 가진 캔버스로 교체 (비트맵 비율 = 화면 비율 → width/height:auto도 동일하게)
    const canvas = document.createElement('canvas');
    let ctx = null;
    try{ ctx = canvas.getContext('2d'); }catch(e){}
    if(!ctx) return;   // Canvas 불가 → 원본 이미지 유지

    // 계산된 스타일은 실시간 값이라, 클래스를 옮기기 전에 맞춤 방식을 미리 읽어 둠
    const cs = getComputedStyle(img);
    const fit = cs.objectFit, pos = cs.objectPosition;
    const intro = !reduceMotion && !!FX.introTargets && img.matches(FX.introTargets);
    canvas.className = img.className;
    canvas.style.cssText = img.style.cssText;
    canvas.width = Math.max(1, img.clientWidth); canvas.height = Math.max(1, img.clientHeight);
    if(img.alt){ canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', img.alt); }
    else canvas.setAttribute('aria-hidden', 'true');
    img.parentNode.insertBefore(canvas, img);
    img.className = ''; img.hidden = true;

    const b = { img, canvas, ctx, fit, pos,
                last: null, raf: null, prevT: 0, active: [], introState: intro ? 'pending' : 'done' };
    try{ build(b); }
    catch(e){
      // 그리기 실패 → 원본 이미지로 되돌림
      img.className = canvas.className; img.hidden = false; canvas.remove();
      return;
    }
    brushes.push(b);
    if(intro) checkIntro();
  }

  // 화면 크기에 맞춰 원본 레이어와 입자 격자 다시 만들기
  function build(b){
    const { img, canvas } = b;
    if(b.layout) b.layout();      // 글자: 캔버스 크기·위치를 글자 영역에 맞춤
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if(!W || !H) return;
    const rect = canvas.getBoundingClientRect();
    const cssScale = rect.width / canvas.offsetWidth || 1;              // 부모 확대 포함
    let DPR = Math.min(window.devicePixelRatio || 1, 2) * cssScale;
    if(W * H * DPR * DPR > MAX_PIXELS) DPR = Math.sqrt(MAX_PIXELS / (W * H));
    const PW = Math.round(W * DPR), PH = Math.round(H * DPR);
    canvas.width = PW; canvas.height = PH;

    // 원본 (이미지는 object-fit 적용, 글자는 같은 글꼴로 그림)
    const base = document.createElement('canvas'); base.width = PW; base.height = PH;
    const bctx = base.getContext('2d');
    if(b.paint) b.paint(bctx, DPR);
    else{
      const [x, y, w, h] = fitRect(img.naturalWidth, img.naturalHeight, W, H, b.fit, b.pos);
      bctx.imageSmoothingQuality = 'high';
      bctx.drawImage(img, x * DPR, y * DPR, w * DPR, h * DPR);
    }

    // 입자 격자: 칸마다 고정된 무작위 성질 (밀리는 방향·거리 / 제자리 / 투명)
    const cols = Math.ceil(W / FX.size), rows = Math.ceil(H / FX.size), n = cols * rows;
    const ang = new Float32Array(n), dist = new Float32Array(n), kind = new Uint8Array(n);
    for(let i = 0; i < n; i++){
      ang[i] = Math.random() * Math.PI * 2;
      dist[i] = FX.pushMin + Math.random() * (FX.pushMax - FX.pushMin);
      const r = Math.random();
      kind[i] = r < FX.dropRatio ? 2 : r < FX.dropRatio + FX.stillRatio ? 1 : 0;   // 2 투명, 1 제자리, 0 밀림
    }

    // 불투명 칸 목록 (등장 연출용). 픽셀을 읽을 수 없으면 전체 칸 사용
    let solid = null;
    if(b.introState !== 'done'){
      try{
        const probe = document.createElement('canvas'); probe.width = cols; probe.height = rows;
        const pctx = probe.getContext('2d');
        pctx.drawImage(base, 0, 0, cols, rows);
        const data = pctx.getImageData(0, 0, cols, rows).data;
        solid = [];
        for(let i = 0; i < n; i++) if(data[i * 4 + 3] > 8) solid.push(i);
      }catch(e){ solid = null; }
    }

    Object.assign(b, { W, H, PW, PH, DPR, base, cols, rows, cell: FX.size * DPR,
      ang, dist, kind, d: new Float32Array(n), solid });
    b.active = [];
    if(b.introState === 'pending') b.ctx.clearRect(0, 0, PW, PH);   // 등장 전엔 비워 둠
    else draw(b);
  }

  // 원본을 그리고, 흔들린 칸은 원본을 지운 뒤 같은 칸의 조각을 밀린 위치에 다시 그림
  function draw(b){
    const { ctx, base, cell, cols, active, d } = b;
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(base, 0, 0);
    if(!active.length) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    for(const i of active) ctx.fillRect((i % cols) * cell, Math.floor(i / cols) * cell, cell, cell);
    ctx.globalCompositeOperation = 'source-over';
    for(const i of active){
      const e = smooth(Math.min(1, d[i]));
      const sx = (i % cols) * cell, sy = Math.floor(i / cols) * cell;
      let ox = 0, oy = 0, a = 1;
      if(b.kind[i] === 0){ const r = b.dist[i] * e * b.DPR; ox = Math.cos(b.ang[i]) * r; oy = Math.sin(b.ang[i]) * r; }
      else if(b.kind[i] === 2){ a = 1 - e; }
      if(a <= 0.01) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(base, sx, sy, cell, cell, sx + ox, sy + oy, cell, cell);
    }
    ctx.globalAlpha = 1;
  }

  // 브러시: 커서 주변 칸을 흔듦 (가운데일수록 강하게, 경계는 불규칙하게)
  function stamp(b, x, y){
    const s = FX.size, R = FX.radius, cols = b.cols, rows = b.rows;
    const c0 = Math.max(0, Math.floor((x - R) / s)), c1 = Math.min(cols - 1, Math.floor((x + R) / s));
    const r0 = Math.max(0, Math.floor((y - R) / s)), r1 = Math.min(rows - 1, Math.floor((y + R) / s));
    for(let r = r0; r <= r1; r++){
      for(let c = c0; c <= c1; c++){
        const dx = (c + 0.5) * s - x, dy = (r + 0.5) * s - y;
        const q = (dx * dx + dy * dy) / (R * R);
        if(q > 1) continue;
        const f = (1 - q) * (0.75 + Math.random() * 0.25) * 1.4;
        if(f <= 0.02) continue;
        const i = r * cols + c;
        if(b.d[i] <= 0) b.active.push(i);
        if(f > b.d[i]) b.d[i] = f;
      }
    }
  }

  function loop(b, t){
    const dt = b.prevT ? t - b.prevT : 16; b.prevT = t;
    const step = dt / FX.restore;
    // 입자가 제자리로 돌아오며 원본 복원
    b.active = b.active.filter(i => (b.d[i] = Math.max(0, Math.min(b.d[i], 1) - step)) > 0);
    draw(b);
    if(b.active.length) b.raf = requestAnimationFrame(t2 => loop(b, t2));
    else { b.raf = null; b.prevT = 0; }
  }

  // 등장: 흩어진 작은 조각들이 각자 시간차를 두고 제자리로 모이며 완성
  function playIntro(b){
    b.introState = 'playing';
    const { ctx, base, cell, cols, PW, PH } = b;
    const cells = b.solid || Array.from({ length: b.cols * b.rows }, (_, i) => i);
    const n = cells.length;
    const delay = new Float32Array(n), ang = new Float32Array(n), dist = new Float32Array(n);
    for(let k = 0; k < n; k++){
      delay[k] = Math.random() * FX.introStagger;
      ang[k] = Math.random() * Math.PI * 2;
      dist[k] = (0.3 + Math.random() * 0.7) * FX.introSpread * b.DPR;
    }
    const start = performance.now();
    const total = FX.introStagger + FX.introDuration;
    function frame(now){
      const el = now - start;
      if(el >= total){ b.introState = 'done'; b.solid = null; draw(b); return; }
      ctx.globalCompositeOperation = 'copy';
      ctx.clearRect(0, 0, PW, PH);
      ctx.globalCompositeOperation = 'source-over';
      for(let k = 0; k < n; k++){
        const p = (el - delay[k]) / FX.introDuration;
        if(p <= 0) continue;
        const i = cells[k], sx = (i % cols) * cell, sy = Math.floor(i / cols) * cell;
        if(p >= 1){ ctx.globalAlpha = 1; ctx.drawImage(base, sx, sy, cell, cell, sx, sy, cell, cell); continue; }
        const e = 1 - smooth(p);
        ctx.globalAlpha = smooth(p);
        ctx.drawImage(base, sx, sy, cell, cell, sx + Math.cos(ang[k]) * dist[k] * e, sy + Math.sin(ang[k]) * dist[k] * e, cell, cell);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // 등장 대기 중인 이미지가 화면에 충분히 들어오면 시작 (위치로 직접 판단)
  function checkIntro(){
    brushes.forEach(b => {
      if(b.introState !== 'pending' || !b.base) return;
      const r = b.canvas.getBoundingClientRect();
      const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if(r.height && visible >= Math.min(r.height, window.innerHeight) * FX.introThreshold) playIntro(b);
    });
  }
  window.addEventListener('scroll', checkIntro, { passive: true });
  window.addEventListener('load', checkIntro);

  if(brushEnabled){
    window.addEventListener('mousemove', e => {
      if(document.body.classList.contains('es-immersive')) return;   // 검사 화면 중엔 메인 효과 멈춤
      brushes.forEach(b => {
        if(!b.base || b.introState !== 'done') return;
        const r = b.canvas.getBoundingClientRect();
        if(!r.width || !r.height){ b.last = null; return; }
        // 화면 좌표 → 이미지 내용 영역(CSS px) 좌표 (테두리·확대 보정)
        const k = b.canvas.offsetWidth / r.width;
        const x = (e.clientX - r.left) * k - b.canvas.clientLeft;
        const y = (e.clientY - r.top) * k - b.canvas.clientTop;
        const R = FX.radius;
        if(x < -R || y < -R || x > b.W + R || y > b.H + R){ b.last = null; return; }
        // 이전 위치와의 사이도 촘촘히 흔들어 경로가 끊기지 않게
        if(b.last){
          const dd = Math.hypot(x - b.last.x, y - b.last.y), n = Math.ceil(dd / (R / 3));
          for(let i = 1; i <= n; i++) stamp(b, b.last.x + (x - b.last.x) * i / n, b.last.y + (y - b.last.y) * i / n);
        } else stamp(b, x, y);
        b.last = { x, y };
        if(!b.raf) b.raf = requestAnimationFrame(t => loop(b, t));
      });
    }, { passive: true });
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => brushes.forEach(b => {
      if(b.introState === 'playing') return;
      try{ build(b); }catch(e){}
    }), 150);
    checkIntro();
  });

  document.querySelectorAll('img').forEach(img => {
    if(img.matches(EXCLUDE)) return;
    if(img.complete && img.naturalWidth) setup(img);
    else img.addEventListener('load', () => setup(img), { once: true });
    // 로딩 실패 시엔 교체하지 않음 (원본 img 그대로)
  });

  /* 큰 제목 글자에도 같은 입자 브러시.
     진짜 글자는 자리·선택·화면 낭독용으로 투명하게 남기고, 그 위에 같은 글꼴로 그린 캔버스를 겹침.
     요소 안의 글자 덩어리(줄바꿈·아이콘 사이)마다 따로 캔버스를 만듦. */
  const TEXT_TARGETS = '.hero h1, .section-title, .rb-title, .sr-title, .slogan-text, .dg-title';

  function setupText(span){
    const cs = getComputedStyle(span);
    const canvas = document.createElement('canvas');
    let ctx = null;
    try{ ctx = canvas.getContext('2d'); }catch(e){}
    if(!ctx || !('letterSpacing' in ctx)) return;   // 자간을 못 그리는 브라우저는 원본 글자 유지

    const size = parseFloat(cs.fontSize);
    const stroke = parseFloat(cs.webkitTextStrokeWidth) || 0;
    const style = {
      font: `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`,
      spacing: cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing,
      color: cs.color, stroke, strokeColor: cs.webkitTextStrokeColor,
      text: cs.textTransform === 'uppercase' ? span.textContent.toUpperCase() : span.textContent
    };
    const pad = Math.ceil(size * 0.2 + stroke);     // 글자 획이 상자 밖으로 나가는 만큼 여유

    canvas.className = 'px-text-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;pointer-events:none;';
    if(getComputedStyle(span).position === 'static') span.style.position = 'relative';
    span.appendChild(canvas);
    span.style.color = 'transparent';
    span.style.webkitTextStrokeColor = 'transparent';

    const b = { canvas, ctx, last: null, raf: null, prevT: 0, active: [], introState: 'done',
      layout(){
        canvas.style.left = -pad + 'px'; canvas.style.top = -pad + 'px';
        canvas.style.width = (span.offsetWidth + pad * 2) + 'px';
        canvas.style.height = (span.offsetHeight + pad * 2) + 'px';
      },
      paint(g, DPR){
        g.scale(DPR, DPR);
        g.font = style.font;
        g.letterSpacing = style.spacing;
        g.textBaseline = 'alphabetic';
        const m = g.measureText(style.text);
        // 인라인 글자 상자 = 글꼴 위아래 높이 → 기준선은 위 여유 + 글꼴 윗높이
        const y = pad + (span.offsetHeight - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
        if(style.color !== 'rgba(0, 0, 0, 0)' && style.color !== 'transparent'){
          g.fillStyle = style.color; g.fillText(style.text, pad, y);
        }
        if(style.stroke){
          g.lineWidth = style.stroke; g.strokeStyle = style.strokeColor; g.strokeText(style.text, pad, y);
        }
      }
    };
    try{ build(b); }
    catch(e){ canvas.remove(); span.style.color = ''; span.style.webkitTextStrokeColor = ''; return; }
    brushes.push(b);
  }

  function initText(){
    document.querySelectorAll(TEXT_TARGETS).forEach(el => {
      // 직접 들어 있는 글자 덩어리를 span으로 감싸 각각 캔버스로
      Array.from(el.childNodes).forEach(node => {
        if(node.nodeType === 3 && node.textContent.trim()){
          const span = document.createElement('span');
          span.className = 'px-text';
          node.replaceWith(span); span.appendChild(node);
        }
      });
      el.querySelectorAll(':scope > span:not(.px-text-skip)').forEach(span => {
        if(span.querySelector('canvas, img') || !span.textContent.trim()) return;
        setupText(span);
      });
    });
  }
  // 글꼴이 다 불러와진 다음에 그려야 모양이 맞음
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(initText);
})();

/* ── 분노 연구 기록: 천사 뒤 픽셀 디더링 패턴 ──
   오른쪽 아래(천사 발치)가 가장 촘촘하고 위·왼쪽으로 갈수록 듬성듬성.
   Bayer 행렬로 찍어 중간 밀도는 체크무늬, 옅은 곳은 고른 점 격자가 됨. 투명도는 CSS(.rb-dither)에서 60%.
   천사 실루엣 안쪽과 제목·본문·링크 글자 영역에는 픽셀을 깔지 않음. */
const DITHER_FX = {
  cell: 7,                 // 픽셀 한 칸 크기 (px)
  color: '#000000',        // 픽셀 색 (투명도 60%로 파랑 위에서 남색 톤)
  centerX: 0.9,            // 가장 촘촘한 지점 (상자 폭 대비)
  centerY: 1.0,            // 가장 촘촘한 지점 (상자 높이 대비)
  reach: 1050,             // 패턴이 퍼지는 거리 (px)
  curve: 1.35,             // 클수록 촘촘한 영역이 좁아짐
  textMargin: 12,          // 글자 둘레로 비워 둘 여백 (px)
  angelMargin: 3           // 천사 실루엣 둘레로 더 비워 둘 여백 (px)
};

(function(){
  const canvas = document.querySelector('.rb-dither');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  if(!ctx) return;
  const box = canvas.parentElement;
  const BAYER = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];

  // 천사 실루엣을 지우는 데 쓸 원본 이미지 (투명 배경 PNG)
  const angelImg = new Image();
  angelImg.src = '앉아있는천사.png';

  // 상자 기준 영역 (px). 등장 연출의 이동(transform)에 영향받지 않도록 원래 배치(offset) 기준으로 잼
  function rectIn(el){
    let x = 0, y = 0, n = el;
    while(n && n !== box){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }

  function draw(){
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if(!W || !H) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    const F = DITHER_FX, c = F.cell, cd = c * DPR;
    const cx = W * F.centerX, cy = H * F.centerY;

    // 글자 영역: 칸 단위로 비움 (글자 둘레 여백 포함)
    const keepOut = Array.from(box.querySelectorAll('.rb-title, .rb-body p, .rb-cta')).map(el => {
      const r = rectIn(el), m = F.textMargin;
      return { x0: r.x - m, y0: r.y - m, x1: r.x + r.w + m, y1: r.y + r.h + m };
    });
    const blocked = (x0, y0, x1, y1) => keepOut.some(k => x1 > k.x0 && x0 < k.x1 && y1 > k.y0 && y0 < k.y1);

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = F.color;
    for(let gy = 0; gy * c < H; gy++){
      for(let gx = 0; gx * c < W; gx++){
        const x = (gx + 0.5) * c, y = (gy + 0.5) * c;
        const d = Math.max(0, 1 - Math.hypot(x - cx, y - cy) / F.reach);
        if(Math.pow(d, F.curve) <= (BAYER[gy % 4][gx % 4] + 0.5) / 16) continue;
        if(blocked(gx * c, gy * c, (gx + 1) * c, (gy + 1) * c)) continue;
        ctx.fillRect(Math.round(gx * cd), Math.round(gy * cd), Math.ceil(cd), Math.ceil(cd));
      }
    }

    // 천사 실루엣 안쪽 지우기 (object-fit:contain, 가운데 정렬과 같은 위치)
    const angel = box.querySelector('.rb-angel');
    if(angel && angelImg.complete && angelImg.naturalWidth){
      const r = rectIn(angel);
      const s = Math.min(r.w / angelImg.naturalWidth, r.h / angelImg.naturalHeight);
      const w = angelImg.naturalWidth * s, h = angelImg.naturalHeight * s;
      const x = r.x + (r.w - w) / 2, y = r.y + (r.h - h) / 2;
      ctx.globalCompositeOperation = 'destination-out';
      // 가장자리 픽셀이 실루엣에 걸쳐 남지 않도록 살짝 두껍게(사방으로 겹쳐 찍기)
      const g = F.angelMargin * DPR;
      [[0,0],[g,0],[-g,0],[0,g],[0,-g]].forEach(([ox, oy]) =>
        ctx.drawImage(angelImg, x * DPR + ox, y * DPR + oy, w * DPR, h * DPR));
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  function redraw(){ draw(); }
  angelImg.onload = redraw;
  window.addEventListener('resize', redraw);
  window.addEventListener('load', redraw);
  if(document.fonts) document.fonts.ready.then(redraw);
  redraw();
})();

/* ── 분노 연구 기록 섹션 등장: 연구 기록이 열리는 느낌 ──
   1) 하늘색 배경이 아래→위로 펼쳐짐  2) 모서리 사각형·구분선·머리글이 나타나 문서 영역을 잡음
   3) OVERVIEW·제목이 16px 아래에서 올라오며 페이드인  4) 본문 블록(링크·천사·픽셀 패턴 포함) 페이드인
   효과는 조금씩 겹쳐 시작해 약 0.85초 안에 끝남. 페이지 로드 후 첫 진입에만 재생하고 이후엔 완성 상태 유지.
   단, 1분 무조작으로 첫 화면에 돌아가면 다음 사람을 위해 다시 준비함.
   동작 줄이기 설정·IntersectionObserver 미지원이면 연출 없이 바로 보임. 스크롤은 건드리지 않음. */
const RECORD_INTRO = {
  bg:    { delay: 0,   dur: 520 },   // 배경 펼침
  frame: { delay: 140, dur: 420 },   // 모서리·구분선·머리글
  title: { delay: 200, dur: 520, step: 60 },   // OVERVIEW → 제목 (step 간격)
  body:  { delay: 340, dur: 500 },   // 본문 블록
  threshold: 0.15,                   // 상자가 이만큼 보이면 시작
  // OVERVIEW 해독 효과: 무작위 글자가 바뀌다가 왼쪽부터 한 글자씩 맞춰짐
  // fromScale: 처음 크기 배율 → 글자가 맞춰지는 동안 원래 크기로 줄어들며 완성
  scramble: { delay: 200, settleStart: 250, settleEach: 250, tick: 45, fromScale: 4,
              chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }
};

(function(){
  const box = document.querySelector('.record-box');
  if(!box) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!('IntersectionObserver' in window)) return;

  const R = RECORD_INTRO;
  let groups = [], total = 0, timer = null;

  // 대상은 매번 새로 찾음 (천사는 이미지 로딩 뒤 캔버스로 교체되며 클래스가 옮겨감)
  function collect(){
    const q = sel => Array.from(box.querySelectorAll(sel)).filter(el => !el.hidden);
    groups = [
      { els: q('.rb-corner, .rb-bar, .rb-rule, .rb-header'), t: R.frame, rise: false },
      { els: [document.querySelector('.section-title'), box.querySelector('.rb-title')].filter(Boolean), t: R.title, rise: true },
      { els: q('.rb-body, .rb-cta, .rb-angel, .rb-angel-under, .rb-dither'), t: R.body, rise: false }
    ];
    total = Math.max(R.bg.delay + R.bg.dur, ...groups.map(g => g.t.delay + (g.t.step || 0) * (g.els.length - 1) + g.t.dur));
  }

  // 등장 전 상태로 준비 (JS가 여기까지 실행됐을 때만 숨김)
  function arm(){
    clearTimeout(timer);
    cleanup();
    collect();
    box.classList.add('ri-bg', 'ri-bg-off');
    box.style.setProperty('--ri-bg-dur', R.bg.dur + 'ms');
    groups.forEach(g => g.els.forEach((el, i) => {
      el.classList.add('ri-el', 'ri-off');
      if(g.rise) el.classList.add('ri-rise');
      el.style.setProperty('--ri-dur', g.t.dur + 'ms');
      el.style.setProperty('--ri-delay', (g.t.delay + (g.t.step || 0) * i) + 'ms');
    }));
    io.observe(box);
  }

  // OVERVIEW 해독: 해독 중엔 입자 브러시 캔버스를 숨기고 진짜 글자를 보여 줬다가 끝나면 되돌림
  function scramble(){
    const el = document.querySelector('.section-title');
    if(!el) return;
    const S = R.scramble;
    const span = el.querySelector('.px-text') || el;
    const node = Array.from(span.childNodes).find(n => n.nodeType === 3 && n.nodeValue.trim());
    if(!node) return;
    const canvas = el.querySelector('.px-text-canvas');
    const final = node.nodeValue;
    const w = span.offsetWidth;                // 글자 폭이 달라도 가운데 정렬이 흔들리지 않게 폭 고정
    if(span !== el){ span.style.display = 'inline-block'; span.style.width = w + 'px'; span.style.textAlign = 'center'; }
    if(canvas){ canvas.style.visibility = 'hidden'; span.style.color = ''; span.style.webkitTextStrokeColor = ''; }
    // 큰 글자에서 시작해 마지막 글자가 맞춰질 때 원래 크기로 (transform과 따로 노는 scale 속성 사용)
    const dur = S.settleStart + S.settleEach * (final.length - 1);
    span.style.transition = 'none';
    span.style.scale = String(S.fromScale);
    void span.offsetWidth;
    span.style.transition = `scale ${dur}ms cubic-bezier(.16,.84,.3,1)`;
    span.style.scale = '1';
    const rand = () => S.chars[Math.floor(Math.random() * S.chars.length)];
    let start = null, last = 0;
    function frame(t){
      if(start === null) start = t;
      const e = t - start;
      if(e - last >= S.tick || e === 0){
        last = e;
        let out = '', done = true;
        for(let i = 0; i < final.length; i++){
          const ch = final[i];
          if(ch === ' ' || e >= S.settleStart + S.settleEach * i) out += ch;
          else { out += rand(); done = false; }
        }
        node.nodeValue = out;
        if(done){
          node.nodeValue = final;
          span.style.transition = ''; span.style.scale = '';
          if(span !== el){ span.style.display = ''; span.style.width = ''; span.style.textAlign = ''; }
          if(canvas){ canvas.style.visibility = ''; span.style.color = 'transparent'; span.style.webkitTextStrokeColor = 'transparent'; }
          return;
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function play(){
    void box.offsetHeight;                     // 등장 전 상태를 먼저 그린 뒤 전환
    box.classList.remove('ri-bg-off');
    setTimeout(scramble, R.scramble.delay);
    // 준비 뒤 캔버스로 교체된 천사도 포함
    document.querySelectorAll('.ri-off').forEach(el => el.classList.remove('ri-off'));
    timer = setTimeout(cleanup, total + 80);
  }
  function cleanup(){
    // 연출용 클래스·변수를 모두 떼어 원래 정적인 상태로 (다시 스크롤해도 그대로)
    box.classList.remove('ri-bg', 'ri-bg-off');
    box.style.removeProperty('--ri-bg-dur');
    document.querySelectorAll('.ri-el').forEach(el => {
      el.classList.remove('ri-el', 'ri-off', 'ri-rise');
      el.style.removeProperty('--ri-dur'); el.style.removeProperty('--ri-delay');
    });
  }

  const io = new IntersectionObserver(entries => {
    if(entries.some(e => e.isIntersecting)){ io.unobserve(box); play(); }
  }, { threshold: R.threshold });

  // 1분 무조작으로 첫 화면에 돌아가면 다음 사람을 위해 다시 준비 (그 외엔 첫 진입에만 재생)
  window.armRecordIntro = arm;
  arm();
})();
