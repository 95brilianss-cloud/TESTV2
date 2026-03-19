// ============================================
// TURBINE LOGSHEET PRO - VERSION 1.6.0
// Feature: Google Drive Photo Upload for Logsheet
// ============================================

const APP_VERSION = '1.6.0';
const APP_NAME = 'Turbine Logsheet Pro';

const AUTH_CONFIG = {
    SESSION_KEY: 'turbine_session',
    USER_KEY: 'turbine_user',
    USERS_CACHE_KEY: 'turbine_users_cache',
    SESSION_DURATION: 8 * 60 * 60 * 1000,
    REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000
};

const DRAFT_KEYS = {
    LOGSHEET: 'draft_turbine',
    LOGSHEET_BACKUP: 'draft_turbine_backup',
    BALANCING: 'balancing_draft',
    TPM_OFFLINE: 'tpm_offline',
    LOGSHEET_OFFLINE: 'offline_logsheets',
    BALANCING_OFFLINE: 'balancing_offline',
    TPM_HISTORY: 'tpm_history',
    BALANCING_HISTORY: 'balancing_history'
};

const DRAFT_KEYS_CT = {
    LOGSHEET: 'draft_ct_logsheet',
    OFFLINE: 'offline_ct_logsheets'
};

// GAS URL - PASTIKAN SUDAH UPDATE SCRIPT UNTUK HANDLE UPLOAD DRIVE
const GAS_URL = "https://script.google.com/macros/s/AKfycbxsbKon3vlsHlaFOb4NR_li801XtGSMMzamGZnVokF6FxvJULlDLkbvspRmPa_9yw2i/exec";

const OFFLINE_USERS = {
    'admin': { password: 'admin123', role: 'admin', name: 'Administrator', department: 'Unit Utilitas 3B' },
    'operator': { password: 'operator123', role: 'operator', name: 'Operator Shift', department: 'Unit Utilitas 3B' },
    'utilitas3b': { password: 'pgresik2024', role: 'operator', name: 'Unit Utilitas 3B', department: 'Unit Utilitas 3B' }
};

const BALANCING_FIELDS = [
    'balancingDate', 'balancingTime',
    'loadMW', 'eksporMW',
    'plnMW', 'ubbMW', 'pieMW', 'tg65MW', 'tg66MW', 'gtgMW',
    'ss6500MW', 'ss2000Via', 'activePowerMW', 'reactivePowerMVAR', 
    'currentS', 'voltageV', 'hvs65l02MW', 'hvs65l02Current', 'total3BMW',
    'fq1105',
    'stgSteam', 'pa2Steam', 'puri2Steam', 'melterSA2', 
    'ejectorSteam', 'glandSealSteam', 'deaeratorSteam', 
    'dumpCondenser', 'pcv6105',
    'pi6122', 'ti6112', 'ti6146', 'ti6126', 
    'axialDisplacement', 'vi6102', 'te6134',
    'ctSuFan', 'ctSuPompa', 'ctSaFan', 'ctSaPompa',
    'kegiatanShift'
];

// ============================================
// 2. DATA STRUKTUR AREA
// ============================================

const AREAS = {
    "Steam Inlet Turbine": [
        "MPS Inlet 30-TP-6101 PI-6114 (kg/cm2)", 
        "MPS Inlet 30-TP-6101 TI-6153 (°C)", 
        "MPS Inlet 30-TP-6101 PI-6116 (kg/cm2)", 
        "LPS Extrac 30-TP-6101 PI-6123 (kg/cm2)", 
        "Gland Steam TI-6156 (°C)", 
        "MPS Inlet 30-TP-6101 PI-6108 (Kg/cm2)", 
        "Exhaust Steam PI-6111 (kg/cm2)", 
        "Gland Steam PI-6118 (Kg/cm2)"
    ],
    "Low Pressure Steam": [
        "LPS from U-6101 PI-6104 (kg/cm2)", 
        "LPS from U-6101 TI-6102 (°C)", 
        "LPS Header PI-6106 (Kg/cm2)", 
        "LPS Header TI-6107 (°C)"
    ],
    "Lube Oil": [
        "Lube Oil 30-TK-6102 LI-6104 (%)", 
        "Lube Oil 30-TK-6102 TI-6125 (°C)", 
        "Lube Oil 30-C-6101 (On/Off)", 
        "Lube Oil 30-EH-6102 (On/Off)", 
        "Lube Oil Cartridge FI-6143 (%)", 
        "Lube Oil Cartridge PI-6148 (mmH2O)", 
        "Lube Oil Cartridge PI-6149 (mmH2O)", 
        "Lube Oil PI-6145 (kg/cm2)", 
        "Lube Oil E-6104 (A/B)", 
        "Lube Oil TI-6127 (°C)", 
        "Lube Oil FIL-6101 (A/B)", 
        "Lube Oil PDI-6146 (Kg/cm2)", 
        "Lube Oil PI-6143 (Kg/cm2)", 
        "Lube Oil TI-6144 (°C)", 
        "Lube Oil TI-6146 (°C)", 
        "Lube Oil TI-6145 (°C)", 
        "Lube Oil FG-6144 (%)", 
        "Lube Oil FG-6146 (%)", 
        "Lube Oil TI-6121 (°C)", 
        "Lube Oil TI-6116 (°C)", 
        "Lube Oil FG-6121 (%)", 
        "Lube Oil FG-6116 (%)"
    ],
    "Control Oil": [
        "Control Oil 30-TK-6103 LI-6106 (%)", 
        "Control Oil 30-TK-6103 TI-6128 (°C)", 
        "Control Oil P-6106 (A/B)", 
        "Control Oil FIL-6103 (A/B)", 
        "Control Oil PI-6152 (Bar)"
    ],
    "Shaft Line": [
        "Jacking Oil 30-P-6105 PI-6158 (Bar)", 
        "Jacking Oil 30-P-6105 PI-6161 (Bar)", 
        "Electrical Turning Gear U-6103 (Remote/Running/Stop)", 
        "EH-6101 (ON/OFF)"
    ],
    "Condenser 30-E-6102": [
        "LG-6102 (%)", 
        "30-P-6101 (A/B)", 
        "30-P-6101 Suction (kg/cm2)", 
        "30-P-6101 Discharge (kg/cm2)", 
        "30-P-6101 Load (Ampere)"
    ],
    "Ejector": [
        "J-6101 PI-6126 A (Kg/cm2)", 
        "J-6101 PI-6127 B (Kg/cm2)", 
        "J-6102 PI-6128 A (Kg/cm2)", 
        "J-6102 PI-6129 B (Kg/cm2)", 
        "J-6104 PI-6131 (Kg/cm2)", 
        "J-6104 PI-6138 (Kg/cm2)", 
        "PI-6172 (kg/cm2)", 
        "LPS Extrac 30-TP-6101 TI-6155 (°C)", 
        "from U-6102 TI-6104 (°C)"
    ],
    "Generator Cooling Water": [
        "Air Cooler PI-6124 A (Kg/cm2)", 
        "Air Cooler PI-6124 B (Kg/cm2)", 
        "Air Cooler TI-6113 A (°C)", 
        "Air Cooler TI-6113 B (°C)", 
        "Air Cooler PI-6125 A (Kg/cm2)", 
        "Air Cooler PI-6125 B (Kg/cm2)", 
        "Air Cooler TI-6114 A (°C)", 
        "Air Cooler TI-6114 B (°C)"
    ],
    "Condenser Cooling Water": [
        "Condenser PI-6135 A (Kg/cm2)", 
        "Condenser PI-6135 B (Kg/cm2)", 
        "Condenser TI-6118 A (°C)", 
        "Condenser TI-6118 B (°C)", 
        "Condenser PI-6136 A (Kg/cm2)", 
        "Condenser PI-6136 B (Kg/cm2)", 
        "Condenser TI-6119 A (°C)", 
        "Condenser TI-6119 B (°C)"
    ],
    "BFW System": [
        "Condensate Tank TK-6201 (%)", 
        "Condensate Tank TI-6216 (°C)", 
        "P-6202 (A/B)", 
        "P-6202 Suction (kg/cm2)", 
        "P-6202 Discharge (kg/cm2)", 
        "P-6202 Load (Ampere)", 
        "Deaerator LI-6202 (%)", 
        "Deaerator TI-6201 (°C)", 
        "30-P-6201 (A/B)", 
        "30-P-6201 Suction (kg/cm2)", 
        "30-P-6201 Discharge (kg/cm2)", 
        "30-P-6201 Load (Ampere)", 
        "30-C-6202 A (ON/OFF)", 
        "30-C-6202 A (Ampere)", 
        "30-C-6202 B (ON/OFF)", 
        "30-C-6202 B (Ampere)", 
        "30-C-6202 PCV-6216 (%)", 
        "30-C-6202 PI-6107 (kg/cm2)", 
        "Condensate Drum 30-D-6201 LI-6209 (%)", 
        "Condensate Drum 30-D-6201 PI-6218 (kg/cm2)", 
        "Condensate Drum 30-D-6201 TI-6215 (°C)"
    ],
    "Chemical Dosing": [
        "30-TK-6205 LI-6204 (%)", 
        "30-TK-6205 30-P-6205 (A/B)", 
        "30-TK-6205 Disch (kg/cm2)", 
        "30-TK-6205 Stroke (%)", 
        "30-TK-6206 LI-6206 (%)", 
        "30-TK-6206 30-P-6206 (A/B)", 
        "30-TK-6206 Disch (kg/cm2)", 
        "30-TK-6206 Stroke (%)", 
        "30-TK-6207 LI-6208 (%)", 
        "30-TK-6207 30-P-6207 (A/B)", 
        "30-TK-6207 Disch (kg/cm2)", 
        "30-TK-6207 Stroke (%)"
    ]
};

const AREAS_CT = {
    "BASIN SA": [
        "D-6511 LEVEL BASIN",
        "D-6511 BLOWDOWN",
        "D-6511 PH BASIN", 
        "D-6511 TRASSAR (A/M)", 
        "TK-6511 LEVEL ACID", 
        "FIL-6511 (A/B)", 
        "30-P-6511 A PRESS (kg/cm2)", 
        "30-P-6511 B PRESS (kg/cm2)", 
        "30-P-6511 C PRESS (kg/cm2)", 
        "MT-6511 A STATUS", 
        "MT-6511 B STATUS", 
        "MT-6511 C STATUS", 
        "MT-6511 D STATUS"
    ], 
    "BASIN SU": [
        "D-6521 LEVEL BASIN",
        "D-6521 BLOWDOWN",
        "D-6521 PH BASIN", 
        "D-6521 TRASSAR (A/M)", 
        "TK-6521 LEVEL ACID", 
        "FIL-6521 (A/B)", 
        "30-P-6521 A PRESS (kg/cm2)", 
        "30-P-6521 B PRESS (kg/cm2)", 
        "30-P-6521 C PRESS (kg/cm2)", 
        "MT-6521 A STATUS", 
        "MT-6521 B STATUS", 
        "MT-6521 C STATUS", 
        "MT-6521 D STATUS"
    ]
};

const INPUT_TYPES = {
    PUMP_STATUS: {
        patterns: ['(A/B)', '(ON/OFF)', '(On/Off)', '(Running/Stop)', '(Remote/Running/Stop)'],
        options: {
            '(A/B)': ['A', 'B'],
            '(ON/OFF)': ['ON', 'OFF'],
            '(On/Off)': ['On', 'Off'],
            '(Running/Stop)': ['Running', 'Stop'],
            '(Remote/Running/Stop)': ['Remote', 'Running', 'Stop']
        }
    }
};

// ============================================
// 3. STATE MANAGEMENT
// ============================================
let lastData = {};
let currentInput = {};
let activeArea = "";
let activeIdx = 0;
let totalParams = 0;
let currentInputType = 'text';
let autoCloseTimer = null;
let currentUser = null;
let isAuthenticated = false;
let usersCache = null;
let activeTPMArea = '';
let currentTPMPhoto = null;
let currentTPMStatus = '';
let currentShift = 3;
let balancingAutoSaveInterval = null;
let uploadProgressInterval = null;
let currentUploadController = null;
let deferredPrompt = null;
let installBannerShown = false;
let pendingSaveAction = null;
let currentParamPhoto = null;
let isUploadingPhoto = false; // Flag untuk mencegah double upload

let lastDataCT = {};
let currentInputCT = {};
let activeAreaCT = "";
let activeIdxCT = 0;
let totalParamsCT = 0;
let currentInputTypeCT = 'text';

// ============================================
// 4. INITIALIZATION
// ============================================

function initState() {
    try {
        const savedDraft = localStorage.getItem(DRAFT_KEYS.LOGSHEET);
        if (savedDraft) currentInput = JSON.parse(savedDraft);
        
        const savedCTDraft = localStorage.getItem(DRAFT_KEYS_CT.LOGSHEET);
        if (savedCTDraft) currentInputCT = JSON.parse(savedCTDraft);
        
        totalParams = Object.values(AREAS).reduce((acc, arr) => acc + arr.length, 0);
        totalParamsCT = Object.values(AREAS_CT).reduce((acc, arr) => acc + arr.length, 0);
    } catch (e) {
        console.error('Error loading state:', e);
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(`./sw.js?v=${APP_VERSION}`)
            .then(registration => {
                console.log('SW registered:', registration.scope);
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateAlert();
                        }
                    });
                });
            })
            .catch(err => console.error('SW registration failed:', err));
            
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data?.type === 'VERSION_CHECK' && event.data.version !== APP_VERSION) {
                showUpdateAlert();
            }
        });
    });
}

// ============================================
// 5. UTILITY FUNCTIONS & COMPRESSION
// ============================================

async function compressImage(base64Image, maxWidth = 1280, quality = 0.8, maxSizeMB = 2.5) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        const timeout = setTimeout(() => {
            reject(new Error('Timeout loading image'));
        }, 10000);
        
        img.onload = function() {
            clearTimeout(timeout);
            
            try {
                if (img.width === 0 || img.height === 0) {
                    reject(new Error('Invalid image dimensions'));
                    return;
                }
                
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = Math.round(height * (maxWidth / width));
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }
                
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                
                let currentQuality = quality;
                let compressed = canvas.toDataURL('image/jpeg', currentQuality);
                const maxBytes = maxSizeMB * 1024 * 1024;
                
                let attempts = 0;
                while (getBase64Size(compressed) > maxBytes && attempts < 5 && currentQuality > 0.3) {
                    currentQuality -= 0.1;
                    compressed = canvas.toDataURL('image/jpeg', currentQuality);
                    attempts++;
                }
                
                if (getBase64Size(compressed) > maxBytes) {
                    reject(new Error('Cannot compress below max size'));
                    return;
                }
                
                resolve(compressed);
                
            } catch (err) {
                reject(err);
            }
        };
        
        img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Failed to load image'));
        };
        
        img.src = base64Image;
    });
}

function getBase64Size(base64String) {
    const base64Length = base64String.split(',')[1].length;
    const padding = (base64String.endsWith('==')) ? 2 : (base64String.endsWith('=')) ? 1 : 0;
    return (base64Length * 0.75) - padding;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Safe Fetch & JSONP
function safeJSONP(url, callbackName, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
        let isResolved = false;
        const cleanup = () => {
            isResolved = true;
            cleanupJSONP(callbackName);
            const scripts = document.querySelectorAll('script');
            scripts.forEach(script => {
                if (script.src && script.src.includes(`callback=${callbackName}`)) {
                    if (script.parentNode) script.remove();
                }
            });
        };
        
        const timeoutId = setTimeout(() => {
            if (!isResolved) {
                cleanup();
                reject(new Error('JSONP Timeout'));
            }
        }, timeoutMs);
        
        window[callbackName] = (response) => {
            if (!isResolved) {
                cleanup();
                clearTimeout(timeoutId);
                resolve(response || { success: true });
            }
        };
        
        const script = document.createElement('script');
        script.src = url;
        script.onerror = () => {
            if (!isResolved) {
                cleanup();
                clearTimeout(timeoutId);
                reject(new Error('Network error'));
            }
        };
        
        setTimeout(() => {
            if (!isResolved) {
                console.warn(`[SafeJSONP] Emergency cleanup for ${callbackName}`);
                cleanup();
                clearTimeout(timeoutId);
                reject(new Error('Emergency timeout'));
            }
        }, timeoutMs + 2000);
        
        document.body.appendChild(script);
    });
}

function emergencyResetUpload() {
    console.log('[Emergency] Resetting upload state...');
    if (uploadProgressInterval) {
        clearInterval(uploadProgressInterval);
        uploadProgressInterval = null;
    }
    currentUploadController = null;
    isUploadingPhoto = false;
    hideUploadProgress();
    showCustomAlert('Sinkronisasi dihentikan. Silakan coba lagi.', 'warning');
}

function cleanupJSONP(callbackName) {
    if (window[callbackName]) {
        try { delete window[callbackName]; } 
        catch (e) { window[callbackName] = undefined; }
    }
}

function showUpdateAlert() {
    const updateAlert = document.getElementById('updateAlert');
    if (updateAlert) updateAlert.classList.remove('hidden');
}

function applyUpdate() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
}

