// 游戏变量
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let score = 0;
let lives = 3;
let gameRunning = false;
let gamePaused = false;
let paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 15,
    speed: 15
};
let balls = [];
let ballSpeed = 3;
let ballInterval = 1500; // 毫秒
let lastBallTime = 0;
let animations = [];
let keys = {};

// 初始化游戏
function initGame() {
    score = 0;
    lives = 3;
    balls = [];
    gameRunning = false;
    gamePaused = false;
    updateScore();
    updateLives();
    draw();
}

// 更新得分
function updateScore() {
    document.getElementById('score').textContent = `得分: ${score}`;
}

// 更新生命
function updateLives() {
    document.getElementById('lives').textContent = `生命: ${lives}`;
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制渐变背景
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f5f5f7');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制 paddle
    ctx.fillStyle = '#0071e3';
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 8);
    ctx.fill();
    
    // 添加 paddle 阴影
    ctx.shadowColor = 'rgba(0, 113, 227, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    
    // 绘制球
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        
        // 为球添加渐变效果
        let ballGradient = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 0, ball.x, ball.y, ball.radius);
        ballGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        ballGradient.addColorStop(1, ball.color);
        ctx.fillStyle = ballGradient;
        
        ctx.fill();
        ctx.closePath();
    });
    
    // 绘制游戏状态
    if (!gameRunning) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1d1d1f';
        ctx.font = '30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('点击开始游戏', canvas.width / 2, canvas.height / 2);
    }
    
    if (gamePaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1d1d1f';
        ctx.font = '30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('游戏暂停', canvas.width / 2, canvas.height / 2);
    }
}

// 更新游戏
function update(timestamp) {
    if (!gameRunning || gamePaused) {
        requestAnimationFrame(update);
        return;
    }
    
    // 处理键盘输入
    processKeyboardInput();
    
    // 生成新球
    if (timestamp - lastBallTime > ballInterval) {
        createBall();
        lastBallTime = timestamp;
    }
    
    // 更新球的位置
    balls.forEach((ball, index) => {
        ball.y += ball.speed;
        
        // 检查球是否落地
        if (ball.y + ball.radius > canvas.height) {
            balls.splice(index, 1);
            lives--;
            updateLives();
            
            // 检查游戏结束
            if (lives <= 0) {
                gameRunning = false;
                document.getElementById('gameOverlay').classList.remove('hidden');
                document.getElementById('gameMessage').textContent = `游戏结束！最终得分: ${score}`;
                document.getElementById('startBtn').textContent = '重新开始';
            }
        }
        
        // 检查碰撞
        if (ball.y + ball.radius >= paddle.y && 
            ball.x >= paddle.x && 
            ball.x <= paddle.x + paddle.width) {
            // 添加碰撞动画
            addAnimation(ball.x, ball.y, 'collision');
            balls.splice(index, 1);
            score++;
            updateScore();
            
            // 添加得分动画
            addAnimation(ball.x, ball.y, 'score');
            
            // 增加游戏难度
            if (score % 5 === 0) {
                ballSpeed += 0.5;
                if (ballInterval > 500) {
                    ballInterval -= 100;
                }
            }
        }
    });
    
    // 更新动画
    updateAnimations();
    
    draw();
    // 绘制动画
    drawAnimations();
    
    requestAnimationFrame(update);
}

// 创建新球
function createBall() {
    let ball = {
        x: Math.random() * (canvas.width - 20) + 10,
        y: 0,
        radius: 10,
        speed: ballSpeed,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    balls.push(ball);
}

// 添加动画
function addAnimation(x, y, type) {
    animations.push({
        x: x,
        y: y,
        type: type,
        startTime: Date.now(),
        duration: 500
    });
}

// 更新动画
function updateAnimations() {
    let currentTime = Date.now();
    animations = animations.filter(anim => {
        return currentTime - anim.startTime < anim.duration;
    });
}

// 绘制动画
function drawAnimations() {
    animations.forEach(anim => {
        let progress = (Date.now() - anim.startTime) / anim.duration;
        if (anim.type === 'collision') {
            // 碰撞动画
            ctx.beginPath();
            ctx.arc(anim.x, anim.y, 20 * (1 - progress), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(76, 175, 80, ${0.5 * (1 - progress)})`;
            ctx.fill();
            ctx.closePath();
        } else if (anim.type === 'score') {
            // 得分动画
            ctx.fillStyle = `rgba(255, 215, 0, ${1 - progress})`;
            ctx.font = `${20 + 10 * progress}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('+1', anim.x, anim.y - 30 * progress);
        }
    });
}

// 移动 paddle
function movePaddle(e) {
    if (!gameRunning || gamePaused) return;
    
    let rect = canvas.getBoundingClientRect();
    paddle.x = e.clientX - rect.left - paddle.width / 2;
    
    // 限制 paddle 在画布内
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

// 触摸移动 paddle
function touchMove(e) {
    e.preventDefault();
    if (!gameRunning || gamePaused) return;
    
    let rect = canvas.getBoundingClientRect();
    paddle.x = e.touches[0].clientX - rect.left - paddle.width / 2;
    
    // 限制 paddle 在画布内
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

// 键盘控制 paddle
function handleKeydown(e) {
    keys[e.key] = true;
}

function handleKeyup(e) {
    keys[e.key] = false;
}

// 处理键盘输入
function processKeyboardInput() {
    if (!gameRunning || gamePaused) return;
    
    if (keys['ArrowLeft']) {
        paddle.x -= paddle.speed;
    }
    if (keys['ArrowRight']) {
        paddle.x += paddle.speed;
    }
    
    // 限制 paddle 在画布内
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

// 事件监听器
document.getElementById('startBtn').addEventListener('click', function() {
    if (!gameRunning) {
        gameRunning = true;
        document.getElementById('gameOverlay').classList.add('hidden');
        requestAnimationFrame(update);
    }
});

document.getElementById('pauseBtn').addEventListener('click', function() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        if (!gamePaused) {
            document.getElementById('gameOverlay').classList.add('hidden');
            requestAnimationFrame(update);
        } else {
            document.getElementById('gameOverlay').classList.remove('hidden');
            document.getElementById('gameMessage').textContent = '游戏暂停';
            document.getElementById('startBtn').textContent = '继续游戏';
        }
    }
});

// 键盘事件监听
document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

// 保留鼠标和触摸事件监听（可选）
canvas.addEventListener('mousemove', movePaddle);
canvas.addEventListener('touchmove', touchMove);

// 初始化游戏
initGame();