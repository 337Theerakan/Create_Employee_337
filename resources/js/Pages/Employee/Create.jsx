import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Create({ departments }) {
    const [profileImagePreview, setProfileImagePreview] = useState(null); // State for profile picture preview
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        birth_date: '',
        hire_date: '',
        gender: 'M',
        dept_no: '',
        profile_picture: null,
    });

    // Handle profile picture change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImagePreview(URL.createObjectURL(file)); // Preview the selected image
            setData('profile_picture', file); // Store the file
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employee.store'), {
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 bg-gray-900 p-8 rounded-lg shadow-lg">
            {/* Profile Section */}
            <div className="border-b border-gray-600 pb-12">
                <h2 className="text-2xl font-semibold text-green-500">โปรไฟล์</h2>
                <p className="mt-1 text-sm text-gray-400">
                    ข้อมูลนี้จะถูกแสดงต่อสาธารณะ ดังนั้นระมัดระวังในการแชร์ข้อมูล
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {/* Profile Picture */}
                    <div className="col-span-full">
                        <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-300">
                            รูปโปรไฟล์
                        </label>
                        <div className="mt-2 flex items-center gap-x-3">

                            {profileImagePreview ? (
                                <img
                                //profileImagePreview คือรูปภาพที่เราเลือกจาก file input
                                    src={profileImagePreview}
                                    alt="Profile"
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            ) : (
                                // แก้ไขเพิ่มเติม ให้แสดงรูปภาพโปรไฟล์ หากมีรูปภาพหรือแสดงรูปภาพ UserCircleIcon หากไม่มีรูปภาพ
                                <UserCircleIcon aria-hidden="true" className="h-16 w-16 text-gray-500" />
                            )}
                            <button
                                type="button"
                                onClick={() => document.getElementById('file-upload').click()} // เปิด file input เมื่อคลิก
                                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                            >
                                เปลี่ยน
                            </button>
                        </div>
                    </div>

                    {/* Cover Photo */}
                    <div className="col-span-full">
                        <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-300">
                            รูปหน้าปก
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10">
                            <div className="text-center">
                                <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-500" />
                                <div className="mt-4 flex text-sm text-gray-400">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-green-600 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:bg-green-700"
                                    >
                                        <span>อัพโหลดไฟล์</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            accept="image/*"
                                            // แก้ไขเพิ่มเติม ให้เรียกใช้ handleImageChange เมื่อมีการเลือกไฟล์
                                            onChange={handleImageChange}
                                            className="sr-only"
                                        />
                                    </label>
                                    {errors.profile_picture && (
                                        <span className="text-red-500">{errors.profile_picture}</span>
                                    )}
                                    <p className="text-xs text-gray-400">PNG, JPG สูงสุด 10MB (จริงๆเเค่2MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="border-b border-gray-600 pb-12">
                <h2 className="text-2xl font-semibold text-green-500">ข้อมูลส่วนบุคคล</h2>
                <p className="mt-1 text-sm text-gray-400">กรุณากรอกให้ครบจบ</p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {/* First Name */}
                    <div className="sm:col-span-3">
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-300">
                            ชื่อ
                        </label>
                        <div className="mt-2">
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-white outline-none focus:ring-2 focus:ring-green-600 sm:text-sm"
                            />
                        </div>
                        {errors.first_name && <span className="text-red-500">{errors.first_name}</span>}
                    </div>

                    {/* Last Name */}
                    <div className="sm:col-span-3">
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-300">
                            นามสกุล
                        </label>
                        <div className="mt-2">
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-white outline-none focus:ring-2 focus:ring-green-600 sm:text-sm"
                            />
                        </div>
                        {errors.last_name && <span className="text-red-500">{errors.last_name}</span>}
                    </div>

                    {/* Birth Date */}
                    <div className="sm:col-span-3">
                        <label htmlFor="birth_date" className="block text-sm font-medium text-gray-300">
                            วันเกิด
                        </label>
                        <div className="mt-2">
                            <input
                                id="birth_date"
                                name="birth_date"
                                type="date"
                                value={data.birth_date}
                                onChange={(e) => setData('birth_date', e.target.value)}
                                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-white outline-none focus:ring-2 focus:ring-green-600 sm:text-sm"
                            />
                        </div>
                        {errors.birth_date && <span className="text-red-500">{errors.birth_date}</span>}
                    </div>

                    {/* Hire Date */}
                    <div className="sm:col-span-3">
                        <label htmlFor="hire_date" className="block text-sm font-medium text-gray-300">
                            วันเข้าทำงาน
                        </label>
                        <div className="mt-2">
                            <input
                                id="hire_date"
                                name="hire_date"
                                type="date"
                                value={data.hire_date}
                                onChange={(e) => setData('hire_date', e.target.value)}
                                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-white outline-none focus:ring-2 focus:ring-green-600 sm:text-sm"
                            />
                        </div>
                        {errors.hire_date && <span className="text-red-500">{errors.hire_date}</span>}
                    </div>

                    {/* Gender */}
                    <div className="sm:col-span-3">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                            เพศ
                        </label>
                        <div className="mt-2">
                            <select
                                id="gender"
                                name="gender"
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-white outline-none focus:ring-2 focus:ring-green-600 sm:text-sm"
                            >
                                <option value="M">ชาย</option>
                                <option value="F">หญิง</option>
                            </select>
                        </div>
                        {errors.gender && <span className="text-red-500">{errors.gender}</span>}
                    </div>

                    {/* Department */}
                    <div className="sm:col-span-3">
                        <label htmlFor="dept_no" className="block text-sm font-medium text-gray-300">
                            แผนก
                        </label>
                        <div className="mt-2">
                        <select
                        id="dept_no"
                         name="dept_no"
                         value={data.dept_no}
                         onChange={(e) => setData('dept_no', e.target.value)}
                         className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-white outline-none focus:ring-2 focus:ring-green-600 sm:text-sm"
                         >
                            <option value="" disabled>--- Select Department ---</option> {/* Placeholder option */}
                            {departments.map((dept) => (
                                <option key={dept.dept_no} value={dept.dept_no}>
                                    {dept.dept_name}
                                    </option>
                                ))}
                                </select>
                        </div>
                        {errors.dept_no && <span className="text-red-500">{errors.dept_no}</span>}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-6 py-2 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm"
                >
                    {processing ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
            </div>
        </form>
    );
}
