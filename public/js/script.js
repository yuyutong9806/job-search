class RecruitmentApp {
    constructor() {
        this.companies = [];
        this.filters = {
            city: '',
            source: '',
            search: '',
            hideAmbassador: false
        };
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        if (this.companies.length === 0) {
            this.loadSampleData();
        }
        this.render();
    }

    setupEventListeners() {
        // 城市筛选
        document.getElementById('cityFilters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tag')) {
                document.querySelectorAll('#cityFilters .filter-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.filters.city = e.target.dataset.value;
                this.render();
            }
        });

        // 来源筛选
        document.getElementById('sourceFilters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tag')) {
                document.querySelectorAll('#sourceFilters .filter-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.filters.source = e.target.dataset.value;
                this.render();
            }
        });

        // 搜索
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.render();
        });

        // 隐藏校园大使
        document.getElementById('hideAmbassador').addEventListener('change', (e) => {
            this.filters.hideAmbassador = e.target.checked;
            this.render();
        });

        // 模态框操作
        const modal = document.getElementById('companyModal');
        const closeBtn = document.querySelector('.close');
        const form = document.getElementById('companyForm');

        document.getElementById('addCompanyBtn').addEventListener('click', () => {
            modal.style.display = 'block';
            form.reset();
        });

        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        form.addEventListener('submit', (e) => this.handleAddCompany(e));
    }

    handleAddCompany(e) {
        e.preventDefault();
        const company = {
            id: Date.now(),
            updateDate: new Date().toISOString().split('T')[0].slice(5), // MM-DD format
            name: document.getElementById('companyName').value,
            industry: document.getElementById('companyIndustry').value,
            batch: document.getElementById('companyBatch').value,
            location: document.getElementById('companyLocation').value,
            positions: document.getElementById('companyPositions').value,
            noticeLink: document.getElementById('companyNoticeLink').value,
            applyLink: document.getElementById('companyApplyLink').value,
            source: '官网' // Default source
        };

        this.companies.unshift(company);
        this.saveData();
        document.getElementById('companyModal').style.display = 'none';
        this.render();
    }

    deleteCompany(id) {
        if (confirm('确定要删除这条信息吗？')) {
            this.companies = this.companies.filter(c => c.id !== id);
            this.saveData();
            this.render();
        }
    }

    getFilteredCompanies() {
        return this.companies.filter(company => {
            // 城市筛选
            if (this.filters.city && !company.location.includes(this.filters.city)) return false;
            
            // 来源筛选
            if (this.filters.source && company.source !== this.filters.source) return false;
            
            // 搜索筛选
            if (this.filters.search) {
                const searchContent = (company.name + company.positions).toLowerCase();
                if (!searchContent.includes(this.filters.search)) return false;
            }

            // 隐藏校园大使
            if (this.filters.hideAmbassador && company.positions.includes('校园大使')) return false;

            return true;
        });
    }

    render() {
        const filtered = this.getFilteredCompanies();
        const container = document.getElementById('companiesList');
        document.getElementById('totalCount').textContent = filtered.length;

        if (filtered.length === 0) {
            container.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:20px;">暂无数据</td></tr>';
            return;
        }

        container.innerHTML = filtered.map(company => `
            <tr>
                <td>${company.updateDate}</td>
                <td style="font-weight:500">${company.name}</td>
                <td>${company.noticeLink ? `<a href="${company.noticeLink}" target="_blank" class="link-btn">招聘公告</a>` : '-'}</td>
                <td>${company.applyLink ? `<a href="${company.applyLink}" target="_blank" class="link-btn">投递官网</a>` : '-'}</td>
                <td><span class="tag-industry">${company.industry}</span></td>
                <td><span class="tag-batch">${company.batch}</span></td>
                <td style="font-size:13px;color:#666;max-width:300px;">${company.positions}</td>
                <td>${company.location}</td>
                <td>
                    <button class="action-btn delete" onclick="app.deleteCompany(${company.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadSampleData() {
        this.companies = [
            {
                id: 1,
                updateDate: '12-28',
                name: '中国金融出版社',
                industry: '国企',
                batch: '26秋招',
                location: '北京',
                positions: '编辑、财务、行政管理',
                noticeLink: '#',
                applyLink: '#',
                source: '官网'
            },
            {
                id: 2,
                updateDate: '12-28',
                name: '汇川技术',
                industry: '民营',
                batch: '26秋招',
                location: '深圳、苏州',
                positions: '嵌入式软件工程师、硬件工程师、算法工程师',
                noticeLink: '#',
                applyLink: '#',
                source: '官网'
            },
            {
                id: 3,
                updateDate: '12-28',
                name: '清华大学图书馆',
                industry: '事业单位',
                batch: '26秋招',
                location: '北京',
                positions: '图书管理员、信息技术岗',
                noticeLink: '#',
                applyLink: '#',
                source: '官网'
            },
            {
                id: 4,
                updateDate: '12-27',
                name: '万兴科技',
                industry: '互联网',
                batch: 'offer直通计划',
                location: '长沙、深圳',
                positions: '产品经理、C++开发、海外运营',
                noticeLink: '#',
                applyLink: '#',
                source: '官网'
            },
            {
                id: 5,
                updateDate: '12-27',
                name: '中国农业科学院',
                industry: '事业单位',
                batch: '26秋招',
                location: '北京',
                positions: '科研助理、行政管理',
                noticeLink: '#',
                applyLink: '#',
                source: '官网'
            }
        ];
        this.saveData();
    }

    saveData() {
        localStorage.setItem('companies_v2', JSON.stringify(this.companies));
    }

    loadData() {
        const data = localStorage.getItem('companies_v2');
        if (data) {
            this.companies = JSON.parse(data);
        }
    }
}

const app = new RecruitmentApp();
