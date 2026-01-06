/**
 * 前端域名授权检测器 - 双模式监测
 * 支持远程服务器检测和本地JS文件检测
 * 包含定时触发和多埋点机制
 */

class DomainAuthMonitor {
    constructor() {
        const currentHost = window.location.hostname;
        const protocol = window.location.protocol;
        
        this.backendUrls = [
            `${protocol}//localhost:5000`,
            `${protocol}//127.0.0.1:5000`,
            `${protocol}//${currentHost}`,
            `${protocol}//check.${currentHost}`
        ];
        
        this.checkIntervals = [2, 3, 4]; // 每天2、3、4点检测
        this.lastCheckTime = 0;
        this.checkCooldown = 30 * 60 * 1000; // 30分钟冷却时间
        
        this.remoteTimeout = 5000; // 远程检测超时5秒
        this.localTimeout = 1000;  // 本地检测超时1秒
        
        this.isMonitoring = false;
        this.currentMode = 'remote'; // remote | local
        
        this.unauthorizedMessage = `网站正版数据来源 ${window.location.hostname}，请授权再使用。`;
        this.defaultAffiliateCode = 'e089f22f-05ee-495e-b8f1-261651e48aba';
        
        this.buriedPoints = [
            'pageLoad', 'scroll', 'click', 'mouseMove', 'formSubmit', 
            'ajaxComplete', 'beforeUnload', 'visibilityChange'
        ];
        
        this.triggerThreshold = 3; // 至少触发3个埋点才执行检测
        this.triggeredPoints = new Set();
        
        this.init();
    }

    init() {
        this.setupBuriedPoints();
        this.startTimer();
        this.checkAuthorization();
        console.log('域名授权检测器初始化完成');
    }

