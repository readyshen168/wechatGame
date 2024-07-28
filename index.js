const canvas = document.getElementById("canvas"),
context = canvas.getContext("2d"),

// 小球的球心位置
ballPos = {x: canvas.width/2, y: canvas.height/2},
// 小球半径
radius = 10,
// 挡板尺寸
panelHeight = 50,
panelWidth = 10,
// 右挡板的起始位置
centerY = (canvas.height - panelHeight)/2,
// 右挡板在y轴上的移动范围
rightPanelMoveRange = 20,
// 左挡板的最低位置
leftPanelYmax = canvas.height - panelHeight

// 小球速度
let speedX = 2, speedY = 1,
// 挡板style
pattern = "brown",
// 左右挡板的初始位置
leftPanelY = rightPanelY = (canvas.height-panelHeight) / 2,
// 右挡板在y轴上的和速度
rightPanelSpeedY = 0.5,
// 用户分数
userScore = 0,
// 系统分数
systemScore = 0,
// 判断游戏是否结束
gameIsOver = false

// 加载挡板木纹图片
const img = document.getElementById("mood")
img.onload = function (){
    pattern = context.createPattern(img, "no-repeat")
}

// 小球与墙壁四周的碰撞检查
function testHitWall(){
    if(ballPos.x > canvas.width - radius){
        speedX = -speedX
    } else if(ballPos.x < radius){
        speedX = -speedX
    }
    if(ballPos.y > canvas.height - radius){
        speedY = -speedY
    } else if(ballPos.y < radius){
        speedY = -speedY
    }
}

// 小球与挡板的碰撞检查, 计入计分模块
function testHitPanel(){
    // 左挡板
    if(ballPos.x < panelWidth + radius){
       if(ballPos.y > leftPanelY && ballPos.y < (leftPanelY + panelHeight)){
           speedX = -speedX
           userScore++
           checkScore()
           console.log("当！撞左挡板")
           // 添加音效
           playHitAudio()
       }
        // 右挡板
    } else if(ballPos.x > canvas.width - panelWidth - radius){
        if(ballPos.y > rightPanelY && ballPos.y < (rightPanelY + panelHeight)){
            speedX = -speedX
            systemScore++
            checkScore()
            console.log("当！撞右挡板")
            // 添加音效
            playHitAudio()
        }
    }
}

// 使用循环体绘制虚线作为分界线
function drawDashLine(){
    let dashGap = 10,
        StartY = 0
    context.beginPath()
    while (StartY <= canvas.height) {
        // 移动到起始点StartY
        context.moveTo(canvas.width / 2, StartY)
        // lineTo到起始点加一段距离dashGap
        context.lineTo(canvas.width / 2, StartY + dashGap)
        // StartX加2倍的dashGap
        StartY += 2 * dashGap
    }
    context.lineWidth = 1
    context.strokeStyle = "grey"
    context.stroke()

}

// 设置标题样式
function drawTitle(){
    const title = "挡板小游戏",
        // 标题参数
        titleWidth = context.measureText(title).width,
        // 测量文字的高度
        // titleHeight = context.measureText("M").width,
        // 文字居中位置
        xMid = canvas.width / 2,
        yMid = canvas.height / 2

    context.font = "italic 1000 20px STHeiti"

    // 设置文本绘制基线
    context.textBaseline = 'middle'
    context.textAlign = 'center'
    // context.fillStyle = "##FF0000"
    // 设置渐变样式
    let grd = context.createLinearGradient(xMid-titleWidth/2, 0, xMid + titleWidth/2, 0)
    grd.addColorStop(0, "red")
    grd.addColorStop(0.5, "white")
    grd.addColorStop(1, "blue")
    context.fillStyle = grd
    context.fillText(title, xMid, yMid)

}

// 给画布添加浅色背景
function drawBg(){
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(canvas.width, 0)
    context.lineTo(canvas.width, canvas.height)
    context.lineTo(0, canvas.height)
    context.lineTo(0, 0)
    context.fillStyle = "whitesmoke"
    context.fill()
}


// 绘制挡板
function drawPanel(){
    // 用fillRect绘制挡板, 添加图片花纹
    context.fillStyle = pattern
    // 右挡板
    context.fillRect(canvas.width - panelWidth, rightPanelY, panelWidth, panelHeight)
    // 左挡板
    context.fillRect(0, leftPanelY, panelWidth, panelHeight)

// 无需context.fill()，若保留则会填充整个画布
}

// 添加分数
function drawScore(){
    context.font = "100 12px STHeiti"
    context.fillStyle = "lightgray"
    drawText(context, 20, canvas.height-20, "用户" + userScore)
    const sysScoreText  = "系统" + systemScore
    drawText(context, canvas.width - 20 - context.measureText(sysScoreText).width, canvas.height - 20, sysScoreText)
}

// 用arc方法绘制小球
function drawBall(){
    // 添加阴影效果
    context.shadowBlur = 1
    context.shadowOffsetX = 2
    context.shadowOffsetY = 2
    context.shadowColor = "grey"

    // 画小球
    context.beginPath()
    context.arc(ballPos.x, ballPos.y, radius, 0, 2 * Math.PI)
    context.fillStyle = "white"
    context.strokeStyle = "black"
    context.stroke()
    context.fill()

    // 去除阴影效果
    context.shadowOffsetY = context.shadowOffsetX = 0
}



// 把所有需要刷新重绘的代码放入一个函数里：
function render() {

    // 画布背景
    drawBg()
    // 画虚线分界线
    drawDashLine()
    // 设置标题样式
    drawTitle()
    // 绘制挡板
    drawPanel()
    // 添加分数
    drawScore()
    // 绘制小球
    drawBall()
    //绘制静音按钮
    drawMuteButton()
}

