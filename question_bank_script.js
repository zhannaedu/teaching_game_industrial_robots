// Family Feud 题库版 JavaScript

class QuestionBankGame {
    constructor() {
        this.teamAScore = 0;
        this.teamBScore = 0;
        this.currentTeam = 'A';
        this.revealedCards = 0;
        this.gameData = {
            question: '',
            answers: []
        };
        this.questionBank = [];
        this.currentBankIndex = -1; // -1 表示新问题，>=0 表示题库中的问题
        
        // 音效文件列表
        this.soundFiles = [
            './声音/victory.mp3',
            './声音/支付宝到账音效.mp3',
            './声音/正确.mp3',
            './声音/游戏胜利.mp3',
            './声音/金币落袋.mp3',
            './声音/鼓掌.mp3'
        ];
        
        // 初始化音效对象数组
        this.soundEffects = [];
        this.initSoundEffects();
        
        this.init();
    }
    
    init() {
        this.loadQuestionBank();
        this.setupEventListeners();
        this.showSetupScreen();
    }
    
    setupEventListeners() {
        // 题库管理按钮
        document.getElementById('showBank').addEventListener('click', () => this.toggleQuestionBank());
        document.getElementById('clearBank').addEventListener('click', () => this.clearQuestionBank());
        
        // 设置界面按钮
        document.getElementById('saveAndStart').addEventListener('click', () => this.saveAndStart());
        document.getElementById('loadExample').addEventListener('click', () => this.loadExample());
        
        // 游戏界面按钮
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
        document.getElementById('backToSetup').addEventListener('click', () => this.backToSetup());
        document.getElementById('showAll').addEventListener('click', () => this.showAllCards());
        
        // 回车键快捷操作
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const setupScreen = document.getElementById('setupScreen');
                if (setupScreen.style.display !== 'none') {
                    this.saveAndStart();
                }
            }
        });
        
        // 输入框焦点切换
        const inputs = document.querySelectorAll('.answer-input');
        inputs.forEach((input, index) => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
        });
    }
    
    loadQuestionBank() {
        // 从localStorage加载题库
        const saved = localStorage.getItem('familyFeudQuestionBank');
        console.log('从localStorage加载题库:', saved ? '发现数据' : '未发现数据');
        
        if (saved) {
            try {
                this.questionBank = JSON.parse(saved);
                console.log('成功加载题库，题目数量:', this.questionBank.length);
            } catch (e) {
                console.error('加载题库失败:', e);
                this.questionBank = [];
            }
        }
        
        // 如果没有题库，添加一些默认题目
        if (this.questionBank.length === 0) {
            console.log('题库为空，加载默认题目');
            this.addDefaultQuestions();
        } else {
            console.log('使用现有题库，题目列表:', this.questionBank.map(q => q.question));
        }
    }
    
    addDefaultQuestions() {
        console.log('正在添加默认题目...');
        this.questionBank = [
            {
                question: "哪些场景会使用工业机器人？",
                answers: [
                    { answer: "汽车工厂（汽车制造行业）", points: 95 },
                    { answer: "手机工厂（电子电器行业）", points: 88 },
                    { answer: "造船厂（海洋装备制造业）", points: 82 },
                    { answer: "快递物流仓库（物流与仓储行业）", points: 76 },
                    { answer: "饮料厂（食品饮料加工行业）", points: 71 },
                    { answer: "医院手术室（医药行业）", points: 65 },
                    { answer: "铁路隧道（建筑行业）", points: 58 },
                    { answer: "化工厂（化工行业）", points: 52 },
                    { answer: "卫星发射基地（航空航天行业）", points: 45 }
                ]
            },
            {
                question: "使用工业机器人有什么好处？",
                answers: [
                    { answer: "保证焊接和装配的高精度", points: 92 },
                    { answer: "避免人工喷涂的有毒环境伤害", points: 87 },
                    { answer: "减少人工操作的失误率", points: 83 },
                    { answer: "实现24小时连续生产", points: 79 },
                    { answer: "降低人工搬运重物的劳动强度和安全风险", points: 74 },
                    { answer: "能快速处理海量订单", points: 68 },
                    { answer: "避免人工接触带来的污染", points: 63 },
                    { answer: "降低人工高空作业的风险", points: 57 },
                    { answer: "提升仓库空间利用率", points: 51 }
                ]
            },
        ];
        
        console.log('默认题目添加完成，题目数量:', this.questionBank.length);
        console.log('题目列表:', this.questionBank.map(q => q.question));
        
        this.saveQuestionBank();
    }
    
    saveQuestionBank() {
        try {
            localStorage.setItem('familyFeudQuestionBank', JSON.stringify(this.questionBank));
        } catch (e) {
            console.error('保存题库失败:', e);
            alert('保存题库失败，可能是存储空间不足。');
        }
    }
    
    toggleQuestionBank() {
        const bankList = document.getElementById('questionBankList');
        const showBtn = document.getElementById('showBank');
        
        if (bankList.style.display === 'none') {
            bankList.style.display = 'block';
            showBtn.textContent = '隐藏题库';
            this.renderQuestionBank();
        } else {
            bankList.style.display = 'none';
            showBtn.textContent = '查看题库';
        }
    }
    
    renderQuestionBank() {
        const bankList = document.getElementById('questionBankList');
        
        if (this.questionBank.length === 0) {
            bankList.innerHTML = '<div class="empty-bank">题库为空，快来添加第一个问题吧！</div>';
            return;
        }
        
        bankList.innerHTML = '';
        this.questionBank.forEach((item, index) => {
            const bankItem = document.createElement('div');
            bankItem.className = 'bank-item';
            bankItem.dataset.index = index;
            
            const answersText = item.answers.map(a => a.answer).join('、');
            
            bankItem.innerHTML = `
                <div class="bank-question">${item.question}</div>
                <div class="bank-answers">答案：${answersText}</div>
                <div class="bank-actions">
                    <button class="bank-load-btn" onclick="game.loadFromBank(${index})">使用此题</button>
                    <button class="bank-delete-btn" onclick="game.deleteFromBank(${index})">删除</button>
                </div>
            `;
            
            // 点击整个项目也可以加载
            bankItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('bank-load-btn') && !e.target.classList.contains('bank-delete-btn')) {
                    this.loadFromBank(index);
                }
            });
            
            bankList.appendChild(bankItem);
        });
    }
    
    loadFromBank(index) {
        const question = this.questionBank[index];
        if (!question) return;
        
        // 填充表单
        document.getElementById('customQuestion').value = question.question;
        
        const inputs = document.querySelectorAll('.answer-input');
        inputs.forEach((input, i) => {
            if (i < question.answers.length) {
                input.value = question.answers[i].answer;
            } else {
                input.value = '';
            }
        });
        
        // 标记为从题库加载
        this.currentBankIndex = index;
        
        // 高亮显示选中的题目
        document.querySelectorAll('.bank-item').forEach((item, i) => {
            item.classList.toggle('selected', i === index);
        });
        
        // 隐藏题库列表
        document.getElementById('questionBankList').style.display = 'none';
        document.getElementById('showBank').textContent = '查看题库';
        
        // 聚焦到第一个空答案输入框
        const firstEmptyInput = Array.from(inputs).find(input => !input.value);
        if (firstEmptyInput) {
            firstEmptyInput.focus();
        }
    }
    
    deleteFromBank(index) {
        if (!confirm('确定要删除这个题目吗？')) return;
        
        this.questionBank.splice(index, 1);
        this.saveQuestionBank();
        this.renderQuestionBank();
        
        // 如果删除的是当前选中的题目，清空表单
        if (this.currentBankIndex === index) {
            this.clearForm();
        }
        
        alert('题目已删除！');
    }
    
    clearQuestionBank() {
        if (!confirm('确定要清空整个题库吗？此操作不可恢复！')) return;
        
        this.questionBank = [];
        this.saveQuestionBank();
        this.renderQuestionBank();
        this.clearForm();
        
        alert('题库已清空！');
    }
    
    clearForm() {
        document.getElementById('customQuestion').value = '';
        document.querySelectorAll('.answer-input').forEach(input => {
            input.value = '';
        });
        this.currentBankIndex = -1;
        document.getElementById('customQuestion').focus();
    }
    
    showSetupScreen() {
        document.getElementById('setupScreen').style.display = 'flex';
        document.getElementById('gameScreen').style.display = 'none';
        this.renderQuestionBank();
    }
    
    loadExample() {
        // 加载示例数据
        document.getElementById('customQuestion').value = '说出人们最常忘记的三种日常用品';
        const exampleAnswers = [
            '钥匙',
            '手机', 
            '钱包',
            '眼镜',
            '雨伞',
            '手表',
            '背包',
            '身份证',
            '耳机'
        ];
        
        const inputs = document.querySelectorAll('.answer-input');
        inputs.forEach((input, index) => {
            input.value = exampleAnswers[index] || '';
        });
        
        this.currentBankIndex = -1; // 标记为新问题
    }
    
    saveAndStart() {
        // 收集用户输入的数据
        const question = document.getElementById('customQuestion').value.trim();
        const answerInputs = document.querySelectorAll('.answer-input');
        const answers = [];
        
        if (!question) {
            alert('请输入问题！');
            document.getElementById('customQuestion').focus();
            return;
        }
        
        // 收集答案（允许空白）
        answerInputs.forEach((input, index) => {
            const answer = input.value.trim();
            if (answer) { // 只添加非空答案
                answers.push({
                    answer: answer,
                    points: this.generateRandomPoints()
                });
            }
        });
        
        if (answers.length === 0) {
            alert('请至少输入一个答案选项！');
            answerInputs[0].focus();
            return;
        }
        
        // 如果是新问题，保存到题库
        if (this.currentBankIndex === -1) {
            const newQuestion = {
                question: question,
                answers: answers
            };
            
            // 检查是否已存在相同问题
            const exists = this.questionBank.some(item => 
                item.question.toLowerCase() === question.toLowerCase()
            );
            
            if (!exists) {
                this.questionBank.push(newQuestion);
                this.saveQuestionBank();
            }
        }
        
        // 保存游戏数据
        this.gameData = {
            question: question,
            answers: answers
        };
        
        // 切换到游戏界面
        this.showGameScreen();
    }
    
    generateRandomPoints() {
        // 生成合理的随机分数（10-40分）
        return Math.floor(Math.random() * 31) + 10;
    }
    
    showGameScreen() {
        document.getElementById('setupScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        
        // 显示问题
        document.getElementById('currentQuestion').textContent = this.gameData.question;
        
        // 显示题库来源
        const sourceText = this.currentBankIndex >= 0 ? 
            `题库 #${this.currentBankIndex + 1}` : '新问题';
        document.getElementById('questionSource').textContent = sourceText;
        
        // 创建游戏板
        this.createGameBoard();
        
        // 重置分数
        this.resetScores();
    }
    
    createGameBoard() {
        const board = document.getElementById('gameBoard');
        board.innerHTML = '';
        
        // 创建9个牌子（无论是否有答案）
        for (let i = 1; i <= 9; i++) {
            const card = this.createCard(i);
            board.appendChild(card);
        }
        
        this.revealedCards = 0;
    }
    
    createCard(number) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.cardNumber = number;
        
        // 获取对应的答案（如果有的话）
        const answerData = this.gameData.answers[number - 1];
        
        if (answerData) {
            card.dataset.answer = answerData.answer;
            card.dataset.points = answerData.points;
            card.dataset.hasAnswer = 'true';
        } else {
            card.dataset.hasAnswer = 'false';
        }
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-number">${number}</div>
                    <div>点击翻转</div>
                </div>
                <div class="card-back">
                    ${answerData ? `
                        <div class="card-answer">${answerData.answer}</div>
                        <div class="card-points">${answerData.points} 分</div>
                    ` : `
                        <div class="card-answer">空白</div>
                        <div class="card-points">0 分</div>
                    `}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.flipCard(card));
        
        return card;
    }
    
    initSoundEffects() {
        // 为每个音效文件创建Audio对象
        this.soundFiles = [
            './声音/victory.mp3',
            './声音/支付宝到账音效.mp3',
            './声音/正确.mp3',
            './声音/游戏胜利.mp3',
            './声音/金币落袋.mp3',
            './声音/鼓掌.mp3'
        ];
        console.log('音效文件列表:', this.soundFiles);
        this.soundFiles.forEach(file => {
            const audio = new Audio(file);
            audio.preload = 'auto';
            this.soundEffects.push(audio);
        });
    }
    
    playRandomSound() {
        if (this.soundEffects.length === 0) return;
        
        try {
            // 随机选择一个音效
            const randomIndex = Math.floor(Math.random() * this.soundEffects.length);
            const selectedSound = this.soundEffects[randomIndex];
            
            // 重置并播放音效
            selectedSound.currentTime = 0;
            selectedSound.play().catch(error => {
                console.log('音效播放失败:', error);
                // 如果音频文件播放失败，使用Web Audio API作为备选
                this.playWebAudioSound();
            });
        } catch (error) {
            console.log('随机音效播放出错:', error);
            this.playWebAudioSound();
        }
    }
    
    playWebAudioSound() {
        try {
            // 使用Web Audio API生成简单的音效作为备选
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 随机音调
            const frequency = 400 + Math.random() * 600;
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.type = 'sine';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            
        } catch (error) {
            console.log('Web Audio音效也播放失败:', error);
        }
    }
    
    flipCard(card) {
        if (card.classList.contains('flipped')) return;
        
        card.classList.add('flipped');
        card.classList.add('revealed');
        
        // 播放随机音效（无论是否有答案都播放）
        this.playRandomSound();
        
        // 如果有答案，加分
        if (card.dataset.hasAnswer === 'true') {
            const points = parseInt(card.dataset.points);
            this.addScore(points);
        }
        
        this.revealedCards++;
        
        // 检查是否所有牌子都已翻转
        if (this.revealedCards === 9) {
            setTimeout(() => this.showCompletionMessage(), 1000);
        }
    }
    
    addScore(points) {
        if (this.currentTeam === 'A') {
            this.teamAScore += points;
        } else {
            this.teamBScore += points;
        }
        this.updateScoreDisplay();
    }
    
    updateScoreDisplay() {
        document.getElementById('teamAScore').textContent = this.teamAScore;
        document.getElementById('teamBScore').textContent = this.teamBScore;
    }
    
    resetScores() {
        this.teamAScore = 0;
        this.teamBScore = 0;
        this.currentTeam = 'A';
        this.updateScoreDisplay();
    }
    
    showAllCards() {
        const cards = document.querySelectorAll('.card:not(.flipped)');
        cards.forEach((card, index) => {
            setTimeout(() => {
                if (!card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                    card.classList.add('revealed');
                    
                    if (card.dataset.hasAnswer === 'true') {
                        const points = parseInt(card.dataset.points);
                        this.addScore(points);
                    }
                    
                    this.revealedCards++;
                }
            }, index * 200);
        });
        
        setTimeout(() => {
            if (this.revealedCards >= 9) {
                this.showCompletionMessage();
            }
        }, cards.length * 200 + 1000);
    }
    
    showCompletionMessage() {
        const totalScore = this.teamAScore + this.teamBScore;
        const message = `🎉 游戏完成！\n\n总得分：${totalScore} 分\n\n点击"重新开始"可以再次游戏，或"返回设置"选择其他题目。`;
        
        // 创建简单的完成提示
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            max-width: 400px;
        `;
        
        modal.innerHTML = `
            <h2 style="margin-bottom: 15px;">🎉 游戏完成！</h2>
            <p style="margin-bottom: 20px; font-size: 1.1rem;">
                总得分：<strong>${totalScore}</strong> 分
            </p>
            <button onclick="this.parentElement.remove()" class="btn btn-primary">
                知道了
            </button>
        `;
        
        document.body.appendChild(modal);
        
        // 3秒后自动关闭
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 3000);
    }
    
    resetGame() {
        this.revealedCards = 0;
        this.createGameBoard();
        // 保持分数不变，只重置牌子状态
    }
    
    backToSetup() {
        if (confirm('返回设置界面将重置当前游戏，确定要继续吗？')) {
            this.showSetupScreen();
        }
    }
}

// 添加一些额外的CSS样式
const additionalStyles = `
    .card.empty {
        opacity: 0.6;
    }
    
    .card.empty .card-back {
        background: linear-gradient(45deg, #95a5a6, #7f8c8d);
    }
    
    .card.revealed {
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    }
    
    .card.flipped {
        pointer-events: none;
    }
    
    .setup-container {
        animation: fadeIn 0.6s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .question-bank-list::-webkit-scrollbar {
        width: 8px;
    }
    
    .question-bank-list::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
    
    .question-bank-list::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
    }
    
    .question-bank-list::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 初始化游戏
let game; // 全局变量，供HTML中的onclick使用

document.addEventListener('DOMContentLoaded', () => {
    game = new QuestionBankGame();
    window.game = game; // 暴露到全局作用域
});

// 导出到全局作用域
window.QuestionBankGame = QuestionBankGame;