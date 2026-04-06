(() => {
    const protoLine1 = document.getElementById("lyric-line-1");
    const protoLine2 = document.getElementById("lyric-line-2");
    const subLine = document.getElementById("lyric-sub");
    const bgVideo = document.querySelector(".bg-video");
    const referenceVideo = document.getElementById("reference-video");

    if (!protoLine1) return;

    // Hide prototype lines so they don't show up in the animation,
    // but keep them in DOM for getComputedStyle
    if (protoLine1) { protoLine1.style.opacity = '0'; protoLine1.style.pointerEvents = 'none'; }
    if (protoLine2) { protoLine2.style.opacity = '0'; protoLine2.style.pointerEvents = 'none'; }

    let activeSceneGroup = null;

    const measureCanvas = document.createElement("canvas");
    const measureContext = measureCanvas.getContext("2d");

    const totalDurationMs = 21000;
    let sceneTimeline = [
        {
            startMs: 0, endMs: 6900,
            text: "Loading...", subText: "",
            lineY: "45vh", interpolation: "linear",
            keyframes: [{ t: 0, p: 0 }, { t: 2000, p: 100 }]
        }
    ];

    async function loadConfig() {
        try {
            const response = await fetch('custom.yaml');
            const yamlText = await response.text();
            const config = jsyaml.load(yamlText);
            
            // 兼容新旧配置结构
            const titles = config.hero?.titles || config.titles || [];
            
            if (titles.length > 0) {
                // 根据 custom.yaml 动态生成时间轴
                const newTimeline = [];
                const sceneDuration = 7000; // 每个场景 7 秒
                
                titles.forEach((t, i) => {
                    newTimeline.push({
                        startMs: i * sceneDuration,
                        endMs: (i + 1) * sceneDuration - 100,
                        text: t.main,
                        subText: t.sub || "",
                        lineY: "45vh",
                        interpolation: "linear",
                        keyframes: [{ t: 0, p: 0 }, { t: 4000, p: 100 }]
                    });
                });
                
                sceneTimeline = newTimeline;
            }
        } catch (e) {
            console.error("Config failed:", e);
        } finally {
            resolveAllKeyframes();
            activeSceneGroup = null;
        }
    }

    const easingFns = {
        linear: (v) => v,
        bezier: (v) => {
            const t = Math.max(0, Math.min(1, v));
            const inv = 1 - t;
            return (3 * inv * inv * t * 0.12) + (3 * inv * t * t * 0.92) + (t * t * t);
        }
    };

    let activeSceneIndex = -1;
    let elapsedMs = 0;
    let lastTick = performance.now();
    let charCache = new Map();

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    function resolveLineKeyframes(scene, textProp, kfProp, lineEl) {
        const text = scene[textProp];
        const kfs = scene[kfProp];
        if (!text || !kfs) return;

        lineEl.textContent = text; // 暂时设置内容用于测量
        const style = window.getComputedStyle(lineEl);
        measureContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const fullWidth = Math.max(1, measureContext.measureText(text).width);

        scene[kfProp + "_resolved"] = kfs.map(kf => {
            let p = typeof kf.p === "number" ? kf.p : 0;
            if (typeof kf.charIndex === "number") {
                const before = text.slice(0, kf.charIndex);
                p = (measureContext.measureText(before).width / fullWidth) * 100;
            }
            return { t: kf.t, p: clamp(p, 0, 100), ease: kf.ease || scene.interpolation || "linear" };
        });
    }

    function resolveAllKeyframes() {
        sceneTimeline.forEach(s => {
            resolveLineKeyframes(s, "text", "keyframes", protoLine1);
            if (s.text2) resolveLineKeyframes(s, "text2", "keyframes2", protoLine2);
        });
    }

    function sampleKeyframes(keyframes, timeMs) {
        if (!keyframes || keyframes.length === 0) return 0;
        if (timeMs <= keyframes[0].t) return keyframes[0].p;
        if (timeMs >= keyframes[keyframes.length - 1].t) return keyframes[keyframes.length - 1].p;
        for (let i = 0; i < keyframes.length - 1; i++) {
            const curr = keyframes[i];
            const next = keyframes[i + 1];
            if (timeMs <= next.t) {
                const ratio = (timeMs - curr.t) / (next.t - curr.t);
                return curr.p + (next.p - curr.p) * (easingFns[curr.ease] || easingFns.linear)(ratio);
            }
        }
        return 0;
    }

    function splitToSpans(el, text) {
        el.innerHTML = '';
        const spans = [];
        text.split('').forEach(char => {
            const span = document.createElement('span');
            // 空格使用普通空格（允许换行），非空格字符保持原样
            const isSpace = char === ' ';
            const content = isSpace ? ' ' : char;
            span.textContent = content;
            span.className = 'lyric-char' + (isSpace ? ' lyric-space' : '');
            span.setAttribute('data-char', isSpace ? '\u00A0' : content);
            el.appendChild(span);
            spans.push(span);
        });

        requestAnimationFrame(() => {
            charCache.set(el, spans);
        });
    }

    function createNewLine(container, text, lineY) {
        const newLine = document.createElement("p");
        newLine.className = "lyric-line lyric-line-main";
        newLine.style.setProperty("--line-y", lineY);
        container.appendChild(newLine);
        splitToSpans(newLine, text);
        return newLine;
    }

    function applyScene(scene) {
        // Find existing scene groups and transition them out
        const stage = document.getElementById("lyric-stage");
        const oldScenes = stage.querySelectorAll(".lyric-scene:not(.exiting)");
        oldScenes.forEach(s => {
            s.classList.remove("visible");
            s.classList.add("exiting");
            setTimeout(() => s.remove(), 1000);
        });

        charCache.clear();

        // Create new scene group wrapper
        activeSceneGroup = document.createElement("div");
        activeSceneGroup.className = "lyric-scene";
        stage.appendChild(activeSceneGroup);

        // Add lines to the SAME group
        const line1 = createNewLine(activeSceneGroup, scene.text, scene.lineY);
        const line2 = scene.text2 ? createNewLine(activeSceneGroup, scene.text2, scene.line2Y) : null;

        // 副标题也加入组，并根据主行数动态调整高度（主标题下方 12vh 处）
        if (scene.subText) {
            const subLine = document.createElement("p");
            subLine.className = "lyric-line lyric-sub-inline";
            subLine.textContent = scene.subText;
            activeSceneGroup.appendChild(subLine);

            // 使用 requestAnimationFrame 确保 DOM 渲染后获取实际高度
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const line1Rect = line1.getBoundingClientRect();
                    const line2Rect = line2 ? line2.getBoundingClientRect() : null;
                    const stageRect = activeSceneGroup.getBoundingClientRect();

                    // 计算最后一行相对于 stage 的底部位置
                    const lastLineBottom = line2Rect
                        ? line2Rect.bottom - stageRect.top
                        : line1Rect.bottom - stageRect.top;

                    // 副标题位置：最后一行底部 + 12vh 间距
                    const spacing = window.innerHeight * (-0.05);
                    const subY = lastLineBottom + spacing;
                    subLine.style.setProperty("--line-y", `${subY}px`);
                });
            });
        }

        requestAnimationFrame(() => {
            activeSceneGroup.classList.add("visible");
        });
    }

    function updateCharPhysics(el, wipePercent) {
        const chars = charCache.get(el);
        if (!chars) return;
        
        // 改为基于索引（Index-based）而不是基于位置（Geometric）的物理进度
        // 这样可以完美支持自动换行，且保持从左到右、逐行高亮的逻辑一致性
        const totalChars = chars.length;
        const currentActiveIndex = (wipePercent / 100) * totalChars;

        for (let i = 0; i < chars.length; i++) {
            // progress: 前面的字是 1，正在过度的字是 0~1，后面的字是 0
            const progress = clamp(currentActiveIndex - i, 0, 1);
            chars[i].style.setProperty('--char-progress', progress.toFixed(3));
        }
    }

    function render(timeMs) {
        const actualTotalDuration = sceneTimeline.length * 7000;
        const norm = ((timeMs % actualTotalDuration) + actualTotalDuration) % actualTotalDuration;
        let idx = 0;
        for (let i = sceneTimeline.length - 1; i >= 0; i--) {
            if (norm >= sceneTimeline[i].startMs) { idx = i; break; }
        }

        const scene = sceneTimeline[idx];
        if (!scene) return;

        if (idx !== activeSceneIndex) {
            activeSceneIndex = idx;
            applyScene(scene);
        }

        const localTime = norm - scene.startMs;
        const wipe1 = sampleKeyframes(scene.keyframes_resolved, localTime);
        const lines = activeSceneGroup ? activeSceneGroup.querySelectorAll(".lyric-line") : [];
        if (lines[0]) updateCharPhysics(lines[0], wipe1);

        if (scene.text2) {
            const wipe2 = sampleKeyframes(scene.keyframes2_resolved, localTime);
            if (lines[1]) updateCharPhysics(lines[1], wipe2);
        }
    }

    function tick(now) {
        const v = (referenceVideo && referenceVideo.readyState >= 1) ? referenceVideo : bgVideo;
        const actualTotalDuration = sceneTimeline.length * 7000;
        if (v && v.readyState >= 1) {
            elapsedMs = (v.currentTime / v.duration) * actualTotalDuration;
        } else {
            elapsedMs = (elapsedMs + (now - lastTick)) % actualTotalDuration;
        }
        lastTick = now;
        render(elapsedMs);
        requestAnimationFrame(tick);
    }

    loadConfig();
    requestAnimationFrame(tick);
})();

