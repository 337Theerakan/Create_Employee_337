<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('search');
        $sortField = $request->input('sortField', 'emp_no');
        $sortOrder = $request->input('sortOrder', 'asc');

        $employees = DB::table('employees as e')
            ->leftJoin('dept_emp as de', 'e.emp_no', '=', 'de.emp_no')
            ->leftJoin('departments as d', 'de.dept_no', '=', 'd.dept_no')
            ->select(
                'e.emp_no',
                'e.first_name',
                'e.last_name',
                'd.dept_name',
                'e.hire_date',
                'e.gender',
                'e.profile_picture'
            )
            ->where(function ($queryBuilder) use ($query) {
                if ($query) {
                    $queryBuilder
                        ->where('e.first_name', 'like', '%' . $query . '%')
                        ->orWhere('e.last_name', 'like', '%' . $query . '%')
                        ->orWhere('e.emp_no', 'like', '%' . $query . '%');
                }
            })
            ->orderBy($sortField, $sortOrder)
            ->paginate(16);

        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'query' => $query,
            'sortField' => $sortField,
            'sortOrder' => $sortOrder,
        ]);
    }


    public function create()
    {
        // ดึงรายชื่อแผนกจากฐานข้อมูลเพื่อแสดงในฟอร์ม
        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();

        // ส่งข้อมูลไปยังหน้า Inertia
        return Inertia::render('Employee/Create', ['departments' => $departments]);
    }

    public function store(Request $request)
    {
        // ตรวจสอบข้อมูลที่รับมา
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'hire_date' => 'required|date',
            'gender' => 'required|in:M,F',
            'dept_no' => 'required|string|max:4',
            'profile_picture' => 'nullable|image|mimes:jpg,png,jpeg|max:2048', // เพิ่มกฎการอัปโหลดรูปภาพ
        ]);

        try {
            DB::transaction(function () use ($validated, $request) {
                // สร้างหมายเลขพนักงานใหม่
                $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0;
                $newEmpNo = $latestEmpNo + 1;

                // ตรวจสอบว่ามีรูปภาพอัปโหลดหรือไม่
                $profilePicturePath = null;
                if ($request->hasFile('profile_picture')) {
                    $profilePicturePath = $request->file('profile_picture')->store('uploads/employees', 'public');
                }

                // เพิ่มข้อมูลพนักงานในตาราง employees
                DB::table('employees')->insert([
                    'emp_no' => $newEmpNo,
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'birth_date' => $validated['birth_date'],
                    'hire_date' => $validated['hire_date'],
                    'gender' => $validated['gender'],
                    'profile_picture' => $profilePicturePath, // เก็บพาธรูปภาพในฐานข้อมูล
                ]);

                // เพิ่มความสัมพันธ์พนักงานกับแผนกในตาราง dept_emp
                DB::table('dept_emp')->insert([
                    'emp_no' => $newEmpNo,
                    'dept_no' => $validated['dept_no'],
                    'from_date' => now(),
                    'to_date' => '9999-01-01',
                ]);
            });

            // ส่งข้อความสำเร็จ
            return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
        } catch (\Exception $e) {
            // ส่งข้อความเมื่อเกิดข้อผิดพลาด
            return back()->with('error', 'Failed to create employee. Please try again.');
        }
    }
}
// คือกสร้างคอลัมน์ใหม่ในตาราง employees เพื่อเก็บพาธรูปภาพของพนักงาน ใช้คำสั่ง SQL ดังนี้
//ALTER TABLE employees ADD COLUMN profile_picture VARCHAR(255) NULL AFTER gender;
