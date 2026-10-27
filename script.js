// 사전 등록 폼을 실제 백엔드(Formspree, Google Apps Script 등)에 연결하려면
// SIGNUP_ENDPOINT에 POST URL을 넣으세요. 비어 있으면 브라우저에만 저장합니다.
const SIGNUP_ENDPOINT = "";
const STORAGE_KEY = "waterlog-signups";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function saveLocally(email) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!list.includes(email)) list.push(email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (_) {
    // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서도 화면은 정상 동작
  }
}

async function submitEmail(email) {
  if (!SIGNUP_ENDPOINT) {
    saveLocally(email);
    return;
  }
  const res = await fetch(SIGNUP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, source: "waterlog-landing" }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

document.querySelectorAll("[data-signup]").forEach((form) => {
  const input = form.querySelector("input[type=email]");
  const button = form.querySelector("button");
  const msg = form.querySelector(".form-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    msg.className = "form-msg";

    if (!EMAIL_RE.test(email)) {
      input.setAttribute("aria-invalid", "true");
      msg.classList.add("err");
      msg.textContent = "올바른 이메일 주소를 입력해 주세요.";
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    button.disabled = true;
    button.textContent = "등록 중…";

    try {
      await submitEmail(email);
      msg.classList.add("ok");
      msg.textContent = "사전 등록 완료! 시작일이 정해지면 가장 먼저 알려드릴게요. 🌊";
      input.value = "";
    } catch (_) {
      msg.classList.add("err");
      msg.textContent = "등록 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
    } finally {
      button.disabled = false;
      button.textContent = "사전 등록하기";
    }
  });

  input.addEventListener("input", () => input.removeAttribute("aria-invalid"));
});

// 30일 여정 예시: 대부분 배운 점, 가끔 거리 기록
const sampleLogs = [
  ["learn", "물속에서 코로 숨을 끝까지 내쉬어야 다음 호흡이 편하다."],
  ["learn", "발차기는 무릎이 아니라 허벅지에서 시작한다."],
  ["learn", "고개를 너무 들면 하체가 가라앉는다. 시선은 바닥으로."],
  ["dist", "25m 8바퀴 (총 200m)"],
  ["learn", "자유형 팔을 너무 뒤로 돌리면 균형 잡기 어려우니 옆으로 돌려야 한다."],
  ["learn", "벽을 찰 때 스트림라인 자세를 3초 유지하면 훨씬 멀리 간다."],
  ["learn", "호흡할 때 반대쪽 팔을 앞으로 뻗고 있어야 몸이 덜 기운다."],
  ["learn", "배영은 귀가 물에 잠길 만큼 머리를 뒤로 눕혀야 뜬다."],
  ["dist", "25m 10바퀴 (총 250m)"],
  ["learn", "팔 입수는 어깨 너비. 머리 앞 중앙으로 넣으면 몸이 흔들린다."],
  ["learn", "킥판 잡고 발차기만 하면 다리 힘이 얼마나 쓰이는지 느껴진다."],
  ["learn", "천천히 길게 젓는 편이 빨리 여러 번 젓는 것보다 덜 지친다."],
  ["learn", "평영 발차기는 발목을 바깥으로 꺾어야 물을 민다."],
  ["dist", "25m 6바퀴 (총 300m)"],
  ["learn", "턴하기 전 마지막 스트로크에서 숨을 미리 쉬어 둔다."],
  ["learn", "물을 누르지 말고 뒤로 밀어야 앞으로 나간다."],
  ["learn", "롤링을 하면 어깨가 덜 아프다."],
  ["learn", "평영은 '당기고-숨-차고-뻗기' 순서를 지키면 리듬이 생긴다."],
  ["learn", "호흡 쪽을 번갈아 하니 몸 균형이 좋아졌다."],
  ["dist", "50m 6바퀴 (총 300m)"],
  ["learn", "물 잡기(캐치)할 때 팔꿈치를 높게 세워야 물이 잡힌다."],
  ["learn", "숨이 찰 땐 속도보다 내쉬기에 집중하면 회복된다."],
  ["learn", "접영 웨이브는 가슴으로 누르는 느낌에서 시작한다."],
  ["learn", "발차기는 작고 빠르게. 크게 차면 저항이 생긴다."],
  ["learn", "왼쪽 호흡 때 오른손이 빨리 내려오는 습관을 발견했다."],
  ["dist", "25m 12바퀴 (총 300m)"],
  ["learn", "글라이드를 1초 더 길게 하니 스트로크 수가 줄었다."],
  ["learn", "배영 팔은 새끼손가락부터 입수한다."],
  ["learn", "몸에 힘을 빼야 물이 나를 띄워 준다."],
  ["learn", "30일 동안 배운 것들을 다시 읽어 보니 내 수영이 보인다."],
];

const calendar = document.querySelector("[data-calendar]");
const detail = document.querySelector("[data-calendar-detail]");

if (calendar && detail) {
  sampleLogs.forEach(([type, text], i) => {
    const day = i + 1;
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = `cal-cell ${type === "learn" ? "cal-learn" : "cal-dist"}`;
    cell.textContent = day;
    cell.setAttribute("aria-pressed", "false");
    cell.setAttribute("aria-label", `${day}일차, ${type === "learn" ? "배운 점" : "거리"} 기록`);
    cell.addEventListener("click", () => select(cell, day, type, text));
    calendar.appendChild(cell);
  });

  function select(cell, day, type, text) {
    calendar.querySelectorAll(".cal-cell").forEach((c) => c.setAttribute("aria-pressed", "false"));
    cell.setAttribute("aria-pressed", "true");
    const label = type === "learn" ? "배운 점" : "거리";
    const badge = type === "learn" ? "badge-learn" : "badge-dist";
    detail.innerHTML = "";
    const head = document.createElement("div");
    head.className = "log-head";
    head.innerHTML = `<span class="log-day">DAY ${day}</span><span class="badge ${badge}">${label}</span>`;
    const p = document.createElement("p");
    p.textContent = type === "learn" ? `“${text}”` : text;
    detail.append(head, p);
  }

  const first = calendar.querySelector(".cal-cell");
  select(first, 1, sampleLogs[0][0], sampleLogs[0][1]);
}
