// ==================== KONFIGURASI ====================
const WA_NUMBER = '6285143837604'; // GANTI DENGAN NOMOR WA LO

// ==================== DATA PAKET ====================
const packagesData = [
    {
        name: 'BASIC',
        price: '500K',
        period: '/project',
        features: [
            { text: '1 halaman website', included: true },
            { text: 'Desain responsive', included: true },
            { text: 'Form kontak', included: true },
            { text: 'Integrasi sosial media', included: true },
            { text: 'Domain gratis', included: false },
            { text: 'Hosting gratis', included: false },
            { text: 'Fitur e-commerce', included: false }
        ],
        popular: false,
        buttonText: 'PILIH PAKET'
    },
    {
        name: 'PRO',
        price: '1.5M',
        period: '/project',
        features: [
            { text: '5 halaman website', included: true },
            { text: 'Desain responsive', included: true },
            { text: 'Form kontak', included: true },
            { text: 'Integrasi sosial media', included: true },
            { text: 'Domain gratis', included: true },
            { text: 'Hosting gratis', included: false },
            { text: 'Fitur e-commerce', included: false }
        ],
        popular: true,
        buttonText: 'PILIH PAKET'
    },
    {
        name: 'PREMIUM',
        price: '3M',
        period: '/project',
        features: [
            { text: '10 halaman website', included: true },
            { text: 'Desain responsive', included: true },
            { text: 'Form kontak', included: true },
            { text: 'Integrasi sosial media', included: true },
            { text: 'Domain gratis', included: true },
            { text: 'Hosting gratis', included: true },
            { text: 'Fitur e-commerce', included: false }
        ],
        popular: false,
        buttonText: 'PILIH PAKET'
    },
    {
        name: 'CUSTOM',
        price: 'NEGO',
        period: '',
        features: [
            { text: 'Unlimited halaman', included: true },
            { text: 'Desain exclusive', included: true },
            { text: 'Fitur custom', included: true },
            { text: 'Integrasi API', included: true },
            { text: 'Domain + Hosting', included: true },
            { text: 'Fitur e-commerce', included: true },
            { text: 'Maintenance 1 bulan', included: true }
        ],
        popular: false,
        buttonText: 'KONSULTASI'
    }
];

// ==================== RENDER PAKET ====================
function renderPackages() {
    const container = document.getElementById('packagesGrid');
    if (!container) return;
    
    let html = '';
    
    packagesData.forEach((pkg, index) => {
        // Generate fitur-fitur
        const featuresHtml = pkg.features.map(feature => {
            const icon = feature.included ? 'fa-check' : 'fa-times';
            const color = feature.included ? 'var(--red)' : '#555';
            return `
                <li>
                    <i class="fas ${icon}" style="color: ${color}"></i>
                    ${feature.text}
                </li>
            `;
        }).join('');
        
        // Tentukan kelas popular
        const popularClass = pkg.popular ? 'popular' : '';
        
        html += `
            <div class="package-card ${popularClass}">
                <h3 class="package-name">${pkg.name}</h3>
                <div class="package-price">${pkg.price}<span>${pkg.period}</span></div>
                <ul class="package-features">
                    ${featuresHtml}
                </ul>
                <a href="#" class="package-btn" onclick="orderPackage('${pkg.name}', '${pkg.price}')">
                    <i class="fab fa-whatsapp"></i> ${pkg.buttonText}
                </a>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ==================== ORDER VIA WA ====================
function orderPackage(packageName, packagePrice) {
    const message = `Halo kak, saya tertarik dengan paket ${packageName} (${packagePrice}). Boleh minta info lebih lanjut?`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// ==================== SET WA BUTTON ====================
function setWaButton() {
    const waButton = document.getElementById('waButton');
    if (waButton) {
        waButton.href = `https://wa.me/${WA_NUMBER}`;
    }
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('.nav-menu a, .btn').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Update active class
                document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
                const navLink = document.querySelector(`.nav-menu a[href="${href}"]`);
                if (navLink) navLink.classList.add('active');
            }
        }
    });
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    renderPackages();
    setWaButton();
    console.log('✅ RENZX Web Services ready!');
});
