// 最简单的测试脚本
console.log('🎯 最简单的悬浮菜单脚本开始执行！');

// 立即创建调试指示器
const debugIndicator = document.createElement('div');
debugIndicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    padding: 20px;
    z-index: 999999;
    border-radius: 10px;
    font-family: monospace;
    font-size: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
`;

debugIndicator.innerHTML = '🔴 脚本执行成功！';
document.body.appendChild(debugIndicator);

// 3秒后创建悬浮按钮
setTimeout(() => {
    const floatingBtn = document.createElement('div');
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: blue;
        color: white;
        width: 100px;
        height: 50px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 999999;
        font-family: sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    floatingBtn.innerHTML = '悬浮菜单';
    floatingBtn.onclick = () => {
        alert('🎉 悬浮菜单按钮点击成功！');
    };
    document.body.appendChild(floatingBtn);
    
    debugIndicator.style.background = 'green';
    debugIndicator.innerHTML = '🟢 悬浮按钮已创建！';
    
    setTimeout(() => {
        debugIndicator.remove();
    }, 3000);
}, 2000);