function showCustomAlert(msg, type = 'success') {
    const customAlert = document.getElementById('customAlert');
    const alertContent = document.getElementById('alertContent');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const alertIconWrapper = document.getElementById('alertIconWrapper');
    
    if (!customAlert || !alertContent || !alertTitle || !alertMessage || !alertIconWrapper) {
        alert(msg);
        return;
    }
    
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
    }
    
    const titleMap = {
        'success': 'Berhasil',
        'error': 'Error',
        'warning': 'Peringatan',
        'info': 'Informasi'
    };
    
    alertTitle.textContent = titleMap[type] || 'Informasi';
    alertMessage.innerText = msg;
    alertContent.className = 'alert-content ' + type;
    
    const icons = {
        success: `<div class="alert-icon-bg"></div><svg class="alert-icon-svg" viewBox="0 0 52 52"><circle cx="26" cy="26" r="25"/><path d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>`,
        error: `<div class="alert-icon-bg" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"></div><svg class="alert-icon-svg" viewBox="0 0 52 52" style="stroke: #ef4444"><circle cx="26" cy="26" r="25"/><path d="M16 16 L36 36 M36 16 L16 36"/></svg>`,
        warning: `<div class="alert-icon-bg" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"></div><svg class="alert-icon-svg" viewBox="0 0 52 52" style="stroke: #f59e0b"><circle cx="26" cy="26" r="25"/><path d="M26 10 L26 30 M26 34 L26 38"/></svg>`,
        info: `<div class="alert-icon-bg" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"></div><svg class="alert-icon-svg" viewBox="0 0 52 52" style="stroke: #3b82f6"><circle cx="26" cy="26" r="25"/><path d="M26 10 L26 30 M26 34 L26 36"/></svg>`
    };
    
    alertIconWrapper.innerHTML = icons[type] || icons.info;
    customAlert.classList.remove('hidden');
    
    if (type === 'success' || type === 'info') {
        autoCloseTimer = setTimeout(() => {
            if (!customAlert.classList.contains('hidden')) closeAlert();
        }, 3000);
    }
}

function closeAlert() {
    const customAlert = document.getElementById('customAlert');
    if (customAlert) customAlert.classList.add('hidden');
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
    }
}

function navigateTo(screenId) {
    const protectedScreens = ['homeScreen', 'areaListScreen', 'paramScreen', 'tpmScreen', 'tpmInputScreen', 'balancingScreen', 'ctAreaListScreen', 'ctParamScreen'];
    
    if (protectedScreens.includes(screenId) && !requireAuth()) {
        return;
    }
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        window.scrollTo(0, 0);
        
        if (screenId === 'homeScreen') {
            loadUserStats();
            setTimeout(() => {
                addAdminButton();           
                addChangePasswordButton();  
            }, 100);
        } else if (screenId === 'areaListScreen') {
            fetchLastData();
            updateOverallProgress();
        } else if (screenId === 'balancingScreen') {
            initBalancingScreen();
        } else if (screenId === 'ctAreaListScreen') {
            fetchLastDataCT();
            updateCTOverallProgress();
        }
    }
}

function requireAuth() {
    if (!isAuthenticated || !isSessionValid(getSession())) {
        clearSession();
        showLoginScreen();
        showCustomAlert('Sesi Anda telah berakhir. Silakan login kembali.', 'error');
        return false;
    }
    return true;
}

function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// ============================================
// 6. AUTHENTICATION SYSTEM
// ============================================

function initAuth() {
    const session = getSession();
    
    if (session && isSessionValid(session)) {
        currentUser = session.user;
        isAuthenticated = true;
        updateUIForAuthenticatedUser();
        
        const loginScreen = document.getElementById('loginScreen');
        if (loginScreen && loginScreen.classList.contains('active')) {
            navigateTo('homeScreen');
        }
    } else {
        clearSession();
        showLoginScreen();
    }
    
    loadUsersCache();
}

function isSessionValid(session) {
    if (!session || !session.expiresAt) return false;
    return Date.now() < session.expiresAt;
}

function saveSession(user, rememberMe = false) {
    const duration = rememberMe ? AUTH_CONFIG.REMEMBER_ME_DURATION : AUTH_CONFIG.SESSION_DURATION;
    const session = {
        user: user,
        loginTime: Date.now(),
        expiresAt: Date.now() + duration,
        rememberMe: rememberMe
    };
    
    try {
        localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
    } catch (e) {
        console.error('Error saving session:', e);
    }
}

function getSession() {
    try {
        const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
        return sessionData ? JSON.parse(sessionData) : null;
    } catch (e) {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
}

function showLoginScreen() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.classList.add('active');
    
    const savedUser = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            const usernameInput = document.getElementById('operatorUsername');
            if (usernameInput && user.username) {
                usernameInput.value = user.username;
                document.getElementById('operatorPassword')?.focus();
            }
        } catch (e) {
            console.error('Error parsing saved user:', e);
        }
    }
}

async function loginOperator() {
    const usernameInput = document.getElementById('operatorUsername');
    const passwordInput = document.getElementById('operatorPassword');
    const loginBtn = document.querySelector('#loginScreen .btn-primary');
    
    if (!usernameInput || !passwordInput) return;
    
    const username = String(usernameInput.value).trim().toLowerCase();
    const password = String(passwordInput.value).trim();
    
    if (!username || !password) {
        showLoginError('Username dan password wajib diisi!');
        return;
    }
    
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span>⏳ Memverifikasi...</span>';
    }
    
    hideLoginError();
    
    let onlineSuccess = false;
    
    if (navigator.onLine) {
        try {
            const callbackName = 'loginCallback_' + Date.now();
            const result = await safeJSONP(
                `${GAS_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&callback=${callbackName}`,
                callbackName,
                10000
            );
            
            if (result.success) {
                onlineSuccess = true;
                updateUserCache(username, password, result.user);
                handleLoginSuccess(result.user, username, password, false);
                return;
            }
        } catch (error) {
            console.log('Online login failed, trying offline...', error);
        }
    }
    
    const offlineResult = validateUserOffline(username, password);
    
    if (offlineResult.success) {
        handleLoginSuccess(offlineResult.user, username, password, true);
        showCustomAlert(navigator.onLine ? 'Login offline berhasil!' : 'Login offline (tidak ada koneksi)', navigator.onLine ? 'warning' : 'info');
    } else {
        showLoginError(offlineResult.error || 'Login gagal. Periksa koneksi atau username/password.');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>🔓 Masuk</span>';
        }
    }
}

function validateUserOffline(username, password) {
    username = username.toLowerCase().trim();
    
    const cachedUsers = loadUsersCache();
    if (cachedUsers && cachedUsers[username]) {
        const user = cachedUsers[username];
        if (user.password === password) {
            if (user.status === 'INACTIVE') {
                return { success: false, error: 'User tidak aktif' };
            }
            return { 
                success: true, 
                user: {
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    department: user.department
                }
            };
        }
        return { success: false, error: 'Password salah' };
    }
    
    const legacyUser = OFFLINE_USERS[username];
    if (!legacyUser) {
        return { success: false, error: 'User tidak ditemukan' };
    }
    
    if (legacyUser.password !== password) {
        return { success: false, error: 'Password salah' };
    }
    
    return { 
        success: true, 
        user: {
            username: username,
            name: legacyUser.name,
            role: legacyUser.role,
            department: legacyUser.department
        }
    };
}

function handleLoginSuccess(userData, username, password, isOffline = false) {
    currentUser = {
        username: userData.username,
        name: userData.name,
        role: userData.role,
        department: userData.department,
        id: 'OP-' + Date.now().toString(36).toUpperCase(),
        loginTime: new Date().toISOString(),
        isOffline: isOffline
    };
    
    isAuthenticated = true;
    saveSession(currentUser, false);
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(currentUser));
    
    if (!isOffline) {
        updateUserCache(username, password, userData);
    }
    
    const loginBtn = document.querySelector('#loginScreen .btn-primary');
    if (loginBtn) loginBtn.innerHTML = '<span>✓ Berhasil!</span>';
    
    showCustomAlert(`Selamat datang, ${userData.name}!`, 'success');
    
    setTimeout(() => {
        updateUIForAuthenticatedUser();
        navigateTo('homeScreen');
        
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>🔓 Masuk</span>';
        }
        
        const passwordInput = document.getElementById('operatorPassword');
        if (passwordInput) passwordInput.value = '';
        
        if (!isOffline && userData.role === 'admin') {
            setTimeout(syncUsersForOffline, 2000);
        }
    }, 800);
}

function logoutOperator() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        if (Object.keys(currentInput).length > 0) {
            localStorage.setItem(DRAFT_KEYS.LOGSHEET_BACKUP, JSON.stringify(currentInput));
        }
        
        clearSession();
        currentUser = null;
        isAuthenticated = false;
        
        const usernameInput = document.getElementById('operatorUsername');
        const passwordInput = document.getElementById('operatorPassword');
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';
        
        const adminBtn = document.getElementById('adminPanelBtn');
        if (adminBtn) adminBtn.remove();
        
        const cpBtn = document.getElementById('changePasswordBtn');
        if (cpBtn) cpBtn.remove();
        
        showLoginScreen();
        showCustomAlert('Anda telah keluar dari sistem.', 'success');
    }
}

function updateUserCache(username, password, userData) {
    try {
        let cache = loadUsersCache() || {};
        
        cache[username.toLowerCase()] = {
            username: userData.username || username,
            password: password,
            role: userData.role || 'operator',
            name: userData.name || username,
            department: userData.department || 'Unit Utilitas 3B',
            status: 'ACTIVE',
            lastSync: new Date().toISOString()
        };
        
        localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
        usersCache = cache;
        console.log('User cached for offline:', username);
    } catch (e) {
        console.error('Error saving cache:', e);
    }
}

function updatePasswordInCache(username, newPassword) {
    if (!username) return;
    const cache = loadUsersCache() || {};
    const key = String(username).toLowerCase();
    
    if (cache[key]) {
        cache[key].password = newPassword;
        cache[key].lastSync = new Date().toISOString();
        localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
        usersCache = cache;
        console.log('Password updated in cache for:', username);
    }
}

function loadUsersCache() {
    if (usersCache) return usersCache;
    try {
        const cache = localStorage.getItem(AUTH_CONFIG.USERS_CACHE_KEY);
        usersCache = cache ? JSON.parse(cache) : null;
        return usersCache;
    } catch (e) {
        return null;
    }
}

function showLoginError(message) {
    const errorMsg = document.getElementById('loginError');
    const usernameInput = document.getElementById('operatorUsername');
    const passwordInput = document.getElementById('operatorPassword');
    
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        errorMsg.style.color = '#ef4444';
        errorMsg.style.fontSize = '0.875rem';
        errorMsg.style.marginTop = '8px';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.padding = '8px';
        errorMsg.style.background = 'rgba(239, 68, 68, 0.1)';
        errorMsg.style.borderRadius = '8px';
        errorMsg.style.border = '1px solid rgba(239, 68, 68, 0.2)';
    }
    
    if (usernameInput) usernameInput.style.borderColor = '#ef4444';
    if (passwordInput) passwordInput.style.borderColor = '#ef4444';
}

function hideLoginError() {
    const errorMsg = document.getElementById('loginError');
    const usernameInput = document.getElementById('operatorUsername');
    const passwordInput = document.getElementById('operatorPassword');
    
    if (errorMsg) {
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';
    }
    
    if (usernameInput) usernameInput.style.borderColor = '';
    if (passwordInput) passwordInput.style.borderColor = '';
}

function updateUIForAuthenticatedUser() {
    if (!currentUser) return;
    
    const userElements = [
        'displayUserName', 'tpmHeaderUser', 'tpmInputUser', 
        'areaListUser', 'paramUser', 'balancingUser', 
        'ctAreaListUser', 'ctParamUser'
    ];
    
    userElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = currentUser.name || currentUser.username;
    });
    
    if (currentUser.role === 'admin') {
        const homeHeader = document.querySelector('.home-header .user-info');
        if (homeHeader && !homeHeader.querySelector('.admin-badge')) {
            const badge = document.createElement('span');
            badge.className = 'admin-badge';
            badge.style.cssText = 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.65rem; font-weight: 700; margin-left: 4px; text-transform: uppercase;';
            badge.textContent = 'Admin';
            homeHeader.appendChild(badge);
        }
        setTimeout(addAdminButton, 100);
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('operatorPassword');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (!passwordInput) return;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        if (eyeIcon) {
            eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
        }
    } else {
        passwordInput.type = 'password';
        if (eyeIcon) {
            eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
        }
    }
}

// ============================================
// 7. USER MANAGEMENT
// ============================================

function addAdminButton() {
    if (!isAdmin()) return;
    if (document.getElementById('adminPanelBtn')) return;
    
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;
    
    const adminCard = document.createElement('div');
    adminCard.className = 'menu-card danger';
    adminCard.id = 'adminPanelBtn';
    adminCard.style.cssText = 'border-left: 4px solid #ef4444; margin-top: 12px; cursor: pointer;';
    adminCard.onclick = showUserManagement;
    
    adminCard.innerHTML = `
        <div class="menu-icon" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        </div>
        <div class="menu-content">
            <h3>Manajemen User</h3>
            <p>Tambah/Edit/Hapus Operator</p>
        </div>
    `;
    
    menuGrid.appendChild(adminCard);
}

function addChangePasswordButton() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid || document.getElementById('changePasswordBtn')) return;
    
    const btn = document.createElement('div');
    btn.id = 'changePasswordBtn';
    btn.className = 'menu-card';
    btn.style.cssText = 'border-left: 4px solid #f59e0b; cursor: pointer; margin-top: 12px;';
    btn.onclick = showChangePasswordModal;
    
    btn.innerHTML = `
        <div class="menu-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                <circle cx="12" cy="16" r="1"/>
            </svg>
        </div>
        <div class="menu-content">
            <h3>Ganti Password</h3>
            <p>Ubah password akun Anda</p>
        </div>
    `;
    
    menuGrid.appendChild(btn);
}

