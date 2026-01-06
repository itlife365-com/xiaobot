// 悬浮分类菜单组件 - 调试版本
(function() {
    'use strict';

    console.log('🚀 悬浮菜单脚本开始执行...');
    
    // 添加明显的页面标记
    const debugIndicator = document.createElement('div');
    debugIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: red;
        color: white;
        padding: 10px;
        z-index: 10000;
        border-radius: 5px;
        font-family: monospace;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    debugIndicator.innerHTML = '🔧 悬浮菜单脚本正在执行...';
    document.body.appendChild(debugIndicator);

    // 存储分类数据
    let categoriesData = null;
    // 默认展开状态
    let isDefaultExpanded = true;

    console.log('🔧 默认展开状态:', isDefaultExpanded);

    // 获取分类数据
    async function loadCategoriesData() {
        console.log('📡 开始加载分类数据...');
        try {
            const response = await fetch('/js/categories.json');
            console.log('📊 分类数据响应状态:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('✅ 分类数据加载成功:', data);
            return data;
        } catch (error) {
            console.error('❌ 加载分类数据失败:', error);
            return null;
        }
    }

    // 创建悬浮菜单HTML
    function createFloatingMenu(data) {
        console.log('🎨 开始创建悬浮菜单...');
        console.log('📋 接收到的数据:', data);
        
        if (!data || !data.groups) {
            console.error('❌ 分类数据无效');
            return;
        }

        console.log('🏗️ 开始构建菜单HTML...');

        const menuHTML = `
        <!-- 悬浮分类菜单组件 -->
        <div class="floating-category-menu" id="floatingCategoryMenu">
            <!-- 悬浮按钮 -->
            <div class="floating-btn" id="floatingBtn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>分类</span>
            </div>
            
            <!-- 分类菜单 -->
            <div class="category-dropdown" id="categoryDropdown">
                <div class="dropdown-header">
                    <h3>项目分类</h3>
                    <span class="total-count">共${data.total_count}个分类</span>
                    <button class="close-btn" id="closeBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="category-grid">
                    ${createCategorySections(data.groups)}
                </div>
                
                <!-- 快速链接 -->
                <div class="quick-links">
                    <h4>快速导航</h4>
                    <div class="quick-links-grid">
                        <a href="/explore" class="quick-link">
                            <span class="quick-icon">🔍</span>
                            <span>探索发现</span>
                        </a>
                        <a href="/featured" class="quick-link">
                            <span class="quick-icon">⭐</span>
                            <span>精选推荐</span>
                        </a>
                        <a href="/ranking" class="quick-link">
                            <span class="quick-icon">🏅</span>
                            <span>热门排行</span>
                        </a>
                        <a href="/creators" class="quick-link">
                            <span class="quick-icon">👥</span>
                            <span>创作者</span>
                        </a>
                        <a href="/tags" class="quick-link">
                            <span class="quick-icon">🏷️</span>
                            <span>标签</span>
                        </a>
                        <a href="/about" class="quick-link">
                            <span class="quick-icon">ℹ️</span>
                            <span>关于我们</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- 遮罩层 -->
        <div class="dropdown-overlay" id="dropdownOverlay"></div>
        `;

        console.log('📝 HTML构建完成，插入到DOM...');
        
        // 插入到body末尾
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        console.log('✅ HTML已插入DOM');
        
        // 添加样式
        console.log('🎨 添加样式...');
        addFloatingMenuStyles();
        console.log('✅ 样式已添加');
        
        // 初始化事件监听
        console.log('🔗 初始化事件监听...');
        initFloatingMenuEvents();
        console.log('✅ 事件监听已初始化');
        
        // 更新调试指示器
        debugIndicator.style.background = 'green';
        debugIndicator.innerHTML = '✅ 悬浮菜单已创建完成！';
        
        setTimeout(() => {
            debugIndicator.remove();
        }, 5000);
    }

    // 创建分类sections - 去掉分组，直接纵向展示
    function createCategorySections(groups) {
        console.log('📊 开始创建分类sections...');
        let html = '';
        let allCategories = [];
        
        // 收集所有分类
        Object.values(groups).forEach(categories => {
            allCategories = allCategories.concat(categories);
        });
        
        console.log('📋 总分类数:', allCategories.length);
        
        if (allCategories.length === 0) {
            console.warn('⚠️ 没有分类数据');
            return '<div class="no-categories">暂无分类数据</div>';
        }
        
        html += `
        <div class="category-section">
            <div class="category-items">
        `;
        
        // 直接显示所有分类，不分组
        allCategories.forEach(category => {
            html += `
                <a href="${category.url}" class="category-item" title="${category.description || category.name}">
                    <span class="category-icon">${category.icon}</span>
                    <span class="category-name">${category.name}</span>
                    <span class="category-count">${category.projects_count}</span>
                </a>
            `;
        });
        
        html += `
            </div>
        </div>
        `;
        
        console.log('✅ 分类sections创建完成');
        return html;
    }

    // 添加样式
    function addFloatingMenuStyles() {
        const style = document.createElement('style');
        style.textContent = `
        /* 悬浮菜单样式 */
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

        /* 下拉菜单 */
        .category-dropdown {
            position: absolute;
            bottom: 60px;
            right: 0;
            width: 380px;
            max-height: 70vh;
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
            padding: 20px 20px 15px;
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

        /* 分类网格 */
        .category-grid {
            padding: 20px;
            max-height: 500px;
            overflow-y: auto;
        }

        .category-section {
            margin-bottom: 0;
        }

        .category-section h4 {
            display: none; /* 隐藏分组标题 */
        }

        .category-items {
            display: grid;
            grid-template-columns: 1fr;
            gap: 6px;
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

        .total-count {
            font-size: 12px;
            color: #666;
            background: #e9ecef;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 500;
        }

        .no-categories {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
        }

        /* 快速链接 */
        .quick-links {
            padding: 15px 20px;
            border-top: 1px solid #f0f0f0;
            background-color: #f8f9fa;
        }

        .quick-links h4 {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
        }

        .quick-links-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .quick-link {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            text-decoration: none;
            color: #555;
            transition: all 0.2s ease;
            font-size: 13px;
        }

        .quick-link:hover {
            background-color: #007bff;
            color: white;
            transform: translateX(2px);
        }

        .quick-icon {
            font-size: 14px;
        }

        /* 遮罩层 */
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
            
            .category-dropdown.show {
                transform: translate(-50%, -50%) scale(1);
            }
            
            .category-items {
                grid-template-columns: 1fr;
            }
            
            .quick-links-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            .floating-category-menu {
                bottom: 15px;
                right: 15px;
            }
            
            .floating-btn {
                width: 50px;
                height: 50px;
            }
            
            .floating-btn span {
                display: none;
            }
            
            .category-dropdown {
                width: 95vw;
                max-height: 85vh;
            }
        }

        /* 滚动条样式 */
        .category-grid::-webkit-scrollbar {
            width: 6px;
        }

        .category-grid::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .category-grid::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .category-grid::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        `;
        document.head.appendChild(style);
        console.log('✅ CSS样式已添加到head');
    }

    // 初始化事件监听
    function initFloatingMenuEvents() {
        console.log('🔍 查找DOM元素...');
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
        
        // 切换菜单显示/隐藏
        function toggleMenu() {
            console.log('🔄 切换菜单状态:', !isOpen);
            isOpen = !isOpen;
            
            if (isOpen) {
                showMenu();
            } else {
                hideMenu();
            }
        }
        
        // 显示菜单
        function showMenu() {
            console.log('👁️ 显示菜单');
            categoryDropdown.classList.add('show');
            dropdownOverlay.classList.add('show');
            floatingBtn.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }
        
        // 隐藏菜单
        function hideMenu() {
            console.log('🙈 隐藏菜单');
            categoryDropdown.classList.remove('show');
            dropdownOverlay.classList.remove('show');
            floatingBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // 如果设置为默认展开，则立即显示菜单
        if (isDefaultExpanded) {
            console.log('🚀 设置为默认展开，立即显示菜单');
            isOpen = true;
            showMenu();
        }
        
        // 绑定事件
        floatingBtn.addEventListener('click', toggleMenu);
        closeBtn.addEventListener('click', hideMenu);
        dropdownOverlay.addEventListener('click', hideMenu);
        
        // ESC键关闭菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                hideMenu();
            }
        });
        
        // 点击菜单项后关闭菜单
        const menuItems = document.querySelectorAll('.category-item, .quick-link');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                setTimeout(hideMenu, 200); // 稍微延迟以提供更好的用户体验
            });
        });
        
        console.log('✅ 所有事件监听已绑定');
    }

    // 页面加载完成后初始化
    async function init() {
        console.log('🎯 开始初始化悬浮菜单...');
        try {
            // 先加载分类数据
            categoriesData = await loadCategoriesData();
            
            if (!categoriesData) {
                console.warn('⚠️ 无法加载分类数据，使用默认数据');
                // 使用默认数据作为后备
                categoriesData = {
                    success: true,
                    total_count: 23,
                    groups: {
                        "技术开发": [
                            {"name": "技术", "icon": "💻", "url": "/categories/tech", "projects_count": 0},
                            {"name": "AI", "icon": "🤖", "url": "/categories/ai", "projects_count": 0},
                            {"name": "ChatGPT", "icon": "💬", "url": "/categories/chatgpt", "projects_count": 0}
                        ],
                        "商业运营": [
                            {"name": "产品", "icon": "📱", "url": "/categories/product", "projects_count": 0},
                            {"name": "职场", "icon": "💼", "url": "/categories/workplace", "projects_count": 0},
                            {"name": "运营", "icon": "📊", "url": "/categories/operation", "projects_count": 0}
                        ],
                        "创意设计": [
                            {"name": "设计", "icon": "🎨", "url": "/categories/design", "projects_count": 0},
                            {"name": "小红书", "icon": "📝", "url": "/categories/redbook", "projects_count": 0}
                        ],
                        "学习成长": [
                            {"name": "心理", "icon": "🧠", "url": "/categories/psychology", "projects_count": 0}
                        ],
                        "其他": [
                            {"name": "创业", "icon": "📂", "url": "/categories/startbus", "projects_count": 0}
                        ]
                    }
                };
            }
            
            // 确保DOM已加载
            console.log('📄 检查DOM状态:', document.readyState);
            if (document.readyState === 'loading') {
                console.log('⏳ DOM还在加载中，添加DOMContentLoaded监听器');
                document.addEventListener('DOMContentLoaded', () => {
                    console.log('📄 DOM已加载完成，开始创建悬浮菜单');
                    createFloatingMenu(categoriesData);
                });
            } else {
                console.log('✅ DOM已加载完成，直接创建悬浮菜单');
                createFloatingMenu(categoriesData);
            }
        } catch (error) {
            console.error('❌ 初始化悬浮菜单失败:', error);
            debugIndicator.style.background = 'red';
            debugIndicator.innerHTML = '❌ 初始化失败: ' + error.message;
        }
    }

    // 启动组件
    console.log('🚀 启动悬浮菜单组件...');
    init();
    console.log('✅ 悬浮菜单脚本执行完成');
})();