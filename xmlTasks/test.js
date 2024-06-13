// curl -O -O http://jivemdoma.intrumnet.com/files/crm/product/resized800x600/d3/b3/60f70c2377030.jpg http://jivemdoma.intrumnet.com/files/crm/product/resized800x600/b1/01/6028ede3f3c7b.jpg


// "http://jivemdoma.intrumnet.com/files/crm/product/resized800x600/d3/b3/60f70c2377030.jpg"
// "http://jivemdoma.intrumnet.com/files/crm/product/resized800x600/b1/01/6028ede3f3c7b.jpg"


async function cleanAddressNew(address) {
    let cleanedAddress = address.toLowerCase().trim();
    // Замена сокращений и объединение цифр с последующими буквами
    const replacements = {
        '\\bул\\.?\\b': 'улица',
        '\\bобл\\.?\\b': 'область',
        '\\bг\\.?\\b': 'город',
        '\\bр\\.?\\b': 'район',
        '\\bпросп\\.?\\b': 'проспект',
        '\\bпер\\.?\\b': 'переулок'
    };
    
    for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'g');
        cleanedAddress = cleanedAddress.replace(regex, value);
    }
    
    // Объединение цифр с последующими буквами
    cleanedAddress = cleanedAddress.replace(/(\d)\s*([a-zа-я])/g, "$1$2");
    // Удаление лишних символов
    cleanedAddress = cleanedAddress.replace(/[^a-zа-я0-9\s]/g, "").trim();
    // Удаление несущественных слов
    const stopWords = ['область', 'город', 'республика', 'район'];
    cleanedAddress = cleanedAddress.split(' ').filter(word => !stopWords.includes(word)).join(' ');
    return cleanedAddress;
}

// Функция для проверки совпадения адресов
async function isExactMatchThree() {
    const address1 = 'Титова ул, 54';
    const searchAddress = 'Волгоград, улица Титова ул 54';
    
    const cleanedAddress1 = await cleanAddressNew(address1);
    const cleanedAddress2 = await cleanAddressNew(searchAddress);
    
    console.log('Cleaned Address 1:', cleanedAddress1);
    console.log('Cleaned Address 2:', cleanedAddress2);
    
    // Извлечение номеров домов с суффиксами
    const numberPart1 = cleanedAddress1.match(/\d+[a-zа-я]?/g) || [];
    const numberPart2 = cleanedAddress2.match(/\d+[a-zа-я]?/g) || [];
    
    console.log('Number Part 1:', numberPart1);
    console.log('Number Part 2:', numberPart2);
    
    // Проверка совпадения номеров домов с суффиксами
    if (numberPart1.length > 0 && numberPart2.length > 0) {
        if (numberPart1[0] !== numberPart2[0]) {
            return false;
        }
    } else if (numberPart1.length !== numberPart2.length) {
        return false;
    }
    
    // Удаление номеров домов из адресов
    const addressWithoutNumbers1 = cleanedAddress1.replace(numberPart1[0] || '', '').trim();
    const addressWithoutNumbers2 = cleanedAddress2.replace(numberPart2[0] || '', '').trim();
    
    console.log('Address Without Numbers 1:', addressWithoutNumbers1);
    console.log('Address Without Numbers 2:', addressWithoutNumbers2);
    
    // Разделение на части для точного сравнения
    const parts1 = addressWithoutNumbers1.split(/\s+/);
    const parts2 = addressWithoutNumbers2.split(/\s+/);
    
    console.log('Parts 1:', parts1);
    console.log('Parts 2:', parts2);
    
    // Проверка наличия хотя бы одной части searchAddress в address1
    for (let part of parts2) {
        if (parts1.includes(part)) {
            return true;
        }
    }
    
    return false;
}

isExactMatchThree().then(result => {
    console.log('Exact Match:', result);
});
