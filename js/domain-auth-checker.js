/**
 * 前端授权检测功能
 * 用于检测当前部署的域名是否为授权域名
 */

class DomainAuthChecker {
    constructor() {
        this.checkInterval = null;
        this.unauthorizedMessage = `
            <div id="unauthorized-warning" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(45deg, #ff4444, #ff6666);
                color: white;
                padding: 15px;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(255, 68, 68, 0.3);
                animation: pulse 2s infinite;
            ">
                网站正版数据来源 <a href="https://xmdtyz.com/" style="color: #fff; text-decoration: underline; font-weight: bold;" target="_blank">xmdtyz.com</a>，请授权再使用。
                <button onclick="document.getElementById('unauthorized-warning').remove()" style="
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 5px;
                ">×</button>
            </div>
            <style>
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                body { margin-top: 60px !important; }
            </style>
        `;
        this.init();
    }

    init() {
        // 页面加载时立即检测
        this.checkAuthorization();
        
        // 设置定时检测（每分钟检查一次）
        this.checkInterval = setInterval(() => {
            this.checkAuthorization();
        }, 60000); // 1分钟检查一次
        
        // 页面可见性变化时检测
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkAuthorization();
            }
        });
        
        // 窗口焦点变化时检测
        window.addEventListener('focus', () => {
            this.checkAuthorization();
        });
    }

    async checkAuthorization() {
        try {
            // 获取当前域名
            const currentDomain = window.location.hostname;
            console.log('检查域名授权状态:', currentDomain);
            
            // 调用后端API检测授权
            const response = await fetch(`/api/check-domain-auth?domain=${encodeURIComponent(currentDomain)}`);
            
            if (!response.ok) {
                console.warn('授权检测API响应异常:', response.status);
                return;
            }
            
            const result = await response.json();
            console.log('授权检测结果:', result);
            
            if (!result.authorized) {
                this.showUnauthorizedWarning();
            } else {
                this.hideUnauthorizedWarning();
            }
            
        } catch (error) {
            console.error('授权检测失败:', error);
            // 网络错误时，可以选择显示警告或静默处理
            // 这里选择静默处理，避免误报
        }
    }

    showUnauthorizedWarning() {
        // 检查是否已经显示过警告
        if (document.getElementById('unauthorized-warning')) {
            return;
        }
        
        // 动态插入警告内容
        const warningDiv = document.createElement('div');
        warningDiv.innerHTML = this.unauthorizedMessage;
        document.body.appendChild(warningDiv);
        
        // 调整页面布局，避免内容被遮挡
        document.body.style.paddingTop = '60px';
        
        // 记录到控制台
        console.warn('检测到未授权域名，已显示授权警告');
    }

    hideUnauthorizedWarning() {
        const warningElement = document.getElementById('unauthorized-warning');
        if (warningElement) {
            warningElement.remove();
            document.body.style.paddingTop = '';
            console.log('域名授权正常');
        }
    }

    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        this.hideUnauthorizedWarning();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 创建全局实例
    window.domainAuthChecker = new DomainAuthChecker();
});

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    if (window.domainAuthChecker) {
        window.domainAuthChecker.destroy();
    }
});

// 导出给其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DomainAuthChecker;
}