/*
setInterval(function (){
    // 清屏
    context.clearRect(0, 0, canvas.width, canvas.height)
    testHitWall()
    ballPos.x += speedX
    ballPos.y += speedY
    render()
}, 50)
*/

// 在指定位置绘制文本
function drawText(context, x, y, txt){
    context.fillText(txt, x, y)
}

// 根据分数判断游戏是否应该结束
function checkScore(){
    if(systemScore >= 3 || userScore >= 3){
        gameIsOver = true
        console.log("Game Over")
    }
    console.log(`bal posistioX: ${ballPos.x}` )
    console.log(`bal posistioY: ${ballPos.y}` )
    console.log(`bal speedX: ${speedX}` )
    console.log(`bal speedY: ${speedY}` )
    console.log(`system score: ${systemScore}`)
    console.log(`user score: ${userScore}`)
}

// 播放碰撞音效
function playHitAudio(){
    const audio = document.getElementById("hit-sound")
    audio.play()
}

// 创建背景音乐
const bgAudio = new Audio("bu-sound")
if(bgAudio.canPlayType("audio/mp3")){
    bgAudio.src = "./bgmusic.mp3"
}else if(bgAudio.canPlayType(("audio/ogg"))){
    bgAudio.src = "./bgmusic.ogg"
}

// 播放背景音乐
function playbgMusic(){
    bgAudio.currentTime = 0
    bgAudio.play()
}
// 停止播放背景音乐
function stopMusic(){
    bgAudio.pause()
}

// 按钮参数
const btnX = canvas.width - 40,
    btnY = 2 ,
    btnWidth = 20,
    btnHeight = 20,
    // 按钮花纹图像
    btnOnImg = new Image(),
    btnMuteImg = new Image()
    btnOnImg.src = "./sound.png"
    btnMuteImg.src = "./no-sound.png"


// 绘制静音按钮
function drawMuteButton(){

    // 离屏法绘制按钮
    const btnCanvas = document.createElement("canvas"),
    btnContext = btnCanvas.getContext('2d')

    // 具体的按钮图像
    let btn

    // 离屏尺寸与图片大小一致
    btnCanvas.width = 512
    btnCanvas.height = 512

    // 背景音乐状态
    let bgMusicPlaying = bgAudio.currentTime > 0 && !bgAudio.paused
    if(bgMusicPlaying){
        btn = btnOnImg
    }else{
        btn = btnMuteImg
    }
    // 绘制按钮
    btnContext.fillStyle = btnContext.createPattern(btn, "no-repeat")
    btnContext.fillRect(0, 0, btnCanvas.width, btnCanvas.height)
    // 离屏转绘
    context.drawImage(btnCanvas, 0, 0, btnCanvas.width, btnCanvas.height, btnX, btnY, btnWidth, btnHeight)
}


// 监听背景音乐按钮的单击事件
function controlBgMusic(){
    canvas.addEventListener("click", function (e){
        const pos = {x:e.offsetX, y:e.clientY}
        if(pos.x > btnX && pos.x < (btnX + btnWidth) && pos.y > btnY && pos.y < (btnY + btnHeight)){
            console.log("单击了背景音乐按钮")
            const bgMusicIsPlaying = bgAudio.currentTime > 0 && !bgAudio.paused
            bgMusicIsPlaying ? stopMusic() : playbgMusic()
        }
    })
}


// 绘制结束语
function drawEndGame(){
    const txt = "游戏结束"
    context.font = "900 26px STHeiti"
    context.fillStyle = "black"
    context.textBaseline = "middle"
    context.textAlign = "left"
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawText(context, canvas.width / 2 - context.measureText(txt).width / 2, canvas.height / 2, txt)

    // 提示用户重新开始游戏
    const restartTip = "单击屏幕重新开始游戏"
    context.font = "12px FangSong"
    context.fillStyle = "gray"
    drawText(context, (canvas.width-context.measureText(restartTip).width) / 2, canvas.height / 2 + 25, restartTip )
}


// 改进动画流畅度
function run(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    // 检测小球的碰壁
    testHitWall()
    testHitPanel()
    // 更新小球位置
    ballPos.x += speedX
    ballPos.y += speedY
    // 右挡板的移动，更新其y轴位置
    rightPanelY += rightPanelSpeedY
    if(rightPanelY < centerY - rightPanelMoveRange || rightPanelY > centerY + rightPanelMoveRange){
        rightPanelSpeedY = -rightPanelSpeedY
    }
    // 捕捉鼠标的坐标，并以此确定左挡板的y坐标leftPanelY
    canvas.addEventListener("mousemove", function (e){
        let y = e.clientY - canvas.getBoundingClientRect().top - panelHeight / 2
        if(y > 0 && y < leftPanelYmax){
           leftPanelY = y
        }
    })
    // 重新渲染画面各元素
    render()

    // 处理游戏的循环进行
    if(!gameIsOver){
        requestAnimationFrame(run)
    }else{
        // 画结束语
        drawEndGame()

        // 监听单击事件
        canvas.addEventListener("click", restartGame)

        // 停止播放背景音乐
        stopMusic()
    }
}

// 重启游戏的单击事件句柄
function restartGame(e){
    // 移除监听
    canvas.removeEventListener("click", restartGame)
    // 重设游戏变量
    userScore = 0
    systemScore = 0
    gameIsOver = false
    // 重置小球位置
    // 无法给const变量重新赋值：ballPos = {x:canvas.width/2, y:canvas.height/2}
    ballPos.x = canvas.width / 2
    ballPos.y = canvas.height / 2
    // 播放背景音乐
    playbgMusic()
    controlBgMusic()
    run()
}
playbgMusic()
controlBgMusic()
run()
