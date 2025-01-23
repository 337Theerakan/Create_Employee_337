import { useEffect } from 'react';

const FlashMessage = ({ flash }) => {
    useEffect(() => {
        if (flash.success || flash.error) {
            // Set timeout to hide flash message after 3 seconds
            const timer = setTimeout(() => {
                const flashElement = document.getElementById('flash-message');
                if (flashElement) {
                    flashElement.style.display = 'none';
                }
            }, 3000); // 3 seconds

            // Cleanup timer when component unmounts or flash changes
            return () => clearTimeout(timer);
        }
    }, [flash]); // Re-run the effect if flash changes

    // If no flash messages, return null
    if (!flash.success && !flash.error) return null;

    // Render flash message if success or error exists
    return (
        <div
            id="flash-message"
            className={`${flash.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} mb-4 rounded border p-4`}
        >
            <p>{flash.success || flash.error}</p>
        </div>
    );
};

export default FlashMessage;
