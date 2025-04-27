document.addEventListener('DOMContentLoaded', function() {
    // 元素選擇器
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const navItems = document.querySelectorAll('.nav-item');
    const loadingSpinner = document.getElementById('loading-spinner');
    const newsCardTemplate = document.getElementById('news-card-template');

    // 當前分類
    let currentCategory = 'world';

    // 初始加載新聞
    fetchNews(currentCategory);

    // 導航欄點擊事件
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 更新活躍狀態
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');

            // 獲取並更新當前分類
            currentCategory = this.id;

            // 獲取新聞
            fetchNews(currentCategory);
        });
    });

    // 搜尋按鈕點擊事件
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchNews('search', searchTerm);
        }
    });

    // 搜尋框按Enter鍵事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                fetchNews('search', searchTerm);
            }
        }
    });

    // 獲取新聞函數
    async function fetchNews(category, query = '') {
        // 顯示加載動畫
        loadingSpinner.style.display = 'flex';
        newsContainer.innerHTML = '';

        try {
            // 構建RSS feed URL
            let rssUrl = '';

            if (category === 'search' && query) {
                // 搜尋特定關鍵詞
                rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}`;
            } else {
                // 獲取特定分類的新聞
                const categoryMap = {
                    'world': 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB',
                    'business': 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB',
                    'technology': 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB',
                    'science': 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB',
                    'health': 'CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ',
                    'entertainment': 'CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB',
                    'sports': 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB'
                };

                rssUrl = `https://news.google.com/rss/topics/${categoryMap[category]}?hl=zh-TW&gl=TW&ceid=TW:zh-TW`;
            }

            // 使用代理伺服器來解決CORS問題
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

            // 發送請求獲取RSS feed
            const response = await fetch(proxyUrl + rssUrl);
            const xmlText = await response.text();

            // 解析XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            // 提取新聞項目
            const items = xmlDoc.querySelectorAll('item');
            const articles = [];

            items.forEach(item => {
                const title = item.querySelector('title')?.textContent || '';
                const link = item.querySelector('link')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';

                // 從描述中提取來源
                const sourceMatch = description.match(/<font color="#6f6f6f">(.*?)<\/font>/);
                const source = sourceMatch ? sourceMatch[1] : 'Google News';

                // 嘗試從描述中提取圖片URL
                const imgMatch = description.match(/<img src="(.*?)"/);
                const imgUrl = imgMatch ? imgMatch[1] : 'https://via.placeholder.com/350x200?text=No+Image';

                articles.push({
                    title: title,
                    url: link,
                    publishedAt: new Date(pubDate),
                    description: description.replace(/<[^>]*>/g, ''), // 移除HTML標籤
                    source: {
                        name: source
                    },
                    urlToImage: imgUrl
                });
            });

            // 渲染新聞卡片
            renderNewsCards(articles);
        } catch (error) {
            console.error('獲取新聞失敗:', error);
            newsContainer.innerHTML = `
                <div class="error-message">
                    <h3>獲取新聞失敗</h3>
                    <p>請稍後再試或檢查您的網絡連接。錯誤: ${error.message}</p>
                </div>
            `;
        } finally {
            // 隱藏加載動畫
            loadingSpinner.style.display = 'none';
        }
    }

    // 渲染新聞卡片函數
    function renderNewsCards(articles) {
        // 清空容器
        newsContainer.innerHTML = '';

        if (articles.length === 0) {
            newsContainer.innerHTML = `
                <div class="no-results">
                    <h3>沒有找到相關新聞</h3>
                    <p>請嘗試其他關鍵詞或分類。</p>
                </div>
            `;
            return;
        }

        // 為每篇文章創建卡片
        articles.forEach(article => {
            // 克隆模板
            const cardClone = newsCardTemplate.content.cloneNode(true);

            // 填充數據
            const img = cardClone.querySelector('.news-image img');
            img.src = article.urlToImage || 'https://via.placeholder.com/350x200?text=No+Image';
            img.alt = article.title;

            cardClone.querySelector('.source-name').textContent = article.source.name;

            // 格式化日期
            cardClone.querySelector('.news-date').textContent = formatDate(article.publishedAt);

            cardClone.querySelector('.news-title').textContent = article.title;
            cardClone.querySelector('.news-description').textContent = article.description;

            const readMoreLink = cardClone.querySelector('.read-more');
            readMoreLink.href = article.url;

            // 添加到容器
            newsContainer.appendChild(cardClone);
        });
    }

    // 日期格式化函數
    function formatDate(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // 秒數差

        if (diff < 60) {
            return '剛剛';
        } else if (diff < 3600) {
            return `${Math.floor(diff / 60)}分鐘前`;
        } else if (diff < 86400) {
            return `${Math.floor(diff / 3600)}小時前`;
        } else {
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        }
    }

    // 背景動畫效果
    const backgroundElement = document.querySelector('.background-animation');
    let isAnimating = true;

    function animateBackground() {
        if (!isAnimating) return;

        const colors = [
            'linear-gradient(45deg, #ff7e00, #000000)',
            'linear-gradient(45deg, #000000, #ff7e00)'
        ];

        let colorIndex = 0;

        setInterval(() => {
            backgroundElement.style.background = colors[colorIndex % colors.length];
            colorIndex++;
        }, 12000);
    }

    // 啟動背景動畫
    animateBackground();

    // 頁面可見性變化時控制動畫
    document.addEventListener('visibilitychange', function() {
        isAnimating = !document.hidden;
        if (isAnimating) {
            animateBackground();
        }
    });
});