function showUserManagement() {
    if (!isAdmin()) {
        showCustomAlert('Akses ditolak. Hanya admin yang bisa mengakses.', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'userManagementModal';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.98); z-index: 10003; overflow-y: auto; padding: 20px;';
    
    modal.innerHTML = `
        <div style="max-width: 480px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 16px; background: rgba(30, 41, 59, 0.8); border-radius: 12px; border: 1px solid rgba(148, 163, 184, 0.2);">
                <h2 style="margin: 0; font-size: 1.25rem;">👥 Manajemen User</h2>
                <button onclick="closeUserManagement()" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 8px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div id="userListContainer" style="margin-bottom: 20px;">
                <div style="text-align: center; padding: 40px; color: #64748b;">⏳ Memuat data user...</div>
            </div>
            <button onclick="showAddUserForm()" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">
                + Tambah User Baru
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    loadUserList();
}

function closeUserManagement() {
    const modal = document.getElementById('userManagementModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

async function loadUserList() {
    const container = document.getElementById('userListContainer');
    if (!container) return;
    
    try {
        const callbackName = 'usersCallback_' + Date.now();
        const result = await safeJSONP(
            `${GAS_URL}?action=getUsers&adminUser=${encodeURIComponent(currentUser.username)}&adminPass=admin123&callback=${callbackName}`,
            callbackName,
            10000
        );
        
        if (result.success) {
            renderUserList(result.users);
            updateUsersCache(result.users);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        const cached = loadUsersCache();
        if (cached) {
            const usersArray = Object.values(cached);
            renderUserList(usersArray);
            container.insertAdjacentHTML('afterbegin', `
                <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 0.875rem; color: #f59e0b;">
                    ⚠️ Mode offline - Menampilkan data dari cache
                </div>
            `);
        } else {
            container.innerHTML = `<div style="text-align: center; padding: 40px; color: #ef4444;">❌ Gagal memuat data user</div>`;
        }
    }
}

function renderUserList(users) {
    const container = document.getElementById('userListContainer');
    if (!container) return;
    
    const validUsers = users.filter(user => user && user.username && typeof user.username === 'string');
    
    if (validUsers.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: #ef4444;">❌ Tidak ada data user valid</div>`;
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    
    validUsers.forEach(user => {
        const isCurrentUser = user.username.toLowerCase() === (currentUser?.username || '').toLowerCase();
        const isActive = user.status === 'ACTIVE';
        const isAdmin = user.role === 'admin';
        
        html += `
            <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; border-radius: 12px; padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div>
                        <div style="font-weight: 600; font-size: 1rem; color: ${isActive ? '#f8fafc' : '#64748b'};">
                            ${user.name || user.username}
                            ${isCurrentUser ? '<span style="font-size: 0.7rem; background: rgba(14, 165, 233, 0.2); color: #38bdf8; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">Anda</span>' : ''}
                        </div>
                        <div style="font-size: 0.875rem; color: #94a3b8; margin-top: 2px;">
                            @${user.username} • ${user.department || 'Unit Utilitas 3B'}
                        </div>
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <span style="padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; background: ${isAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)'}; color: ${isAdmin ? '#f59e0b' : '#94a3b8'};">
                            ${user.role || 'operator'}
                        </span>
                        <span style="padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; background: ${isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color: ${isActive ? '#10b981' : '#ef4444'};">
                            ${user.status || 'ACTIVE'}
                        </span>
                    </div>
                </div>
                
                <div style="background: rgba(239, 68, 68, 0.05); border: 1px dashed rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                    <div style="font-size: 0.75rem; color: #ef4444; margin-bottom: 4px; font-weight: 600;">🔓 Password:</div>
                    <div style="font-family: monospace; font-size: 0.875rem; color: #f87171; letter-spacing: 1px;">${user.password || 'N/A'}</div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    ${!isCurrentUser ? `
                        <button onclick="toggleUserStatus('${user.username}')" style="flex: 1; padding: 10px; background: ${isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; color: ${isActive ? '#ef4444' : '#10b981'}; border: 1px solid ${isActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}; border-radius: 8px; font-size: 0.875rem; cursor: pointer;">
                            ${isActive ? '🔒 Nonaktifkan' : '🔓 Aktifkan'}
                        </button>
                        <button onclick="deleteUser('${user.username}')" style="padding: 10px 16px; background: rgba(100, 116, 139, 0.1); color: #64748b; border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; font-size: 0.875rem; cursor: pointer;">
                            🗑️
                        </button>
                    ` : '<div style="flex: 1; text-align: center; color: #64748b; font-size: 0.875rem; padding: 10px;">Tidak dapat mengedit diri sendiri</div>'}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function updateUsersCache(usersArray) {
    try {
        let cache = loadUsersCache() || {};
        
        usersArray.forEach(user => {
            if (user && user.username) {
                cache[user.username.toLowerCase()] = {
                    username: user.username,
                    password: user.password || '',
                    role: user.role || 'operator',
                    name: user.name || user.username,
                    department: user.department || 'Unit Utilitas 3B',
                    status: user.status || 'ACTIVE',
                    lastSync: new Date().toISOString()
                };
            }
        });
        
        localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
        usersCache = cache;
    } catch (e) {
        console.error('Error updating users cache:', e);
    }
}

function showAddUserForm() {
    const modal = document.getElementById('userManagementModal');
    if (!modal) return;
    
    modal.setAttribute('data-old-content', modal.innerHTML);
    
    modal.innerHTML = `
        <div style="max-width: 480px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 16px; background: rgba(30, 41, 59, 0.8); border-radius: 12px; border: 1px solid rgba(148, 163, 184, 0.2);">
                <h2 style="margin: 0; font-size: 1.25rem;">➕ Tambah User Baru</h2>
                <button onclick="restoreUserManagement()" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 8px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <form id="addUserForm" style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Username *</label>
                    <input type="text" id="newUsername" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Password (Plaintext) *</label>
                    <input type="text" id="newPassword" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                    <small style="color: #64748b; font-size: 0.75rem;">⚠️ Password akan disimpan dalam bentuk plaintext</small>
                </div>
                
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Nama Lengkap *</label>
                    <input type="text" id="newName" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Role *</label>
                    <select id="newRole" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                        <option value="operator">Operator</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Department</label>
                    <input type="text" id="newDepartment" value="Unit Utilitas 3B" style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                </div>
                
                <button type="submit" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; margin-top: 8px;">
                    Simpan User Baru
                </button>
            </form>
        </div>
    `;
    
    setTimeout(() => {
        const form = document.getElementById('addUserForm');
        if (form) form.addEventListener('submit', handleAddUser);
    }, 100);
}

function restoreUserManagement() {
    const modal = document.getElementById('userManagementModal');
    if (modal && modal.getAttribute('data-old-content')) {
        modal.innerHTML = modal.getAttribute('data-old-content');
        loadUserList();
    }
}

async function handleAddUser(e) {
    e.preventDefault();
    
    const formData = {
        username: document.getElementById('newUsername').value.trim().toLowerCase(),
        password: document.getElementById('newPassword').value,
        name: document.getElementById('newName').value.trim(),
        role: document.getElementById('newRole').value,
        department: document.getElementById('newDepartment').value.trim()
    };
    
    if (!formData.username || !formData.password || !formData.name) {
        showCustomAlert('Semua field wajib diisi!', 'error');
        return;
    }
    
    if (formData.username.length < 3) {
        showCustomAlert('Username minimal 3 karakter!', 'error');
        return;
    }
    
    if (formData.password.length < 4) {
        showCustomAlert('Password minimal 4 karakter!', 'error');
        return;
    }
    
    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'USER_MANAGEMENT',
                action: 'add',
                adminUser: currentUser.username,
                adminPass: 'admin123',
                userData: formData
            })
        });
        
        showCustomAlert('User berhasil ditambahkan!', 'success');
        restoreUserManagement();
        updateUserCache(formData.username, formData.password, formData);
        
    } catch (error) {
        updateUserCache(formData.username, formData.password, {
            ...formData,
            status: 'ACTIVE'
        });
        showCustomAlert('User disimpan secara lokal (mode offline)', 'warning');
        restoreUserManagement();
    }
}

async function toggleUserStatus(username) {
    if (!confirm(`Yakin ingin mengubah status user @${username}?`)) return;
    
    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'USER_MANAGEMENT',
                action: 'toggle',
                adminUser: currentUser.username,
                adminPass: 'admin123',
                targetUsername: username
            })
        });
        
        showCustomAlert('Status user diubah', 'success');
        loadUserList();
    } catch (error) {
        const cache = loadUsersCache();
        if (cache && cache[username.toLowerCase()]) {
            const currentStatus = cache[username.toLowerCase()].status || 'ACTIVE';
            cache[username.toLowerCase()].status = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
        }
        loadUserList();
        showCustomAlert('Status diubah secara lokal (mode offline)', 'warning');
    }
}

async function deleteUser(username) {
    if (!confirm(`Yakin ingin menghapus user @${username}?`)) return;
    
    if (username.toLowerCase() === currentUser.username.toLowerCase()) {
        showCustomAlert('Tidak bisa menghapus diri sendiri!', 'error');
        return;
    }
    
    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'USER_MANAGEMENT',
                action: 'delete',
                adminUser: currentUser.username,
                adminPass: 'admin123',
                targetUsername: username
            })
        });
        
        showCustomAlert('User berhasil dihapus', 'success');
        loadUserList();
    } catch (error) {
        const cache = loadUsersCache();
        if (cache && cache[username.toLowerCase()]) {
            delete cache[username.toLowerCase()];
            localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
        }
        loadUserList();
        showCustomAlert('User dihapus secara lokal (mode offline)', 'warning');
    }
}

async function syncUsersForOffline() {
    if (!navigator.onLine) {
        console.log('[Sync] Skipped: Offline');
        return;
    }
    
    if (!currentUser || currentUser.role !== 'admin') {
        console.log('[Sync] Skipped: Not admin');
        return;
    }
    
    console.log('[Sync] Starting...');
    
    try {
        const callbackName = 'syncUsersCallback_' + Date.now();
        const url = `${GAS_URL}?action=getUsers&adminUser=${encodeURIComponent(currentUser.username)}&adminPass=admin123&callback=${callbackName}`;
        
        const result = await safeJSONP(url, callbackName, 8000);
        
        if (result.success && Array.isArray(result.users)) {
            updateUsersCache(result.users);
            console.log(`[Sync] Success: ${result.users.length} users cached`);
        }
    } catch (error) {
        console.error('[Sync] Error:', error.message);
    }
}

// ============================================
// 8. CHANGE PASSWORD
// ============================================

function showChangePasswordModal() {
    if (!currentUser) {
        showCustomAlert('Silakan login terlebih dahulu', 'error');
        return;
    }
    
    const modal = document.getElementById('changePasswordModal');
    const usernameSpan = document.getElementById('cpUsername');
    const oldPasswordGroup = document.getElementById('oldPasswordGroup');
    const form = document.getElementById('changePasswordForm');
    
    if (usernameSpan) usernameSpan.textContent = currentUser.username;
    
    if (currentUser.role === 'admin') {
        if (oldPasswordGroup) oldPasswordGroup.style.display = 'none';
        const oldPassInput = document.getElementById('cpOldPassword');
        if(oldPassInput) oldPassInput.removeAttribute('required');
    } else {
        if (oldPasswordGroup) oldPasswordGroup.style.display = 'block';
        const oldPassInput = document.getElementById('cpOldPassword');
        if(oldPassInput) oldPassInput.setAttribute('required', 'true');
    }
    
    if(form) form.reset();
    hideCPError();
    
    if (modal) modal.classList.remove('hidden');
    
    setTimeout(() => {
        if (currentUser.role === 'admin') {
            document.getElementById('cpNewPassword')?.focus();
        } else {
            document.getElementById('cpOldPassword')?.focus();
        }
    }, 100);
    
    if(form) form.onsubmit = handleChangePasswordSubmit;
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.classList.add('hidden');
}

function toggleCPVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input || !btn) return;
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

function showCPError(message) {
    const errorDiv = document.getElementById('cpError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideCPError() {
    const errorDiv = document.getElementById('cpError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }
}

async function handleChangePasswordSubmit(e) {
    e.preventDefault();
    hideCPError();
    
    if (!currentUser || !currentUser.username) {
        showCPError('Session tidak valid. Silakan login ulang.');
        return;
    }
    
    const oldPassword = document.getElementById('cpOldPassword')?.value || '';
    const newPassword = document.getElementById('cpNewPassword')?.value || '';
    const confirmPassword = document.getElementById('cpConfirmPassword')?.value || '';
    
    if (newPassword.length < 4) {
        showCPError('Password baru minimal 4 karakter');
        return;
    }
    if (newPassword !== confirmPassword) {
        showCPError('Password baru dan konfirmasi tidak cocok');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Simpan';
    if(submitBtn) {
        submitBtn.textContent = '⏳ Menyimpan...';
        submitBtn.disabled = true;
    }
    
    try {
        const callbackName = 'cpCallback_' + Date.now();
        const result = await safeJSONP(
            `${GAS_URL}?action=changePassword&username=${encodeURIComponent(currentUser.username)}&oldPassword=${encodeURIComponent(currentUser.role === 'admin' ? '' : oldPassword)}&newPassword=${encodeURIComponent(newPassword)}&callback=${callbackName}`,
            callbackName,
            10000
        );
        
        if (result.success) {
            updatePasswordInCache(currentUser.username, newPassword);
            showCustomAlert('✓ Password berhasil diubah! Silakan login ulang.', 'success');
            closeChangePasswordModal();
            
            setTimeout(() => {
                logoutOperator();
            }, 2000);
        } else {
            showCPError(result.error || 'Gagal mengubah password');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showCPError('Gagal mengubah password. Periksa koneksi internet.');
    } finally {
        if(submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// ============================================
// 9. UPLOAD PROGRESS MANAGER
// ============================================

function showUploadProgress(title = 'Mengupload Data...') {
    const overlay = document.getElementById('uploadProgressOverlay');
    const percentage = document.getElementById('progressPercentage');
    const ringFill = document.getElementById('progressRingFill');
    const turbine = document.getElementById('uploadTurbine');
    const statusText = document.getElementById('uploadStatusText');
    
    overlay?.classList.remove('hidden', 'success', 'error');
    if(percentage) percentage.textContent = '0%';
    if(ringFill) ringFill.style.strokeDashoffset = 339.292;
    if(turbine) turbine.classList.add('spinning');
    if(statusText) statusText.textContent = title;
    
    document.querySelectorAll('.step').forEach((step, idx) => {
        step.classList.remove('active', 'completed');
        if (idx === 0) step.classList.add('active');
    });
    document.querySelectorAll('.step-line').forEach(line => line.classList.remove('active'));
    
    let progress = 0;
    let currentStep = 1;
    
    uploadProgressInterval = setInterval(() => {
        if (progress < 30) {
            progress += Math.random() * 3;
        } else if (progress < 70) {
            progress += Math.random() * 2;
            if (currentStep === 1 && progress > 35) {
                setUploadStep(2);
                currentStep = 2;
            }
        } else if (progress < 95) {
            progress += Math.random() * 1;
            if (currentStep === 2 && progress > 75) {
                setUploadStep(3);
                currentStep = 3;
            }
        } else {
            progress += 0.5;
        }
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(uploadProgressInterval);
        }
        
        updateProgressRing(progress);
    }, 100);
    
    return {
        complete: () => completeUploadProgress(),
        error: () => errorUploadProgress(),
        updateText: (text) => { if(statusText) statusText.textContent = text; }
    };
}

function updateProgressRing(percentage) {
    const ringFill = document.getElementById('progressRingFill');
    const percentageText = document.getElementById('progressPercentage');
    const circumference = 339.292;
    const offset = circumference - (percentage / 100) * circumference;
    
    if (ringFill) ringFill.style.strokeDashoffset = offset;
    if (percentageText) percentageText.textContent = Math.round(percentage) + '%';
}

function setUploadStep(stepNum) {
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step${i}`);
        const line = document.getElementById(`stepLine${i}`);
        
        if (step) {
            if (i < stepNum) {
                step.classList.remove('active');
                step.classList.add('completed');
                const icon = step.querySelector('.step-icon');
                if (icon) icon.innerHTML = '✓';
            } else if (i === stepNum) {
                step.classList.add('active');
                step.classList.remove('completed');
            }
        }
        
        if (line && i < stepNum) {
            line.classList.add('active');
        }
    }
}

function completeUploadProgress() {
    clearInterval(uploadProgressInterval);
    updateProgressRing(100);
    setUploadStep(4);
    
    const overlay = document.getElementById('uploadProgressOverlay');
    const turbine = document.getElementById('uploadTurbine');
    const statusText = document.getElementById('uploadStatusText');
    
    overlay?.classList.add('success');
    if(turbine) turbine.classList.remove('spinning');
    if(statusText) statusText.textContent = '✓ Berhasil!';
    
    setTimeout(() => hideUploadProgress(), 800);
}

function errorUploadProgress() {
    clearInterval(uploadProgressInterval);
    
    const overlay = document.getElementById('uploadProgressOverlay');
    const turbine = document.getElementById('uploadTurbine');
    const statusText = document.getElementById('uploadStatusText');
    const percentage = document.getElementById('progressPercentage');
    
    overlay?.classList.add('error');
    if(turbine) turbine.classList.remove('spinning');
    if(statusText) statusText.textContent = '✗ Gagal Mengirim';
    if(percentage) percentage.textContent = 'Error';
    
    setTimeout(() => hideUploadProgress(), 1500);
}

function hideUploadProgress() {
    const overlay = document.getElementById('uploadProgressOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('success', 'error');
    }
    clearInterval(uploadProgressInterval);
}

function cancelUpload() {
    console.log('[Upload] User cancelled');
    if (currentUploadController) {
        currentUploadController.abort();
        currentUploadController = null;
    }
    hideUploadProgress();
    showCustomAlert('Upload dibatalkan', 'warning');
}

// ============================================
// 10. LOGSHEET FUNCTIONS (TURBINE) - WITH GDRIVE UPLOAD
// ============================================

function initParamCameraListener() {
    const paramCamera = document.getElementById('paramCamera');
    if (paramCamera) {
        paramCamera.addEventListener('change', handleParamPhoto);
    }
}

/**
 * Upload photo ke Google Drive via GAS
 * @param {string} base64Data - Base64 image data
 * @param {string} paramName - Nama parameter untuk nama file
 * @returns {Promise<string>} - Google Drive URL
 */
async function uploadPhotoToDrive(base64Data, paramName) {
    // Generate nama file unik
    const timestamp = new Date().getTime();
    const dateStr = new Date().toISOString().split('T')[0];
    const safeParamName = paramName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `LOG_${dateStr}_${safeParamName}_${timestamp}.jpg`;
    
    const uploadData = {
        action: 'uploadPhoto',
        filename: filename,
        mimeType: 'image/jpeg',
        data: base64Data,
        folderName: 'Turbine_Logsheets', // Folder di Google Drive
        operator: currentUser ? currentUser.name : 'Unknown',
        timestamp: new Date().toISOString()
    };
    
    try {
        // Coba pakai JSONP untuk dapat response (jika GAS support)
        const callbackName = 'uploadCallback_' + timestamp;
        const url = `${GAS_URL}?callback=${callbackName}`;
        
        // Karena base64 besar, kita pakai POST fetch tapi dengan mode cors (harus setup GAS)
        // Atau sebagai fallback, kirim via POST no-cors dan polling (tapi ini tidak dapat response)
        
        // Solusi: Kirim ke GAS, GAS akan simpan dan return URL via JSONP jika bisa
        // Tapi untuk base64 besar, JSONP tidak cocok karena URL length limit
        
        // Alternatif: Simpan dulu ke localStorage, nanti saat submit logsheet baru upload semua foto
        // dan dapat URL dari response submit
        
        // Untuk saat ini, kita return null untuk menandakan "pending upload saat submit"
        // Karena keterbatasan CORS dan size limit JSONP
        
        console.log('[Photo Upload] Photo queued for upload with submit:', filename);
        return null; // Indicate that photo will be uploaded with logsheet submit
        
    } catch (error) {
        console.error('[Photo Upload] Error:', error);
        return null;
    }
}

async function handleParamPhoto(event) {
    const file = event.target.files[0];
    if (!file) {
        proceedSaveAfterPhoto();
        return;
    }
    
    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showCustomAlert('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.', 'error');
        event.target.value = '';
        return;
    }
    
    const originalSize = file.size;
    
    if (originalSize > 10 * 1024 * 1024) {
        showCustomAlert(`Ukuran foto terlalu besar (${formatFileSize(originalSize)}). Maksimal 10MB sebelum kompresi.`, 'error');
        event.target.value = '';
        return;
    }
    
    // Show loading indicator
    showCustomAlert('📸 Mengkompresi & menyiapkan foto...', 'info');
    isUploadingPhoto = true;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Photo = e.target.result;
        
        try {
            // Kompresi foto
            const compressedPhoto = await compressImage(base64Photo, 1280, 0.8, 2.5);
            const compressedSize = getBase64Size(compressedPhoto);
            
            const fullLabel = AREAS[activeArea][activeIdx];
            
            if (!currentInput[activeArea]) currentInput[activeArea] = {};
            
            // Simpan metadata foto
            currentInput[activeArea][fullLabel + '_photoData'] = compressedPhoto; // Simpan base64 untuk upload nanti
            currentInput[activeArea][fullLabel + '_photoTime'] = new Date().toISOString();
            currentInput[activeArea][fullLabel + '_photoOperator'] = currentUser ? currentUser.name : 'Unknown';
            currentInput[activeArea][fullLabel + '_photoUploaded'] = false; // Flag status upload
            currentInput[activeArea][fullLabel + '_photoUrl'] = null; // Akan diisi setelah upload ke Drive
            
            // Jika online, coba upload langsung ke Drive
            if (navigator.onLine) {
                showCustomAlert('📤 Mengupload ke Google Drive...', 'info');
                
                try {
                    // Upload ke Drive dan dapatkan URL
                    const driveUrl = await uploadPhotoToDriveRealtime(compressedPhoto, fullLabel);
                    
                    if (driveUrl) {
                        // Jika berhasil dapat URL
                        currentInput[activeArea][fullLabel + '_photoUrl'] = driveUrl;
                        currentInput[activeArea][fullLabel + '_photoUploaded'] = true;
                        // Hapus base64 untuk hemat storage (opsional, tapi base64 tetap diperlukan untuk fallback)
                        // delete currentInput[activeArea][fullLabel + '_photoData']; // Jangan hapus dulu, jaga2 koneksi putus
                        
                        updatePhotoIndicator(true, 'linked'); // Indicator foto sudah di Drive
                        showCustomAlert('✓ Foto berhasil diupload ke Google Drive!', 'success');
                    } else {
                        // Jika tidak dapat URL (mode no-cors), tandai sebagai pending
                        updatePhotoIndicator(true, 'pending');
                        showCustomAlert('📸 Foto tersimpan. Akan diupload saat submit.', 'success');
                    }
                } catch (uploadError) {
                    console.error('[Upload Error]', uploadError);
                    updatePhotoIndicator(true, 'pending');
                    showCustomAlert('📸 Foto tersimpan lokal. Upload Drive saat submit.', 'warning');
                }
            } else {
                // Mode offline
                updatePhotoIndicator(true, 'offline');
                showCustomAlert('📸 Foto tersimpan (offline). Upload saat online.', 'warning');
            }
            
            localStorage.setItem(DRAFT_KEYS.LOGSHEET, JSON.stringify(currentInput));
            
            const compressRatio = ((1 - (compressedSize / originalSize)) * 100).toFixed(0);
            console.log(`[Photo] Compressed ${compressRatio}%, size: ${formatFileSize(compressedSize)}`);
            
            setTimeout(() => {
                proceedSaveAfterPhoto();
                isUploadingPhoto = false;
            }, 500);
            
        } catch (error) {
            console.error('Compression error:', error);
            showCustomAlert('Gagal mengkompresi foto. Coba foto lain atau gunakan resolusi lebih rendah.', 'error');
            isUploadingPhoto = false;
            event.target.value = '';
        }
    };
    
    reader.onerror = function() {
        showCustomAlert('Gagal membaca foto. Silakan coba lagi.', 'error');
        isUploadingPhoto = false;
    };
    
    reader.readAsDataURL(file);
}

