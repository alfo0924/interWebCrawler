document.addEventListener('DOMContentLoaded', function() {
    // 新聞數據
    const fetchNews = async () => {
        // 在實際應用中，這裡應該是向後端API發送請求
        // 由於我們無法直接在前端爬取Google新聞（跨域限制），
        // 這裡使用模擬數據來展示界面效果

        // 顯示載入動畫
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>載入新聞中...</p>
            </div>
        `;

        // 模擬API請求延遲
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 模擬新聞數據
        const mockNews = [
            {
                title: "加拿大街頭慶典汽車衝撞人群 警方確認已有9人死亡",
                source: "奇摩新聞",
                description: "溫哥華街頭慶典發生嚴重車禍事件，一輛汽車衝入人群造成多人傷亡。警方表示，目前已確認9人死亡，事件原因仍在調查中。",
                image: "https://via.placeholder.com/300x180.png?text=加拿大街頭慶典車禍",
                time: "2小時前",
                url: "https://news.google.com/articles/CBMiPmh0dHBzOi8vbmV3cy5saXZlZG9vci5jb20vYXJ0aWNsZS9saXZlZG9vci1uZXdzLTI0MjQ2NTQzMjMuaHRtbNIBAA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "society"
            },
            {
                title: "伊朗港口爆炸至少8死750傷 火勢加劇恐蔓延",
                source: "中央社 CNA",
                description: "伊朗南部重要商港發生大規模爆炸事件，目前已造成至少8人死亡，750人受傷。初步調查顯示可能與貨櫃內化學物質不當存放有關。",
                image: "https://via.placeholder.com/300x180.png?text=伊朗港口爆炸",
                time: "3小時前",
                url: "https://news.google.com/articles/CBMiOWh0dHBzOi8vd3d3LmNuYS5jb20udHcvbmV3cy9maXJzdG5ld3MvaW50bC9wYXBlci8yMDI1MDQyN3c3NDDSAQA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "society"
            },
            {
                title: "對川普釋出善意？ 中國低調豁免美「131類」商品關稅",
                source: "奇摩新聞",
                description: "根據路透社報導，中國已悄悄豁免部分美國商品的高額關稅，涉及131類產品，包括藥品、航空設備和晶片等。分析認為此舉可能是對川普政府釋出善意。",
                image: "https://via.placeholder.com/300x180.png?text=中美關稅談判",
                time: "5小時前",
                url: "https://news.google.com/articles/CBMiRmh0dHBzOi8vbmV3cy5saXZlZG9vci5jb20vYXJ0aWNsZS9saXZlZG9vci1uZXdzLTI0MjQ2NTQzMjMuaHRtbD9tb2RlPWFtcNIBAA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "economy"
            },
            {
                title: "陸「最美通緝犯」出獄開直播！主打「改邪歸正」卻遭封號",
                source: "ETtoday新聞雲",
                description: "中國四川「最美通緝犯」出獄後在抖音平台開設直播，以「改邪歸正」為主題分享經歷，然而直播一個月後帳號被平台封禁。",
                image: "https://via.placeholder.com/300x180.png?text=網紅直播",
                time: "6小時前",
                url: "https://news.google.com/articles/CBMiOmh0dHBzOi8vd3d3LmV0dG9kYXkubmV0L25ld3MvMjAyNTA0MjcvMjU2NzU5OS5odG0_ZnJvbT1ob21lwgE-aHR0cHM6Ly93d3cuZXR0b2RheS5uZXQvYW1wL25ld3MvMjAyNTA0MjcvMjU2NzU5OS5odG0_ZnJvbT1ob21l?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "society"
            },
            {
                title: "印度女洗澡突遭猴群攻擊！滾燙熱水「潑灑全身」慘活活燙死",
                source: "ETtoday新聞雲",
                description: "印度一名女子在家中洗澡時突然遭到猴群攻擊，慌亂中將滾燙的熱水潑灑全身，導致嚴重燙傷不治身亡。當地猴患問題嚴重引發關注。",
                image: "https://via.placeholder.com/300x180.png?text=印度意外事件",
                time: "7小時前",
                url: "https://news.google.com/articles/CBMiOmh0dHBzOi8vd3d3LmV0dG9kYXkubmV0L25ld3MvMjAyNTA0MjcvMjU2NzYwMC5odG0_ZnJvbT1ob21lwgE-aHR0cHM6Ly93d3cuZXR0b2RheS5uZXQvYW1wL25ld3MvMjAyNTA0MjcvMjU2NzYwMC5odG0_ZnJvbT1ob21l?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "society"
            },
            {
                title: "中國男疑跟風抖音「富士山封山季攻頂」 高山症發作求援被日網砲轟",
                source: "自由時報",
                description: "一名中國男子疑似跟風抖音上流傳的「富士山封山季攻頂」教學，在富士山冬季封山期間違法登山，結果高山症發作求援，引發日本網友批評。",
                image: "https://via.placeholder.com/300x180.png?text=富士山登山事件",
                time: "8小時前",
                url: "https://news.google.com/articles/CBMiOmh0dHBzOi8vbmV3cy5saWJlcnR5dGltZXMuY29tLnR3L2ludGVybmF0aW9uYWwvNzQzMjQ4NS9hcnRpY2xlwgEA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "society"
            },
            {
                title: "黃金周變「省錢周」！日本物價高漲掀假期「宅家」潮",
                source: "奇摩新聞",
                description: "日本黃金週假期即將到來，但受物價高漲影響，許多日本民眾選擇「宅在家」度過連假，而非出遊消費。調查顯示，台灣成為日本民眾海外旅遊首選目的地。",
                image: "https://via.placeholder.com/300x180.png?text=日本黃金週",
                time: "9小時前",
                url: "https://news.google.com/articles/CBMiRmh0dHBzOi8vbmV3cy5saXZlZG9vci5jb20vYXJ0aWNsZS9saXZlZG9vci1uZXdzLTI0MjQ2NTQzMjMuaHRtbD9tb2RlPWFtcNIBAA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "economy"
            },
            {
                title: "川普就任百日民調出爐！支持度跌到39%創80年新低 招牌議題掉漆",
                source: "聯合新聞網",
                description: "美國總統川普就任百日民調結果顯示，支持率僅39%，創下80年來美國總統就任初期支持率新低。分析指出，川普在經濟和移民等招牌議題上的表現未獲選民認可。",
                image: "https://via.placeholder.com/300x180.png?text=川普民調",
                time: "10小時前",
                url: "https://news.google.com/articles/CBMiPmh0dHBzOi8vdWRuLmNvbS9uZXdzL2ludGwvNzQzMjQ4NS9hcnRpY2xlP2Zyb209dWRuX3BpY2tfbmV3c9IBAA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "politics"
            },
            {
                title: "全球送別教宗方濟各 盛大喪禮約25萬人致哀、簡樸安葬聖母大殿",
                source: "中央社 CNA",
                description: "教宗方濟各喪禮在梵蒂岡舉行，全球約25萬人前來致哀。依照教宗生前遺願，喪禮儀式簡樸，遺體安葬於聖母大殿。台灣副總統陳建仁出席喪禮並與多國領袖互動。",
                image: "https://via.placeholder.com/300x180.png?text=教宗喪禮",
                time: "12小時前",
                url: "https://news.google.com/articles/CBMiOWh0dHBzOi8vd3d3LmNuYS5jb20udHcvbmV3cy9maXJzdG5ld3MvaW50bC9wYXBlci8yMDI1MDQyN3c3NDTSAQA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "society"
            },
            {
                title: "聞到奇怪味道！女子日本獨旅住連鎖飯店 驚見「陌生男藏床底」",
                source: "TVBS新聞網",
                description: "一名外國女子在日本東京獨自旅行時，入住知名連鎖飯店後發現房間有奇怪味道，低頭一看竟發現床底藏有一名陌生男子。事件引發關注，該男子至今仍未被找到。",
                image: "https://via.placeholder.com/300x180.png?text=日本飯店事件",
                time: "13小時前",
                url: "https://news.google.com/articles/CBMiOmh0dHBzOi8vbmV3cy50dmJzLmNvbS50dy9uZXdzL2ludGVybmF0aW9uYWwvNzQzMjQ4NS9hcnRpY2xlwgEA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "society"
            },
            {
                title: "俄軍首度承認北韓參戰！4字評價北韓兵 稱100%收復庫斯克但烏否認",
                source: "聯合新聞網",
                description: "俄羅斯軍方首次公開承認北韓軍隊參與俄烏戰爭，並對北韓士兵給予高度評價。同時，俄方宣稱已100%收復庫斯克州，但烏克蘭方面否認此說法。",
                image: "https://via.placeholder.com/300x180.png?text=俄烏戰爭",
                time: "14小時前",
                url: "https://news.google.com/articles/CBMiPmh0dHBzOi8vdWRuLmNvbS9uZXdzL2ludGwvNzQzMjQ4NS9hcnRpY2xlP2Zyb209dWRuX3BpY2tfbmV3c9IBAA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "politics"
            },
            {
                title: "父亡逾2年未葬！日中餐館老闆揭原因 警開壁櫥見「一堆白骨」愣了",
                source: "奇摩新聞",
                description: "日本一家中餐館老闆被發現將父親遺體藏在家中壁櫥超過2年未安葬。警方上門調查時打開壁櫥，發現已成一堆白骨。老闆表示因經濟困難無力支付葬禮費用。",
                image: "https://via.placeholder.com/300x180.png?text=日本社會事件",
                time: "15小時前",
                url: "https://news.google.com/articles/CBMiRmh0dHBzOi8vbmV3cy5saXZlZG9vci5jb20vYXJ0aWNsZS9saXZlZG9vci1uZXdzLTI0MjQ2NTQzMjMuaHRtbD9tb2RlPWFtcNIBAA?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
                category: "society"
            }
        ];

        // 渲染新聞
        renderNews(mockNews);

        return mockNews;
    };

    // 渲染新聞函數
    const renderNews = (newsData) => {
        const newsContainer = document.getElementById('newsContainer');

        if (!newsData || newsData.length === 0) {
            newsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px 0;">
                    <p>沒有找到相關新聞</p>
                </div>
            `;
            return;
        }

        let newsHTML = '';

        newsData.forEach(news => {
            newsHTML += `
                <div class="news-card" data-category="${news.category || 'all'}">
                    <img src="${news.image}" alt="${news.title}" class="news-image">
                    <div class="news-content">
                        <p class="news-source">${news.source}</p>
                        <h3 class="news-title">${news.title}</h3>
                        <p class="news-description">${news.description}</p>
                        <p class="news-time">${news.time}</p>
                        <a href="${news.url}" target="_blank" class="read-more">閱讀全文</a>
                    </div>
                </div>
            `;
        });

        newsContainer.innerHTML = newsHTML;
    };

    // 初始化頁面
    let allNews = [];

    // 獲取新聞數據
    fetchNews().then(data => {
        allNews = data;

        // 設置搜尋功能
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();

            if (searchTerm === '') {
                renderNews(allNews);
                return;
            }

            const filteredNews = allNews.filter(news =>
                news.title.toLowerCase().includes(searchTerm) ||
                news.description.toLowerCase().includes(searchTerm) ||
                news.source.toLowerCase().includes(searchTerm)
            );

            renderNews(filteredNews);
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // 設置分類功能
        const categoryButtons = document.querySelectorAll('.category-btn');

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有按鈕的活躍狀態
                categoryButtons.forEach(btn => btn.classList.remove('active'));

                // 添加當前按鈕的活躍狀態
                button.classList.add('active');

                const category = button.dataset.category;

                if (category === 'all') {
                    renderNews(allNews);
                } else {
                    const filteredNews = allNews.filter(news => news.category === category);
                    renderNews(filteredNews);
                }
            });
        });
    });

    // 背景動畫效果
    const updateBackground = () => {
        const background = document.querySelector('.background-animation');
        background.style.animation = 'none';
        setTimeout(() => {
            background.style.animation = 'gradientAnimation 12s infinite';
        }, 10);
    };

    // 每12秒更新一次背景
    setInterval(updateBackground, 12000);
});
