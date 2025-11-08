document.addEventListener('DOMContentLoaded', function() {
    // 创建主容器
    const container = document.createElement('div');
    container.className = 'container';
    container.style.cssText = `
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    `;
    
    // 创建标题部分
    const heroSection = document.createElement('section');
    heroSection.className = 'hero-content';
    heroSection.style.cssText = `
        text-align: center;
        padding: 60px 20px;
    `;
    
    const title = document.createElement('h1');
    title.textContent = 'AI 驱动的 Minecraft 启动器';
    title.style.cssText = `
        font-size: 3.5rem;
        font-weight: 600;
        margin-bottom: 30px;
        color: #333;
        line-height: 1.2;
    `;
    
    // 创建下载按钮区域
    const downloadWrapper = document.createElement('div');
    downloadWrapper.className = 'download-content-wrapper';
    downloadWrapper.style.cssText = `
        margin: 40px 0;
    `;
    
    const downloadContainer = document.createElement('div');
    downloadContainer.id = 'download-buttons';
    downloadContainer.className = 'download-hero alt-downloads';
    downloadContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
        margin-bottom: 20px;
    `;
    
    // macOS 下载按钮
    const macButton = document.createElement('button');
    macButton.type = 'button';
    macButton.className = 'link-button dlink';
    macButton.dataset.os = 'osx';
    macButton.id = 'download-buttons-osx';
    macButton.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px;
        background: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
    `;
    macButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 814 1000">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" fill="currentColor"/>
        </svg>
        Download for macOS
    `;
    
    // Windows 下载按钮
    const winButton = document.createElement('a');
    winButton.href = `https://gitcode.com/Bloret/Bloret-Launcher/releases/download/${config.BLLatest}/Bloret-Launcher-Setup.exe`;
    winButton.type = 'button';
    winButton.className = 'link-button dlink';
    winButton.dataset.os = 'win';
    winButton.id = 'download-buttons-win';
    winButton.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px;
        background: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
        text-decoration: none;
    `;
    winButton.innerHTML = `
        <svg viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path d="m0 12.402 35.687-4.86.016 34.423-35.67.203zm35.67 33.529.028 34.453L.028 75.48.026 45.7zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349-.011 41.34-47.318-6.678-.066-34.739z" fill="currentColor"/>
        </svg>
        Download for Windows
    `;
    
    // Linux 下载按钮容器
    const linuxContainer = document.createElement('div');
    linuxContainer.className = 'linux';
    linuxContainer.style.cssText = `
        display: flex;
        gap: 15px;
    `;
    
    // Linux .deb 下载按钮
    const debButton = document.createElement('button');
    debButton.type = 'button';
    debButton.className = 'link-button dlink deb-btn';
    debButton.dataset.os = 'linux64_deb';
    debButton.id = 'download-linux64_deb';
    debButton.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px;
        background: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
    `;
    debButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 58" width="20" height="20">
            <path d="M47.6083 42.5333C47.3667 42.05 47.125 41.5667 47.125 41.0833C47.125 40.1167 46.6417 39.3917 45.9167 38.6667C45.675 38.425 45.1917 38.1833 44.95 38.1833C46.4 33.8333 44.225 29.4833 41.8083 26.3417C39.875 23.4417 36.975 21.2667 37.2167 17.4C37.2167 12.8083 37.7 4.35002 29.2417 5.07502C20.5417 5.55835 22.9583 14.5 22.7167 17.6417C22.7167 20.3 21.5083 22.9583 19.575 25.1333C19.0917 25.6167 18.6083 26.3417 18.3667 26.825C15.95 29.725 14.7417 33.5917 14.7417 37.2167C14.2583 37.7 13.775 38.1833 13.5333 38.6667C13.2917 38.9083 13.05 39.15 13.05 39.3917C12.8083 39.6333 12.325 39.875 11.8417 40.1167C10.875 40.3583 10.15 40.8417 9.66667 41.8083C9.425 42.5333 9.18333 43.5 9.425 44.4667C9.66667 44.95 9.66667 45.4333 9.425 46.1583C8.94167 47.125 8.94167 48.3333 9.425 49.5417C10.15 50.5083 11.3583 50.75 13.05 50.9917C14.2583 50.9917 15.7083 51.475 16.9167 51.9583C18.125 52.6833 19.575 53.1667 21.025 53.1667C21.75 53.1667 22.7167 52.925 23.4417 52.6833C24.1667 52.2 24.65 51.7167 24.8917 50.9917C25.8583 50.9917 27.3083 50.5083 29 50.5083C30.45 50.5083 31.9 50.9917 33.8333 50.75C33.8333 50.9917 33.8333 51.2333 34.075 51.475C34.5583 52.6833 35.7667 53.65 37.2167 53.8917H37.7C39.6333 53.65 41.5667 52.6833 42.775 51.2333C43.7417 50.2667 44.95 49.5417 46.1583 49.0583C47.6083 48.3333 48.575 47.85 48.8167 46.6417C49.0583 44.95 48.575 43.9833 47.6083 42.5333ZM30.9333 11.6C32.3833 11.8417 33.5917 13.05 33.35 14.5C33.35 15.225 33.1083 15.95 32.625 16.675H32.3833C31.9 16.4333 31.6583 16.4333 31.4167 16.1917C31.6583 15.95 31.6583 15.4667 31.9 14.9833C31.9 14.0167 31.4167 13.2917 30.9333 13.2917C30.2083 13.2917 29.725 14.0167 29.725 14.9833V15.225C29.4833 14.9833 29 14.9833 28.7583 14.7417V14.5C28.5167 13.2917 29.4833 11.8417 30.9333 11.6ZM30.2083 16.4333C30.45 16.675 30.9333 16.9167 31.175 16.9167C31.4167 16.9167 31.9 17.1583 32.1417 17.4C32.625 17.6417 33.1083 17.8833 33.1083 18.6083C33.1083 19.3333 32.3833 20.0583 30.9333 20.5417C30.45 20.7833 30.2083 20.7833 29.9667 21.025C29.2417 21.5083 28.5167 21.75 27.55 21.75C26.825 21.75 26.1 21.2667 25.6167 20.7833C25.375 20.5417 25.1333 20.3 24.65 20.0583C24.4083 19.8167 23.925 19.3333 23.6833 18.6083C23.6833 18.3667 23.925 18.125 24.1667 17.8833C24.8917 17.4 25.1333 17.1583 25.375 16.9167L25.6167 16.675C26.1 15.95 27.0667 15.4667 28.0333 15.4667C28.7583 15.7083 29.4833 15.95 30.2083 16.4333ZM25.1333 12.0833C26.1 12.0833 26.825 13.05 27.0667 14.7417V15.225C26.825 15.225 26.3417 15.4667 26.1 15.7083V15.225C26.1 14.5 25.6167 13.775 25.1333 14.0167C24.65 14.0167 24.4083 14.7417 24.4083 15.4667C24.4083 15.95 24.65 16.1917 24.8917 16.4333C24.8917 16.4333 24.65 16.675 24.4083 16.675C23.925 16.1917 23.4417 15.4667 23.4417 14.7417C23.4417 13.2917 24.1667 12.0833 25.1333 12.0833ZM22.7167 50.9917C21.025 51.7167 18.85 51.475 17.4 50.5083C15.95 49.7833 14.7417 49.5417 13.05 49.5417C11.8417 49.3 10.6333 49.3 10.3917 48.8167C10.15 48.3333 10.15 47.6083 10.6333 46.4C10.875 45.675 10.875 44.95 10.6333 44.225C10.3917 43.5 10.3917 43.0167 10.6333 42.2917C10.875 41.5667 11.3583 41.325 12.0833 41.0833C12.8083 40.8417 13.2917 40.6 13.775 40.1167C14.0167 39.875 14.2583 39.6334 14.5 39.15C15.225 38.1833 15.7083 37.7 16.4333 37.7C17.8833 37.9417 19.0917 40.1167 20.0583 42.2917C20.5417 43.0167 21.025 43.9833 21.75 44.7083C22.7167 45.9167 23.925 47.6083 23.925 48.575C23.925 49.7833 23.4417 50.5083 22.7167 50.9917ZM34.5583 45.675C34.5583 45.9167 34.5583 45.9167 34.3167 46.1583C31.4167 48.3333 27.55 48.575 24.4083 46.8833L22.9583 44.7083C25.1333 44.4667 24.65 41.5667 20.0583 38.6667C15.225 35.525 18.6083 29.725 20.3 27.0667C20.5417 26.825 20.5417 27.0667 19.575 29C18.85 30.45 17.4 34.075 19.3333 36.7333C19.3333 34.8 19.8167 32.8667 20.5417 30.9333C22.2333 27.7917 23.4417 24.1667 24.1667 20.5417C24.4083 20.7833 24.4083 20.7833 24.65 20.7833C24.8917 21.025 25.1333 21.2667 25.375 21.2667C25.8583 21.9917 26.825 22.2333 27.55 22.2333H27.7917C28.7583 22.2333 29.725 21.9917 30.45 21.2667C30.6917 21.025 30.9333 20.7833 31.4167 20.7833C32.1417 20.5417 32.8667 20.0583 33.5917 19.3333C34.5583 22.475 35.525 25.375 36.975 28.0333C37.9417 29.9667 38.6667 31.9 39.15 34.075C39.875 34.075 40.8417 34.3167 41.5667 34.8C43.5 35.7667 44.225 36.4917 43.9833 37.7H43.5C43.5 36.975 43.0167 36.25 41.325 35.525C39.6333 34.8 38.1833 34.8 37.7 36.4917C37.4583 36.4917 37.2167 36.7333 36.975 36.7333C35.0417 37.7 35.0417 40.3583 34.8 43.0167C35.0417 43.9833 34.8 44.7083 34.5583 45.675ZM45.675 47.125C44.225 47.6083 43.0167 48.575 42.05 49.7833C41.0833 51.2333 39.3917 52.2 37.4583 51.9583C36.4917 51.9583 35.525 51.2333 35.2833 50.2667C35.0417 48.8167 35.0417 47.3667 35.7667 45.9167C36.0083 44.95 36.25 44.225 36.4917 43.2583C36.7333 40.3583 36.7333 38.6667 37.9417 37.9417C37.9417 39.15 38.6667 39.875 39.6333 40.3583C40.8417 40.3583 42.05 40.1167 43.0167 39.15H43.5C44.225 39.15 44.7083 39.15 45.1917 39.6333C45.675 40.1167 45.9167 40.8417 45.9167 41.325C45.9167 42.05 46.4 42.775 46.6417 43.5C47.85 44.7083 47.85 45.4333 47.85 45.675C47.6083 46.1583 46.6417 46.6417 45.675 47.125ZM23.925 18.125C23.6833 18.125 23.6833 18.125 23.6833 18.3667C23.6833 18.3667 23.6833 18.6083 23.925 18.6083C24.1667 18.6083 24.1667 18.85 24.1667 18.85C24.8917 19.8167 26.1 20.3 27.55 20.5417C28.7583 20.3 29.9667 20.0583 31.175 19.0917L32.625 18.3667C32.8667 18.3667 32.8667 18.125 32.8667 18.125C32.8667 17.8833 32.8667 17.8833 32.625 17.8833C32.1417 18.125 31.4167 18.3667 30.9333 18.6083C29.9667 19.3333 28.7583 19.8167 27.55 19.8167C26.3417 19.8167 25.375 19.0917 24.65 18.3667C24.4083 18.3667 24.1667 18.125 23.925 18.125Z" fill="currentColor"></path>
        </svg>
        Download for Linux (.deb)
    `;
    
    // Linux .rpm 下载按钮
    const rpmButton = document.createElement('button');
    rpmButton.type = 'button';
    rpmButton.className = 'link-button dlink rpm-btn';
    rpmButton.dataset.os = 'linux64_rpm_repo';
    rpmButton.id = 'download-linux64_rpm_repo';
    rpmButton.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px;
        background: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
    `;
    rpmButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 58" width="20" height="20">
            <path d="M47.6083 42.5333C47.3667 42.05 47.125 41.5667 47.125 41.0833C47.125 40.1167 46.6417 39.3917 45.9167 38.6667C45.675 38.425 45.1917 38.1833 44.95 38.1833C46.4 33.8333 44.225 29.4833 41.8083 26.3417C39.875 23.4417 36.975 21.2667 37.2167 17.4C37.2167 12.8083 37.7 4.35002 29.2417 5.07502C20.5417 5.55835 22.9583 14.5 22.7167 17.6417C22.7167 20.3 21.5083 22.9583 19.575 25.1333C19.0917 25.6167 18.6083 26.3417 18.3667 26.825C15.95 29.725 14.7417 33.5917 14.7417 37.2167C14.2583 37.7 13.775 38.1833 13.5333 38.6667C13.2917 38.9083 13.05 39.15 13.05 39.3917C12.8083 39.6333 12.325 39.875 11.8417 40.1167C10.875 40.3583 10.15 40.8417 9.66667 41.8083C9.425 42.5333 9.18333 43.5 9.425 44.4667C9.66667 44.95 9.66667 45.4333 9.425 46.1583C8.94167 47.125 8.94167 48.3333 9.425 49.5417C10.15 50.5083 11.3583 50.75 13.05 50.9917C14.2583 50.9917 15.7083 51.475 16.9167 51.9583C18.125 52.6833 19.575 53.1667 21.025 53.1667C21.75 53.1667 22.7167 52.925 23.4417 52.6833C24.1667 52.2 24.65 51.7167 24.8917 50.9917C25.8583 50.9917 27.3083 50.5083 29 50.5083C30.45 50.5083 31.9 50.9917 33.8333 50.75C33.8333 50.9917 33.8333 51.2333 34.075 51.475C34.5583 52.6833 35.7667 53.65 37.2167 53.8917H37.7C39.6333 53.65 41.5667 52.6833 42.775 51.2333C43.7417 50.2667 44.95 49.5417 46.1583 49.0583C47.6083 48.3333 48.575 47.85 48.8167 46.6417C49.0583 44.95 48.575 43.9833 47.6083 42.5333ZM30.9333 11.6C32.3833 11.8417 33.5917 13.05 33.35 14.5C33.35 15.225 33.1083 15.95 32.625 16.675H32.3833C31.9 16.4333 31.6583 16.4333 31.4167 16.1917C31.6583 15.95 31.6583 15.4667 31.9 14.9833C31.9 14.0167 31.4167 13.2917 30.9333 13.2917C30.2083 13.2917 29.725 14.0167 29.725 14.9833V15.225C29.4833 14.9833 29 14.9833 28.7583 14.7417V14.5C28.5167 13.2917 29.4833 11.8417 30.9333 11.6ZM30.2083 16.4333C30.45 16.675 30.9333 16.9167 31.175 16.9167C31.4167 16.9167 31.9 17.1583 32.1417 17.4C32.625 17.6417 33.1083 17.8833 33.1083 18.6083C33.1083 19.3333 32.3833 20.0583 30.9333 20.5417C30.45 20.7833 30.2083 20.7833 29.9667 21.025C29.2417 21.5083 28.5167 21.75 27.55 21.75C26.825 21.75 26.1 21.2667 25.6167 20.7833C25.375 20.5417 25.1333 20.3 24.65 20.0583C24.4083 19.8167 23.925 19.3333 23.6833 18.6083C23.6833 18.3667 23.925 18.125 24.1667 17.8833C24.8917 17.4 25.1333 17.1583 25.375 16.9167L25.6167 16.675C26.1 15.95 27.0667 15.4667 28.0333 15.4667C28.7583 15.7083 29.4833 15.95 30.2083 16.4333ZM25.1333 12.0833C26.1 12.0833 26.825 13.05 27.0667 14.7417V15.225C26.825 15.225 26.3417 15.4667 26.1 15.7083V15.225C26.1 14.5 25.6167 13.775 25.1333 14.0167C24.65 14.0167 24.4083 14.7417 24.4083 15.4667C24.4083 15.95 24.65 16.1917 24.8917 16.4333C24.8917 16.4333 24.65 16.675 24.4083 16.675C23.925 16.1917 23.4417 15.4667 23.4417 14.7417C23.4417 13.2917 24.1667 12.0833 25.1333 12.0833ZM22.7167 50.9917C21.025 51.7167 18.85 51.475 17.4 50.5083C15.95 49.7833 14.7417 49.5417 13.05 49.5417C11.8417 49.3 10.6333 49.3 10.3917 48.8167C10.15 48.3333 10.15 47.6083 10.6333 46.4C10.875 45.675 10.875 44.95 10.6333 44.225C10.3917 43.5 10.3917 43.0167 10.6333 42.2917C10.875 41.5667 11.3583 41.325 12.0833 41.0833C12.8083 40.8417 13.2917 40.6 13.775 40.1167C14.0167 39.875 14.2583 39.6334 14.5 39.15C15.225 38.1833 15.7083 37.7 16.4333 37.7C17.8833 37.9417 19.0917 40.1167 20.0583 42.2917C20.5417 43.0167 21.025 43.9833 21.75 44.7083C22.7167 45.9167 23.925 47.6083 23.925 48.575C23.925 49.7833 23.4417 50.5083 22.7167 50.9917ZM34.5583 45.675C34.5583 45.9167 34.5583 45.9167 34.3167 46.1583C31.4167 48.3333 27.55 48.575 24.4083 46.8833L22.9583 44.7083C25.1333 44.4667 24.65 41.5667 20.0583 38.6667C15.225 35.525 18.6083 29.725 20.3 27.0667C20.5417 26.825 20.5417 27.0667 19.575 29C18.85 30.45 17.4 34.075 19.3333 36.7333C19.3333 34.8 19.8167 32.8667 20.5417 30.9333C22.2333 27.7917 23.4417 24.1667 24.1667 20.5417C24.4083 20.7833 24.4083 20.7833 24.65 20.7833C24.8917 21.025 25.1333 21.2667 25.375 21.2667C25.8583 21.9917 26.825 22.2333 27.55 22.2333H27.7917C28.7583 22.2333 29.725 21.9917 30.45 21.2667C30.6917 21.025 30.9333 20.7833 31.4167 20.7833C32.1417 20.5417 32.8667 20.0583 33.5917 19.3333C34.5583 22.475 35.525 25.375 36.975 28.0333C37.9417 29.9667 38.6667 31.9 39.15 34.075C39.875 34.075 40.8417 34.3167 41.5667 34.8C43.5 35.7667 44.225 36.4917 43.9833 37.7H43.5C43.5 36.975 43.0167 36.25 41.325 35.525C39.6333 34.8 38.1833 34.8 37.7 36.4917C37.4583 36.4917 37.2167 36.7333 36.975 36.7333C35.0417 37.7 35.0417 40.3583 34.8 43.0167C35.0417 43.9833 34.8 44.7083 34.5583 45.675ZM45.675 47.125C44.225 47.6083 43.0167 48.575 42.05 49.7833C41.0833 51.2333 39.3917 52.2 37.4583 51.9583C36.4917 51.9583 35.525 51.2333 35.2833 50.2667C35.0417 48.8167 35.0417 47.3667 35.7667 45.9167C36.0083 44.95 36.25 44.225 36.4917 43.2583C36.7333 40.3583 36.7333 38.6667 37.9417 37.9417C37.9417 39.15 38.6667 39.875 39.6333 40.3583C40.8417 40.3583 42.05 40.1167 43.0167 39.15H43.5C44.225 39.15 44.7083 39.15 45.1917 39.6333C45.675 40.1167 45.9167 40.8417 45.9167 41.325C45.9167 42.05 46.4 42.775 46.6417 43.5C47.85 44.7083 47.85 45.4333 47.85 45.675C47.6083 46.1583 46.6417 46.6417 45.675 47.125ZM23.925 18.125C23.6833 18.125 23.6833 18.125 23.6833 18.3667C23.6833 18.3667 23.6833 18.6083 23.925 18.6083C24.1667 18.6083 24.1667 18.85 24.1667 18.85C24.8917 19.8167 26.1 20.3 27.55 20.5417C28.7583 20.3 29.9667 20.0583 31.175 19.0917L32.625 18.3667C32.8667 18.3667 32.8667 18.125 32.8667 18.125C32.8667 17.8833 32.8667 17.8833 32.625 17.8833C32.1417 18.125 31.4167 18.3667 30.9333 18.6083C29.9667 19.3333 28.7583 19.8167 27.55 19.8167C26.3417 19.8167 25.375 19.0917 24.65 18.3667C24.4083 18.3667 24.1667 18.125 23.925 18.125Z" fill="currentColor"></path>
        </svg>
        Download for Linux (.rpm)
    `;
    
    // 其他平台下载链接
    const otherPlatforms = document.createElement('p');
    otherPlatforms.id = 'download-matrix-label';
    otherPlatforms.className = 'hero-alt-download-links';
    otherPlatforms.style.cssText = `
        margin: 20px 0;
        font-size: 14px;
    `;
    otherPlatforms.innerHTML = `
        <a href="http://pcfs.top:2" target="_blank" rel="noopener">以前的网站</a>, 
        <a href="https://github.com/BloretCrew/Bloret-Launcher" id="download-buttons-insiders">Github</a>, 
        or <a href="http://pcfs.top:2/download.html">其他版本下载</a>
    `;
    
    // 条款文本
    const terms = document.createElement('p');
    terms.className = 'terms';
    terms.style.cssText = `
        font-size: 12px;
        color: #666;
        margin-top: 20px;
    `;
    terms.innerHTML = `
        By using VS Code, you agree to its 
        <a href="https://code.visualstudio.com/license" target="_blank" rel="noopener">license</a> and 
        <a href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank" rel="noopener">privacy statement</a>.
    `;
    
    // 将所有元素组合在一起
    linuxContainer.appendChild(debButton);
    linuxContainer.appendChild(rpmButton);
    
    downloadContainer.appendChild(macButton);
    downloadContainer.appendChild(winButton);
    downloadContainer.appendChild(linuxContainer);
    
    downloadWrapper.appendChild(downloadContainer);
    downloadWrapper.appendChild(otherPlatforms);
    downloadWrapper.appendChild(terms);
    
    heroSection.appendChild(title);
    heroSection.appendChild(downloadWrapper);
    
    container.appendChild(heroSection);
    
    // 创建编辑器展示区域
    const graphicSection = document.createElement('section');
    graphicSection.className = 'hero-graphic-container swimlane-graphic';
    graphicSection.style.cssText = `
        background: linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%);
        border-radius: 8px;
        padding: 20px;
        margin: 40px 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    // 创建模拟的编辑器界面
    const editorContainer = document.createElement('div');
    editorContainer.style.cssText = `
        background: #1e1e1e;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        max-width: 1000px;
        margin: 0 auto;
    `;
    
    // 编辑器顶部栏
    const topBar = document.createElement('div');
    topBar.style.cssText = `
        background: #333;
        height: 30px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        justify-content: space-between;
    `;
    
    const windowControls = document.createElement('div');
    windowControls.style.cssText = `
        display: flex;
        gap: 8px;
    `;
    
    const closeButton = createWindowButton('#ff5f56');
    const minimizeButton = createWindowButton('#ffbd2e');
    const maximizeButton = createWindowButton('#27c93f');
    
    windowControls.appendChild(closeButton);
    windowControls.appendChild(minimizeButton);
    windowControls.appendChild(maximizeButton);
    
    const settingsIcon = document.createElement('div');
    settingsIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M23.206 15.5077L21.009 13.6427C20.95 13.5937 20.895 13.5377 20.848 13.4817C20.344 12.8877 20.417 11.9947 21.006 11.4957L23.187 9.67972C23.421 9.48372 23.515 9.16372 23.42 8.87272C22.904 7.28072 22.078 5.82472 20.962 4.54672C20.76 4.31372 20.435 4.23072 20.143 4.33472L17.439 5.30272C17.367 5.32872 17.293 5.34872 17.213 5.36272C16.438 5.51172 15.71 4.97972 15.574 4.23372L15.091 1.43772C15.038 1.13572 14.808 0.895719 14.508 0.831719C12.936 0.495719 11.31 0.482719 9.55198 0.789719C9.24298 0.843719 8.99998 1.08472 8.94298 1.39372L8.42598 4.22772C8.41298 4.30072 8.39498 4.37272 8.36698 4.44772C8.11098 5.16072 7.25098 5.54672 6.56998 5.30472L3.90998 4.32472C3.62298 4.21972 3.29898 4.29872 3.09398 4.52572C1.96998 5.76872 1.12098 7.21072 0.569983 8.81172C0.468983 9.10372 0.557983 9.42772 0.793983 9.62772L2.98798 11.4897C3.04798 11.5407 3.10398 11.5977 3.15198 11.6537C3.65598 12.2477 3.58298 13.1407 2.99498 13.6397L0.813983 15.4537C0.577983 15.6497 0.483983 15.9697 0.579983 16.2607C1.09398 17.8557 1.92198 19.3117 3.03898 20.5897C3.24298 20.8207 3.56498 20.9047 3.85598 20.8017L6.56198 19.8337C6.63698 19.8077 6.70998 19.7867 6.78298 19.7737C7.56398 19.6297 8.28898 20.1557 8.42498 20.9017L8.90698 23.6977C8.95998 23.9997 9.19098 24.2397 9.48998 24.3037C10.313 24.4777 11.157 24.5677 11.999 24.5677C12.786 24.5677 13.609 24.4927 14.447 24.3447C14.756 24.2907 14.998 24.0507 15.055 23.7407L15.574 20.9067C15.587 20.8337 15.605 20.7617 15.633 20.6867C15.888 19.9717 16.739 19.5827 17.43 19.8297L20.09 20.8097C20.382 20.9197 20.701 20.8377 20.906 20.6107C22.03 19.3667 22.879 17.9237 23.43 16.3217C23.531 16.0297 23.442 15.7067 23.206 15.5077ZM20.121 19.2237L17.944 18.4227C16.481 17.8937 14.745 18.7117 14.223 20.1747C14.172 20.3137 14.131 20.4677 14.098 20.6307L13.675 22.9497C12.494 23.1127 11.391 23.1077 10.297 22.9307L9.90298 20.6387C9.61698 19.0877 8.14798 18.0167 6.51498 18.2977C6.36398 18.3257 6.20898 18.3667 6.05498 18.4227L3.84298 19.2147C3.12998 18.3197 2.56998 17.3357 2.17198 16.2767L3.95898 14.7887C5.18198 13.7517 5.33398 11.9107 4.29198 10.6797C4.18498 10.5557 4.07398 10.4457 3.95698 10.3467L2.16398 8.82572C2.58398 7.76372 3.15898 6.78772 3.87898 5.91472L6.05698 6.71772C7.52498 7.24372 9.25598 6.42572 9.77598 4.96472C9.82698 4.82472 9.86798 4.67172 9.90098 4.50872L10.323 2.18972C11.517 2.02672 12.617 2.03272 13.701 2.20772L14.097 4.49972C14.384 6.05572 15.925 7.12172 17.482 6.84172C17.636 6.81372 17.784 6.77472 17.939 6.72072L20.157 5.92672C20.87 6.82072 21.43 7.80572 21.828 8.86272L20.041 10.3507C18.818 11.3887 18.666 13.2297 19.708 14.4607C19.816 14.5857 19.928 14.6977 20.043 14.7937L21.836 16.3157C21.416 17.3777 20.841 18.3547 20.121 19.2277V19.2237ZM12 8.06772C9.51898 8.06772 7.49998 10.0867 7.49998 12.5677C7.49998 15.0487 9.51898 17.0677 12 17.0677C14.481 17.0677 16.5 15.0487 16.5 12.5677C16.5 10.0867 14.481 8.06772 12 8.06772ZM12 15.5677C10.346 15.5677 8.99998 14.2217 8.99998 12.5677C8.99998 10.9137 10.346 9.56772 12 9.56772C13.654 9.56772 15 10.9127 15 12.5677C15 14.2227 13.654 15.5677 12 15.5677Z" />
        </svg>
    `;
    settingsIcon.style.cssText = `
        color: #ccc;
        cursor: pointer;
    `;
    
    topBar.appendChild(windowControls);
    topBar.appendChild(settingsIcon);
    
    // 编辑器主要内容区域
    const editorMain = document.createElement('div');
    editorMain.style.cssText = `
        display: flex;
        height: 400px;
    `;
    
    // 侧边栏
    const sideBar = document.createElement('div');
    sideBar.style.cssText = `
        width: 200px;
        background: #333;
        display: flex;
        flex-direction: column;
    `;
    
    // 活动栏
    const activityBar = document.createElement('div');
    activityBar.style.cssText = `
        width: 48px;
        background: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        gap: 20px;
    `;
    
    const activityIcons = [
        '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">' +
            '<path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"/>' +
        '</svg>',
        '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">' +
            '<path d="M23.03 21.97L15.162 14.102C16.31 12.717 17 10.939 17 9C17 4.582 13.418 1 9 1C4.582 1 1 4.582 1 9C1 13.418 4.582 17 9 17C10.939 17 12.717 16.31 14.102 15.162L21.97 23.03L23.031 21.969L23.03 21.97ZM2.5 9C2.5 5.416 5.416 2.5 9 2.5C12.584 2.5 15.5 5.416 15.5 9C15.5 12.584 12.584 15.5 9 15.5C5.416 15.5 2.5 12.584 2.5 9Z"/>' +
        '</svg>',
        '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">' +
            '<path d="M21.007 8.222A3.738 3.738 0 0 0 15.045 5.2a3.737 3.737 0 0 0 1.156 6.583 2.988 2.988 0 0 1-2.668 1.67h-2.99a4.456 4.456 0 0 0-2.989 1.165V7.4a3.737 3.737 0 1 0-1.494 0v9.117a3.776 3.776 0 1 0 1.816.099 2.99 2.99 0 0 1 2.668-1.667h2.99a4.484 4.484 0 0 0 4.223-3.039 3.736 3.736 0 0 0 3.25-3.687zM4.565 3.738a2.242 2.242 0 1 1 4.484 0 2.242 2.242 0 0 1-4.484 0zm4.484 16.441a2.242 2.242 0 1 1-4.484 0 2.242 2.242 0 0 1 4.484 0zm8.221-9.715a2.242 2.242 0 1 1 0-4.485 2.242 2.242 0 0 1 0 4.485z"/>' +
        '</svg>',
        '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">' +
            '<path d="M10.94 13.5l-1.32 1.32a3.73 3.73 0 0 0-7.24 0L1.06 13.5 0 14.56l1.72 1.72-.22.22V18H0v1.5h1.5v.08c.077.489.214.966.41 1.42L0 22.94 1.06 24l1.65-1.65A4.308 4.308 0 0 0 6 24a4.31 4.31 0 0 0 3.29-1.65L10.94 24 12 22.94 10.09 21c.198-.464.336-.951.41-1.45v-.1H12V18h-1.5v-1.5l-.22-.22L12 14.56l-1.06-1.06zM6 13.5a2.25 2.25 0 0 1 2.25 2.25h-4.5A2.25 2.25 0 0 1 6 13.5zm3 6a3.33 3.33 0 0 1-3 3 3.33 3.33 0 0 1-3-3v-2.25h6v2.25zm14.76-9.9v1.26L13.5 17.37V15.6l8.5-5.37L9 2v9.46a5.07 5.07 0 0 0-1.5-.72V.63L8.64 0l15.12 9.6z"/>' +
        '</svg>',
        '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">' +
            '<path d="M22.281 6.96899L17.031 1.71899H15.9705L12.0015 5.68799V3.74849L11.2515 2.99849H2.25L1.5 3.74849V21.7485L2.25 22.4985H20.25L21 21.7485V12.7485L20.25 11.9985H18.3105L22.2795 8.02949V6.96899H22.281ZM3 4.49999H10.5V12H3V4.49999ZM3 13.5H10.5V21H3V13.5ZM19.5 21H12V13.5H19.5V21ZM12 12V9.31049L14.6895 12H12ZM16.5 11.6895L12.3105 7.49999L16.5 3.31049L20.6895 7.49999L16.5 11.6895Z"/>' +
        '</svg>'
    ];
    
    activityIcons.forEach(function(iconHTML) {
        const icon = document.createElement('div');
        icon.innerHTML = iconHTML;
        icon.style.cssText = 'color: #ccc; cursor: pointer; padding: 8px;';
        activityBar.appendChild(icon);
    });
    
    // 侧边栏视图
    const sideBarView = document.createElement('div');
    sideBarView.style.cssText = 'flex: 1; padding: 10px; color: white; font-size: 14px;';
    sideBarView.innerHTML = 
        '<div style="margin-bottom: 15px; font-weight: bold;">EXPLORER</div>' +
        '<div style="margin-bottom: 5px; color: #ccc;">• OPEN EDITORS</div>' +
        '<div style="margin-bottom: 5px; color: #ccc;">• WORKSPACE</div>' +
        '<div style="margin-left: 15px;">index.js</div>' +
        '<div style="margin-left: 15px; color: #999;">package.json</div>' +
        '<div style="margin-left: 15px; color: #999;">README.md</div>' +
        '<div style="margin-top: 15px; margin-bottom: 5px; color: #ccc;">• OUTLINE</div>';
    
    sideBar.appendChild(activityBar);
    sideBar.appendChild(sideBarView);
    
    // 编辑器区域
    const editorArea = document.createElement('div');
    editorArea.style.cssText = `
        flex: 1;
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 14px;
        padding: 20px;
        overflow: auto;
        position: relative;
    `;
    
    // 添加代码内容
    const codeContent = document.createElement('pre');
    codeContent.style.cssText = `
        margin: 0;
        line-height: 1.5;
    `;
    codeContent.textContent = '// Welcome to Bloret Launcher!\n\nfunction greet(name) {\n    console.log(`Hello, ${name}!`);\n}\n\ngreet(\'Developer\');\n\n// Start coding and enjoy the experience\n// of the open source AI code editor';

    // 添加行号
    const lineNumbers = document.createElement('div');
    lineNumbers.style.cssText = `
        position: absolute;
        left: 0;
        top: 20px;
        bottom: 20px;
        width: 40px;
        text-align: right;
        color: #858585;
        padding-right: 10px;
        border-right: 1px solid #3c3c3c;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.5;
    `;
    
    let lineNumbersText = '';
    for (let i = 1; i <= 12; i++) {
        lineNumbersText += i + '<br>';
    }
    lineNumbers.innerHTML = lineNumbersText;
    
    editorArea.appendChild(lineNumbers);
    editorArea.appendChild(codeContent);
    
    editorMain.appendChild(sideBar);
    editorMain.appendChild(editorArea);
    
    editorContainer.appendChild(topBar);
    editorContainer.appendChild(editorMain);
    
    graphicSection.appendChild(editorContainer);
    
    // 添加到主容器
    container.appendChild(graphicSection);
    
    // 添加到文档
    document.body.appendChild(container);
    
    // 添加基本样式
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0;
            padding: 0;
            background: white;
        }
        
        .link-button:hover {
            background: #005a9e !important;
        }
        
        a {
            color: #007acc;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
});

// 创建窗口控制按钮的辅助函数
function createWindowButton(color) {
    const button = document.createElement('div');
    button.style.cssText = 'width: 12px; height: 12px; border-radius: 50%; background: ' + color + '; cursor: pointer;';
    return button;
}