/**
 * Upload foto ke Google Drive real-time (saat foto diambil)
 * Perlu endpoint GAS yang mendukung CORS atau menggunakan teknik khusus
 */
async function uploadPhotoToDriveRealtime(base64Data, paramName) {
    return new Promise((resolve, reject) => {
        const timestamp = new Date().getTime();
        const dateStr = new Date().toISOString().split('T')[0];
        const safeParamName = paramName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
        const filename = `LOG_${dateStr}_${safeParamName}_${timestamp}.jpg`;
        
        // Buat form data untuk POST
        const formData = new FormData();
        formData.append('action', 'uploadPhotoDrive');
        formData.append('filename', filename);
        formData.append('data', base64Data);
        formData.append('mimeType', 'image/jpeg');
        formData.append('folderId', 'YOUR_FOLDER_ID'); // Ganti dengan ID folder Google Drive
        
        // Gunakan fetch dengan timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 detik timeout
        
        fetch(GAS_URL, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        })
        .then(response => response.json())
        .then(data => {
            clearTimeout(timeoutId);
            if (data.success && data.url) {
                resolve(data.url);
            } else {
                reject(new Error(data.error || 'Upload failed'));
            }
        })
        .catch(error => {
            clearTimeout(timeoutId);
            // Jika error CORS atau network, resolve dengan null (akan dihandle saat submit)
            if (error.name === 'TypeError' || error.name === 'AbortError') {
                resolve(null);
            } else {
                reject(error);
            }
        });
    });
}

function proceedSaveAfterPhoto() {
    if (activeIdx < AREAS[activeArea].length - 1) {
        activeIdx++;
        showStep();
        renderProgressDots();
        updatePhotoIndicator(false);
    } else {
        showCustomAlert(`✓ Area ${activeArea} selesai diisi!`, 'success');
        setTimeout(() => navigateTo('areaListScreen'), 1500);
    }
}

/**
 * Update indicator foto dengan status yang berbeda
 * @param {boolean} hasPhoto 
 * @param {string} status - 'linked' (sudah di Drive), 'pending' (menunggu upload), 'offline', null
 */
function updatePhotoIndicator(hasPhoto, status = null) {
    const paramCard = document.querySelector('.param-card');
    if (!paramCard) return;
    
    let indicator = paramCard.querySelector('.photo-indicator');
    
    if (hasPhoto) {
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'photo-indicator';
            indicator.style.cssText = `
                position: absolute;
                top: 12px;
                right: 12px;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                display: flex;
                align-items: center;
                gap: 4px;
                z-index: 10;
                font-weight: 600;
            `;
            paramCard.style.position = 'relative';
            paramCard.appendChild(indicator);
        }
        
        // Style berdasarkan status
        if (status === 'linked') {
            indicator.style.background = '#10b981'; // Hijau
            indicator.style.color = 'white';
            indicator.innerHTML = '☁️ Drive';
        } else if (status === 'pending') {
            indicator.style.background = '#f59e0b'; // Kuning
            indicator.style.color = 'white';
            indicator.innerHTML = '⏳ Pending';
        } else if (status === 'offline') {
            indicator.style.background = '#64748b'; // Abu
            indicator.style.color = 'white';
            indicator.innerHTML = '📱 Local';
        } else {
            indicator.style.background = '#3b82f6'; // Biru
            indicator.style.color = 'white';
            indicator.innerHTML = '📸 Ada';
        }
    } else if (indicator) {
        indicator.remove();
    }
}

async function fetchLastData() {
    updateStatusIndicator(false);
    
    try {
        const callbackName = 'jsonp_' + Date.now();
        const result = await Promise.race([
            safeJSONP(`${GAS_URL}?callback=${callbackName}`, callbackName, 8000),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]);
        
        lastData = result;
        updateStatusIndicator(true);
        renderMenu();
    } catch (error) {
        console.warn('Fetch last data failed:', error);
        renderMenu();
    }
}

function updateStatusIndicator(isOnline) {
    console.log('System Status:', isOnline ? 'Online' : 'Offline');
}

function renderMenu() {
    const list = document.getElementById('areaList');
    if (!list) return;
    
    const totalAreas = Object.keys(AREAS).length;
    let completedAreas = 0;
    let html = '';
    
    Object.entries(AREAS).forEach(([areaName, params]) => {
        const areaData = currentInput[areaName] || {};
        const filled = Object.keys(areaData).filter(k => !k.endsWith('_photoData') && !k.endsWith('_photoTime') && !k.endsWith('_photoOperator') && !k.endsWith('_photoUploaded') && !k.endsWith('_photoUrl')).length;
        const total = params.length;
        const percent = Math.round((filled / total) * 100);
        const isCompleted = filled === total && total > 0;
        
        const hasAbnormal = params.some(paramName => {
            const val = areaData[paramName] || '';
            const firstLine = val.split('\n')[0];
            return ['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine);
        });
        
        // Cek apakah ada foto yang sudah diupload ke Drive
        const hasDrivePhotos = Object.keys(areaData).some(k => k.endsWith('_photoUrl') && areaData[k]);
        
        if (isCompleted) completedAreas++;
        
        const circumference = 2 * Math.PI * 18;
        const strokeDashoffset = circumference - (percent / 100) * circumference;
        
        html += `
            <div class="area-item ${isCompleted ? 'completed' : ''} ${hasAbnormal ? 'has-warning' : ''}" onclick="openArea('${areaName}')">
                <div class="area-progress-ring">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
                        <circle cx="20" cy="20" r="18" fill="none" stroke="${isCompleted ? '#10b981' : 'var(--primary)'}" 
                                stroke-width="3" stroke-linecap="round" stroke-dasharray="${circumference}" 
                                stroke-dashoffset="${strokeDashoffset}" transform="rotate(-90 20 20)"/>
                        <text x="20" y="24" text-anchor="middle" font-size="10" font-weight="bold" fill="${isCompleted ? '#10b981' : 'var(--text-primary)'}">${filled}</text>
                    </svg>
                </div>
                <div class="area-info">
                    <div class="area-name">${areaName}</div>
                    <div class="area-meta ${hasAbnormal ? 'warning' : ''}">
                        ${hasAbnormal ? '⚠️ Ada parameter bermasalah • ' : ''}${filled} dari ${total} parameter
                        ${hasDrivePhotos ? ' • ☁️ Drive' : ''}
                    </div>
                </div>
                <div class="area-status">
                    ${hasAbnormal ? '<span style="color: #ef4444; margin-right: 4px;">!</span>' : ''}
                    ${isCompleted ? '✓' : '❯'}
                </div>
            </div>
        `;
    });
    
    list.innerHTML = html;
    
    const hasData = Object.keys(currentInput).length > 0;
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.style.display = hasData ? 'flex' : 'none';
    
    updateOverallProgressUI(completedAreas, totalAreas);
}

function updateOverallProgress() {
    const totalAreas = Object.keys(AREAS).length;
    let completedAreas = 0;
    Object.entries(AREAS).forEach(([areaName, params]) => {
        const filled = currentInput[areaName] ? Object.keys(currentInput[areaName]).filter(k => !k.includes('_photo')).length : 0;
        if (filled === params.length && filled > 0) completedAreas++;
    });
    updateOverallProgressUI(completedAreas, totalAreas);
}

function updateOverallProgressUI(completedAreas, totalAreas) {
    const percent = Math.round((completedAreas / totalAreas) * 100);
    const progressText = document.getElementById('progressText');
    const overallPercent = document.getElementById('overallPercent');
    const overallProgressBar = document.getElementById('overallProgressBar');
    
    if (progressText) progressText.textContent = `${percent}% Complete`;
    if (overallPercent) overallPercent.textContent = `${percent}%`;
    if (overallProgressBar) overallProgressBar.style.width = `${percent}%`;
}

function openArea(areaName) {
    if (!requireAuth()) return;
    
    activeArea = areaName;
    activeIdx = 0;
    navigateTo('paramScreen');
    const currentAreaName = document.getElementById('currentAreaName');
    if (currentAreaName) currentAreaName.textContent = areaName;
    renderProgressDots();
    showStep();
}

function renderProgressDots() {
    const container = document.getElementById('progressDots');
    if (!container) return;
    const total = AREAS[activeArea].length;
    let html = '';
    
    for (let i = 0; i < total; i++) {
        const fullLabel = AREAS[activeArea][i];
        const savedValue = currentInput[activeArea]?.[fullLabel] || '';
        const lines = savedValue.split('\n');
        const firstLine = lines[0];
        
        const isFilled = savedValue !== '';
        const hasIssue = ['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine);
        const isActive = i === activeIdx;
        
        // Cek status foto
        const hasPhotoData = currentInput[activeArea]?.[fullLabel + '_photoData'] ? true : false;
        const photoUrl = currentInput[activeArea]?.[fullLabel + '_photoUrl'];
        const isUploaded = currentInput[activeArea]?.[fullLabel + '_photoUploaded'];
        
        let className = '';
        let icon = '';
        
        if (isActive) {
            className = 'active';
        } else if (hasIssue) {
            className = 'has-issue';
            icon = '⚠️';
        } else if (isFilled) {
            className = 'filled';
        }
        
        if (hasPhotoData) {
            className += ' has-photo';
            if (isUploaded && photoUrl) {
                icon = '☁️'; // Sudah di Drive
            } else {
                icon = '📸'; // Local only
            }
        }
        
        let title = '';
        if (hasIssue) title = firstLine;
        if (hasPhotoData) {
            title = title ? title + ' + ' : '';
            title += isUploaded ? 'Foto di Google Drive' : 'Foto tersimpan lokal';
        }
        
        html += `<div class="progress-dot ${className}" onclick="jumpToStep(${i})" title="${title}" style="position: relative;">
            ${icon ? `<span style="position: absolute; top: -8px; right: -4px; font-size: 10px;">${icon}</span>` : ''}
        </div>`;
    }
    container.innerHTML = html;
}

function jumpToStep(index) {
    saveCurrentStep();
    activeIdx = index;
    showStep();
    renderProgressDots();
}

function detectInputType(label) {
    for (const [type, config] of Object.entries(INPUT_TYPES)) {
        for (const pattern of config.patterns) {
            if (label.includes(pattern)) {
                return {
                    type: 'select',
                    options: config.options[pattern],
                    pattern: pattern
                };
            }
        }
    }
    return { type: 'text', options: null, pattern: null };
}

function getUnit(label) {
    const match = label.match(/\(([^)]+)\)/);
    return match ? match[1] : "";
}

function getParamName(label) {
    return label.split(' (')[0];
}

function showStep() {
    const fullLabel = AREAS[activeArea][activeIdx];
    const total = AREAS[activeArea].length;
    const inputType = detectInputType(fullLabel);
    currentInputType = inputType.type;
    
    const stepInfo = document.getElementById('stepInfo');
    const areaProgress = document.getElementById('areaProgress');
    const labelInput = document.getElementById('labelInput');
    const lastTimeLabel = document.getElementById('lastTimeLabel');
    const prevValDisplay = document.getElementById('prevValDisplay');
    const inputFieldContainer = document.getElementById('inputFieldContainer');
    const unitDisplay = document.getElementById('unitDisplay');
    const mainInputWrapper = document.getElementById('mainInputWrapper');
    
    if (stepInfo) stepInfo.textContent = `Step ${activeIdx + 1}/${total}`;
    if (areaProgress) areaProgress.textContent = `${activeIdx + 1}/${total}`;
    if (labelInput) labelInput.textContent = getParamName(fullLabel);
    if (lastTimeLabel) lastTimeLabel.textContent = lastData._lastTime || '--:--';
    
    let prevVal = lastData[fullLabel] || '--';
    if (prevVal !== '--') {
        const lines = prevVal.toString().split('\n');
        const firstLine = lines[0];
        if (['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine)) {
            prevVal = firstLine + (lines[1] ? ' - ' + lines[1] : '');
        }
    }
    if (prevValDisplay) prevValDisplay.textContent = prevVal;
    
    if (inputType.type === 'select') {
        let currentValue = (currentInput[activeArea] && currentInput[activeArea][fullLabel]) || '';
        if (currentValue) {
            const lines = currentValue.split('\n');
            const firstLine = lines[0];
            if (!['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine)) {
                currentValue = firstLine;
            } else {
                currentValue = '';
            }
        }
        
        let optionsHtml = `<option value="" disabled ${!currentValue ? 'selected' : ''}>Pilih Status...</option>`;
        inputType.options.forEach(opt => {
            const selected = currentValue === opt ? 'selected' : '';
            optionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
        });
        
        if (inputFieldContainer) {
            inputFieldContainer.innerHTML = `
                <div class="select-wrapper">
                    <select id="valInput" class="status-select">${optionsHtml}</select>
                    <div class="select-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                </div>
            `;
        }
        if (unitDisplay) unitDisplay.style.display = 'none';
        if (mainInputWrapper) mainInputWrapper.classList.add('has-select');
    } else {
        let currentValue = (currentInput[activeArea] && currentInput[activeArea][fullLabel]) || '';
        
        if (currentValue) {
            const lines = currentValue.split('\n');
            const firstLine = lines[0];
            if (!['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine)) {
                currentValue = firstLine;
            } else {
                currentValue = '';
            }
        }
        
        if (inputFieldContainer) {
            inputFieldContainer.innerHTML = `<input type="text" id="valInput" inputmode="decimal" placeholder="0.00" value="${currentValue}" autocomplete="off">`;
        }
        if (unitDisplay) {
            unitDisplay.textContent = getUnit(fullLabel) || '--';
            unitDisplay.style.display = 'flex';
        }
        if (mainInputWrapper) mainInputWrapper.classList.remove('has-select');
    }
    
    // Update photo indicator berdasarkan status yang tersimpan
    const photoData = currentInput[activeArea]?.[fullLabel + '_photoData'];
    const photoUrl = currentInput[activeArea]?.[fullLabel + '_photoUrl'];
    const isUploaded = currentInput[activeArea]?.[fullLabel + '_photoUploaded'];
    
    if (photoData) {
        updatePhotoIndicator(true, isUploaded && photoUrl ? 'linked' : 'pending');
    } else {
        updatePhotoIndicator(false);
    }
    
    loadAbnormalStatus(fullLabel);
    renderProgressDots();
    
    setTimeout(() => {
        const input = document.getElementById('valInput');
        if (input && inputType.type === 'text' && !input.disabled) {
            input.focus();
            input.select();
        }
    }, 100);
}

function handleStatusChange(checkbox) {
    const chip = checkbox.closest('.status-chip');
    const noteContainer = document.getElementById('statusNoteContainer');
    const valInput = document.getElementById('valInput');
    
    document.querySelectorAll('input[name="paramStatus"]').forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
            cb.closest('.status-chip').classList.remove('active');
        }
    });
    
    if (checkbox.checked) {
        chip.classList.add('active');
        if (noteContainer) noteContainer.style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('statusNote')?.focus();
        }, 100);
        
        if (checkbox.value === 'NOT_INSTALLED') {
            if (valInput) {
                valInput.value = '-';
                valInput.disabled = true;
                valInput.style.opacity = '0.5';
                valInput.style.background = 'rgba(100, 116, 139, 0.2)';
            }
        }
    } else {
        chip.classList.remove('active');
        if (noteContainer) noteContainer.style.display = 'none';
        const noteInput = document.getElementById('statusNote');
        if (noteInput) noteInput.value = '';
        
        if (valInput) {
            valInput.value = '';
            valInput.disabled = false;
            valInput.style.opacity = '1';
            valInput.style.background = '';
            valInput.focus();
        }
    }
    
    saveCurrentStatusToDraft();
}

