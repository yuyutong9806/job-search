// 数据管理
class RecruitmentApp {
    constructor() {
        this.companies = [];
        this.favorites = new Set();
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.loadSampleData();
        this.render();
    }

    setupEventListeners() {
        // 导航
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(link.dataset.section);
            });
        });

        // 搜索和筛选
        document.getElementById('searchInput').addEventListener('input', () => this.filterCompanies());
        document.getElementById('filterSelect').addEventListener('change', () => this.filterCompanies());

        // 添加公司按钮
        document.getElementById('addCompanyBtn').addEventListener('click', () => this.openModal());

        // 模态框
        const modal = document.getElementById('companyModal');
        const closeBtn = document.querySelector('.close');
        const form = document.getElementById('companyForm');

        closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
        form.addEventListener('submit', (e) => this.handleAddCompany(e));

        // 清空收藏
        document.getElementById('clearFavoritesBtn').addEventListener('click', () => {
            if (confirm('确定要清空所有收藏吗？')) {
                this.favorites.clear();
                this.saveData();
                this.render();
            }
        });
    }

    navigateToSection(section) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) {
                link.classList.add('active');
            }
        });

        // 平滑滚动到顶部
        window.scrollTo(0, 0);
    }

    openModal() {
        document.getElementById('companyModal').classList.add('show');
        document.getElementById('companyForm').reset();
    }

    closeModal() {
        document.getElementById('companyModal').classList.remove('show');
    }

    handleAddCompany(e) {
        e.preventDefault();

        const company = {
            id: Date.now(),
            name: document.getElementById('companyName').value,
            industry: document.getElementById('companyIndustry').value,
            positions: document.getElementById('companyPositions').value,
            deadline: document.getElementById('companyDeadline').value,
            link: document.getElementById('companyLink').value,
            notes: document.getElementById('companyNotes').value,
            addedDate: new Date().toISOString()
        };

        this.companies.push(company);
        this.saveData();
        this.closeModal();
        this.navigateToSection('companies');
        this.render();
    }

    deleteCompany(id) {
        if (confirm('确定要删除这个公司信息吗？')) {
            this.companies = this.companies.filter(c => c.id !== id);
            this.favorites.delete(id);
            this.saveData();
            this.render();
        }
    }

    toggleFavorite(id) {
        if (this.favorites.has(id)) {
            this.favorites.delete(id);
        } else {
            this.favorites.add(id);
        }
        this.saveData();
        this.render();
    }

    filterCompanies() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const industryFilter = document.getElementById('filterSelect').value;

        const filtered = this.companies.filter(company => {
            const matchesSearch = company.name.toLowerCase().includes(searchTerm) ||
                                  company.positions.toLowerCase().includes(searchTerm);
            const matchesIndustry = !industryFilter || company.industry === industryFilter;
            return matchesSearch && matchesIndustry;
        });

        this.renderCompaniesList(filtered);
    }

    renderCompaniesList(companies = this.companies) {
        const container = document.getElementById('companiesList');

        if (companies.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <h3>还没有公司信息</h3>
                    <p>点击"+ 添加公司"按钮添加你感兴趣的公司</p>
                </div>
            `;
            return;
        }

        container.innerHTML = companies.map(company => `
            <div class="company-card">
                <div class="company-header">
                    <span class="company-name">${company.name}</span>
                    <span class="company-badge">${company.industry}</span>
                </div>
                <div class="company-info">
                    ${new Date(company.addedDate).toLocaleDateString('zh-CN')}
                </div>
                ${company.positions ? `
                    <div class="company-positions">
                        <strong>职位：</strong>
                        ${company.positions}
                    </div>
                ` : ''}
                ${company.deadline ? `
                    <div class="company-deadline">
                        ⏰ 截止：${new Date(company.deadline).toLocaleDateString('zh-CN')}
                    </div>
                ` : ''}
                ${company.notes ? `
                    <div class="company-info" style="margin-bottom: 15px;">
                        <strong>备注：</strong> ${company.notes}
                    </div>
                ` : ''}
                <div class="company-actions">
                    <button 
                        class="btn-favorite ${this.favorites.has(company.id) ? 'active' : ''}"
                        onclick="app.toggleFavorite(${company.id})"
                    >
                        ${this.favorites.has(company.id) ? '★ 已收藏' : '☆ 收藏'}
                    </button>
                    ${company.link ? `
                        <a href="${company.link}" target="_blank" class="btn btn-open">查看职位</a>
                    ` : ''}
                    <button 
                        class="btn-delete"
                        onclick="app.deleteCompany(${company.id})"
                    >
                        删除
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderFavorites() {
        const favorites = this.companies.filter(c => this.favorites.has(c.id));
        const container = document.getElementById('favoritesList');

        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <h3>还没有收藏任何公司</h3>
                    <p>在公司列表中点击"☆ 收藏"来添加</p>
                </div>
            `;
            return;
        }

        this.renderCompaniesList(favorites);
    }

    renderTimeline() {
        const container = document.getElementById('timelineList');
        
        // 按截止日期排序
        const sorted = [...this.companies]
            .filter(c => c.deadline)
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        if (sorted.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>还没有截止日期</h3>
                    <p>添加公司信息时填写截止日期以在时间表中查看</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sorted.map(company => {
            const deadline = new Date(company.deadline);
            const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
            const status = daysLeft < 0 ? '已过期' : (daysLeft === 0 ? '今天截止' : `还剩${daysLeft}天`);

            return `
                <div class="timeline-item">
                    <div class="timeline-date">
                        ${deadline.toLocaleDateString('zh-CN')}
                    </div>
                    <div class="timeline-content">
                        <h3>${company.name}</h3>
                        <p>${company.positions || '职位未填写'}</p>
                        <p style="color: ${daysLeft < 0 ? '#e74c3c' : '#3498db'}; font-weight: bold;">
                            ${status}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        document.getElementById('totalCompanies').textContent = this.companies.length;
        document.getElementById('totalPositions').textContent = 
            this.companies.reduce((sum, c) => sum + (c.positions ? 1 : 0), 0);
        document.getElementById('totalFavorites').textContent = this.favorites.size;
    }

    render() {
        this.renderCompaniesList();
        this.renderFavorites();
        this.renderTimeline();
        this.updateStats();
    }

    loadSampleData() {
        // 只在第一次运行时加载示例数据
        if (this.companies.length === 0) {
            this.companies = [
                {
                    id: 1,
                    name: 'BATJ (百度、阿里、腾讯、字节)',
                    industry: '互联网',
                    positions: 'Java开发工程师, 前端工程师, 产品经理, 运营',
                    deadline: '2025-10-31',
                    link: 'https://www.example.com',
                    notes: '大厂秋招，福利待遇优厚',
                    addedDate: new Date().toISOString()
                },
                {
                    id: 2,
                    name: '华为',
                    industry: '电子/硬件',
                    positions: '硬件工程师, 软件工程师, 系统工程师',
                    deadline: '2025-09-30',
                    link: 'https://www.example.com',
                    notes: '2025届校招开启',
                    addedDate: new Date().toISOString()
                },
                {
                    id: 3,
                    name: '网易',
                    industry: '互联网',
                    positions: '游戏开发工程师, 后端开发, 测试工程师',
                    deadline: '2025-10-15',
                    link: 'https://www.example.com',
                    notes: '游戏和音乐方向招聘',
                    addedDate: new Date().toISOString()
                },
                {
                    id: 4,
                    name: '美团',
                    industry: '互联网',
                    positions: '算法工程师, 后端工程师, 前端工程师',
                    deadline: '2025-10-20',
                    link: 'https://www.example.com',
                    notes: '社区秋招，待遇不错',
                    addedDate: new Date().toISOString()
                }
            ];
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('companies', JSON.stringify(this.companies));
        localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
    }

    loadData() {
        const companiesData = localStorage.getItem('companies');
        const favoritesData = localStorage.getItem('favorites');

        if (companiesData) {
            this.companies = JSON.parse(companiesData);
        }

        if (favoritesData) {
            this.favorites = new Set(JSON.parse(favoritesData));
        }
    }
}

// 辅助函数
function navigateTo(section) {
    app.navigateToSection(section);
}

// 初始化应用
const app = new RecruitmentApp();