// ========== 分页控制系统 ==========
((global) => {
    // 分页状态
    let currentPage = 0;
    let isAnimating = false;
    let isScrollLocked = false;
    const totalPages = 2;
    const scrollThreshold = 50; // 滚动阈值
    let touchStartY = 0;
    let scrollAccumulator = 0;

    // DOM 元素
    const pagesContainer = document.getElementById('pages-container');
    const pages = document.querySelectorAll('.page');
    const paginationDots = document.querySelectorAll('.pagination-dot');

    // 初始化
    function init() {
        if (!pagesContainer) return;

        // 绑定导航点击事件
        paginationDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetPage = parseInt(e.target.dataset.page);
                if (targetPage !== currentPage && !isAnimating) {
                    goToPage(targetPage);
                }
            });
        });

        // 绑定滚轮事件
        global.addEventListener('wheel', handleWheel, { passive: false });

        // 绑定触摸事件（移动端）
        global.addEventListener('touchstart', handleTouchStart, { passive: true });
        global.addEventListener('touchend', handleTouchEnd, { passive: true });

        // 绑定键盘事件
        global.addEventListener('keydown', handleKeydown);

        // 绑定导航链接点击
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    if (href === '#hero') goToPage(0);
                    else if (href === '#features') goToPage(1);
                }
            });
        });

        // 初始化第一页
        updateActiveStates();
    }

    // 处理滚轮事件
    function handleWheel(e) {
        if (isAnimating) {
            e.preventDefault();
            return;
        }

        const delta = e.deltaY;
        scrollAccumulator += delta;

        if (Math.abs(scrollAccumulator) > scrollThreshold) {
            if (scrollAccumulator > 0 && currentPage < totalPages - 1) {
                goToPage(currentPage + 1);
            } else if (scrollAccumulator < 0 && currentPage > 0) {
                goToPage(currentPage - 1);
            }
            scrollAccumulator = 0;
            e.preventDefault();
        }
    }

    // 处理触摸开始
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    // 处理触摸结束
    function handleTouchEnd(e) {
        if (isAnimating) return;

        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentPage < totalPages - 1) {
                goToPage(currentPage + 1);
            } else if (diff < 0 && currentPage > 0) {
                goToPage(currentPage - 1);
            }
        }
    }

    // 处理键盘事件
    function handleKeydown(e) {
        if (isAnimating) return;

        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                if (currentPage < totalPages - 1) {
                    e.preventDefault();
                    goToPage(currentPage + 1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                if (currentPage > 0) {
                    e.preventDefault();
                    goToPage(currentPage - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                goToPage(0);
                break;
            case 'End':
                e.preventDefault();
                goToPage(totalPages - 1);
                break;
        }
    }

    // 切换到指定页面
    function goToPage(targetPage) {
        if (isAnimating || targetPage === currentPage) return;
        if (targetPage < 0 || targetPage >= totalPages) return;

        isAnimating = true;

        // 移除当前页面激活状态
        pages[currentPage].classList.remove('active');

        // 添加目标页面激活状态
        currentPage = targetPage;
        pages[currentPage].classList.add('active');

        // 更新导航指示器
        updateActiveStates();

        // 动画完成后解锁
        setTimeout(() => {
            isAnimating = false;
        }, 700); // 与 CSS transition 时间一致
    }

    // 更新激活状态
    function updateActiveStates() {
        paginationDots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);

// ========== 配置渲染系统 ==========
((global) => {
    let appConfig = null;

    // 加载并应用配置
    async function loadAndApplyConfig() {
        try {
            const response = await fetch('custom.yaml');
            const yamlText = await response.text();
            appConfig = jsyaml.load(yamlText);

            // 渲染各个部分
            renderNavbar();
            renderHero();
            renderLauncherFeatures();
            renderMeta();

            console.log('✅ 配置加载成功 (custom.yaml)');
        } catch (e) {
            console.error('❌ 配置加载失败:', e);
        }
    }

    // 渲染导航栏
    function renderNavbar() {
        const { navbar } = appConfig;
        if (!navbar) return;

        // 品牌名称和图标
        const titleEl = document.querySelector('.navbar-title');
        const logoEl = document.querySelector('.navbar-logo');

        if (titleEl && navbar.brand) {
            titleEl.textContent = navbar.brand;
        }
        if (logoEl && navbar.logo) {
            logoEl.src = navbar.logo;
        }

        // 不再动态生成导航栏，使用 HTML 中手动设置的按钮
        // 只更新顶栏下载按钮文字（如果配置已加载）
        updateNavDownloadButton();
    }

    // 检测用户操作系统
    function detectUserOS() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('win') !== -1) return 'windows';
        if (userAgent.indexOf('mac') !== -1) return 'macos';
        if (userAgent.indexOf('linux') !== -1) return 'linux';
        return 'unknown';
    }

    // 更新顶栏下载按钮文字
    function updateNavDownloadButton() {
        if (!appConfig) return;
        const downloads = appConfig.hero?.downloads;
        if (!downloads) return;

        const userOS = detectUserOS();
        const matchingBtn = downloads.buttons.find(btn => {
            if (userOS === 'windows' && btn.platform.toLowerCase().includes('windows')) return true;
            if (userOS === 'macos' && btn.platform.toLowerCase().includes('macos')) return true;
            if (userOS === 'linux' && btn.platform.toLowerCase().includes('linux')) return true;
            return false;
        }) || downloads.buttons[0];

        const navDownloadBtn = document.getElementById('nav-download-btn');
        if (navDownloadBtn && matchingBtn) {
            navDownloadBtn.textContent = `下载 ${matchingBtn.platform} 版本`;
        }
    }

    // 渲染 Hero 区域
    function renderHero() {
        const { hero } = appConfig;
        if (!hero) return;

        // 渲染下载区域
        if (hero.downloads) {
            renderDownloads(hero.downloads);
        }
    }

    // 渲染下载区域
    function renderDownloads(downloads) {
        console.log('开始渲染下载区域...', downloads);
        
        // 渲染版本号
        const versionEl = document.getElementById('dock-version');
        if (versionEl) {
            versionEl.textContent = `v${downloads.version || '26'}`;
        }

        // 检测用户系统
        const userOS = detectUserOS();
        const primaryButton = document.getElementById('dock-primary_btn');
        const otherButton = document.getElementById('dock_other_btn');
        
        console.log('用户系统:', userOS);

        // 获取匹配的平台
        const matchingBtn = downloads.buttons.find(btn => {
            if (userOS === 'windows' && btn.platform.toLowerCase().includes('windows')) return true;
            if (userOS === 'macos' && btn.platform.toLowerCase().includes('macos')) return true;
            if (userOS === 'linux' && btn.platform.toLowerCase().includes('linux')) return true;
            return false;
        }) || downloads.buttons[0];

        const platformName = matchingBtn.platform;
        const iconHtml = matchingBtn.icon || '';
        
        // 设置下载岛主按钮
        if (primaryButton) {
            primaryButton.innerHTML = `<div class="dock-btn-content">${iconHtml}<span>下载 ${platformName}</span></div>`;
            primaryButton.onclick = function() { openDownloadModal(matchingBtn); };
        }

        // 设置"其他系统"按钮
        if (otherButton) {
            otherButton.onclick = function() { openDownloadModal(); };
        }

        // 更新顶栏下载按钮文字
        updateNavDownloadButton();
    }

    // 检测用户操作系统
    function detectUserOS() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('win') !== -1) return 'windows';
        if (userAgent.indexOf('mac') !== -1) return 'macos';
        if (userAgent.indexOf('linux') !== -1) return 'linux';
        return 'unknown';
    }

    // 打开当前系统的下载模态对话框 (供顶栏使用)
    window.openDownloadModalForCurrentOS = function() {
        if (!appConfig) return;
        const downloads = appConfig.hero?.downloads;
        if (!downloads) return;

        const userOS = detectUserOS();
        const matchingBtn = downloads.buttons.find(btn => {
            if (userOS === 'windows' && btn.platform.toLowerCase().includes('windows')) return true;
            if (userOS === 'macos' && btn.platform.toLowerCase().includes('macos')) return true;
            if (userOS === 'linux' && btn.platform.toLowerCase().includes('linux')) return true;
            return false;
        });

        openDownloadModal(matchingBtn);
    };

    // 打开下载模态对话框
    window.openDownloadModal = function(selectedPlatform) {
        const modal = document.getElementById('download-modal');
        const modalButtons = document.getElementById('modal-buttons');
        const modalLinks = document.getElementById('modal-links');
        
        if (!modal || !modalButtons) return;

        // 获取下载配置
        const config = window.getAppConfig();
        const downloads = config?.hero?.downloads;
        if (!downloads || !downloads.buttons) return;

        // 清空模态对话框
        modalButtons.innerHTML = '';
        if (modalLinks) modalLinks.innerHTML = '';

        if (selectedPlatform && selectedPlatform.architectures) {
            // 显示特定平台的架构选项
            modalButtons.innerHTML = selectedPlatform.architectures.map(arch => 
                `<a href="${arch.url}" target="_blank" rel="noopener" class="modal-btn">
                    ${selectedPlatform.icon || ''}
                    <span>${arch.name}</span>
                </a>`
            ).join('');
        } else {
            // 显示所有平台
            downloads.buttons.forEach(btn => {
                if (btn.architectures) {
                    btn.architectures.forEach(arch => {
                        modalButtons.innerHTML += `<a href="${arch.url}" target="_blank" rel="noopener" class="modal-btn">
                            ${btn.icon || ''}
                            <span>${btn.platform} - ${arch.name}</span>
                        </a>`;
                    });
                }
            });
        }

        // 渲染扩展链接
        if (modalLinks && downloads.links) {
            modalLinks.innerHTML = downloads.links.map(link => 
                `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`
            ).join('');
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // 关闭下载模态对话框
    window.closeDownloadModal = function(event) {
        if (event && event.target !== event.currentTarget) return;
        const modal = document.getElementById('download-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // ESC 键关闭模态
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeDownloadModal();
        }
    });

    // 渲染 Launcher 功能特性
    function renderLauncherFeatures() {
        const { hero } = appConfig;
        const features = hero?.features || [
            { icon: '🤖', title: 'Bloriko AI 助手', desc: '自然语言推荐 Mod，智能问答帮助你更好地游玩 Minecraft' },
            { icon: '🌐', title: 'Easytier 联机服务', desc: '基于虚拟组网的多人游戏服务，大幅简化连接流程' },
            { icon: '📸', title: '全局截图工具', desc: '支持快捷键的快速截图功能，方便分享游戏精彩瞬间' },
            { icon: '🎛️', title: '悬浮工具栏', desc: 'Minecraft 游戏内的悬浮工具栏，便捷访问常用功能' },
            { icon: '🔐', title: '2FA 账户安全', desc: '通行证系统支持双重验证，保障账户安全与云端同步' },
            { icon: '🎨', title: 'Fluent Design', desc: '贴近 Windows 11 的美学设计，现代化的用户界面' }
        ];

        const gridEl = document.getElementById('launcher-features');
        if (gridEl) {
            gridEl.innerHTML = '';
            features.forEach((feature, index) => {
                const card = document.createElement('div');
                card.className = 'feature-card';
                card.style.transitionDelay = `${0.2 + index * 0.1}s`;
                card.innerHTML = `
                    <div class="feature-icon">${feature.icon}</div>
                    <h3 class="feature-title">${feature.title}</h3>
                    <p class="feature-desc">${feature.description || feature.desc}</p>
                `;
                gridEl.appendChild(card);
            });
        }

        // 渲染编辑器展示
        renderEditorShowcase();
    }

    // 渲染 About 区域
    function renderAbout() {
        const { about } = appConfig;
        if (!about) return;

        // 标题
        const titleEl = document.querySelector('.page-4 .page-title');
        if (titleEl) titleEl.textContent = about.title;

        const subtitleEl = document.querySelector('.page-4 .page-subtitle');
        if (subtitleEl) subtitleEl.textContent = about.subtitle;

        // 内容文字
        const textEl = document.querySelector('.about-text');
        if (textEl && about.content) {
            textEl.innerHTML = about.content.join('<br>');
        }

        // CTA 按钮
        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection && about.ctaButtons) {
            ctaSection.innerHTML = '';
            
            about.ctaButtons.forEach(btn => {
                const button = document.createElement('button');
                button.className = `cta-button ${btn.type}`;
                button.textContent = btn.label;
                if (btn.href && btn.href !== '#') {
                    button.onclick = () => window.open(btn.href, '_blank');
                }
                ctaSection.appendChild(button);
            });
        }

        // 数据统计
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid && about.stats) {
            statsGrid.innerHTML = '';
            
            about.stats.forEach(stat => {
                const item = document.createElement('div');
                item.className = 'stat-item';
                item.innerHTML = `
                    <span class="stat-value">${stat.value}</span>
                    <span class="stat-label">${stat.label}</span>
                `;
                statsGrid.appendChild(item);
            });
        }
    }

    // 渲染编辑器展示
    function renderEditorShowcase() {
        const showcase = document.getElementById('editor-showcase');
        if (!showcase) return;

        showcase.innerHTML = `
            <div class="editor-container">
                <div class="editor-topbar">
                    <div class="window-controls">
                        <div class="window-btn close"></div>
                        <div class="window-btn minimize"></div>
                        <div class="window-btn maximize"></div>
                    </div>
                    <div class="editor-title">Bloret Launcher</div>
                </div>
                <div class="editor-content">
                    <div class="editor-sidebar">
                        <div class="sidebar-item active">🏠 首页</div>
                        <div class="sidebar-item">🎮 实例管理</div>
                        <div class="sidebar-item">📦 Mod 管理</div>
                        <div class="sidebar-item">🌐 联机服务</div>
                        <div class="sidebar-item">⚙️ 设置</div>
                    </div>
                    <div class="editor-main">
                        <div class="welcome-text">
                            <h3>欢迎使用 Bloret Launcher</h3>
                            <p>AI 驱动的 Minecraft 启动器</p>
                            <p>版本 26 - 现已可用</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染核心服务区域（Minecraft 服务器）
    function renderCore() {
        const { core } = appConfig;
        if (!core) return;

        // 标题
        const titleEl = document.querySelector('.page-2 .page-title');
        if (titleEl) titleEl.textContent = core.title;

        const subtitleEl = document.querySelector('.page-2 .page-subtitle');
        if (subtitleEl) subtitleEl.textContent = core.subtitle;

        // 服务器信息
        if (core.server) {
            const ipEl = document.getElementById('server-ip');
            if (ipEl) ipEl.textContent = core.server.ip;

            const descEl = document.querySelector('.server-description');
            if (descEl) descEl.textContent = core.server.description;

            // Launcher 推荐信息
            if (core.server.launcher) {
                const launcherBtn = document.querySelector('.launcher-btn');
                if (launcherBtn) {
                    launcherBtn.href = core.server.launcher.url || '#';
                }

                const launcherText = document.querySelector('.launcher-text');
                if (launcherText && core.server.launcher.name) {
                    launcherText.textContent = `推荐使用 ${core.server.launcher.name} 加入`;
                }

                const launcherHint = document.querySelector('.launcher-hint');
                if (launcherHint) {
                    launcherHint.textContent = core.server.launcher.hint || '';
                }
            }
        }

        // 服务器特色
        const gridEl = document.querySelector('.page-2 .features-grid');
        if (gridEl && core.server?.features) {
            gridEl.innerHTML = '';
            
            core.server.features.forEach(item => {
                const card = document.createElement('div');
                card.className = 'feature-card';
                card.innerHTML = `
                    <div class="feature-icon">${item.icon}</div>
                    <h3 class="feature-title">${item.title}</h3>
                    <p class="feature-desc">${item.description}</p>
                `;
                gridEl.appendChild(card);
            });
        }
    }

    // 渲染更多服务区域
    function renderServices() {
        const { services } = appConfig;
        if (!services) return;

        // 标题
        const titleEl = document.querySelector('.page-3 .page-title');
        if (titleEl) titleEl.textContent = services.title;

        const subtitleEl = document.querySelector('.page-3 .page-subtitle');
        if (subtitleEl) subtitleEl.textContent = services.subtitle;

        // 服务卡片
        const gridEl = document.querySelector('.services-grid');
        if (gridEl && services.items) {
            gridEl.innerHTML = '';
            
            services.items.forEach(item => {
                const card = document.createElement('a');
                card.className = 'service-card';
                card.href = item.url;
                card.target = '_blank';
                card.style.setProperty('--service-color', item.color);
                card.innerHTML = `
                    <span class="service-icon">${item.icon}</span>
                    <div class="service-info">
                        <h3 class="service-name">${item.name}</h3>
                        <p class="service-desc">${item.description}</p>
                    </div>
                `;
                gridEl.appendChild(card);
            });
        }
    }

    // 渲染 Meta 信息
    function renderMeta() {
        const { site } = appConfig;
        if (!site) return;

        // 页面标题
        if (site.title) {
            document.title = site.title;
        }

        // Favicon
        if (site.favicon) {
            let link = document.querySelector("link[rel*='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = site.favicon;
        }
    }

    // 暴露配置给其他模块
    global.getAppConfig = () => appConfig;

    // 页面加载时执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAndApplyConfig);
    } else {
        loadAndApplyConfig();
    }
})(window);

// ========== 工具函数 ==========
// 复制服务器 IP
function copyIP() {
    const ip = document.getElementById('server-ip').textContent;
    navigator.clipboard.writeText(ip).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '已复制!';
        btn.style.background = 'rgba(76, 175, 80, 0.3)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
    });
}