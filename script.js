// ==================== DATA ====================
let tabungan = JSON.parse(localStorage.getItem('tabungan')) || [];
let targets = JSON.parse(localStorage.getItem('targets')) || [];

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    // Set default tanggal
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('tanggalTabungan')) {
        document.getElementById('tanggalTabungan').value = today;
    }
    
    // Load data sesuai halaman
    const path = window.location.pathname;
    
    if (path.includes('tabungan.html')) {
        tampilkanTabungan();
        updateRingkasan();
    } else if (path.includes('target.html')) {
        tampilkanTargets();
    } else if (path.includes('analisis.html')) {
        updateAnalisis();
    }
});

// ==================== TABUNGAN FUNCTIONS ====================
function tambahTabungan() {
    const jumlah = document.getElementById('jumlahTabungan')?.value;
    const keterangan = document.getElementById('keteranganTabungan')?.value;
    const tanggal = document.getElementById('tanggalTabungan')?.value;
    
    if (!jumlah || jumlah <= 0) {
        showToast('❌ Masukkan jumlah yang valid!');
        return;
    }
    
    if (!keterangan) {
        showToast('❌ Masukkan keterangan!');
        return;
    }
    
    const newData = {
        id: Date.now(),
        jumlah: parseInt(jumlah),
        keterangan: keterangan,
        tanggal: tanggal,
        createdAt: new Date().toLocaleString()
    };
    
    tabungan.push(newData);
    simpanTabungan();
    
    document.getElementById('jumlahTabungan').value = '';
    document.getElementById('keteranganTabungan').value = '';
    
    tampilkanTabungan();
    updateRingkasan();
    
    showToast('✅ Tabungan berhasil ditambahkan!');
}

function editTabungan(id) {
    const item = tabungan.find(t => t.id === id);
    if (!item) return;
    
    const jumlahBaru = prompt('Edit jumlah (Rp):', item.jumlah);
    if (jumlahBaru === null) return;
    
    const keteranganBaru = prompt('Edit keterangan:', item.keterangan);
    if (keteranganBaru === null) return;
    
    if (isNaN(jumlahBaru) || jumlahBaru <= 0) {
        showToast('❌ Jumlah tidak valid!');
        return;
    }
    
    item.jumlah = parseInt(jumlahBaru);
    item.keterangan = keteranganBaru;
    
    simpanTabungan();
    tampilkanTabungan();
    updateRingkasan();
    
    showToast('✅ Tabungan diupdate!');
}

function hapusTabungan(id) {
    if (confirm('Yakin mau hapus?')) {
        tabungan = tabungan.filter(t => t.id !== id);
        simpanTabungan();
        tampilkanTabungan();
        updateRingkasan();
        showToast('🗑️ Tabungan dihapus!');
    }
}

