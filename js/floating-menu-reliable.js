// 可靠的悬浮菜单测试脚本
(function() {
    'use strict';
    
    console.log('🚀 开始执行可靠的悬浮菜单脚本');
    
    // 等待DOM准备就绪
    function waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    // 主执行函数
    async function main() {
        try {
            console.log('⏳ 等待DOM准备就绪...');
            await waitForDOM();
            console.log('✅ DOM准备就绪');
            
            // 立即创建调试指示器
            createDebugIndicator('🔴 脚本开始执行！', 'red');
            
            // 2秒后创建悬浮按钮
            setTimeout(() => {
                createFloatingButton();
                updateDebugIndicator('🟢 悬浮按钮已创建！', 'green');
                
                // 3秒后移除调试指示器
                setTimeout(() => {
                    const indicator = document.getElementById('debugIndicator');
                    if (indicator) indicator.remove();
                }, 3000);
            }, 2000);
            
        } catch (error) {
            console.error('❌ 脚本执行错误:', error);
            createDebugIndicator('❌ 脚本执行错误: ' + error.message, 'red');
        }
    }
    
    // 创建调试指示器
    function createDebugIndicator(message, color) {
        // 移除旧的指示器
        const oldIndicator = document.getElementById('debugIndicator');
        if (oldIndicator) oldIndicator.remove();
        
        const indicator = document.createElement('div');
        indicator.id = 'debugIndicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: ${color};
            color: white;
            padding: 20px;
            z-index: 999999;
            border-radius: 10px;
            font-family: monospace;
            font-size: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            min-width: 200px;
            text-align: center;
        `;
        indicator.innerHTML = message;
        document.body.appendChild(indicator);
        console.log('📍 调试指示器已创建:', message);
    }
    
    // 更新调试指示器
    function updateDebugIndicator(message, color) {
        const indicator = document.getElementById('debugIndicator');
        if (indicator) {
            indicator.style.background = color;
            indicator.innerHTML = message;
            console.log('📍 调试指示器已更新:', message);
        }
    }
    
    // 创建悬浮按钮
    function createFloatingButton() {
        console.log('🎨 开始创建悬浮按钮...');
        
        const floatingBtn = document.createElement('div');
        floatingBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            width: 120px;
            height: 50px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999999;
            font-family: sans-serif;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0, 123, 255, 0.4);
            transition: all 0.3s ease;
            user-select: none;
        `;
        
        floatingBtn.innerHTML = '🎯 悬浮菜单';
        floatingBtn.title = '点击测试悬浮菜单功能';
        
        // 添加点击事件
        floatingBtn.addEventListener('click', () => {
            console.log('🎉 悬浮按钮被点击！');
            alert('🎉 悬浮菜单按钮点击成功！脚本执行正常！');
        });
        
        // 添加悬停效果
        floatingBtn.addEventListener('mouseenter', () => {
            floatingBtn.style.transform = 'translateY(-2px)';
            floatingBtn.style.boxShadow = '0 6px 25px rgba(0, 123, 255, 0.6)';
        });
        
        floatingBtn.addEventListener('mouseleave', () => {
            floatingBtn.style.transform = 'translateY(0)';
            floatingBtn.style.boxShadow = '0 4px 20px rgba(0, 123, 255, 0.4)';
        });
        
        document.body.appendChild(floatingBtn);
        console.log('✅ 悬浮按钮已添加到页面');
        
        // 验证按钮是否成功添加
        const addedBtn = document.querySelector('[style*="position: fixed"][style*="bottom: 30px"]');
        console.log('🔍 验证按钮是否存在:', !!addedBtn);
    }
    
    // 启动脚本
    main();
})();