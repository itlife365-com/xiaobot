// 悬浮分类菜单组件 - 简化测试版本
(function() {
    'use strict';

    console.log('🚀 简化悬浮菜单脚本开始执行...');
    
    // 添加明显的页面标记
    const debugIndicator = document.createElement('div');
    debugIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: purple;
        color: white;
        padding: 15px;
        z-index: 10000;
        border-radius: 5px;
        font-family: monospace;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        cursor: pointer;
    `;
    debugIndicator.innerHTML = '🔧 简化悬浮菜单脚本正在执行...';
    debugIndicator.onclick = function() {
        this.remove();
    };
    document.body.appendChild(debugIndicator);

    console.log('🔧 简化版本初始化完成');

    // 简单的测试分类数据
    const testCategories = [
        { name: "技术开发", icon: "💻", count: 10 },
        { name: "创意设计", icon: "🎨", count: 8 },
        { name: "商业运营", icon: "📊", count: 6 },
        { name: "学习成长", icon: "📚", count: 5 }
    ];

    console.log('📋 测试分类数据:', testCategories);

    // 创建悬浮菜单
    function createFloatingMenu() {
        console.log('🎨 开始创建悬浮菜单...');
        
        const menuHTML = `
        <div class="floating-category-menu" id="floatingCategoryMenu">
            <div class="floating-btn" id="floatingBtn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>分类</span>
            </div>
            
            <div class="category-dropdown" id="categoryDropdown">
                <div class="dropdown-header">
                    <h3>项目分类</h3>
                    <button class="close-btn" id="closeBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="category-grid">
                    ${createCategoryItems()}
                </div>
            </div>
        </div>

        <div class="dropdown-overlay" id="dropdownOverlay"></div>
        `;

        document.body.insertAdjacentHTML('beforeend', menuHTML);
        console.log('✅ HTML已插入DOM');
        
        addStyles();
        initEvents();
        
        // 更新调试指示器
        debugIndicator.style.background = 'green';
        debugIndicator.innerHTML = '✅ 简化悬浮菜单已创建完成！';
        
        setTimeout(() => {
            debugIndicator.remove();
        }, 5000);
    }

    function createCategoryItems() {
        let html = '';
        testCategories.forEach(category => {
            html += `
                <a href="#" class="category-item">
                    <span class="category-icon">${category.icon}</span>
                    <span class="category-name">${category.name}</span>
                    <span class="category-count">${category.count}</span>
                </a>
            `;
        });
        return html;
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
        .floating-category-menu {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .floating-btn {
            width: 120px;
            height: 50px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: white;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 123, 255, 0.4);
            transition: all 0.3s ease;
            border: none;
            font-size: 14px;
            font-weight: 500;
        }

        .floating-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0, 123, 255, 0.6);
        }

        .floating-btn svg {
            transition: transform 0.3s ease;
        }

        .floating-btn.active svg {
            transform: rotate(45deg);
        }

        .category-dropdown {
            position: absolute;
            bottom: 60px;
            right: 0;
            width: 320px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.9);
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .category-dropdown.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        .dropdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }

        .dropdown-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }

        .close-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background-color 0.2s;
            color: #666;
        }

        .close-btn:hover {
            background-color: #f0f0f0;
        }

        .category-grid {
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
        }

        .category-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            border-radius: 8px;
            text-decoration: none;
            color: #333;
            transition: all 0.2s ease;
            border: 1px solid transparent;
            margin-bottom: 5px;
        }

        .category-item:hover {
            background-color: #f8f9fa;
            border-color: #007bff;
            transform: translateX(2px);
        }

        .category-icon {
            font-size: 16px;
            flex-shrink: 0;
        }

        .category-name {
            flex: 1;
            font-size: 13px;
            font-weight: 500;
        }

        .category-count {
            font-size: 11px;
            color: #666;
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 10px;
            min-width: 20px;
            text-align: center;
        }

        .dropdown-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 9998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .dropdown-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .floating-category-menu {
                bottom: 20px;
                right: 20px;
            }
            
            .floating-btn {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                flex-direction: column;
                gap: 4px;
                font-size: 12px;
            }
            
            .floating-btn span {
                font-size: 10px;
            }
            
            .category-dropdown {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90vw;
                max-height: 80vh;
                right: auto;
                bottom: auto;
            }
        }
        `;
        document.head.appendChild(style);
        console.log('✅ 样式已添加');
    }

    function initEvents() {
        const floatingBtn = document.getElementById('floatingBtn');
        const categoryDropdown = document.getElementById('categoryDropdown');
        const closeBtn = document.getElementById('closeBtn');
        const dropdownOverlay = document.getElementById('dropdownOverlay');
        
        console.log('📍 找到的元素:', {
            floatingBtn: !!floatingBtn,
            categoryDropdown: !!categoryDropdown,
            closeBtn: !!closeBtn,
            dropdownOverlay: !!dropdownOverlay
        });
        
        if (!floatingBtn || !categoryDropdown || !closeBtn || !dropdownOverlay) {
            console.warn('⚠️ Floating menu elements not found');
            debugIndicator.style.background = 'orange';
            debugIndicator.innerHTML = '⚠️ DOM元素未找到！';
            return;
        }
        
        let isOpen = false;
        
        function toggleMenu() {
            console.log('🔄 切换菜单状态:', !isOpen);
            isOpen = !isOpen;
            
            if (isOpen) {
                categoryDropdown.classList.add('show');
                dropdownOverlay.classList.add('show');
                floatingBtn.classList.add('active');
            } else {
                categoryDropdown.classList.remove('show');
                dropdownOverlay.classList.remove('show');
                floatingBtn.classList.remove('active');
            }
        }
        
        floatingBtn.addEventListener('click', toggleMenu);
        closeBtn.addEventListener('click', toggleMenu);
        dropdownOverlay.addEventListener('click', toggleMenu);
        
        // ESC键关闭菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                toggleMenu();
            }
        });
        
        console.log('✅ 所有事件监听已绑定');
    }

    // 立即执行
    console.log('🚀 创建悬浮菜单...');
    createFloatingMenu();
    console.log('✅ 简化悬浮菜单脚本执行完成');
})();