function saveCurrentStatusToDraft() {
    const fullLabel = AREAS[activeArea][activeIdx];
    const input = document.getElementById('valInput');
    const checkedStatus = document.querySelector('input[name="paramStatus"]:checked');
    const note = document.getElementById('statusNote')?.value || '';
    
    if (!currentInput[activeArea]) currentInput[activeArea] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    if (checkedStatus) {
        if (note) {
            valueToSave = `${checkedStatus.value}\n${note}`;
        } else {
            valueToSave = checkedStatus.value;
        }
    }
    
    if (valueToSave) {
        currentInput[activeArea][fullLabel] = valueToSave;
    } else {
        delete currentInput[activeArea][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS.LOGSHEET, JSON.stringify(currentInput));
    renderProgressDots();
}

function loadAbnormalStatus(fullLabel) {
    document.querySelectorAll('input[name="paramStatus"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.status-chip').classList.remove('active');
    });
    
    const noteContainer = document.getElementById('statusNoteContainer');
    const noteInput = document.getElementById('statusNote');
    const valInput = document.getElementById('valInput');
    
    if (noteContainer) noteContainer.style.display = 'none';
    if (noteInput) noteInput.value = '';
    
    if (valInput) {
        valInput.disabled = false;
        valInput.style.opacity = '1';
        valInput.style.background = '';
        valInput.value = '';
    }
    
    if (currentInput[activeArea] && currentInput[activeArea][fullLabel]) {
        const savedValue = currentInput[activeArea][fullLabel];
        const lines = savedValue.split('\n');
        const firstLine = lines[0];
        const secondLine = lines[1] || '';
        
        const isStatus = ['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine);
        
        if (isStatus) {
            const checkbox = document.querySelector(`input[value="${firstLine}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.closest('.status-chip').classList.add('active');
                if (noteContainer) noteContainer.style.display = 'block';
                if (noteInput) noteInput.value = secondLine;
                
                if (firstLine === 'NOT_INSTALLED' && valInput) {
                    valInput.value = '-';
                    valInput.disabled = true;
                    valInput.style.opacity = '0.5';
                    valInput.style.background = 'rgba(100, 116, 139, 0.2)';
                }
            }
        } else {
            if (valInput) valInput.value = savedValue;
        }
    }
}

function saveCurrentStep() {
    const input = document.getElementById('valInput');
    const fullLabel = AREAS[activeArea][activeIdx];
    
    if (!currentInput[activeArea]) currentInput[activeArea] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    const checkedStatus = document.querySelector('input[name="paramStatus"]:checked');
    const note = document.getElementById('statusNote')?.value || '';
    
    if (checkedStatus) {
        if (checkedStatus.value === 'NOT_INSTALLED') {
            valueToSave = 'NOT_INSTALLED';
            if (note) valueToSave += '\n' + note;
        } else {
            if (note) {
                valueToSave = `${checkedStatus.value}\n${note}`;
            } else {
                valueToSave = checkedStatus.value;
            }
        }
    }
    
    if (valueToSave) {
        currentInput[activeArea][fullLabel] = valueToSave;
    } else {
        delete currentInput[activeArea][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS.LOGSHEET, JSON.stringify(currentInput));
}

function saveStep() {
    saveCurrentStep();
    
    const fullLabel = AREAS[activeArea][activeIdx];
    const existingPhoto = currentInput[activeArea] && currentInput[activeArea][fullLabel + '_photoData'];
    
    if (existingPhoto) {
        proceedSaveAfterPhoto();
    } else {
        if (confirm('📸 Ambil foto lokasi sebagai bukti pengisian?\n\nFoto akan diupload ke Google Drive.')) {
            const paramCamera = document.getElementById('paramCamera');
            if (paramCamera) {
                paramCamera.click();
            } else {
                proceedSaveAfterPhoto();
            }
        } else {
            proceedSaveAfterPhoto();
        }
    }
}

function goBack() {
    saveCurrentStep();
    
    if (activeIdx > 0) {
        activeIdx--;
        showStep();
    } else {
        navigateTo('areaListScreen');
    }
}

/**
 * Kirim data logsheet ke Google Sheets
 * Foto yang belum terupload akan diupload sekarang, dan URL Drive yang dikirim ke Sheet
 */
async function sendToSheet() {
    if (!requireAuth()) return;
    
    // Cek apakah ada foto yang belum diupload ke Drive
    const pendingPhotos = [];
    Object.entries(currentInput).forEach(([areaName, params]) => {
        Object.keys(params).forEach(key => {
            if (key.endsWith('_photoData') && !params[key.replace('_photoData', '_photoUploaded')]) {
                pendingPhotos.push({
                    area: areaName,
                    param: key.replace('_photoData', ''),
                    data: params[key],
                    filename: `LOG_${new Date().toISOString().split('T')[0]}_${key.replace('_photoData', '').replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.jpg`
                });
            }
        });
    });
    
    const progress = showUploadProgress('Mengirim Logsheet & Upload Foto...');
    currentUploadController = new AbortController();
    
    const autoAbortTimeout = setTimeout(() => {
        if (currentUploadController) {
            currentUploadController.abort();
        }
    }, 120000); // 2 menit timeout untuk upload banyak foto
    
    try {
        // Jika ada foto pending dan online, upload dulu ke Drive
        if (pendingPhotos.length > 0 && navigator.onLine) {
            progress.updateText(`Mengupload ${pendingPhotos.length} foto ke Drive...`);
            
            // Upload semua foto pending
            const uploadPromises = pendingPhotos.map(async (photo) => {
                try {
                    const result = await uploadSinglePhotoToDrive(photo.data, photo.filename);
                    if (result && result.url) {
                        // Update currentInput dengan URL
                        currentInput[photo.area][photo.param + '_photoUrl'] = result.url;
                        currentInput[photo.area][photo.param + '_photoUploaded'] = true;
                        return { success: true, param: photo.param };
                    }
                } catch (e) {
                    console.error('Failed upload:', photo.param, e);
                    return { success: false, param: photo.param };
                }
            });
            
            await Promise.all(uploadPromises);
            
            // Simpan perubahan (URL foto) ke localStorage
            localStorage.setItem(DRAFT_KEYS.LOGSHEET, JSON.stringify(currentInput));
        }
        
        // Siapkan data untuk dikirim ke Sheet
        let allParameters = {};
        let photoCount = 0;
        let driveLinks = []; // Array untuk menyimpan link Drive yang akan dimasukkan ke Sheet
        
        Object.entries(currentInput).forEach(([areaName, params]) => {
            Object.entries(params).forEach(([paramName, value]) => {
                // Hanya kirim nilai parameter (bukan metadata foto)
                if (!paramName.endsWith('_photoData') && !paramName.endsWith('_photoTime') && 
                    !paramName.endsWith('_photoOperator') && !paramName.endsWith('_photoUploaded')) {
                    
                    // Jika ini adalah URL foto, masukkan ke driveLinks
                    if (paramName.endsWith('_photoUrl') && value) {
                        driveLinks.push({
                            parameter: paramName.replace('_photoUrl', ''),
                            url: value
                        });
                        photoCount++;
                    } else {
                        // Parameter normal
                        allParameters[paramName] = value;
                    }
                }
            });
        });
        
        // Tambahkan metadata logsheet
        const finalData = {
            type: 'LOGSHEET_WITH_DRIVE_PHOTOS',
            Operator: currentUser ? currentUser.name : 'Unknown',
            OperatorId: currentUser ? currentUser.id : 'Unknown',
            PhotoCount: photoCount,
            DriveLinks: driveLinks, // Array objek {parameter, url}
            Timestamp: new Date().toISOString(),
            ...allParameters
        };
        
        progress.updateText('Menyimpan data ke Spreadsheet...');
        
        await Promise.race([
            fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
                signal: currentUploadController.signal
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Upload timeout')), 60000))
        ]);
        
        clearTimeout(autoAbortTimeout);
        progress.complete();
        
        showCustomAlert(`✓ Data berhasil dikirim! (${photoCount} foto di Google Drive)`, 'success');
        
        // Cleanup
        currentInput = {};
        localStorage.removeItem(DRAFT_KEYS.LOGSHEET);
        
        setTimeout(() => navigateTo('homeScreen'), 1500);
        
    } catch (error) {
        clearTimeout(autoAbortTimeout);
        console.error('[SendToSheet] Error:', error);
        progress.error();
        
        // Simpan ke offline queue
        let offlineData = JSON.parse(localStorage.getItem(DRAFT_KEYS.LOGSHEET_OFFLINE) || '[]');
        offlineData.push({
            ...finalData,
            pendingUpload: true,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem(DRAFT_KEYS.LOGSHEET_OFFLINE, JSON.stringify(offlineData));
        
        setTimeout(() => {
            showCustomAlert('Gagal mengirim. Data & foto disimpan lokal untuk upload ulang.', 'error');
        }, 500);
    } finally {
        currentUploadController = null;
    }
}

/**
 * Upload single photo ke Google Drive
 * @param {string} base64Data 
 * @param {string} filename 
 */
async function uploadSinglePhotoToDrive(base64Data, filename) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('action', 'uploadToDrive');
        formData.append('filename', filename);
        formData.append('data', base64Data);
        formData.append('mimeType', 'image/jpeg');
        formData.append('folderName', 'Turbine_Logsheets_' + new Date().toISOString().split('T')[0]); // Folder per hari
        
        fetch(GAS_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resolve({ url: data.url, id: data.fileId });
            } else {
                reject(new Error(data.error));
            }
        })
        .catch(reject);
    });
}

// ============================================
// 11. TPM FUNCTIONS
// ============================================

function updateTPMUserInfo() {
    const tpmHeaderUser = document.getElementById('tpmHeaderUser');
    const tpmInputUser = document.getElementById('tpmInputUser');
    
    if (tpmHeaderUser) tpmHeaderUser.textContent = currentUser?.name || 'Operator';
    if (tpmInputUser) tpmInputUser.textContent = currentUser?.name || 'Operator';
}

function openTPMArea(areaName) {
    if (!requireAuth()) return;
    
    activeTPMArea = areaName;
    currentTPMPhoto = null;
    currentTPMStatus = '';
    
    resetTPMForm();
    
    const title = document.getElementById('tpmInputTitle');
    if (title) title.textContent = areaName;
    
    updateTPMUserInfo();
    navigateTo('tpmInputScreen');
}

function resetTPMForm() {
    const preview = document.getElementById('tpmPhotoPreview');
    const photoSection = document.getElementById('tpmPhotoSection');
    
    if (preview) {
        preview.innerHTML = `
            <div class="photo-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Ambil Foto</span>
            </div>
        `;
    }
    
    if (photoSection) photoSection.classList.remove('has-photo');
    
    const notes = document.getElementById('tpmNotes');
    const action = document.getElementById('tpmAction');
    if (notes) notes.value = '';
    if (action) action.value = '';
    
    resetTPMStatusButtons();
}

function resetTPMStatusButtons() {
    ['btnNormal', 'btnAbnormal', 'btnOff'].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) btn.className = 'status-btn';
    });
}

async function handleTPMPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const originalSize = file.size;
    
    if (originalSize > 10 * 1024 * 1024) {
        showCustomAlert(`Ukuran foto terlalu besar (${formatFileSize(originalSize)}). Maksimal 10MB sebelum kompresi.`, 'error');
        event.target.value = '';
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        showCustomAlert('File harus berupa gambar.', 'error');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            showCustomAlert('📸 Mengkompresi foto...', 'info');
            
            const compressedPhoto = await compressImage(e.target.result, 1600, 0.85, 4.5);
            const compressedSize = getBase64Size(compressedPhoto);
            
            currentTPMPhoto = compressedPhoto;
            const preview = document.getElementById('tpmPhotoPreview');
            const photoSection = document.getElementById('tpmPhotoSection');
            
            if (preview) {
                preview.innerHTML = `<img src="${currentTPMPhoto}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" alt="TPM Photo">`;
            }
            if (photoSection) photoSection.classList.add('has-photo');
            
            const compressRatio = ((1 - (compressedSize / originalSize)) * 100).toFixed(0);
            showCustomAlert(`📸 Foto berhasil! (Dikurangi ${compressRatio}%)`, 'success');
            
        } catch (error) {
            console.error('TPM Compression error:', error);
            showCustomAlert('Gagal mengkompresi foto TPM.', 'error');
        }
    };
    reader.readAsDataURL(file);
}

function selectTPMStatus(status) {
    currentTPMStatus = status;
    resetTPMStatusButtons();
    
    const buttonMap = {
        'normal': { id: 'btnNormal', class: 'active-normal' },
        'abnormal': { id: 'btnAbnormal', class: 'active-abnormal' },
        'off': { id: 'btnOff', class: 'active-off' }
    };
    
    const selected = buttonMap[status];
    if (selected) {
        const btn = document.getElementById(selected.id);
        if (btn) btn.classList.add(selected.class);
    }
    
    if ((status === 'abnormal' || status === 'off') && !currentTPMPhoto) {
        setTimeout(() => {
            showCustomAlert('⚠️ Kondisi abnormal/off wajib didokumentasikan dengan foto!', 'warning');
        }, 100);
    }
}

async function submitTPMData() {
    if (!requireAuth()) return;
    
    const notes = document.getElementById('tpmNotes')?.value.trim() || '';
    const action = document.getElementById('tpmAction')?.value || '';
    
    if (!currentTPMStatus) {
        showCustomAlert('Pilih status kondisi terlebih dahulu!', 'error');
        return;
    }
    
    if (!currentTPMPhoto) {
        showCustomAlert('Ambil foto dokumentasi terlebih dahulu!', 'error');
        return;
    }
    
    if (!action) {
        showCustomAlert('Pilih tindakan yang dilakukan!', 'error');
        return;
    }
    
    const progress = showUploadProgress('Mengupload TPM...');
    currentUploadController = new AbortController();
    
    const autoAbort = setTimeout(() => {
        currentUploadController?.abort();
    }, 20000);
    
    const tpmData = {
        type: 'TPM',
        area: activeTPMArea,
        status: currentTPMStatus,
        action: action,
        notes: notes,
        photo: currentTPMPhoto,
        user: currentUser ? currentUser.name : 'Unknown',
        timestamp: new Date().toISOString()
    };
    
    try {
        await Promise.race([
            fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tpmData),
                signal: currentUploadController.signal
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('TPM Upload timeout')), 20000))
        ]);
        
        clearTimeout(autoAbort);
        progress.complete();
        
        let tpmHistory = JSON.parse(localStorage.getItem(DRAFT_KEYS.TPM_HISTORY) || '[]');
        tpmHistory.push({...tpmData, photo: '[UPLOADED]'});
        localStorage.setItem(DRAFT_KEYS.TPM_HISTORY, JSON.stringify(tpmHistory));
        
        showCustomAlert(`✓ Data TPM berhasil disimpan!`, 'success');
        currentTPMPhoto = null;
        currentTPMStatus = '';
        
        setTimeout(() => navigateTo('tpmScreen'), 1500);
        
    } catch (error) {
        clearTimeout(autoAbort);
        console.error('[TPM] Error:', error);
        progress.error();
        
        let offlineTPM = JSON.parse(localStorage.getItem(DRAFT_KEYS.TPM_OFFLINE) || '[]');
        offlineTPM.push(tpmData);
        localStorage.setItem(DRAFT_KEYS.TPM_OFFLINE, JSON.stringify(offlineTPM));
        
        showCustomAlert('Gagal upload. Data disimpan lokal.', 'error');
    } finally {
        currentUploadController = null;
    }
}

// ============================================
// 12. BALANCING FUNCTIONS
// ============================================

function initBalancingScreen() {
    if (!requireAuth()) return;
    
    const balancingUser = document.getElementById('balancingUser');
    if (balancingUser && currentUser) balancingUser.textContent = currentUser.name;
    
    detectShift();
    
    const draftData = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING));
    const hasDraft = draftData !== null;
    
    if (hasDraft) {
        loadBalancingDraft();
    } else {
        loadLastBalancingData();
    }
    
    calculateLPBalance();
    setupBalancingAutoSave();
    setTimeout(updateDraftStatusIndicator, 100);
}

function detectShift() {
    const hour = new Date().getHours();
    let shift = 3;
    let shiftText = "Shift 3 (23:00 - 07:00)";
    
    if (hour >= 7 && hour < 15) {
        shift = 1;
        shiftText = "Shift 1 (07:00 - 15:00)";
    } else if (hour >= 15 && hour < 23) {
        shift = 2;
        shiftText = "Shift 2 (15:00 - 23:00)";
    }
    
    currentShift = shift;
    
    const badge = document.getElementById('currentShiftBadge');
    const info = document.getElementById('balancingShiftInfo');
    const kegiatanNum = document.getElementById('kegiatanShiftNum');
    
    if (badge) badge.textContent = `SHIFT ${shift}`;
    if (info) info.textContent = `${shiftText} • Auto Save Aktif`;
    if (kegiatanNum) kegiatanNum.textContent = shift;
    
    if (badge) {
        const colors = [
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        ];
        badge.style.background = colors[shift - 1];
    }
    
    setDefaultDateTime();
}

function setDefaultDateTime() {
    const now = new Date();
    const dateInput = document.getElementById('balancingDate');
    const timeInput = document.getElementById('balancingTime');
    
    if (dateInput && !dateInput.value) dateInput.value = now.toISOString().split('T')[0];
    if (timeInput && !timeInput.value) timeInput.value = now.toTimeString().slice(0, 5);
}

function saveBalancingDraft() {
    try {
        const draftData = {};
        
        BALANCING_FIELDS.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                draftData[fieldId] = element.value;
            }
        });
        
        draftData._shift = currentShift;
        draftData._savedAt = new Date().toISOString();
        draftData._user = currentUser ? currentUser.name : 'Unknown';
        draftData._userId = currentUser ? currentUser.id : 'unknown';
        
        localStorage.setItem(DRAFT_KEYS.BALANCING, JSON.stringify(draftData));
        updateDraftStatusIndicator();
    } catch (e) {
        console.error('Error saving balancing draft:', e);
    }
}

function loadBalancingDraft() {
    try {
        const draftData = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING));
        if (!draftData) return false;
        
        let loadedCount = 0;
        BALANCING_FIELDS.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element && draftData[fieldId] !== undefined && draftData[fieldId] !== '') {
                element.value = draftData[fieldId];
                loadedCount++;
            }
        });
        
        const eksporEl = document.getElementById('eksporMW');
        if (eksporEl && eksporEl.value) {
            handleEksporInput(eksporEl);
        }
        
        calculateLPBalance();
        return loadedCount > 0;
    } catch (e) {
        console.error('Error loading balancing draft:', e);
        return false;
    }
}

function clearBalancingDraft() {
    try {
        localStorage.removeItem(DRAFT_KEYS.BALANCING);
        updateDraftStatusIndicator();
    } catch (e) {
        console.error('Error clearing balancing draft:', e);
    }
}

function setupBalancingAutoSave() {
    if (balancingAutoSaveInterval) {
        clearInterval(balancingAutoSaveInterval);
    }
    
    let lastData = '';
    balancingAutoSaveInterval = setInterval(() => {
        const currentData = JSON.stringify(getCurrentBalancingData());
        if (currentData !== lastData && hasBalancingData()) {
            saveBalancingDraft();
            lastData = currentData;
        }
    }, 10000);
    
    window.addEventListener('beforeunload', () => {
        if (hasBalancingData()) saveBalancingDraft();
    });
    
    const formContainer = document.getElementById('balancingScreen');
    if (formContainer) {
        let timeout;
        formContainer.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                clearTimeout(timeout);
                timeout = setTimeout(() => saveBalancingDraft(), 1000);
            }
        });
    }
}

function getCurrentBalancingData() {
    const data = {};
    BALANCING_FIELDS.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) data[fieldId] = element.value;
    });
    return data;
}

function hasBalancingData() {
    const data = getCurrentBalancingData();
    return Object.values(data).some(val => val !== '' && val !== null && val !== undefined);
}

function updateDraftStatusIndicator() {
    const indicator = document.getElementById('draftStatusIndicator');
    if (indicator) {
        const hasDraft = localStorage.getItem(DRAFT_KEYS.BALANCING) !== null;
        indicator.style.display = hasDraft ? 'flex' : 'none';
    }
}

async function loadLastBalancingData(fromSpreadsheet = true) {
    const loader = document.getElementById('loader');
    const loaderText = document.querySelector('.loader-text h3');
    
    if (loader) loader.style.display = 'flex';
    if (loaderText) loaderText.textContent = 'Mengambil data terakhir...';
    
    try {
        let lastData = null;
        let source = 'local';
        
        if (fromSpreadsheet && navigator.onLine) {
            try {
                const response = await fetch(`${GAS_URL}?action=getLastBalancing&t=${Date.now()}`, {
                    signal: AbortSignal.timeout(10000)
                });
                
                const result = await response.json();
                
                if (result.success && result.data) {
                    lastData = result.data;
                    source = 'spreadsheet';
                }
            } catch (fetchError) {
                console.warn('Gagal fetch dari spreadsheet:', fetchError);
            }
        }
        
        if (!lastData) {
            const history = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING_HISTORY) || '[]');
            if (history.length > 0) {
                lastData = history[history.length - 1];
                source = 'local';
            }
        }
        
        if (!lastData) {
            setDefaultDateTime();
            return;
        }
        
        // Mapping field dari server ke form
        const fieldMapping = {
            'loadMW': lastData['Load_MW'],
            'eksporMW': lastData['Ekspor_Impor_MW'],
            'plnMW': lastData['PLN_MW'],
            'ubbMW': lastData['UBB_MW'],
            'pieMW': lastData['PIE_MW'],
            'tg65MW': lastData['TG65_MW'],
            'tg66MW': lastData['TG66_MW'],
            'gtgMW': lastData['GTG_MW'],
            'ss6500MW': lastData['SS6500_MW'],
            'ss2000Via': lastData['SS2000_Via'],
            'activePowerMW': lastData['Active_Power_MW'],
            'reactivePowerMVAR': lastData['Reactive_Power_MVAR'],
            'currentS': lastData['Current_S_A'],
            'voltageV': lastData['Voltage_V'],
            'hvs65l02MW': lastData['HVS65_L02_MW'],
            'hvs65l02Current': lastData['HVS65_L02_Current_A'],
            'total3BMW': lastData['Total_3B_MW'],
            'fq1105': lastData['Produksi_Steam_SA_t/h'],
            'stgSteam': lastData['STG_Steam_t/h'],
            'pa2Steam': lastData['PA2_Steam_t/h'],
            'puri2Steam': lastData['Puri2_Steam_t/h'],
            'melterSA2': lastData['Melter_SA2_t/h'],
            'ejectorSteam': lastData['Ejector_t/h'],
            'glandSealSteam': lastData['Gland_Seal_t/h'],
            'deaeratorSteam': lastData['Deaerator_t/h'],
            'dumpCondenser': lastData['Dump_Condenser_t/h'],
            'pcv6105': lastData['PCV6105_t/h'],
            'pi6122': lastData['PI6122_kg/cm2'],
            'ti6112': lastData['TI6112_C'],
            'ti6146': lastData['TI6146_C'],
            'ti6126': lastData['TI6126_C'],
            'axialDisplacement': lastData['Axial_Displacement_mm'],
            'vi6102': lastData['VI6102_μm'],
            'te6134': lastData['TE6134_C'],
            'ctSuFan': lastData['CT_SU_Fan'],
            'ctSuPompa': lastData['CT_SU_Pompa'],
            'ctSaFan': lastData['CT_SA_Fan'],
            'ctSaPompa': lastData['CT_SA_Pompa'],
            'kegiatanShift': lastData['Kegiatan_Shift']
        };
        
        Object.entries(fieldMapping).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && value !== undefined && value !== null && value !== '') {
                el.value = value;
            }
        });
        
        const eksporEl = document.getElementById('eksporMW');
        if (eksporEl && eksporEl.value) {
            handleEksporInput(eksporEl);
        }
        
        calculateLPBalance();
        saveBalancingDraft();
        
        const msg = source === 'spreadsheet' 
            ? `✓ Data terakhir dari server dimuat.`
            : `✓ Data terakhir dari penyimpanan lokal dimuat.`;
        
        showCustomAlert(msg, 'success');
        
    } catch (e) {
        console.error('Error loading last data:', e);
        setDefaultDateTime();
    } finally {
        if (loader) loader.style.display = 'none';
    }
}

function resetBalancingForm() {
    if (!confirm('Yakin reset form? Semua data akan dikosongkan dan draft akan dihapus.')) {
        return;
    }
    
    clearBalancingDraft();
    setDefaultDateTime();
    
    BALANCING_FIELDS.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) element.value = '';
    });
    
    const selects = ['ss2000Via', 'melterSA2', 'ejectorSteam', 'glandSealSteam'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.selectedIndex = 0;
    });
    
    const eksporEl = document.getElementById('eksporMW');
    const eksporLabel = document.getElementById('eksporLabel');
    const eksporHint = document.getElementById('eksporHint');
    
    if (eksporEl) {
        eksporEl.setAttribute('data-state', '');
        eksporEl.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        eksporEl.style.background = 'rgba(15, 23, 42, 0.6)';
    }
    if (eksporLabel) {
        eksporLabel.textContent = 'Ekspor/Impor (MW)';
        eksporLabel.style.color = '#94a3b8';
    }
    if (eksporHint) {
        eksporHint.innerHTML = '💡 <strong>Minus (-) = Ekspor</strong> | <strong>Plus (+) = Impor</strong>';
        eksporHint.style.color = '#94a3b8';
    }
    
    calculateLPBalance();
    showCustomAlert('Form berhasil direset! Semua field dikosongkan.', 'success');
}

function handleEksporInput(input) {
    const label = document.getElementById('eksporLabel');
    const hint = document.getElementById('eksporHint');
    let value = parseFloat(input.value);
    
    if (isNaN(value) || input.value === '') {
        if (label) {
            label.textContent = 'Ekspor/Impor (MW)';
            label.style.color = '#94a3b8';
        }
        if (hint) {
            hint.innerHTML = '💡 <strong>Minus (-) = Ekspor</strong> | <strong>Plus (+) = Impor</strong>';
            hint.style.color = '#94a3b8';
        }
        input.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        input.style.background = 'rgba(15, 23, 42, 0.6)';
        input.setAttribute('data-state', '');
        return;
    }
    
    if (value < 0) {
        if (label) {
            label.textContent = 'Ekspor (MW)';
            label.style.color = '#10b981';
        }
        if (hint) {
            hint.innerHTML = '✓ Posisi: <strong>Ekspor ke Grid</strong> (Nilai negatif)';
            hint.style.color = '#10b981';
        }
        input.style.borderColor = '#10b981';
        input.style.background = 'rgba(16, 185, 129, 0.05)';
        input.setAttribute('data-state', 'ekspor');
        
    } else if (value > 0) {
        if (label) {
            label.textContent = 'Impor (MW)';
            label.style.color = '#f59e0b';
        }
        if (hint) {
            hint.innerHTML = '✓ Posisi: <strong>Impor dari Grid</strong> (Nilai positif)';
            hint.style.color = '#f59e0b';
        }
        input.style.borderColor = '#f59e0b';
        input.style.background = 'rgba(245, 158, 11, 0.05)';
        input.setAttribute('data-state', 'impor');
        
    } else {
        if (label) {
            label.textContent = 'Ekspor/Impor (MW)';
            label.style.color = '#94a3b8';
        }
        if (hint) {
            hint.innerHTML = '⚪ Posisi: <strong>Netral</strong> (Nilai 0)';
            hint.style.color = '#64748b';
        }
        input.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        input.style.background = 'rgba(15, 23, 42, 0.6)';
        input.setAttribute('data-state', '');
    }
}

function getEksporImporValue() {
    const input = document.getElementById('eksporMW');
    if (!input || !input.value) return 0;
    const value = parseFloat(input.value);
    return isNaN(value) ? 0 : value;
}

function calculateLPBalance() {
    const produksi = parseFloat(document.getElementById('fq1105')?.value) || 0;
    
    const konsumsiItems = [
        'stgSteam', 'pa2Steam', 'puri2Steam', 'deaeratorSteam',
        'dumpCondenser', 'pcv6105', 'melterSA2', 'ejectorSteam', 'glandSealSteam'
    ];
    
    let totalKonsumsi = 0;
    konsumsiItems.forEach(id => {
        totalKonsumsi += parseFloat(document.getElementById(id)?.value) || 0;
    });
    
    const totalDisplay = document.getElementById('totalKonsumsiSteam');
    if (totalDisplay) {
        totalDisplay.textContent = totalKonsumsi.toFixed(1) + ' t/h';
    }
    
    const balance = produksi - totalKonsumsi;
    
    const balanceField = document.getElementById('lpBalanceField');
    const balanceLabel = document.getElementById('lpBalanceLabel');
    const balanceInput = document.getElementById('lpBalanceValue');
    const balanceStatus = document.getElementById('lpBalanceStatus');
    
    if (balanceInput) balanceInput.value = Math.abs(balance).toFixed(1);
    
    if (balance < 0) {
        if (balanceLabel) balanceLabel.textContent = 'LPS Impor dari SU 3A (t/h)';
        if (balanceStatus) {
            balanceStatus.textContent = 'Posisi: Impor dari 3A (Produksi < Konsumsi)';
            balanceStatus.style.color = '#f59e0b';
        }
        if (balanceInput) {
            balanceInput.style.borderColor = '#f59e0b';
            balanceInput.style.color = '#f59e0b';
            balanceInput.style.background = 'rgba(245, 158, 11, 0.1)';
        }
        if (balanceField) {
            balanceField.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            balanceField.style.background = 'rgba(245, 158, 11, 0.05)';
        }
    } else {
        if (balanceLabel) balanceLabel.textContent = 'LPS Ekspor ke SU 3A (t/h)';
        if (balanceStatus) {
            balanceStatus.textContent = 'Posisi: Ekspor ke 3A (Produksi > Konsumsi)';
            balanceStatus.style.color = '#10b981';
        }
        if (balanceInput) {
            balanceInput.style.borderColor = '#10b981';
            balanceInput.style.color = '#10b981';
            balanceInput.style.background = 'rgba(16, 185, 129, 0.1)';
        }
        if (balanceField) {
            balanceField.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            balanceField.style.background = 'rgba(16, 185, 129, 0.05)';
        }
    }
    
    return balance;
}

function formatWhatsAppMessage(data) {
    const formatNum = (num, maxDecimals = 2) => {
        if (num === undefined || num === null || num === '' || isNaN(num)) return '-';
        const parsed = parseFloat(num);
        if (parsed === 0) return '0';
        return parsed.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: maxDecimals
        });
    };
    
    const formatInt = (num) => {
        if (num === undefined || num === null || num === '' || isNaN(num)) return '-';
        return parseInt(num).toLocaleString('id-ID');
    };
    
    const tglParts = data.Tanggal.split('-');
    const bulanIndo = {
        '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
        '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
        '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
    };
    const tglIndo = `${tglParts[2]} ${bulanIndo[tglParts[1]]} ${tglParts[0]}`;
    
    let message = `*Update STG 17,5 MW*\n`;
    message += `Tgl ${tglIndo}\n`;
    message += `Jam ${data.Jam}\n\n`;
    
    message += `*Output Power STG 17,5*\n`;
    message += `⠂ Load = ${formatNum(data.Load_MW)} MW\n`;
    message += `⠂ ${data.Ekspor_Impor_Status} = ${formatNum(Math.abs(data.Ekspor_Impor_MW), 3)} MW\n\n`;
    
    message += `*Balance Power SCADA*\n`;
    message += `⠂ PLN = ${formatNum(data.PLN_MW)}MW\n`;
    message += `⠂ UBB = ${formatNum(data.UBB_MW)}MW\n`;
    message += `⠂ PIE = ${formatNum(data.PIE_MW)} MW\n`;
    message += `⠂ TG-65 = ${formatNum(data.TG65_MW)} MW\n`;
    message += `⠂ TG-66 = ${formatNum(data.TG66_MW)} MW\n`;
    message += `⠂ GTG = ${formatNum(data.GTG_MW)} MW\n\n`;
    
    message += `*Konsumsi Power 3B*\n`;
    message += `● SS-6500 (TR-Main 01) = ${formatNum(data.SS6500_MW, 3)} MW\n`;
    message += `● SS-2000 *Via ${data.SS2000_Via}*\n`;
    message += `  ⠂ Active power = ${formatNum(data.Active_Power_MW, 3)} MW\n`;
    message += `  ⠂ Reactive power = ${formatNum(data.Reactive_Power_MVAR, 3)} MVAR\n`;
    message += `  ⠂ Current S = ${formatNum(data.Current_S_A, 1)} A\n`;
    message += `  ⠂ Voltage = ${formatInt(data.Voltage_V)} V\n`;
    message += `  ⠂ (HVS65 L02) = ${formatNum(data.HVS65_L02_MW, 3)} MW (${formatInt(data.HVS65_L02_Current_A)} A)\n`;
    message += `● Total 3B = ${formatNum(data.Total_3B_MW, 3)}MW\n\n`;
    
    message += `*Produksi Steam SA*\n`;
    message += `⠂ FQ-1105 = ${formatNum(data['Produksi_Steam_SA_t/h'], 1)} t/h\n\n`;
    
    message += `*Konsumsi Steam 3B*\n`;
    message += `⠂ STG 17,5 = ${formatNum(data['STG_Steam_t/h'], 1)} t/h\n`;
    message += `⠂ PA2 = ${formatNum(data['PA2_Steam_t/h'], 1)} t/h\n`;
    message += `⠂ Puri2 = ${formatNum(data['Puri2_Steam_t/h'], 1)} t/h\n`;
    message += `⠂ Melter SA2 = ${formatNum(data['Melter_SA2_t/h'], 1)} t/h\n`;
    message += `⠂ Ejector = ${formatNum(data['Ejector_t/h'], 1)} t/h\n`;
    message += `⠂ Gland Seal = ${formatNum(data['Gland_Seal_t/h'], 1)} t/h\n`;
    message += `⠂ Deaerator = ${formatNum(data['Deaerator_t/h'], 1)} t/h\n`;
    message += `⠂ Dump Condenser = ${formatNum(data['Dump_Condenser_t/h'], 1)} t/h\n`;
    message += `⠂ PCV-6105 = ${formatNum(data['PCV6105_t/h'], 1)} t/h\n`;
    message += `*⠂ Total Konsumsi* = ${formatNum(data['Total_Konsumsi_Steam_t/h'], 1)} t/h\n\n`;
    
    message += `*${data.LPS_Balance_Status}* = ${formatNum(data['LPS_Balance_t/h'], 1)} t/h\n\n`;
    
    message += `*Monitoring*\n`;
    message += `⠂ Steam Extraction PI-6122 = ${formatNum(data['PI6122_kg/cm2'], 2)} kg/cm² & TI-6112 = ${formatNum(data['TI6112_C'], 1)} °C\n`;
    message += `⠂ Temp. Cooling Air Inlet (TI-6146/47) = ${formatNum(data['TI6146_C'], 2)} °C\n`;
    message += `⠂ Temp. Lube Oil (TI-6126) = ${formatNum(data['TI6126_C'], 2)} °C\n`;
    message += `⠂ Axial Displacement = ${formatNum(data['Axial_Displacement_mm'], 2)} mm (High : 0,6 mm)\n`;
    message += `⠂ Vibrasi VI-6102 = ${formatNum(data['VI6102_μm'], 2)} μm (High : 85 μm)\n`;
    message += `⠂ Temp. Journal Bearing TE-6134 = ${formatNum(data['TE6134_C'], 1)} °C (High : 115 °C)\n`;
    message += `⠂ CT SU = Fan : ${formatInt(data['CT_SU_Fan'])} & Pompa : ${formatInt(data['CT_SU_Pompa'])}\n`;
    message += `⠂ CT SA = Fan : ${formatInt(data['CT_SA_Fan'])} & Pompa : ${formatInt(data['CT_SA_Pompa'])}\n\n`;
    
    message += `*Kegiatan Shift ${data.Shift}*\n`;
    message += data.Kegiatan_Shift || '-';
    
    return message;
}

async function submitBalancingData() {
    if (!requireAuth()) return;
    
    const requiredFields = ['loadMW', 'fq1105', 'stgSteam'];
    for (let id of requiredFields) {
        const el = document.getElementById(id);
        if (!el || !el.value) {
            showCustomAlert(`Field ${id} wajib diisi!`, 'error');
            if (el) el.focus();
            return;
        }
    }
    
    const progress = showUploadProgress('Mengirim Data Balancing...');
    currentUploadController = new AbortController();
    
    const autoAbort = setTimeout(() => {
        currentUploadController?.abort();
    }, 30000);
    
    const eksporValue = getEksporImporValue();
    const lpBalance = calculateLPBalance();
    
    const balancingData = {
        type: 'BALANCING',
        Operator: currentUser ? currentUser.name : 'Unknown',
        Timestamp: new Date().toISOString(),
        
        Tanggal: document.getElementById('balancingDate')?.value || '',
        Jam: document.getElementById('balancingTime')?.value || '',
        Shift: currentShift,
        
        'Load_MW': parseFloat(document.getElementById('loadMW')?.value) || 0,
        'Ekspor_Impor_MW': eksporValue,
        'Ekspor_Impor_Status': eksporValue > 0 ? 'Impor' : (eksporValue < 0 ? 'Ekspor' : 'Netral'),
        
        'PLN_MW': parseFloat(document.getElementById('plnMW')?.value) || 0,
        'UBB_MW': parseFloat(document.getElementById('ubbMW')?.value) || 0,
        'PIE_MW': parseFloat(document.getElementById('pieMW')?.value) || 0,
        'TG65_MW': parseFloat(document.getElementById('tg65MW')?.value) || 0,
        'TG66_MW': parseFloat(document.getElementById('tg66MW')?.value) || 0,
        'GTG_MW': parseFloat(document.getElementById('gtgMW')?.value) || 0,
        
        'SS6500_MW': parseFloat(document.getElementById('ss6500MW')?.value) || 0,
        'SS2000_Via': document.getElementById('ss2000Via')?.value || 'TR-Main01',
        'Active_Power_MW': parseFloat(document.getElementById('activePowerMW')?.value) || 0,
        'Reactive_Power_MVAR': parseFloat(document.getElementById('reactivePowerMVAR')?.value) || 0,
        'Current_S_A': parseFloat(document.getElementById('currentS')?.value) || 0,
        'Voltage_V': parseFloat(document.getElementById('voltageV')?.value) || 0,
        'HVS65_L02_MW': parseFloat(document.getElementById('hvs65l02MW')?.value) || 0,
        'HVS65_L02_Current_A': parseFloat(document.getElementById('hvs65l02Current')?.value) || 0,
        'Total_3B_MW': parseFloat(document.getElementById('total3BMW')?.value) || 0,
        
        'Produksi_Steam_SA_t/h': parseFloat(document.getElementById('fq1105')?.value) || 0,
        'STG_Steam_t/h': parseFloat(document.getElementById('stgSteam')?.value) || 0,
        'PA2_Steam_t/h': parseFloat(document.getElementById('pa2Steam')?.value) || 0,
        'Puri2_Steam_t/h': parseFloat(document.getElementById('puri2Steam')?.value) || 0,
        'Melter_SA2_t/h': parseFloat(document.getElementById('melterSA2')?.value) || 0,
        'Ejector_t/h': parseFloat(document.getElementById('ejectorSteam')?.value) || 0,
        'Gland_Seal_t/h': parseFloat(document.getElementById('glandSealSteam')?.value) || 0,
        'Deaerator_t/h': parseFloat(document.getElementById('deaeratorSteam')?.value) || 0,
        'Dump_Condenser_t/h': parseFloat(document.getElementById('dumpCondenser')?.value) || 0,
        'PCV6105_t/h': parseFloat(document.getElementById('pcv6105')?.value) || 0,
        'Total_Konsumsi_Steam_t/h': parseFloat(document.getElementById('totalKonsumsiSteam')?.textContent) || 0,
        'LPS_Balance_t/h': Math.abs(lpBalance),
        'LPS_Balance_Status': lpBalance < 0 ? 'Impor dari 3A' : 'Ekspor ke 3A',
        
        'PI6122_kg/cm2': parseFloat(document.getElementById('pi6122')?.value) || 0,
        'TI6112_C': parseFloat(document.getElementById('ti6112')?.value) || 0,
        'TI6146_C': parseFloat(document.getElementById('ti6146')?.value) || 0,
        'TI6126_C': parseFloat(document.getElementById('ti6126')?.value) || 0,
        'Axial_Displacement_mm': parseFloat(document.getElementById('axialDisplacement')?.value) || 0,
        'VI6102_μm': parseFloat(document.getElementById('vi6102')?.value) || 0,
        'TE6134_C': parseFloat(document.getElementById('te6134')?.value) || 0,
        'CT_SU_Fan': parseInt(document.getElementById('ctSuFan')?.value) || 0,
        'CT_SU_Pompa': parseInt(document.getElementById('ctSuPompa')?.value) || 0,
        'CT_SA_Fan': parseInt(document.getElementById('ctSaFan')?.value) || 0,
        'CT_SA_Pompa': parseInt(document.getElementById('ctSaPompa')?.value) || 0,
        
        'Kegiatan_Shift': document.getElementById('kegiatanShift')?.value || ''
    };
    
    try {
        await Promise.race([
            fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(balancingData),
                signal: currentUploadController.signal
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Balancing timeout')), 30000))
        ]);
        
        clearTimeout(autoAbort);
        progress.complete();
        
        let balancingHistory = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING_HISTORY) || '[]');
        balancingHistory.push({
            ...balancingData,
            submittedAt: new Date().toISOString()
        });
        localStorage.setItem(DRAFT_KEYS.BALANCING_HISTORY, JSON.stringify(balancingHistory));
        
        showCustomAlert('✓ Data Balancing berhasil dikirim!', 'success');
        
        setTimeout(() => {
            const waMessage = encodeURIComponent(formatWhatsAppMessage(balancingData));
            const waNumber = '6281382160345';
            window.open(`https://wa.me/${waNumber}?text=${waMessage}`, '_blank');
            navigateTo('homeScreen');
        }, 1000);
        
    } catch (error) {
        clearTimeout(autoAbort);
        console.error('Balancing Error:', error);
        progress.error();
        
        let offlineBalancing = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING_OFFLINE) || '[]');
        offlineBalancing.push(balancingData);
        localStorage.setItem(DRAFT_KEYS.BALANCING_OFFLINE, JSON.stringify(offlineBalancing));
        
        setTimeout(() => {
            showCustomAlert('Gagal mengirim. Data disimpan lokal.', 'error');
        }, 500);
    } finally {
        currentUploadController = null;
    }
}

