(function() {
    // Function to detect dev tools
    const isDevToolsOpen = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        return widthThreshold || heightThreshold;
    };

    // Show warning message
    const showWarning = () => {
        alert('Warning: Developer tools are for developers only. Please close them for privacy and security reasons.');
    };

    // Check periodically if dev tools are open
    setInterval(() => {
        if (isDevToolsOpen()) {
            showWarning();
        }
    }, 1000);

    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) ||
            (e.ctrlKey && e.key === 'u')
        ) {
            e.preventDefault();
            showWarning();
        }
    });

    // Prevent right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showWarning();
        return false;
    });

    // Prevent Ctrl+U (View Source)
    document.onkeydown = function(e) {
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            showWarning();
            return false;
        }
    };
})();
