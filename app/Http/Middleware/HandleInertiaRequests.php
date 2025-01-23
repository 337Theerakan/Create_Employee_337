<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // ประกาศตัวแปรสำหรับเก็บข้อความ Flash - Success/Error
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(), // ข้อมูลผู้ใช้ที่เข้าzสู่ระบบ
            ],
            'flash' => [
                'success' => $request->session()->get('success') ?? null, // ข้อความ Flash สำหรับความสำเร็จ
                'error' => $request->session()->get('error') ?? null, // ข้อความ Flash สำหรับข้อผิดพลาด
            ],
        ]);
    }
}
//Middleware นี้ใช้สำหรับแชร์ข้อมูลที่ใช้ร่วมกันในทุกๆ คำขอ เช่น ข้อมูลผู้ใช้ที่เข้าสู่ระบบและข้อความ
// Flash สำหรับความสำเร็จและข้อผิดพลาด
