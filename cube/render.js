
    // ========== 配置 ==========
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    // 大正方形尺寸 (像素) ，3x3 小格子每个 30px
    const BIG_SIZE = 90;           
    const CELL_SIZE = BIG_SIZE / 3; // 30px

    // 起始偏移，让画面居中一点 (左、上留白)
    const OFFSET_X = 60;
    const OFFSET_Y = 50;

    // 定义六个大正方形的编号及位置 (行、列 0-index)
    // 编号规则: 
    //   第1行第2个 → (0,1) 编号0
    //   第2行第1,2,3,4 → (1,0) (1,1) (1,2) (1,3) 编号1,2,3,4
    //   第3行第2个 → (2,1) 编号5
    const bigSquarePositions = [
        { id: 0, row: 0, col: 1 }, // 第一行第二列
        { id: 1, row: 1, col: 0 }, // 第二行第一列
        { id: 2, row: 1, col: 1 }, // 第二行第二列
        { id: 3, row: 1, col: 2 }, // 第二行第三列
        { id: 4, row: 1, col: 3 }, // 第二行第四列
        { id: 5, row: 2, col: 1 }  // 第三行第二列
    ].map(item => ({
        ...item,
        x: OFFSET_X + item.col * BIG_SIZE,
        y: OFFSET_Y + item.row * BIG_SIZE
    }));

    // ========== 从 Cube.data 初始化颜色状态 ==========
    // 深拷贝: 每个大正方形内的 9 个数字独立
    let colorState = Cube.data.map(innerArray => [...innerArray]);

    // 简单的合法性检查 (保证每个大正方形都有9个颜色值)
    if (colorState.length < 6) {
        console.warn('Cube.data 长度不足6，使用默认填充');
        while (colorState.length < 6) colorState.push(new Array(9).fill(0));
    }
    for (let i = 0; i < 6; i++) {
        if (!colorState[i] || colorState[i].length !== 9) {
            console.warn(`大正方形 #${i} 数据异常，重置为全0`);
            colorState[i] = new Array(9).fill(0);
        }
    }

    // ========== 绘制函数 ==========
    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 遍历六个大正方形
        for (const pos of bigSquarePositions) {
            const bigColors = colorState[pos.id]; // 长度为9的数组
            if (!bigColors) continue;

            const left = pos.x;
            const top = pos.y;

            // 1. 绘制 3x3 小彩色方格
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const idx = row * 3 + col;      // 0~8
                    const code = bigColors[idx];
                    
                    // 颜色映射
                    let fillColor;
                    switch (code) {
                        case 0: fillColor = '#f44336'; break; // 红
                        case 1: fillColor = '#2196f3'; break; // 蓝
                        case 2: fillColor = '#ffffff'; break; // 白
                        case 3: fillColor = '#4caf50'; break; // 绿
                        case 4: fillColor = '#ffeb3b'; break; // 黄
                        case 5: fillColor = '#ff9800'; break; // 橙
                        default: fillColor = '#888'; break;
                    }
                    
                    ctx.fillStyle = fillColor;
                    ctx.fillRect(
                        left + col * CELL_SIZE,
                        top + row * CELL_SIZE,
                        CELL_SIZE - 0.5,   // 留出细微缝隙，让网格线更明显
                        CELL_SIZE - 0.5
                    );
                }
            }

            // 2. 绘制灰色网格线 (细线，让每个小方格边界清晰)
            ctx.save();
            ctx.strokeStyle = '#555b6e';
            ctx.lineWidth = 0.8;
            for (let i = 0; i <= 3; i++) {
                // 垂直线
                const x = left + i * CELL_SIZE;
                ctx.beginPath();
                ctx.moveTo(x, top);
                ctx.lineTo(x, top + BIG_SIZE);
                ctx.stroke();

                // 水平线
                const y = top + i * CELL_SIZE;
                ctx.beginPath();
                ctx.moveTo(left, y);
                ctx.lineTo(left + BIG_SIZE, y);
                ctx.stroke();
            }
            ctx.restore();

            // 3. 绘制大正方形的黑色粗边框
            ctx.save();
            ctx.strokeStyle = '#0a0c14';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(left, top, BIG_SIZE, BIG_SIZE);
            ctx.restore();

            // (可选) 在大正方形角落显示编号(浅色小字)，方便对照——不是必须，但有益调试
            ctx.save();
            ctx.font = 'bold 14px monospace';
            ctx.fillStyle = '#f0f0f0';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 4;
            ctx.fillText(pos.id, left + 4, top + 18);
            ctx.restore();
        }
    }

    // ========== 鼠标点击监听 ==========
    canvas.addEventListener('click', (e) => {
        // 获取鼠标在 canvas 坐标系中的精确位置 (考虑 CSS 缩放)
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;   // 通常为1 (如果css宽高和画布一致)
        const scaleY = canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        // 遍历六个大正方形，检查点击落在哪个内部
        for (const pos of bigSquarePositions) {
            const left = pos.x;
            const top = pos.y;
            const right = left + BIG_SIZE;
            const bottom = top + BIG_SIZE;

            if (mouseX >= left && mouseX < right && mouseY >= top && mouseY < bottom) {
                // 命中该大正方形 → 计算点击了哪个小方格 (0~8)
                const dx = mouseX - left;
                const dy = mouseY - top;

                // 计算小方格行列 (0,1,2)
                let col = Math.floor(dx / CELL_SIZE);
                let row = Math.floor(dy / CELL_SIZE);

                // 边界保护 (浮点数可能刚好等于 CELL_SIZE 导致 col=3)
                col = Math.min(2, Math.max(0, col));
                row = Math.min(2, Math.max(0, row));

                const smallIdx = row * 3 + col;  // 0~8

                // ① 在控制台输出被点击的大正方形编号
                console.log(`>>> 点击大正方形 #${pos.id}  | 小方格索引 ${smallIdx}`);

                // ② 为该小正方形随机生成新颜色 (0~5)
                const newColor = Math.floor(Math.random() * 6);
                colorState[pos.id][smallIdx] = newColor;

                // ③ 重绘画面
                drawCanvas();

                // 只处理最先命中的大正方形 (由于没有重叠，一次点击只会进入一个)
                return;
            }
        }

        // 如果点击在空白区域，什么也不做 (但可加个提示)
        console.log('点击在空白区域 (无编号大正方形)');
    });

    // ========== 首次渲染 ==========
    drawCanvas();

    // 可选: 将颜色状态挂载到window方便调试 (非必须)
    window.debugColors = colorState;