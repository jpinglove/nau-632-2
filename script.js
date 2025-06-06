// 替换成你自己的 Unsplash Access Key
const UNSPLASH_ACCESS_KEY = 'i15kRgVNZhGLhLf_Und6K44thf0NOLZblTI6j4LLne4';
const API_BASE_URL = 'https://api.unsplash.com';

// 获取DOM元素
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');

// 监听表单提交事件
searchForm.addEventListener('submit', function (event) {
    // 阻止表单的默认提交行为（页面刷新）
    event.preventDefault();
    
    const query = searchInput.value.trim();
    if (query) {
        searchImages(query);
    }
});

/**
 * 根据关键词从Unsplash API获取图片
 * @param {string} query - 搜索的关键词
 */
function searchImages(query) {
    // 准备UI：显示加载动画，隐藏错误信息，清空旧图片
    showLoader();
    hideError();
    clearImageContainer();
    
    // 构建API请求URL
    // 我们使用 /photos/random 端点，并附带 query 和 count 参数
    // count=12 表示我们希望一次获取12张与关键词相关的随机图片
    const apiUrl = `${API_BASE_URL}/photos/random?query=${query}&count=12&client_id=${UNSPLASH_ACCESS_KEY}`;

    // 1. 创建一个新的 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();

    // 2. 配置请求：方法(GET)、URL、是否异步(true)
    xhr.open('GET', apiUrl, true);

    // 3. 设置请求成功时的回调函数 (onload)
    // onload在请求完成并成功（HTTP状态码200-299）时触发
    xhr.onload = function () {
        // 隐藏加载动画
        hideLoader();

        if (xhr.status >= 200 && xhr.status < 300) {
            // 请求成功，解析返回的JSON数据
            const data = JSON.parse(xhr.responseText);
            
            // 检查API是否返回了有效的图片数组
            if (data && data.length > 0) {
                displayImages(data);
            } else {
                showError(`未能找到关于 "${query}" 的图片，请尝试其他关键词。`);
            }
        } else {
            // 请求失败（例如，404 Not Found, 500 Server Error）
            showError(`请求失败。状态码: ${xhr.status} - ${xhr.statusText}`);
        }
    };

    // 4. 设置请求失败时的回调函数 (onerror)
    // onerror在发生网络层面的错误时（例如，无法连接到服务器）触发
    xhr.onerror = function () {
        hideLoader();
        showError('网络错误，请检查你的网络连接。');
    };

    // 5. 发送请求
    xhr.send();
}

/**
 * 将获取到的图片数据显示在页面上
 * @param {Array} images - 包含图片信息的数组
 */
function displayImages(images) {
    images.forEach(image => {
        // 为每张图片创建一个img元素
        const imgElement = document.createElement('img');
        
        // 设置图片的URL和替代文本（用于SEO和可访问性）
        imgElement.src = image.urls.regular; // 使用regular尺寸的图片
        imgElement.alt = image.alt_description || 'Unsplash Image';
        
        // 将创建的img元素添加到图片容器中
        imageContainer.appendChild(imgElement);
    });
}

// --- 辅助函数 ---

function showLoader() {
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function clearImageContainer() {
    imageContainer.innerHTML = '';
}