// 全域變數
let newsData = [];
let filteredData = [];
let currentCategory = 'all';
let searchQuery = '';

// DOM元素
const newsContainer = document.getElementById('newsContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const refreshBtn = document.getElementById('refreshBtn');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();

    // 事件監聽器
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    categoryFilter.addEventListener('change', handleCategoryChange);
    refreshBtn.addEventListener('click', fetchNews);
});

// 抓取新聞資料
async function fetchNews() {
    showLoading();

    try {
        // 這裡我們使用一個代理伺服器來繞過CORS限制
        // 在實際部署時，您需要設置自己的後端API來抓取Google新聞
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en';

        const response = await fetch(proxyUrl + targetUrl);
        const data = await response.text();

        // 解析RSS XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const items = xmlDoc.querySelectorAll('item');

        newsData = Array.from(items).map(item => {
            // 從XML中提取資料
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const pubDate = new Date(item.querySelector('pubDate').textContent);
            const source = item.querySelector('source') ? item.querySelector('source').textContent : 'Google News';
            const description = item.querySelector('description') ? item.querySelector('description').textContent : '';

            // 從描述中提取圖片URL (如果有的話)
            let imageUrl = '';
            const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) {
                imageUrl = imgMatch[1];
            }

            // 隨機分配一個分類 (在實際應用中，您可能會從新聞內容中提取)
            const categories = ['world', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];
            const category = categories[Math.floor(Math.random() * categories.length)];

            return {
                title,
                link,
                pubDate,
                source,
                imageUrl,
                category
            };
        });

        // 更新顯示
        filteredData = [...newsData];
        renderNews();
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('無法載入新聞，請稍後再試。');
    }
}

// 渲染新聞卡片
function renderNews() {
    // 清空容器
    newsContainer.innerHTML = '';

    // 如果沒有新聞，顯示無結果訊息
    if (filteredData.length === 0) {
        newsContainer.innerHTML = `
            <div class="no-results">
                <h3>沒有找到符合的新聞</h3>
                <p>請嘗試其他關鍵字或分類</p>
            </div>
        `;
        return;
    }

    // 創建新聞卡片
    filteredData.forEach(news => {
        const formattedDate = formatDate(news.pubDate);
        const card = document.createElement('div');
        card.className = 'news-card';

        card.innerHTML = `
            ${news.imageUrl ? `<img src="${news.imageUrl}" alt="${news.title}" class="news-image">` : ''}
            <div class="news-content">
                <span class="news-source">${news.source}</span>
                <h3 class="news-title"><a href="${news.link}" target="_blank">${news.title}</a></h3>
                <div class="news-date">
                    <i class="far fa-clock"></i> ${formattedDate}
                </div>
            </div>
        `;

        newsContainer.appendChild(card);
    });
}

// 處理搜尋
function handleSearch() {
    searchQuery = searchInput.value.trim().toLowerCase();
    filterNews();
}

// 處理分類變更
function handleCategoryChange() {
    currentCategory = categoryFilter.value;
    filterNews();
}

// 篩選新聞
function filterNews() {
    filteredData = newsData.filter(news => {
        // 分類篩選
        const categoryMatch = currentCategory === 'all' || news.category === currentCategory;

        // 關鍵字搜尋
        const searchMatch = searchQuery === '' ||
            news.title.toLowerCase().includes(searchQuery) ||
            news.source.toLowerCase().includes(searchQuery);

        return categoryMatch && searchMatch;
    });

    renderNews();
}

// 顯示載入中
function showLoading() {
    newsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>正在載入最新新聞...</p>
        </div>
    `;
}

// 顯示錯誤
function showError(message) {
    newsContainer.innerHTML = `
        <div class="no-results">
            <h3>發生錯誤</h3>
            <p>${message}</p>
        </div>
    `;
}

// 格式化日期
function formatDate(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // 差異（秒）

    if (diff < 60) {
        return '剛剛';
    } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes}分鐘前`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours}小時前`;
    } else if (diff < 604800) {
        const days = Math.floor(diff / 86400);
        return `${days}天前`;
    } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

// 模擬新聞資料 (當API無法使用時)
function generateMockNews() {
    const mockNews = [
        {
            title: '全球經濟復甦跡象明顯，各國股市普遍上漲',
            link: 'https://news.google.com/articles/example1',
            pubDate: new Date(Date.now() - 3600000), // 1小時前
            source: 'Financial Times',
            imageUrl: 'https://source.unsplash.com/random/300x200?economy',
            category: 'business'
        },
        {
            title: '新型冠狀病毒變種引發關注，專家呼籲加強防疫措施',
            link: 'https://news.google.com/articles/example2',
            pubDate: new Date(Date.now() - 7200000), // 2小時前
            source: 'BBC News',
            imageUrl: 'https://source.unsplash.com/random/300x200?virus',
            category: 'health'
        },
        {
            title: '人工智能技術突破：新模型在多項任務中超越人類表現',
            link: 'https://news.google.com/articles/example3',
            pubDate: new Date(Date.now() - 86400000), // 1天前
            source: 'TechCrunch',
            imageUrl: 'https://source.unsplash.com/random/300x200?ai',
            category: 'technology'
        },
        {
            title: '氣候變化加劇：極端天氣事件在全球範圍內增加',
            link: 'https://news.google.com/articles/example4',
            pubDate: new Date(Date.now() - 172800000), // 2天前
            source: 'National Geographic',
            imageUrl: 'https://source.unsplash.com/random/300x200?climate',
            category: 'science'
        },
        {
            title: '奧運會倒計時：運動員們進入最後備戰階段',
            link: 'https://news.google.com/articles/example5',
            pubDate: new Date(Date.now() - 259200000), // 3天前
            source: 'ESPN',
            imageUrl: 'https://source.unsplash.com/random/300x200?olympics',
            category: 'sports'
        },
        {
            title: '國際電影節揭幕：多部備受期待的新片首映',
            link: 'https://news.google.com/articles/example6',
            pubDate: new Date(Date.now() - 345600000), // 4天前
            source: 'Variety',
            imageUrl: 'https://source.unsplash.com/random/300x200?movie',
            category: 'entertainment'
        }
    ];

    return mockNews;
}

// 如果API請求失敗，使用模擬資料
window.addEventListener('error', function(e) {
    if (e.target.tagName.toLowerCase() === 'script') {
        console.log('Script loading error, using mock data instead');
        newsData = generateMockNews();
        filteredData = [...newsData];
        renderNews();
    }
}, true);
