document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const results = document.getElementById('results');

    searchButton.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBooks();
        }
    });

    function searchBooks() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Hide error message and show loading
        errorMessage.classList.add('hidden');
        loading.classList.remove('hidden');
        results.innerHTML = '';

        // Fetch books from Google Books API
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`)
            .then(response => response.json())
            .then(data => {
                loading.classList.add('hidden');
                displayBooks(data.items || []);
            })
            .catch(error => {
                loading.classList.add('hidden');
                console.error('Error fetching books:', error);
                errorMessage.classList.remove('hidden');
            });
    }

    function displayBooks(books) {
        if (books.length === 0) {
            results.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><p>No books found. Try a different search term.</p></div>';
            return;
        }

        books.forEach(book => {
            const volumeInfo = book.volumeInfo;
            const bookElement = document.createElement('div');
            bookElement.className = 'book';

            const imageUrl = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : 'https://via.placeholder.com/150x200/667eea/white?text=No+Image';
            const title = volumeInfo.title || 'Unknown Title';
            const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
            const publishedDate = volumeInfo.publishedDate || 'Unknown Date';
            const infoLink = volumeInfo.infoLink || '#';

            bookElement.innerHTML = `
                <img src="${imageUrl}" alt="${title}" loading="lazy">
                <div class="book-content">
                    <h3>${title}</h3>
                    <p><strong>Author(s):</strong> ${authors}</p>
                    <p><strong>Published:</strong> ${publishedDate}</p>
                    <a href="${infoLink}" target="_blank">More Info <i class="fas fa-external-link-alt"></i></a>
                </div>
            `;

            results.appendChild(bookElement);
        });
    }
});