    /**
     * 设置多处埋点（优化版，减少性能影响）
     */
    setupBuriedPoints() {
        // 只保留关键埋点，移除频繁事件监听
        
        // 页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.triggerBuriedPoint('pageLoad');
            });
        } else {
            this.triggerBuriedPoint('pageLoad');
        }

        // 滚动事件（大幅降低频率）
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.triggerBuriedPoint('scroll');
            }, 5000); // 增加到5秒
        });

        // 移除频繁的点击和鼠标移动监听，避免干扰正常交互
        // 点击事件由业务逻辑处理，不在这里监控

        // 表单提交
        document.addEventListener('submit', (e) => {
            this.triggerBuriedPoint('formSubmit');
        });

        // AJAX完成（监控XMLHttpRequest和fetch）
        this.interceptAjax();

        // 页面卸载前
        window.addEventListener('beforeunload', () => {
            this.triggerBuriedPoint('beforeUnload');
        });

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            this.triggerBuriedPoint('visibilityChange');
        });
    }

    /**
     * 拦截AJAX请求
     */
    interceptAjax() {
        const originalXHR = window.XMLHttpRequest;
        const self = this;
        
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalSend = xhr.send;
            
            xhr.send = function() {
                xhr.addEventListener('loadend', () => {
                    self.triggerBuriedPoint('ajaxComplete');
                });
                return originalSend.apply(xhr, arguments);
            };
            
            return xhr;
        };

        const originalFetch = window.fetch;
        window.fetch = function() {
            return originalFetch.apply(this, arguments).finally(() => {
                self.triggerBuriedPoint('ajaxComplete');
            });
        };
    }

    /**
     * 触发埋点
     */
    triggerBuriedPoint(pointName) {
        this.triggeredPoints.add(pointName);
        
        console.log(`埋点触发: ${pointName}, 已触发: ${Array.from(this.triggeredPoints).join(',')}`);
        
        // 当触发足够数量的埋点时，执行检测
        if (this.triggeredPoints.size >= this.triggerThreshold) {
            this.checkAuthorization();
        }
    }

    /**
     * 启动定时器（每天2、3、4点检测）
     */
    startTimer() {
        const checkScheduledTimes = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // 检查是否在指定的小时（2、3、4点）
            if (this.checkIntervals.includes(currentHour) && currentMinute === 0) {
                console.log(`定时检测触发: ${currentHour}:${currentMinute}`);
                this.checkAuthorization();
            }
        };

        // 每分钟检查一次
        setInterval(checkScheduledTimes, 60000);
        
        // 立即检查一次
        checkScheduledTimes();
    }

    /**
     * 检查授权状态
     */
    async checkAuthorization() {
        const now = Date.now();
        if (now - this.lastCheckTime < this.checkCooldown) {
            console.log('检测冷却中，跳过本次检测');
            return;
        }

        this.lastCheckTime = now;
        console.log('开始授权检测...');

        // 先尝试远程检测
        const remoteResult = await this.checkRemoteAuthorization();
        
        if (remoteResult.success) {
            this.handleAuthorizationResult(remoteResult.authorized);
        } else {
            console.log('远程检测失败，切换到本地检测');
            this.currentMode = 'local';
            
            // 使用本地检测
            if (window.localAuthChecker) {
                const localResult = window.localAuthChecker.checkLocalAuthorization();
                this.handleAuthorizationResult(localResult.authorized);
            } else {
                console.warn('本地授权检测器未加载');
                this.handleAuthorizationResult(false);
            }
        }
    }

    /**
     * 远程授权检测
     */
    async checkRemoteAuthorization() {
        for (let baseUrl of this.backendUrls) {
            try {
                console.log(`尝试远程检测: ${baseUrl}`);
                
                const response = await this.fetchWithTimeout(
                    `${baseUrl}/api/check-domain-auth?domain=${encodeURIComponent(window.location.hostname)}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: this.remoteTimeout
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log(`远程检测成功: ${baseUrl}`, data);
                    
                    return {
                        success: true,
                        authorized: data.authorized || false,
                        mode: 'remote',
                        server: baseUrl
                    };
                }
            } catch (error) {
                console.warn(`远程检测失败: ${baseUrl}`, error.message);
                continue;
            }
        }
        
        return {
            success: false,
            authorized: false,
            mode: 'remote'
        };
    }

    /**
     * 处理授权检测结果
     */
    handleAuthorizationResult(authorized) {
        console.log(`授权检测结果: ${authorized ? '已授权' : '未授权'} (${this.currentMode}模式)`);
        
        if (authorized) {
            this.hideUnauthorizedWarning();
            this.updateAffiliateCode(true);
        } else {
            this.showUnauthorizedWarning();
            this.updateAffiliateCode(false);
        }
    }

    /**
     * 显示未授权警告
     */
    showUnauthorizedWarning() {
        // 如果本地检测器可用，使用它的警告样式
        if (window.localAuthChecker) {
            window.localAuthChecker.showUnauthorizedWarning();
        } else {
            // 简单的警告
            const warning = document.createElement('div');
            warning.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: #ff6b6b;
                color: white;
                padding: 10px;
                text-align: center;
                z-index: 999999;
                font-size: 14px;
            `;
            warning.innerHTML = `
                ${this.unauthorizedMessage}
                <button onclick="this.parentElement.remove()" style="margin-left: 10px; padding: 2px 8px; background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer;">×</button>
            `;
            document.body.insertBefore(warning, document.body.firstChild);
        }
    }

    /**
     * 隐藏未授权警告
     */
    hideUnauthorizedWarning() {
        if (window.localAuthChecker) {
            window.localAuthChecker.hideUnauthorizedWarning();
        } else {
            const warning = document.querySelector('div[style*="background: #ff6b6b"]');
            if (warning) warning.remove();
        }
    }

    /**
     * 更新推广码
     */
    updateAffiliateCode(authorized) {
        const affiliateCode = authorized ? null : this.defaultAffiliateCode;
        
        // 更新所有需要的地方
        this.updateProjectDetailAffiliateCode(affiliateCode);
        
        // 触发事件，让其他组件知道授权状态变化
        window.dispatchEvent(new CustomEvent('authorizationChanged', {
            detail: { authorized, affiliateCode }
        }));
    }

    /**
     * 更新project_detail.html中的affiliate_code
     */
    updateProjectDetailAffiliateCode(affiliateCode) {
        // 更新所有包含affiliate_code的元素或属性（但不更新按钮文字）
        const elements = document.querySelectorAll('[data-affiliate-code]');
        
        elements.forEach(element => {
            // 跳过按钮和其他具有固定文字的元素，只更新属性
            const isButton = element.tagName === 'BUTTON' || 
                           element.tagName === 'A' || 
                           element.classList.contains('btn') ||
                           element.classList.contains('share-btn');
            
            if (!isButton) {
                if (affiliateCode) {
                    element.setAttribute('data-affiliate-code', affiliateCode);
                    element.textContent = affiliateCode;
                } else {
                    // 恢复默认值
                    element.setAttribute('data-affiliate-code', element.getAttribute('data-default-code') || '');
                    element.textContent = element.getAttribute('data-default-code') || '';
                }
            } else {
                // 对于按钮，只更新data-affiliate-code属性，保持原有文字
                if (affiliateCode) {
                    element.setAttribute('data-affiliate-code', affiliateCode);
                } else {
                    element.setAttribute('data-affiliate-code', element.getAttribute('data-default-code') || '');
                }
            }
        });

        // 更新URL中的refer参数
        const links = document.querySelectorAll('a[href*="refer="]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (affiliateCode) {
                link.setAttribute('href', href.replace(/refer=[^&]*/, `refer=${affiliateCode}`));
            } else {
                // 恢复默认refer参数
                const defaultCode = link.getAttribute('data-default-code') || 'e089f22f-05ee-495e-b8f1-261651e48aba';
                link.setAttribute('href', href.replace(/refer=[^&]*/, `refer=${defaultCode}`));
            }
        });
    }

    /**
     * 带超时的fetch
     */
    fetchWithTimeout(url, options = {}) {
        const { timeout = 5000, ...fetchOptions } = options;
        
        return Promise.race([
            fetch(url, fetchOptions),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }

    /**
     * 获取当前状态
     */
    getStatus() {
        return {
            monitoring: this.isMonitoring,
            mode: this.currentMode,
            triggeredPoints: Array.from(this.triggeredPoints),
            lastCheckTime: this.lastCheckTime,
            currentDomain: window.location.hostname
        };
    }
}

// 初始化检测器
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.domainAuthMonitor = new DomainAuthMonitor();
    });
} else {
    window.domainAuthMonitor = new DomainAuthMonitor();
}