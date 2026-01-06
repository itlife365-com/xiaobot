/**
 * 悬浮分类菜单组件 - 最终版本
 * 功能完整，包含分类数据加载、用户交互和响应式设计
 */
(function() {
    'use strict';

    // 配置对象
    const CONFIG = {
        DEBUG: false,                   // 关闭调试模式
        AUTO_EXPAND: true,              // 默认展开
        ANIMATION_DURATION: 300,        // 动画持续时间
        Z_INDEX: 9999,                  // 层级
        CATEGORIES_API: '/api/categories', // 分类数据API - 指向后台数据库
        FALLBACK_CATEGORIES: [          // 备用分类数据
            { name: "AI", icon: "🤖", count: 70, slug: "ai" },
            { name: "指南", icon: "📖", count: 50, slug: "guide" },
            { name: "产品", icon: "📱", count: 47, slug: "product" },
            { name: "职场", icon: "💼", count: 45, slug: "workplace" },
            { name: "案例库", icon: "📚", count: 38, slug: "caselibrary" },
            { name: "阅读", icon: "📚", count: 34, slug: "reading" },
            { name: "ChatGPT", icon: "🤖", count: 31, slug: "chatgpt" },
            { name: "生活", icon: "🌟", count: 28, slug: "life" },
            { name: "小红书", icon: "📖", count: 28, slug: "redbook" },
            { name: "创业", icon: "🚀", count: 20, slug: "startbus" },
            { name: "技术", icon: "💻", count: 20, slug: "tech" },
            { name: "运营", icon: "⚙️", count: 17, slug: "operation" },
            { name: "商业", icon: "📊", count: 16, slug: "business" },
            { name: "项目", icon: "📋", count: 12, slug: "project" },
            { name: "笔记", icon: "📝", count: 11, slug: "note" },
            { name: "副业", icon: "💰", count: 9, slug: "sidehustle" },
            { name: "互联网", icon: "🌐", count: 8, slug: "Internet" },
            { name: "Midjourney", icon: "🎨", count: 8, slug: "midjourney" },
            { name: "心理", icon: "🧠", count: 7, slug: "psychology" },
            { name: "设计", icon: "🎨", count: 6, slug: "design" },
            { name: "工具", icon: "🔧", count: 4, slug: "tool" },
            { name: "创作", icon: "✍️", count: 3, slug: "creation" },
            { name: "播客", icon: "🎧", count: 3, slug: "podcast" }
        ]
    };

    // 状态对象
    let state = {
        isExpanded: false,
        categories: [],
        isLoading: false,
        debugMode: CONFIG.DEBUG
    };

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

    // 加载分类数据
    async function loadCategories() {
        try {
            state.isLoading = true;
            
            const response = await fetch(CONFIG.CATEGORIES_API);
            
            if (response.ok) {
                const data = await response.json();
                state.categories = data.categories || data;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ 分类数据加载失败，使用备用数据:', error);
            state.categories = CONFIG.FALLBACK_CATEGORIES;
        } finally {
            state.isLoading = false;
        }
    }

    // 创建悬浮菜单HTML
    function createFloatingMenuHTML() {
        const menuHTML = `
            <div class="floating-category-menu" id="floatingCategoryMenu">
                <!-- 悬浮按钮 -->
                <div class="floating-btn" id="floatingBtn">
                    <svg class="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="menu-text">分类</span>
                    <span class="category-count" id="categoryCount">0</span>
                </div>
                
                <!-- 下拉菜单 -->
                <div class="category-dropdown" id="categoryDropdown">
                    <div class="dropdown-header">
                        <h3>项目分类</h3>
                        <button class="close-btn" id="closeBtn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="category-grid" id="categoryGrid">
                        ${createCategoryItemsHTML()}
                    </div>
                    
                    <div class="dropdown-footer">
                        <small>共 <span id="totalCount">0</span> 个项目</small>
                    </div>
                </div>
            </div>
            
            <!-- 遮罩层 -->
            <div class="dropdown-overlay" id="dropdownOverlay"></div>
        `;

        document.body.insertAdjacentHTML('beforeend', menuHTML);
    }

    // 创建分类项目HTML
    function createCategoryItemsHTML() {
        if (!state.categories.length) {
            return '<div class="no-categories">暂无分类数据</div>';
        }

        return state.categories.map(category => `
            <a href="/categories/?category=${category.slug}" class="category-item" data-slug="${category.slug}">
                <span class="category-icon">${category.icon}</span>
                <span class="category-name">${category.name}</span>
                <span class="category-count">${category.count}</span>
            </a>
        `).join('');
    }

    // 添加样式
    function addFloatingMenuStyles() {
        const style = document.createElement('style');
        style.id = 'floatingMenuStyles';
        style.textContent = `
            .floating-category-menu {
                position: fixed;
                bottom: 30px;
                left: 30px;
                z-index: ${CONFIG.Z_INDEX};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }

            .floating-btn {
                width: 140px;
                height: 56px;
                background: linear-gradient(135deg, #007bff, #0056b3);
                border-radius: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 123, 255, 0.4);
                transition: all ${CONFIG.ANIMATION_DURATION}ms ease;
                border: none;
                font-size: 14px;
                font-weight: 600;
                position: relative;
                overflow: hidden;
            }

            .floating-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 30px rgba(0, 123, 255, 0.6);
            }

            .floating-btn.active {
                background: linear-gradient(135deg, #dc3545, #c82333);
            }

            .floating-btn.active .menu-icon {
                transform: rotate(45deg);
            }

            .menu-icon {
                transition: transform ${CONFIG.ANIMATION_DURATION}ms ease;
            }

            .category-count {
                background: rgba(255, 255, 255, 0.2);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 700;
            }

            .category-dropdown {
                position: absolute;
                bottom: 70px;
                left: 0;
                width: 360px;
                max-height: 500px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px) scale(0.95);
                transition: all ${CONFIG.ANIMATION_DURATION}ms ease;
                overflow: hidden;
                border: 1px solid rgba(0, 0, 0, 0.1);
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
                padding: 24px;
                border-bottom: 1px solid #f0f0f0;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            }

            .dropdown-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 700;
                color: #333;
            }

            .close-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.2s ease;
                color: #666;
            }

            .close-btn:hover {
                background-color: rgba(0, 0, 0, 0.1);
                color: #333;
            }

            .category-grid {
                padding: 20px;
                max-height: 350px;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: #007bff #f1f1f1;
            }

            .category-grid::-webkit-scrollbar {
                width: 6px;
            }

            .category-grid::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }

            .category-grid::-webkit-scrollbar-thumb {
                background: #007bff;
                border-radius: 3px;
            }

            .category-grid::-webkit-scrollbar-thumb:hover {
                background: #0056b3;
            }

            .category-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                margin-bottom: 8px;
                background: white;
                border-radius: 12px;
                text-decoration: none;
                color: #333;
                transition: all 0.2s ease;
                border: 1px solid transparent;
            }

            .category-item:last-child {
                margin-bottom: 0;
            }

            .category-item:hover {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                transform: translateX(4px);
                border-color: #007bff;
                box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
            }

            .category-icon {
                font-size: 18px;
                width: 24px;
                text-align: center;
            }

            .category-name {
                flex: 1;
                font-weight: 500;
                font-size: 14px;
            }

            .category-count {
                background: linear-gradient(135deg, #007bff, #0056b3);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                min-width: 24px;
                text-align: center;
            }

            .dropdown-footer {
                padding: 16px 24px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
                text-align: center;
            }

            .dropdown-footer small {
                color: #6c757d;
                font-size: 12px;
            }

            .dropdown-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.1);
                z-index: ${CONFIG.Z_INDEX - 1};
                opacity: 0;
                visibility: hidden;
                transition: all ${CONFIG.ANIMATION_DURATION}ms ease;
            }

            .dropdown-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            .no-categories {
                text-align: center;
                padding: 40px 20px;
                color: #6c757d;
                font-size: 14px;
            }

            /* 响应式设计 */
            @media (max-width: 768px) {
                .floating-category-menu {
                    bottom: 20px;
                    left: 20px;
                }

                .floating-btn {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                }

                .floating-btn .menu-text {
                    display: none;
                }

                .category-dropdown {
                    width: calc(100vw - 40px);
                    left: -10px;
                    bottom: 70px;
                }
            }

            @media (max-width: 480px) {
                .floating-category-menu {
                    bottom: 15px;
                    left: 15px;
                }

                .floating-btn {
                    width: 50px;
                    height: 50px;
                }

                .category-dropdown {
                    width: calc(100vw - 30px);
                    max-height: 60vh;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // 初始化事件监听
    function initEventListeners() {
        const floatingBtn = document.getElementById('floatingBtn');
        const categoryDropdown = document.getElementById('categoryDropdown');
        const closeBtn = document.getElementById('closeBtn');
        const dropdownOverlay = document.getElementById('dropdownOverlay');

        // 点击悬浮按钮切换菜单
        floatingBtn.addEventListener('click', toggleMenu);

        // 点击关闭按钮
        closeBtn.addEventListener('click', closeMenu);

        // 点击遮罩层关闭菜单
        dropdownOverlay.addEventListener('click', closeMenu);

        // 监听分类点击事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-item')) {
                e.preventDefault();
                
                // 从href链接中提取分类名称
                const href = e.target.getAttribute('href');
                const slugMatch = href.match(/\/categories\/([^\/\?]+)/);
                const slug = slugMatch ? slugMatch[1] : null;
                
                if (slug) {
                    console.log(`🎯 选择了分类: ${slug}`);
                    
                    // 执行页面导航
                    window.location.href = `/categories/${slug}`;
                    
                    closeMenu();
                }
            }
        });

        // ESC键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isExpanded) {
                closeMenu();
            }
        });
    }

    // 切换菜单状态
    function toggleMenu() {
        if (state.isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // 打开菜单
    function openMenu() {
        const floatingBtn = document.getElementById('floatingBtn');
        const categoryDropdown = document.getElementById('categoryDropdown');
        const dropdownOverlay = document.getElementById('dropdownOverlay');

        floatingBtn.classList.add('active');
        categoryDropdown.classList.add('show');
        dropdownOverlay.classList.add('show');
        state.isExpanded = true;
    }

    // 关闭菜单
    function closeMenu() {
        const floatingBtn = document.getElementById('floatingBtn');
        const categoryDropdown = document.getElementById('categoryDropdown');
        const dropdownOverlay = document.getElementById('dropdownOverlay');

        floatingBtn.classList.remove('active');
        categoryDropdown.classList.remove('show');
        dropdownOverlay.classList.remove('show');
        state.isExpanded = false;
    }

    // 更新UI
    function updateUI() {
        const categoryCount = document.getElementById('categoryCount');
        const totalCount = document.getElementById('totalCount');

        const totalItems = state.categories.reduce((sum, cat) => sum + (cat.count || 0), 0);
        
        if (categoryCount) {
            categoryCount.textContent = state.categories.length;
        }
        
        if (totalCount) {
            totalCount.textContent = totalItems;
        }

        console.log(`📊 UI更新: ${state.categories.length} 个分类, ${totalItems} 个项目`);
    }

    // 主初始化函数
    async function init() {
        try {
            // 等待DOM准备就绪
            await waitForDOM();

            // 加载分类数据
            await loadCategories();

            // 创建HTML结构
            createFloatingMenuHTML();

            // 添加样式
            addFloatingMenuStyles();

            // 更新UI
            updateUI();

            // 初始化事件监听
            initEventListeners();

            // 默认展开（如果配置允许）
            if (CONFIG.AUTO_EXPAND) {
                setTimeout(() => {
                    openMenu();
                    // 移除自动收起逻辑，保持菜单展开状态
                }, 1000);
            }

            console.log('🎉 悬浮菜单初始化完成！');

        } catch (error) {
            console.error('❌ 悬浮菜单初始化失败:', error);
        }
    }

    // 启动初始化
    init();

    // 暴露全局接口（可选）
    window.FloatingCategoryMenu = {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu,
        state: state,
        config: CONFIG
    };

})();