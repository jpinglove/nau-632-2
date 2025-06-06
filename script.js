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
    showLoader();
    hideError();
    clearImageContainer();
    
    // 构建API请求URL
    // 参照Unsplash API 文档描述
    // https://unsplash.com/documentation#get-a-random-photo
    // 使用 /photos/random 接口，并附带 query 和 count 参数
    // count=12 表示一次获取12张与关键词相关的图片
    const apiUrl = `${API_BASE_URL}/photos/random?query=${query}&count=12&client_id=${UNSPLASH_ACCESS_KEY}`;

    // 创建一个新的XMLHttpRequest对象
    const xhr = new XMLHttpRequest();

    // 使用GET方式，以及否异步方式
    xhr.open('GET', apiUrl, true);

    // 设置一个回调函数
    // onload在请求完成会触发
    xhr.onload = function () {
        // 隐藏动画
        hideLoader();

        if (xhr.status >= 200 && xhr.status < 300) {
            // 如果请求成功 就解析返回的JSON格式数据
            const data = JSON.parse(xhr.responseText);
            
            // 检查数组是否>0，>0说明有效返回。
            if (data && data.length > 0) {
                displayImages(data);
            } else {
                // 如果无效返回，给出提示
                showError(`没有找到关于 "${query}" 的图片，请尝试更换关键词，谢谢使用。`);
            }
        } else {
            // 请求失败，给出错误提示。
            showError(`请求失败。状态码: ${xhr.status} - ${xhr.statusText}`);
        }
    };

    // 设置一个请求失败的回调。
    // onerror() 在在有当例如发生网络错误时触发。
    xhr.onerror = function () {
        hideLoader();
        showError('网络错误，请检查网络连接。');
    };

    xhr.send();
}

/**
 * 将获取到的图片显示在页面上
 * @param {Array} images - 一个图片的数组
 */
function displayImages(images) {
    images.forEach(image => {
        // 为每张图片创建一个img元素
        const imgElement = document.createElement('img');
        
        // 设置图片的信息
        imgElement.src = image.urls.regular; // 返回字段中的regular尺寸的图片显示较为适合，还有raw,full,small,thumb等URL字段。
        imgElement.alt = image.alt_description || 'Unsplash Image Description'; // 用返回字段里的alt_description给图片添加描述，如果没有，就显示默认的。
        
        // 将创建的img元素添加到图片容器中，以让页面显示出图片
        imageContainer.appendChild(imgElement);
    });
}

// 其它的一些辅助函数
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