/**
 * 本地授权检测模块
 * 用于在前端离线状态下验证域名授权
 * 包含加密的授权域名清单
 */

class LocalAuthChecker {
    constructor() {
        // 默认授权域名（加密存储）- 从 authorized-domains.js 加载
        this.encryptedDomains = window.authorizedDomains || [];
        this.defaultAffiliateCode = 'e089f22f-05ee-495e-b8f1-261651e48aba';
        this.unauthorizedMessage = `
        <div id="unauthorized-warning" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 999999;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            backdrop-filter: blur(10px);
        ">
            网站正版数据来源 <a href="https://xmdtyz.com/" style="color: #fff; text-decoration: underline; font-weight: bold;" target="_blank">xmdtyz.com</a>，请授权再使用。
            <button onclick="document.getElementById('unauthorized-warning').remove()" style="
                margin-left: 15px;
                padding: 6px 12px;
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">×</button>
        </div>
        `;
    }

    /**
     * 设置加密的域名清单
     * @param {Array} encryptedDomains - 加密后的域名数组
     */
    setEncryptedDomains(encryptedDomains) {
        this.encryptedDomains = encryptedDomains;
        window.authorizedDomains = encryptedDomains;
    }

    /**
     * 简单的域名加密（Base64 + 简单混淆）
     * @param {string} domain - 域名
     * @returns {string} 加密后的域名
     */
    encryptDomain(domain) {
        // Base64编码 + 简单混淆
        const base64 = btoa(domain);
        const scrambled = base64.split('').reverse().join('');
        return scrambled + Math.random().toString(36).substring(2, 6);
    }

    /**
     * 简单的域名解密
     * @param {string} encryptedDomain - 加密后的域名
     * @returns {string} 解密后的域名
     */
    decryptDomain(encryptedDomain) {
        try {
            // 移除随机后缀
            const scrambled = encryptedDomain.substring(0, encryptedDomain.length - 4);
            const base64 = scrambled.split('').reverse().join('');
            return atob(base64);
        } catch (e) {
            return null;
        }
    }

    /**
     * 检查当前域名是否在授权清单中
     * @param {string} domain - 要检查的域名
     * @returns {boolean} 是否授权
     */
    isDomainAuthorized(domain) {
        if (!domain) return false;
        
        const currentDomain = domain.toLowerCase().trim();
        
        // 解密并检查每个域名
        for (let encryptedDomain of this.encryptedDomains) {
            const decryptedDomain = this.decryptDomain(encryptedDomain);
            if (decryptedDomain) {
                // 精确匹配
                if (decryptedDomain === currentDomain) {
                    return true;
                }
                
                // 通配符匹配 (*.domain.com)
                if (decryptedDomain.startsWith('*.')) {
                    const baseDomain = decryptedDomain.substring(2);
                    if (currentDomain.endsWith(baseDomain)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    /**
     * 获取当前域名
     * @returns {string} 当前域名
     */
    getCurrentDomain() {
        try {
            return window.location.hostname;
        } catch (e) {
            return 'unknown';
        }
    }

    /**
     * 执行本地授权检测
     * @returns {Object} 检测结果
     */
    checkLocalAuthorization() {
        const currentDomain = this.getCurrentDomain();
        const isAuthorized = this.isDomainAuthorized(currentDomain);
        
        console.log('本地授权检测:', {
            domain: currentDomain,
            authorized: isAuthorized,
            totalDomains: this.encryptedDomains.length
        });
        
        return {
            authorized: isAuthorized,
            domain: currentDomain,
            message: isAuthorized ? '域名已授权' : '域名未授权'
        };
    }

    /**
     * 显示未授权警告
     */
    showUnauthorizedWarning() {
        if (document.getElementById('unauthorized-warning')) {
            return; // 已存在
        }
        
        const warningDiv = document.createElement('div');
        warningDiv.innerHTML = this.unauthorizedMessage;
        document.body.insertBefore(warningDiv.firstElementChild, document.body.firstChild);
        
        console.warn('本地授权检测：显示未授权警告');
    }

    /**
     * 隐藏未授权警告
     */
    hideUnauthorizedWarning() {
        const warningElement = document.getElementById('unauthorized-warning');
        if (warningElement) {
            warningElement.remove();
        }
        console.log('本地授权检测：隐藏授权警告');
    }

    /**
     * 获取未授权情况下的默认推广码
     * @returns {string} 默认推广码
     */
    getDefaultAffiliateCode() {
        return this.defaultAffiliateCode;
    }
}

// 创建全局实例
window.localAuthChecker = new LocalAuthChecker();

// 导出给外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalAuthChecker;
}