function toggleSS2000Detail() {
    const select = document.getElementById('ss2000Via');
    const detail = document.getElementById('ss2000Detail');
    if (select && detail) {
        detail.style.display = select.value ? 'block' : 'none';
    }
}

// ============================================
// 13. CT LOGSHEET FUNCTIONS
// ============================================

async function fetchLastDataCT() {
    updateStatusIndicator(false);
    
    try {
        const callbackName = 'jsonp_ct_' + Date.now();
        const result = await Promise.race([
            safeJSONP(`${GAS_URL}?action=getLastCT&callback=${callbackName}`, callbackName, 8000),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]);
        
        lastDataCT = result || {};
        updateStatusIndicator(true);
        renderCTMenu();
    } catch (error) {
        console.warn('Fetch CT last data failed:', error);
        renderCTMenu();
    }
}

function renderCTMenu() {
    const list = document.getElementById('ctAreaList');
    if (!list) return;
    
    const totalAreas = Object.keys(AREAS_CT).length;
    let completedAreas = 0;
    let html = '';
    
    Object.entries(AREAS_CT).forEach(([areaName, params]) => {
        const areaData = currentInputCT[areaName] || {};
        const filled = Object.keys(areaData).length;
        const total = params.length;
        const percent = Math.round((filled / total) * 100);
        const isCompleted = filled === total && total > 0;
        
        const hasAbnormal = params.some(paramName => {
            const val = areaData[paramName] || '';
            const firstLine = val.split('\n')[0];
            return ['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine);
        });
        
        if (isCompleted) completedAreas++;
        
        const circumference = 2 * Math.PI * 18;
        const strokeDashoffset = circumference - (percent / 100) * circumference;
        
        html += `
            <div class="area-item ${isCompleted ? 'completed' : ''} ${hasAbnormal ? 'has-warning' : ''}" onclick="openCTArea('${areaName}')">
                <div class="area-progress-ring">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
                        <circle cx="20" cy="20" r="18" fill="none" stroke="${isCompleted ? '#10b981' : '#3b82f6'}" 
                                stroke-width="3" stroke-linecap="round" stroke-dasharray="${circumference}" 
                                stroke-dashoffset="${strokeDashoffset}" transform="rotate(-90 20 20)"/>
                        <text x="20" y="24" text-anchor="middle" font-size="10" font-weight="bold" fill="${isCompleted ? '#10b981' : '#f8fafc'}">${filled}</text>
                    </svg>
                </div>
                <div class="area-info">
                    <div class="area-name">${areaName}</div>
                    <div class="area-meta ${hasAbnormal ? 'warning' : ''}">
                        ${hasAbnormal ? '⚠️ Ada parameter bermasalah • ' : ''}${filled} dari ${total} parameter
                    </div>
                </div>
                <div class="area-status">
                    ${hasAbnormal ? '<span style="color: #ef4444; margin-right: 4px;">!</span>' : ''}
                    ${isCompleted ? '✓' : '❯'}
                </div>
            </div>
        `;
    });
    
    list.innerHTML = html;
    
    const hasData = Object.keys(currentInputCT).length > 0;
    const submitBtn = document.getElementById('ctSubmitBtn');
    if (submitBtn) submitBtn.style.display = hasData ? 'flex' : 'none';
    
    updateCTOverallProgressUI(completedAreas, totalAreas);
}

function updateCTOverallProgress() {
    const totalAreas = Object.keys(AREAS_CT).length;
    let completedAreas = 0;
    Object.entries(AREAS_CT).forEach(([areaName, params]) => {
        const filled = currentInputCT[areaName] ? Object.keys(currentInputCT[areaName]).length : 0;
        if (filled === params.length && filled > 0) completedAreas++;
    });
    updateCTOverallProgressUI(completedAreas, totalAreas);
}

function updateCTOverallProgressUI(completedAreas, totalAreas) {
    const percent = Math.round((completedAreas / totalAreas) * 100);
    const progressText = document.getElementById('ctProgressText');
    const overallPercent = document.getElementById('ctOverallPercent');
    const overallProgressBar = document.getElementById('ctOverallProgressBar');
    
    if (progressText) progressText.textContent = `${percent}% Complete`;
    if (overallPercent) overallPercent.textContent = `${percent}%`;
    if (overallProgressBar) overallProgressBar.style.width = `${percent}%`;
}

function openCTArea(areaName) {
    if (!requireAuth()) return;
    
    activeAreaCT = areaName;
    activeIdxCT = 0;
    navigateTo('ctParamScreen');
    const currentAreaName = document.getElementById('ctCurrentAreaName');
    if (currentAreaName) currentAreaName.textContent = areaName;
    renderCTProgressDots();
    showCTStep();
}

function renderCTProgressDots() {
    const container = document.getElementById('ctProgressDots');
    if (!container) return;
    const total = AREAS_CT[activeAreaCT].length;
    let html = '';
    
    for (let i = 0; i < total; i++) {
        const fullLabel = AREAS_CT[activeAreaCT][i];
        const savedValue = currentInputCT[activeAreaCT]?.[fullLabel] || '';
        const lines = savedValue.split('\n');
        const firstLine = lines[0];
        
        const isFilled = savedValue !== '';
        const hasIssue = ['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine);
        const isActive = i === activeIdxCT;
        
        let className = '';
        if (isActive) className = 'active';
        else if (hasIssue) className = 'has-issue';
        else if (isFilled) className = 'filled';
        
        html += `<div class="progress-dot ${className}" onclick="jumpToCTStep(${i})" title="${hasIssue ? firstLine : ''}"></div>`;
    }
    container.innerHTML = html;
}

function jumpToCTStep(index) {
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    const input = document.getElementById('ctValInput');
    
    if (input && input.value.trim()) {
        if (!currentInputCT[activeAreaCT]) currentInputCT[activeAreaCT] = {};
        
        const checkedStatus = document.querySelector('input[name="ctParamStatus"]:checked');
        const note = document.getElementById('ctStatusNote')?.value || '';
        let valueToSave = input.value.trim();
        
        if (checkedStatus) {
            if (note) {
                valueToSave = `${checkedStatus.value}\n${note}`;
            } else {
                valueToSave = checkedStatus.value;
            }
        }
        
        currentInputCT[activeAreaCT][fullLabel] = valueToSave;
        localStorage.setItem(DRAFT_KEYS_CT.LOGSHEET, JSON.stringify(currentInputCT));
    }
    
    activeIdxCT = index;
    showCTStep();
    renderCTProgressDots();
}

function detectCTInputType(label) {
    if (label.includes('(A/M)') || label.includes('(A/B)')) {
        return {
            type: 'select',
            options: label.includes('(A/M)') ? ['Auto', 'Manual'] : ['A', 'B', 'AB'],
            pattern: label.includes('(A/M)') ? '(A/M)' : '(A/B)'
        };
    }
    if (label.includes('STATUS') || label.includes('Running') || label.includes('ON/OFF')) {
        return {
            type: 'select',
            options: ['Running', 'Stop', 'Standby'],
            pattern: 'STATUS'
        };
    }
    return { type: 'text', options: null, pattern: null };
}

function getCTUnit(label) {
    const match = label.match(/\(([^)]+)\)/);
    return match ? match[1] : "";
}

function getCTParamName(label) {
    return label.split(' (')[0];
}

function handleCTStatusChange(checkbox) {
    const chip = checkbox.closest('.status-chip');
    const noteContainer = document.getElementById('ctStatusNoteContainer');
    const valInput = document.getElementById('ctValInput');
    
    document.querySelectorAll('input[name="ctParamStatus"]').forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
            cb.closest('.status-chip').classList.remove('active');
        }
    });
    
    if (checkbox.checked) {
        chip.classList.add('active');
        if (noteContainer) noteContainer.style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('ctStatusNote')?.focus();
        }, 100);
        
        if (checkbox.value === 'NOT_INSTALLED' && valInput) {
            valInput.value = '-';
            valInput.disabled = true;
            valInput.style.opacity = '0.5';
            valInput.style.background = 'rgba(100, 116, 139, 0.2)';
        }
    } else {
        chip.classList.remove('active');
        if (noteContainer) noteContainer.style.display = 'none';
        const noteInput = document.getElementById('ctStatusNote');
        if (noteInput) noteInput.value = '';
        
        if (valInput) {
            valInput.value = '';
            valInput.disabled = false;
            valInput.style.opacity = '1';
            valInput.style.background = '';
            valInput.focus();
        }
    }
    
    saveCurrentCTStatusToDraft();
}

