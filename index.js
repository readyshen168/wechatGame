const canvas = document.getElementById("canvas"),
context = canvas.getContext("2d"),
title = "挡板小游戏",
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

// 把所有需要刷新重绘的代码放入一个函数里：
function render() {
    // 给画布添加浅色背景
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(canvas.width, 0)
    context.lineTo(canvas.width, canvas.height)
    context.lineTo(0, canvas.height)
    context.lineTo(0, 0)
    context.fillStyle = "whitesmoke"
    context.fill()

    // 使用循环体绘制虚线作为分界线
    const dashGap = 10
    let StartY = 0
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

    // 添加阴影效果
    context.shadowBlur = 1
    context.shadowOffsetX = 2
    context.shadowOffsetY = 2
    context.shadowColor = "grey"

    // 设置文字样式
    context.font = "italic 1000 20px STHeiti"
    const titleWidth = context.measureText(title).width,
        titleHight = context.measureText("M").width,
        // 文字居中位置
        xmid = (canvas.width - titleWidth) / 2,
        ymid = (canvas.height - titleHight) / 2
    // 设置文本绘制基线
    context.textBaseline = 'top'
    context.textAlign = 'left'
    // context.fillStyle = "##FF0000"
    // 设置渐变样式
    let grd = context.createLinearGradient(xmid, 0, xmid + titleWidth, 0)
    grd.addColorStop(0, "red")
    grd.addColorStop(0.5, "white")
    grd.addColorStop(1, "blue")
    context.fillStyle = grd
    context.fillText(title, xmid, ymid)
    // 替代方案是直接用canvas的中线来定位，只需调整文本的textBaseline和textAlign即可

    // 用fillRect绘制挡板, 添加图片花纹
    context.fillStyle = pattern
    // 右挡板
    context.fillRect(canvas.width - panelWidth, rightPanelY, panelWidth, panelHeight)
    // 左挡板
    context.fillRect(0, leftPanelY, panelWidth, panelHeight)

    // 无需context.fill()，若保留则会填充整个画布

    // 添加分数
    context.font = "100 12px STHeiti"
    context.fillStyle = "lightgray"
    context.shadowOffsetY = context.shadowOffsetX = 0
    drawText(context, 20, canvas.height-20, "用户" + userScore)
    const sysScoreText  = "系统" + systemScore
    drawText(context, canvas.width - 20 - context.measureText(sysScoreText).width, canvas.height - 20, sysScoreText)

    // 用arc方法绘制小球
    context.shadowOffsetY = context.shadowOffsetX = 2 // 恢复小球阴影
    context.beginPath()
    context.arc(ballPos.x, ballPos.y, radius, 0, 2 * Math.PI)
    context.fillStyle = "white"
    context.strokeStyle = "black"
    context.stroke()
    context.fill()

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

// 绘制静音按钮
const btnX = canvas.width - 40,
    btnY = 2 ,
    btnWidth = 20,
    btnHeight = 20
function drawMuteButton(){
    // 离屏法绘制按钮
    const btnCanvas = document.createElement("canvas")
    btnCanvas.width = 512
    btnCanvas.height = 512
    const btnContext = btnCanvas.getContext('2d')
    const btnImg = new Image()
    // 背景音乐状态
    let bgMusicPlaying = bgAudio.currentTime > 0 && !bgAudio.paused
    if(bgMusicPlaying){
        btnImg.src = "./sound.png"
    }else{
        btnImg.src = "./no-sound.png"
    }
    btnContext.fillStyle = btnContext.createPattern(btnImg, "no-repeat")
    btnContext.fillRect(0, 0, btnCanvas.width, btnCanvas.height)
    context.drawImage(btnCanvas, 0, 0, btnCanvas.width, btnCanvas.height, btnX, btnY, btnWidth, btnHeight)

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
        const txt = "游戏结束"
        context.shadowOffsetY = context.shadowOffsetX = 0 // 去除阴影
        context.font = "900 26px STHeiti"
        context.fillStyle = "black"
        context.textBaseline = "middle"
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawText(context, canvas.width / 2 - context.measureText(txt).width / 2, canvas.height / 2, txt)

        // 提示用户重新开始游戏
        const restartTip = "单击屏幕重新开始游戏"
        context.font = "12px FangSong"
        context.fillStyle = "gray"
        drawText(context, (canvas.width-context.measureText(restartTip).width) / 2, canvas.height / 2 + 25, restartTip )

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
    run()
}
playbgMusic()
run()
