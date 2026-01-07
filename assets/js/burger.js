    document.addEventListener("DOMContentLoaded", function() {
        
        const burgerButton = document.getElementById('iconNavbarSidenav');
        const body = document.body;

        if (burgerButton) {
            burgerButton.addEventListener('click', function(e) {
                e.preventDefault();
                if (body.classList.contains('g-sidenav-pinned')) {
                    body.classList.remove('g-sidenav-pinned');
                } else {
                    body.classList.add('g-sidenav-pinned');
                }
            });
        }
        
        document.addEventListener('click', function(event) {
            const sidebar = document.getElementById('sidenav-main');
            if (body.classList.contains('g-sidenav-pinned') && 
                !sidebar.contains(event.target) && 
                !burgerButton.contains(event.target)) {
                
                body.classList.remove('g-sidenav-pinned');
            }
        });
    });