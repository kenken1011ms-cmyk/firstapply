// ===== アンケートデータ =====
const quizData = [
    {
        question: "あなたの年齢層を教えてください",
        options: ["10代", "20代", "30代", "40代", "50代", "60代以上"]
    },
    {
        question: "好きなプログラミング言語は？",
        options: ["JavaScript", "Python", "Java", "C/C++", "Ruby", "TypeScript", "その他"]
    },
    {
        question: "開発経験はどのくらい？",
        options: ["1年未満", "1〜2年", "3〜5年", "6〜10年", "10年以上"]
    },
    {
        question: "興味のある分野は？（複数回答可）",
        options: ["Web開発", "モバイルアプリ", "AI・機械学習", "ゲーム開発", "クラウド", "セキュリティ"],
        multi: true
    }
];

// ===== 状態管理 =====
let currentQuestion = 0;
let answers = [];  // 各質問の回答を保存

// ===== DOM要素 =====
const questionText = document.getElementById('questionText');
const optionsArea = document.getElementById('optionsArea');
const progress = document.getElementById('progress');
const questionNumber = document.getElementById('questionNumber');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const quizArea = document.getElementById('quizArea');
const resultArea = document.getElementById('resultArea');
const resultList = document.getElementById('resultList');
const restartBtn = document.getElementById('restartBtn');

// ===== 初期化 =====
function init() {
    answers = new Array(quizData.length).fill(null);
    currentQuestion = 0;
    showQuestion();
    updateProgress();
    updateNavButtons();
}

// ===== 質問の表示 =====
function showQuestion() {
    const data = quizData[currentQuestion];
    questionText.textContent = data.question;

    // 選択肢ボタンを生成
    optionsArea.innerHTML = '';
    data.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.textContent = option;
        btn.addEventListener('click', () => selectOption(index));

        // すでに回答済みなら選択状態にする
        if (data.multi) {
            // 複数選択
            if (answers[currentQuestion] && answers[currentQuestion].includes(index)) {
                btn.classList.add('selected');
            }
        } else {
            // 単一選択
            if (answers[currentQuestion] === index) {
                btn.classList.add('selected');
            }
        }

        optionsArea.appendChild(btn);
    });
}

// ===== 選択肢の選択 =====
function selectOption(index) {
    const data = quizData[currentQuestion];
    const buttons = optionsArea.querySelectorAll('.btn-option');

    if (data.multi) {
        // 複数選択の場合
        if (!answers[currentQuestion]) {
            answers[currentQuestion] = [];
        }
        const idx = answers[currentQuestion].indexOf(index);
        if (idx > -1) {
            // すでに選択済みなら解除
            answers[currentQuestion].splice(idx, 1);
            buttons[index].classList.remove('selected');
        } else {
            // 選択追加
            answers[currentQuestion].push(index);
            buttons[index].classList.add('selected');
        }
        // 空配列ならnullに戻す
        if (answers[currentQuestion].length === 0) {
            answers[currentQuestion] = null;
        }
    } else {
        // 単一選択の場合
        answers[currentQuestion] = index;
        buttons.forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
        });
    }

    updateNavButtons();
}

// ===== 進捗バーの更新 =====
function updateProgress() {
    const percent = ((currentQuestion + 1) / quizData.length) * 100;
    progress.style.width = percent + '%';
    questionNumber.textContent = `質問 ${currentQuestion + 1} / ${quizData.length}`;
}

// ===== ナビゲーションボタンの更新 =====
function updateNavButtons() {
    // 戻るボタン
    prevBtn.disabled = currentQuestion === 0;

    // 次へボタン
    const hasAnswer = answers[currentQuestion] !== null &&
        (!Array.isArray(answers[currentQuestion]) || answers[currentQuestion].length > 0);
    nextBtn.disabled = !hasAnswer;

    // 最後の質問なら「完了」に変更
    if (currentQuestion === quizData.length - 1) {
        nextBtn.textContent = hasAnswer ? '完了' : '次へ';
    } else {
        nextBtn.textContent = '次へ';
    }
}

// ===== 次へボタンの処理 =====
function goNext() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        showQuestion();
        updateProgress();
        updateNavButtons();
    } else {
        showResult();
    }
}

// ===== 戻るボタンの処理 =====
function goPrev() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
        updateProgress();
        updateNavButtons();
    }
}

// ===== 結果画面の表示 =====
function showResult() {
    quizArea.classList.add('hidden');
    document.querySelector('header').classList.add('hidden');
    document.querySelector('.nav-buttons').classList.add('hidden');
    resultArea.classList.remove('hidden');

    resultList.innerHTML = '';
    quizData.forEach((data, qIndex) => {
        const item = document.createElement('div');
        item.className = 'result-item';

        const questionDiv = document.createElement('div');
        questionDiv.className = 'result-question';
        questionDiv.textContent = `Q${qIndex + 1}. ${data.question}`;

        const answerDiv = document.createElement('div');
        answerDiv.className = 'result-answer';

        const ans = answers[qIndex];
        if (data.multi && Array.isArray(ans)) {
            const answerTexts = ans.map(i => data.options[i]).join('、');
            answerDiv.textContent = `A. ${answerTexts}`;
        } else if (ans !== null) {
            answerDiv.textContent = `A. ${data.options[ans]}`;
        } else {
            answerDiv.textContent = 'A. 未回答';
        }

        item.appendChild(questionDiv);
        item.appendChild(answerDiv);
        resultList.appendChild(item);
    });
}

// ===== リスタート =====
function restart() {
    quizArea.classList.remove('hidden');
    document.querySelector('header').classList.remove('hidden');
    document.querySelector('.nav-buttons').classList.remove('hidden');
    resultArea.classList.add('hidden');
    init();
}

// ===== イベントリスナー =====
nextBtn.addEventListener('click', goNext);
prevBtn.addEventListener('click', goPrev);
restartBtn.addEventListener('click', restart);

// ===== 起動 =====
init();
