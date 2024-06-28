// 假设页面源代码中包含了类似 "/artists/336490" 的字符串
function extractIdFromPageSource() {
    // 获取当前页面的 HTML 源代码
    const htmlSource = document.documentElement.innerHTML;
    // 匹配 /artists/ 后面的数字部分
    const regex = /\/artists\/(\d+)/;
    // 使用正则表达式匹配并返回结果
    const match = htmlSource.match(regex);
    // 如果匹配成功，返回匹配到的数字，否则返回空字符串或者可以自定义的其他返回值
    return match ? match[1] : '';
}

// 加载 CSV 文件并处理
function loadCSVAndFindNextLine(id) {
    // 检查本地存储中是否已经有 CSV 数据
    const cachedData = localStorage.getItem('myCSVData');

    if (cachedData) {
        // 如果本地存储中有缓存数据，直接使用缓存数据
        findNextLine(cachedData, id);
    } else {
        // 否则，从网络获取数据并缓存到本地存储
        const url = 'https://raw.githubusercontent.com/your-username/your-repo/main/path/to/your/file.csv';

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(csvText => {
                // 缓存数据到本地存储
                localStorage.setItem('myCSVData', csvText);
                // 查找包含指定 ID 的行，并获取下一行内容
                findNextLine(csvText, id);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
}

// 查找包含指定 ID 的行，并获取下一行内容
function findNextLine(csvText, id) {
    // 分割 CSV 文本为行数组
    const rows = csvText.split('\n');
    
    // 查找包含指定 ID 的那一行
    let targetRow = null;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].includes(id)) {
            targetRow = i;
            break;
        }
    }
    
    // 如果找到了目标行，获取下一行的内容
    if (targetRow !== null && targetRow + 1 < rows.length) {
        const nextLine = rows[targetRow + 1].trim(); // 获取下一行内容（去除首尾空白符）
        
        // 切割逗号之前的内容
        const index = nextLine.indexOf(',');
        const tags = nextLine.substring(index + 1).trim();
        
        // 构建跳转链接
        const redirectUrl = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(tags)}`;
        
        // 跳转到新链接
        window.location.href = redirectUrl;
        
        console.log(`Redirecting to: ${redirectUrl}`);
        return tags;
    } else {
        console.warn(`No valid line found after ID ${id} in CSV.`);
        return ''; // 或者返回其他默认值，表示未找到有效行
    }
}

// 示例用法：加载 CSV 文件，并使用页面中提取的 ID 查找并跳转到下一行内容对应的链接
const id = extractIdFromPageSource();
loadCSVAndFindNextLine(id);