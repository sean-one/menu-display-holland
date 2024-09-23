document.addEventListener('DOMContentLoaded', function() {
    adjustFontSize()
    displayScreenSize()
    fetchMenuData()
    setInterval(fetchMenuData, 15000) // every 15 seconds
});

document.addEventListener('resize', function() {
    adjustFontSize()
    displayScreenSize()
});

function adjustFontSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const orientation = (screenWidth > screenHeight) ? 'landscape' : 'portrait';
    
    let baseFontSizePercentage;
    
    if (orientation === 'landscape') {
        baseFontSizePercentage = ((screenWidth / 1280) * 62.5) / pixelRatio;
    } else {
        baseFontSizePercentage = ((screenHeight / 1280) * 62.5) / pixelRatio;
    }
    
    document.documentElement.style.fontSize = baseFontSizePercentage + '%';
}

function displayScreenSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const screenSizeElement = document.getElementById('screen-details');
    const orientation = (screenWidth > screenHeight) ? 'landscape' : 'portrait';

    if (screenSizeElement) {
        screenSizeElement.textContent = `width: ${screenWidth}, height: ${screenHeight}, ratio: ${pixelRatio}, orientation: ${orientation}`;
    }
}

async function fetchMenuData() {
    try {
        const response = await fetch(MENU_URL);
        const data = await response.json();

        if (data.flower) {
            displayFlowerData(data.flower)
        } else {
            console.error('no flower data found')
        }
    } catch (error) {
        console.error(`error fetching data: `, error);
    }
}

function displayFlowerData(flowerData) {
    const sativaMenu = document.getElementById('sativaMenu');
    const indicaMenu = document.getElementById('indicaMenu');
    const hybridMenu = document.getElementById('hybridMenu');

    // clear the existing menus before updating
    sativaMenu.innerHTML = ''
    indicaMenu.innerHTML = ''
    hybridMenu.innerHTML = ''

    flowerData.forEach(row => {
        const productLine = document.createElement('div')
        productLine.classList.add('productLine')
        productLine.innerHTML = `
            <div class="nameListing ${row.featured ? 'featured' : ''}">${row.strain_name}</div>
            <div class="sizeListing ${row.featured ? 'featured' : ''}">${row.strain_1g !== '-' ? row.strain_1g : ''}</div>
            <div class="sizeListing ${row.featured ? 'featured' : ''}">${row.strain_1_8 !== '-' ? row.strain_1_8 : ''}</div>
            <div class="sizeListing ${row.featured ? 'featured' : ''}">${row.strain_1_4 !== '-' ? row.strain_1_4 : ''}</div>
            <div class="sizeListing ${row.featured ? 'featured' : ''}">${row.strain_1_2 !== '-' ? row.strain_1_2 : ''}</div>
            <div class="sizeListing ${row.featured ? 'featured' : ''}">${row.strain_1oz !== '-' ? row.strain_1oz : ''}</div>
        `
        switch (row.strain_type) {
            case 'sativa':
                sativaMenu.appendChild(productLine);
                break;
            case 'indica':
                indicaMenu.appendChild(productLine);
                break;
            case 'hybrid':
                hybridMenu.appendChild(productLine);
                break;
            default:
                console.log('Unknown category:', row.strain_type);
        }
    })
}