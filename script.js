document.addEventListener('DOMContentLoaded', function() {
    // 元素選擇
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortOrder = document.getElementById('sortOrder');
    const newsResults = document.getElementById('newsResults');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // 初始化頁面
    fetchNews();

    // 事件監聽
    searchButton.addEventListener('click', function() {
        fetchNews();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchNews();
        }
    });

    categoryFilter.addEventListener('change', fetchNews);
    sortOrder.addEventListener('change', fetchNews);

    // 獲取新聞函數
    function fetchNews() {
        // 顯示載入指示器
        loadingIndicator.style.display = 'flex';
        newsResults.innerHTML = '';

        // 獲取搜尋參數
        const query = searchInput.value.trim();
        const category = categoryFilter.value;
        const sort = sortOrder.value;

        // 模擬API請求延遲
        setTimeout(() => {
            // 在實際應用中，這裡應該是向後端API發送請求
            // 由於這是前端示例，我們使用模擬數據
            const mockNewsData = getMockNewsData(query, category, sort);
            displayNews(mockNewsData);

            // 隱藏載入指示器
            loadingIndicator.style.display = 'none';
        }, 1500);
    }

    // 顯示新聞函數
    function displayNews(newsData) {
        if (newsData.length === 0) {
            newsResults.innerHTML = '<div class="no-results">沒有找到相關新聞</div>';
            return;
        }

        newsResults.innerHTML = '';

        newsData.forEach(news => {
            const newsElement = document.createElement('article');
            newsElement.className = 'news-item';

            const formattedDate = formatDate(news.date);

            newsElement.innerHTML = `
                <div class="news-source">
                    <span class="source-name">${news.source}</span>
                    <span class="news-date">${formattedDate}</span>
                </div>
                <h2 class="news-title">
                    <a href="${news.link}" target="_blank">${news.title}</a>
                </h2>
                <p class="news-description">${news.description}</p>
            `;

            newsResults.appendChild(newsElement);
        });
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 模擬新聞數據
    function getMockNewsData(query, category, sort) {
        // 這裡只是模擬數據，實際應用中應該從API獲取
        const mockNews = [
            {
                title: '全球經濟論壇發布最新報告：後疫情時代的復甦挑戰',
                description: '全球經濟論壇最新報告指出，儘管各國經濟正逐步從疫情中恢復，但供應鏈中斷、勞動力短缺和通貨膨脹等問題仍然存在，各國需要採取協調一致的措施應對這些挑戰。',
                source: '經濟日報',
                link: '#',
                date: '2025-04-26T08:30:00',
                category: 'business'
            },
            {
                title: '聯合國氣候變化會議達成新協議，各國承諾加速減碳',
                description: '在最新一輪的聯合國氣候變化會議上，全球195個國家簽署了新的減碳協議，承諾到2030年將碳排放量減少45%，並增加對發展中國家的氣候融資支持。',
                source: '環境報導',
                link: '#',
                date: '2025-04-25T14:15:00',
                category: 'world'
            },
            {
                title: '新型AI技術在醫療診斷領域取得突破性進展',
                description: '研究人員開發的新型AI系統能夠以超過95%的準確率診斷出早期癌症，這一突破可能徹底改變醫療診斷方式，並大幅提高治療成功率。',
                source: '科技前沿',
                link: '#',
                date: '2025-04-27T09:45:00',
                category: 'technology'
            },
            {
                title: '國際太空站迎來首個商業模塊，太空旅遊時代即將到來',
                description: '國際太空站成功對接了首個商業太空模塊，這標誌著太空旅遊產業的重要里程碑。據報導，首批太空旅客將於明年初前往國際太空站進行為期一週的旅行。',
                source: '科學探索',
                link: '#',
                date: '2025-04-24T11:20:00',
                category: 'science'
            },
            {
                title: '全球糧食安全報告：氣候變化威脅農業生產',
                description: '聯合國糧農組織最新報告警告，氣候變化正對全球農業生產構成嚴重威脅，極端天氣事件增加導致作物減產，可能加劇全球糧食不安全狀況。',
                source: '國際新聞社',
                link: '#',
                date: '2025-04-23T16:40:00',
                category: 'world'
            },
            {
                title: '新研究發現：每日適量咖啡攝入可能降低心臟病風險',
                description: '發表在知名醫學期刊上的最新研究顯示，每天適量飲用2-3杯咖啡可能有助於降低心臟病和中風的風險，研究人員認為這與咖啡中的抗氧化物質有關。',
                source: '健康時報',
                link: '#',
                date: '2025-04-26T10:05:00',
                category: 'health'
            }
        ];

        // 根據查詢和分類過濾
        let filteredNews = mockNews;

        if (query) {
            const queryLower = query.toLowerCase();
            filteredNews = filteredNews.filter(news =>
                news.title.toLowerCase().includes(queryLower) ||
                news.description.toLowerCase().includes(queryLower)
            );
        }

        if (category && category !== 'all') {
            filteredNews = filteredNews.filter(news => news.category === category);
        }

        // 根據排序選項排序
        if (sort === 'newest') {
            filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === 'relevance' && query) {
            // 簡單的相關性排序，實際應用中應該更複雜
            const queryLower = query.toLowerCase();
            filteredNews.sort((a, b) => {
                const aTitle = a.title.toLowerCase();
                const bTitle = b.title.toLowerCase();
                const aDesc = a.description.toLowerCase();
                const bDesc = b.description.toLowerCase();

                const aRelevance = (aTitle.includes(queryLower) ? 2 : 0) + (aDesc.includes(queryLower) ? 1 : 0);
                const bRelevance = (bTitle.includes(queryLower) ? 2 : 0) + (bDesc.includes(queryLower) ? 1 : 0);

                return bRelevance - aRelevance;
            });
        }

        return filteredNews;
    }

    // 背景漸變動畫
    function setupGradientAnimation() {
        const gradientElement = document.querySelector('.gradient-background');

        // 設定背景大小以實現動畫效果
        gradientElement.style.backgroundSize = '400% 400%';
    }

    setupGradientAnimation();
});
