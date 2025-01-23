import { useEffect } from 'react';

const FlashMessage = ({ flash }) => {
    useEffect(() => {
        // ตั้งเวลาให้ข้อความ Flash หายไปหลังจาก 3 วินาที
        const timer = setTimeout(() => {
            const flashElement = document.getElementById('flash-message');
            if (flashElement) {
                flashElement.style.display = 'none';
            }
        }, 3000); // 3 วินาที

        // ล้างเวลาเมื่อคอมโพเนนต์ถูกทำลาย
        return () => clearTimeout(timer);
    }, []);

    // ถ้าไม่มีข้อความ Flash ให้คืนค่า null
    if (!flash.success && !flash.error) return null;

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
//คอมโพเนนต์นี้ใช้สำหรับแสดงข้อความ (Success/Error)
