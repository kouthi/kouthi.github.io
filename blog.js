// Render blog entries (newest first)
function renderBlogList() {
    const blogList = document.getElementById('blog-list');
    if (!blogList) return;

    blogEntries.reverse().forEach(entry => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = entry.file;
        link.textContent = `${entry.date}: ${entry.title}`;
        li.appendChild(link);
        blogList.appendChild(li);
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBlogList);
} else {
    renderBlogList();
}