function saveCurrentCTStatusToDraft() {
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    const input = document.getElementById('ctValInput');
    const checkedStatus = document.querySelector('input[name="ctParamStatus"]:checked');
    const note = document.getElementById('ctStatusNote')?.value || '';
    
    if (!currentInputCT[activeAreaCT]) currentInputCT[activeAreaCT] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    if (checkedStatus) {
        if (note) {
            valueToSave = `${checkedStatus.value}\n${note}`;
        } else {
            valueToSave = checkedStatus.value;
        }
    }
    
    if (valueToSave) {
        currentInputCT[activeAreaCT][fullLabel] = valueToSave;
    } else {
        delete currentInputCT[activeAreaCT][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS_CT.LOGSHEET, JSON.stringify(currentInputCT));
    renderCTProgressDots();
}

function loadCTAbnormalStatus(fullLabel) {
    document.querySelectorAll('input[name="ctParamStatus"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.status-chip').classList.remove('active');
    });
    
    const noteContainer = document.getElementById('ctStatusNoteContainer');
    const noteInput = document.getElementById('ctStatusNote');
    const valInput = document.getElementById('ctValInput');
    
    if (noteContainer) noteContainer.style.display = 'none';
    if (noteInput) noteInput.value = '';
    
    if (valInput) {
        valInput.disabled = false;
        valInput.style.opacity = '1';
        valInput.style.background = '';
        valInput.value = '';
    }
    
    if (currentInputCT[activeAreaCT] && currentInputCT[activeAreaCT][fullLabel]) {
        const savedValue = currentInputCT[activeAreaCT][fullLabel];
        const lines = savedValue.split('\n');
        const firstLine = lines[0];
        const secondLine = lines[1] || '';
        
        const isStatus = ['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine);
        
        if (isStatus) {
            const checkbox = document.querySelector(`input[value="${firstLine}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.closest('.status-chip').classList.add('active');
                if (noteContainer) noteContainer.style.display = 'block';
                if (noteInput) noteInput.value = secondLine;
                
                if (firstLine === 'NOT_INSTALLED' && valInput) {
                    valInput.value = '-';
                    valInput.disabled = true;
                    valInput.style.opacity = '0.5';
                    valInput.style.background = 'rgba(100, 116, 139, 0.2)';
                }
            }
        } else {
            if (valInput) valInput.value = savedValue;
        }
    }
}

function showCTStep() {
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    const total = AREAS_CT[activeAreaCT].length;
    const inputType = detectCTInputType(fullLabel);
    currentInputTypeCT = inputType.type;
    
    const stepInfo = document.getElementById('ctStepInfo');
    const areaProgress = document.getElementById('ctAreaProgress');
    const labelInput = document.getElementById('ctLabelInput');
    const lastTimeLabel = document.getElementById('ctLastTimeLabel');
    const prevValDisplay = document.getElementById('ctPrevValDisplay');
    const inputFieldContainer = document.getElementById('ctInputFieldContainer');
    const unitDisplay = document.getElementById('ctUnitDisplay');
    const mainInputWrapper = document.getElementById('ctMainInputWrapper');
    
    if (stepInfo) stepInfo.textContent = `Step ${activeIdxCT + 1}/${total}`;
    if (areaProgress) areaProgress.textContent = `${activeIdxCT + 1}/${total}`;
    if (labelInput) labelInput.textContent = getCTParamName(fullLabel);
    if (lastTimeLabel) lastTimeLabel.textContent = lastDataCT._lastTime || '--:--';
    
    let prevVal = lastDataCT[fullLabel] || '--';
    if (prevVal !== '--') {
        const lines = prevVal.toString().split('\n');
        const firstLine = lines[0];
        if (['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine)) {
            prevVal = firstLine + (lines[1] ? ' - ' + lines[1] : '');
        }
    }
    if (prevValDisplay) prevValDisplay.textContent = prevVal;
    
    if (inputType.type === 'select') {
        let currentValue = (currentInputCT[activeAreaCT] && currentInputCT[activeAreaCT][fullLabel]) || '';
        if (currentValue) {
            const lines = currentValue.split('\n');
            const firstLine = lines[0];
            if (!['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine)) {
                currentValue = firstLine;
            } else {
                currentValue = '';
            }
        }
        
        let optionsHtml = `<option value="" disabled ${!currentValue ? 'selected' : ''}>Pilih Status...</option>`;
        inputType.options.forEach(opt => {
            const selected = currentValue === opt ? 'selected' : '';
            optionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
        });
        
        if (inputFieldContainer) {
            inputFieldContainer.innerHTML = `
                <div class="select-wrapper">
                    <select id="ctValInput" class="status-select">${optionsHtml}</select>
                    <div class="select-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                </div>
            `;
        }
        if (unitDisplay) unitDisplay.style.display = 'none';
        if (mainInputWrapper) mainInputWrapper.classList.add('has-select');
    } else {
        let currentValue = (currentInputCT[activeAreaCT] && currentInputCT[activeAreaCT][fullLabel]) || '';
        
        if (currentValue) {
            const lines = currentValue.split('\n');
            const firstLine = lines[0];
            if (!['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine)) {
                currentValue = firstLine;
            } else {
                currentValue = '';
            }
        }
        
        if (inputFieldContainer) {
            inputFieldContainer.innerHTML = `<input type="text" id="ctValInput" inputmode="decimal" placeholder="0.00" value="${currentValue}" autocomplete="off">`;
        }
        if (unitDisplay) {
            unitDisplay.textContent = getCTUnit(fullLabel) || '--';
            unitDisplay.style.display = 'flex';
        }
        if (mainInputWrapper) mainInputWrapper.classList.remove('has-select');
    }
    
    loadCTAbnormalStatus(fullLabel);
    renderCTProgressDots();
    
    setTimeout(() => {
        const input = document.getElementById('ctValInput');
        if (input && inputType.type === 'text' && !input.disabled) {
            input.focus();
            input.select();
        }
    }, 100);
}

function saveCTStep() {
    const input = document.getElementById('ctValInput');
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    
    if (!currentInputCT[activeAreaCT]) currentInputCT[activeAreaCT] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    const checkedStatus = document.querySelector('input[name="ctParamStatus"]:checked');
    const note = document.getElementById('ctStatusNote')?.value || '';
    
    if (checkedStatus) {
        if (checkedStatus.value === 'NOT_INSTALLED') {
            valueToSave = 'NOT_INSTALLED';
            if (note) valueToSave += '\n' + note;
        } else {
            if (note) {
                valueToSave = `${checkedStatus.value}\n${note}`;
            } else {
                valueToSave = checkedStatus.value;
            }
        }
    }
    
    if (valueToSave) {
        currentInputCT[activeAreaCT][fullLabel] = valueToSave;
    } else {
        delete currentInputCT[activeAreaCT][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS_CT.LOGSHEET, JSON.stringify(currentInputCT));
    
    if (activeIdxCT < AREAS_CT[activeAreaCT].length - 1) {
        activeIdxCT++;
        showCTStep();
    } else {
        showCustomAlert(`Area ${activeAreaCT} selesai diisi!`, 'success');
        setTimeout(() => navigateTo('ctAreaListScreen'), 1500);
    }
}

function goBackCT() {
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    const input = document.getElementById('ctValInput');
    
    if (!currentInputCT[activeAreaCT]) currentInputCT[activeAreaCT] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    const checkedStatus = document.querySelector('input[name="ctParamStatus"]:checked');
    const note = document.getElementById('ctStatusNote')?.value || '';
    
    if (checkedStatus) {
        if (checkedStatus.value === 'NOT_INSTALLED') {
            valueToSave = 'NOT_INSTALLED';
            if (note) valueToSave += '\n' + note;
        } else {
            if (note) {
                valueToSave = `${checkedStatus.value}\n${note}`;
            } else {
                valueToSave = checkedStatus.value;
            }
        }
    }
    
    if (valueToSave) {
        currentInputCT[activeAreaCT][fullLabel] = valueToSave;
    } else {
        delete currentInputCT[activeAreaCT][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS_CT.LOGSHEET, JSON.stringify(currentInputCT));
    
    if (activeIdxCT > 0) {
        activeIdxCT--;
        showCTStep();
    } else {
        navigateTo('ctAreaListScreen');
    }
}

async function sendCTToSheet() {
    if (!requireAuth()) return;
    
    const progress = showUploadProgress('Mengirim Logsheet CT...');
    currentUploadController = new AbortController();
    
    const autoAbort = setTimeout(() => {
        currentUploadController?.abort();
    }, 25000);
    
    let allParameters = {};
    Object.entries(currentInputCT).forEach(([areaName, params]) => {
        Object.entries(params).forEach(([paramName, value]) => {
            allParameters[paramName] = value;
        });
    });
    
    const finalData = {
        type: 'LOGSHEET_CT',
        Operator: currentUser ? currentUser.name : 'Unknown',
        OperatorId: currentUser ? currentUser.id : 'Unknown',
        ...allParameters
    };
    
    console.log('Sending CT Logsheet Data...');
    
    try {
        await Promise.race([
            fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
                signal: currentUploadController.signal
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('CT Upload timeout')), 25000))
        ]);
        
        clearTimeout(autoAbort);
        progress.complete();
        
        showCustomAlert('✓ Data CT berhasil dikirim ke sistem!', 'success');
        
        currentInputCT = {};
        localStorage.removeItem(DRAFT_KEYS_CT.LOGSHEET);
        
        setTimeout(() => navigateTo('homeScreen'), 1500);
        
    } catch (error) {
        clearTimeout(autoAbort);
        console.error('Error sending CT data:', error);
        progress.error();
        
        let offlineData = JSON.parse(localStorage.getItem(DRAFT_KEYS_CT.OFFLINE) || '[]');
        offlineData.push(finalData);
        localStorage.setItem(DRAFT_KEYS_CT.OFFLINE, JSON.stringify(offlineData));
        
        setTimeout(() => {
            showCustomAlert('Gagal mengirim. Data disimpan lokal.', 'error');
        }, 500);
    } finally {
        currentUploadController = null;
    }
}

// ============================================
// 14. UI & EVENT LISTENERS
// ============================================

function setupLoginListeners() {
    const usernameInput = document.getElementById('operatorUsername');
    const passwordInput = document.getElementById('operatorPassword');
    
    if (usernameInput) {
        usernameInput.addEventListener('input', hideLoginError);
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') passwordInput?.focus();
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', hideLoginError);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginOperator();
        });
    }
}

function setupTPMListeners() {
    const tpmCamera = document.getElementById('tpmCamera');
    if (tpmCamera) {
        tpmCamera.addEventListener('change', handleTPMPhoto);
    }
}

function simulateLoading() {
    let progress = 0;
    const loaderProgress = document.getElementById('loaderProgress');
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                const loader = document.getElementById('loader');
                if (loader) loader.style.display = 'none';
            }, 500);
        }
        if (loaderProgress) loaderProgress.style.width = progress + '%';
    }, 300);
}

function loadUserStats() {
    const totalAreas = Object.keys(AREAS).length;
    let completedAreas = 0;
    
    Object.entries(AREAS).forEach(([areaName, params]) => {
        const filled = currentInput[areaName] ? Object.keys(currentInput[areaName]).filter(k => !k.includes('_photo')).length : 0;
        if (filled === params.length && filled > 0) completedAreas++;
    });
    
    const statProgress = document.getElementById('statProgress');
    const statAreas = document.getElementById('statAreas');
    
    if (statProgress) {
        const percent = Math.round((completedAreas / totalAreas) * 100);
        statProgress.textContent = `${percent}%`;
    }
    
    if (statAreas) {
        statAreas.textContent = `${completedAreas}/${totalAreas}`;
    }
}

// ============================================
// 15. PWA INSTALL HANDLER
// ============================================

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (!isAppInstalled() && !installBannerShown) {
        setTimeout(() => showCustomInstallBanner(), 3000);
    }
});

window.addEventListener('appinstalled', () => {
    hideCustomInstallBanner();
    deferredPrompt = null;
    installBannerShown = true;
    showToast('✓ Aplikasi berhasil diinstall!', 'success');
});

function showCustomInstallBanner() {
    if (document.getElementById('customInstallBanner')) return;
    
    const banner = document.createElement('div');
    banner.id = 'customInstallBanner';
    banner.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 20px;
            padding: 32px 24px;
            width: 90%;
            max-width: 340px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            z-index: 10002;
            text-align: center;
            animation: scaleIn 0.3s ease;
        ">
            <div style="
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
            ">
                ⚡
            </div>
            
            <h3 style="color: #f8fafc; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">
                Install Aplikasi
            </h3>
            
            <p style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 24px; line-height: 1.5;">
                Tambahkan Turbine Log ke layar utama untuk akses lebih cepat.
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="installPWA()" style="
                    width: 100%;
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    Install Sekarang
                </button>
                
                <button onclick="hideCustomInstallBanner()" style="
                    width: 100%;
                    padding: 12px 24px;
                    background: transparent;
                    color: #64748b;
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 12px;
                    font-size: 0.9375rem;
                    cursor: pointer;
                ">
                    Nanti Saja
                </button>
            </div>
        </div>
        
        <div style="
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 10001;
        " onclick="hideCustomInstallBanner()"></div>
    `;
    
    document.body.appendChild(banner);
    installBannerShown = true;
}

function hideCustomInstallBanner() {
    const banner = document.getElementById('customInstallBanner');
    if (banner) {
        banner.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => banner.remove(), 200);
    }
}

async function installPWA() {
    if (!deferredPrompt) {
        showToast('Aplikasi sudah terinstall atau browser tidak mendukung', 'info');
        return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        hideCustomInstallBanner();
        showToast('✓ Menginstall aplikasi...', 'success');
    } else {
        hideCustomInstallBanner();
    }
    
    deferredPrompt = null;
}

function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
}

function showToast(msg, type) {
    console.log(`[${type}] ${msg}`);
}

// ============================================
// 16. KEYBOARD SHORTCUTS & EMERGENCY RESET
// ============================================

let escPressCount = 0;
let escResetTimer = null;

document.addEventListener('keydown', (e) => {
    const paramScreen = document.getElementById('paramScreen');
    const ctParamScreen = document.getElementById('ctParamScreen');
    
    if (paramScreen && paramScreen.classList.contains('active')) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentInputType !== 'select') saveStep();
        } else if (e.key === 'Escape') {
            goBack();
        }
    }
    
    if (ctParamScreen && ctParamScreen.classList.contains('active')) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentInputTypeCT !== 'select') saveCTStep();
        } else if (e.key === 'Escape') {
            goBackCT();
        }
    }
    
    // Emergency reset dengan triple-tap ESC
    if (e.key === 'Escape') {
        escPressCount++;
        
        if (escPressCount === 1) {
            escResetTimer = setTimeout(() => {
                escPressCount = 0;
            }, 2000);
        }
        
        if (escPressCount >= 3) {
            clearTimeout(escResetTimer);
            escPressCount = 0;
            emergencyResetUpload();
        }
    }
});

// ============================================
// 17. DOM READY INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    initState();
    
    const versionDisplay = document.getElementById('versionDisplay');
    if (versionDisplay) versionDisplay.textContent = APP_VERSION;
    
    initAuth();
    setupLoginListeners();
    setupTPMListeners();
    initParamCameraListener();
    
    simulateLoading();
    
    console.log(`${APP_NAME} v${APP_VERSION} initialized successfully`);
});