function tampilkanTabungan() {
    const container = document.getElementById('riwayatTabungan');
    if (!container) return;
    
    const filterBulan = document.getElementById('filterBulanTabungan')?.value || 'all';
    const searchTerm = document.getElementById('searchTabungan')?.value?.toLowerCase() || '';
    
    let dataFilter = [...tabungan];
    
    if (filterBulan !== 'all') {
        dataFilter = dataFilter.filter(t => t.tanggal?.split('-')[1] === filterBulan);
    }
    
    if (searchTerm) {
        dataFilter = dataFilter.filter(t => t.keterangan?.toLowerCase().includes(searchTerm));
    }
    
    dataFilter.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    if (dataFilter.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Belum ada tabungan</p></div>';
        return;
    }
    
    let html = '';
    dataFilter.forEach(item => {
        html += `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-desc">${escapeHtml(item.keterangan)}</div>
                    <div class="transaction-date">${formatTanggal(item.tanggal)}</div>
                </div>
                <div class="transaction-amount">${formatRupiah(item.jumlah)}</div>
                <div class="transaction-actions">
                    <button class="btn-icon" onclick="editTabungan(${item.id})"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn-icon" onclick="hapusTabungan(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function filterTabungan() {
    tampilkanTabungan();
}

function updateRingkasan() {
    const total = tabungan.reduce((sum, item) => sum + (item.jumlah || 0), 0);
    const jumlah = tabungan.length;
    const rata = jumlah > 0 ? total / jumlah : 0;
    
    if (document.getElementById('totalTabungan')) {
        document.getElementById('totalTabungan').textContent = formatRupiah(total);
    }
    if (document.getElementById('jumlahTransaksi')) {
        document.getElementById('jumlahTransaksi').textContent = jumlah;
    }
    if (document.getElementById('rataRata')) {
        document.getElementById('rataRata').textContent = formatRupiah(rata);
    }
}

// ==================== TARGET FUNCTIONS (FIX) ====================
function tambahTarget() {
    const nama = document.getElementById('namaTarget')?.value;
    const targetNominal = document.getElementById('targetNominal')?.value;
    const foto = document.getElementById('fotoTarget')?.value;
    
    if (!nama) {
        showToast('❌ Masukkan nama target!');
        return;
    }
    
    if (!targetNominal || targetNominal <= 0) {
        showToast('❌ Masukkan target nominal!');
        return;
    }
    
    const newTarget = {
        id: Date.now(),
        nama: nama,
        target: parseInt(targetNominal),
        terkumpul: 0,
        foto: foto || 'https://via.placeholder.com/300x200/1a1a1a/d4af37?text=Target',
        createdAt: new Date().toLocaleString()
    };
    
    targets.push(newTarget);
    simpanTarget();
    tampilkanTargets();
    
    document.getElementById('namaTarget').value = '';
    document.getElementById('targetNominal').value = '';
    document.getElementById('fotoTarget').value = '';
    
    showToast('✅ Target berhasil dibuat!');
}

function tambahKeTarget(targetId) {
    const target = targets.find(t => t.id === targetId);
    if (!target) return;
    
    const jumlah = prompt(`Masukkan jumlah untuk target "${target.nama}":`, '');
    if (jumlah === null) return;
    
    if (isNaN(jumlah) || jumlah <= 0) {
        showToast('❌ Jumlah tidak valid!');
        return;
    }
    
    target.terkumpul += parseInt(jumlah);
    simpanTarget();
    tampilkanTargets();
    showToast(`✅ Ditambahkan ${formatRupiah(parseInt(jumlah))} ke target!`);
}

function hapusTarget(id) {
    if (confirm('Yakin mau hapus target ini?')) {
        targets = targets.filter(t => t.id !== id);
        simpanTarget();
        tampilkanTargets();
        showToast('🗑️ Target dihapus!');
    }
}

function tampilkanTargets() {
    const container = document.getElementById('targetsContainer');
    if (!container) return;
    
    if (targets.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-bullseye"></i><p>Belum ada target</p></div>';
        return;
    }
    
    let html = '';
    targets.forEach(target => {
        const progress = (target.terkumpul / target.target) * 100;
        html += `
            <div class="target-card">
                <div class="target-image">
                    <img src="${target.foto}" alt="${escapeHtml(target.nama)}" onerror="this.src='https://via.placeholder.com/300x200/1a1a1a/d4af37?text=Target'">
                </div>
                <div class="target-name">${escapeHtml(target.nama)}</div>
                <div class="target-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>${formatRupiah(target.terkumpul)}</span>
                        <span>${Math.round(progress)}%</span>
                    </div>
                </div>
                <div class="target-amounts">
                    <span class="current-amount">${formatRupiah(target.terkumpul)}</span>
                    <span class="target-amount">dari ${formatRupiah(target.target)}</span>
                </div>
                <div class="target-actions">
                    <button class="btn-icon" onclick="tambahKeTarget(${target.id})" title="Tambah ke target">
                        <i class="fas fa-plus-circle"></i>
                    </button>
                    <button class="btn-icon" onclick="hapusTarget(${target.id})" title="Hapus target">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ==================== ANALISIS FUNCTIONS ====================
function updateAnalisis() {
    const total = tabungan.reduce((sum, t) => sum + (t.jumlah || 0), 0);
    const tertinggi = tabungan.length > 0 ? Math.max(...tabungan.map(t => t.jumlah || 0)) : 0;
    const totalTransaksi = tabungan.length;
    
    const bulanMap = new Map();
    tabungan.forEach(t => {
        if (t.tanggal) {
            const bulan = t.tanggal.substring(0, 7);
            bulanMap.set(bulan, (bulanMap.get(bulan) || 0) + (t.jumlah || 0));
        }
    });
    
    const rataBulan = bulanMap.size > 0 ? total / bulanMap.size : 0;
    
    if (document.getElementById('statTotal')) {
        document.getElementById('statTotal').textContent = formatRupiah(total);
    }
    if (document.getElementById('statRataBulan')) {
        document.getElementById('statRataBulan').textContent = formatRupiah(rataBulan);
    }
    if (document.getElementById('statTertinggi')) {
        document.getElementById('statTertinggi').textContent = formatRupiah(tertinggi);
    }
    if (document.getElementById('statTotalTransaksi')) {
        document.getElementById('statTotalTransaksi').textContent = totalTransaksi;
    }
    
    updateTargetProgress();
    updateChart();
}

function updateTargetProgress() {
    const container = document.getElementById('targetProgressList');
    if (!container) return;
    
    if (targets.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">Belum ada target</p>';
        return;
    }
    
    let html = '';
    targets.forEach(target => {
        const progress = (target.terkumpul / target.target) * 100;
        html += `
            <div class="stat-item">
                <span>${escapeHtml(target.nama)}</span>
                <span class="stat-value">${Math.round(progress)}%</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateChart() {
    const container = document.getElementById('chartContainer');
    if (!container) return;
    
    const bulanData = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const bulanStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const namaBulan = date.toLocaleString('id-ID', { month: 'short' });
        
        const total = tabungan
            .filter(t => t.tanggal?.startsWith(bulanStr))
            .reduce((sum, t) => sum + (t.jumlah || 0), 0);
        
        bulanData.push({ bulan: namaBulan, total });
    }
    
    const maxTotal = Math.max(...bulanData.map(d => d.total), 1);
    
    let html = '';
    bulanData.forEach(data => {
        const height = (data.total / maxTotal) * 150;
        html += `
            <div class="chart-bar-container">
                <div class="chart-bar" style="height: ${height}px;"></div>
                <span class="chart-label">${data.bulan}</span>
            </div>
        `;
    });
    
    container.innerHTML = html || '<p style="color: var(--text-secondary); text-align: center;">Belum ada data</p>';
}

// ==================== UTILS ====================
function simpanTabungan() {
    localStorage.setItem('tabungan', JSON.stringify(tabungan));
}

function simpanTarget() {
    localStorage.setItem('targets', JSON.stringify(targets));
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka || 0);
}

function formatTanggal(tanggal) {
    if (!tanggal) return '-';
    const [tahun, bulan, hari] = tanggal.split('-');
    const namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${hari} ${namaBulan[parseInt(bulan)-1]} ${tahun}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}