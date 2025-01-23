import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import FlashMessage from '@/Components/FlashMessage';
import { usePage } from '@inertiajs/react';

export default function Index({ employees, query, sortField, sortOrder }) {
  const { flash } = usePage().props;

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: sortField || 'emp_no', order: sortOrder || 'asc' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearch(query || '');
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    await router.get('/employee', { search, sortField: sort.field, sortOrder: sort.order });
    setLoading(false);
  };

  const handleSort = async (field) => {
    const newOrder = sort.field === field && sort.order === 'asc' ? 'desc' : 'asc';
    setSort({ field, order: newOrder });
    setLoading(true);
    await router.get('/employee', { search, sortField: field, sortOrder: newOrder });
    setLoading(false);
  };

  const handlePagination = async (page) => {
    setLoading(true);
    await router.get('/employee', { search, page, sortField: sort.field, sortOrder: sort.order });
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 text-white">
      <FlashMessage flash={flash} />
      {loading && (
        <div className="flex justify-center items-center text-xl mb-4">
          <svg className="animate-spin h-5 w-5 mr-3 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12z"></path>
          </svg>
          Loading...
        </div>
      )}
      <h1 className="text-4xl font-semibold text-center mb-6 text-green-500">Employee List</h1>

      <form onSubmit={handleSearch} className="mb-6 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="p-3 border-2 border-gray-500 rounded-md w-1/3 bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" className="ml-4 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {employees.data.length === 0 ? (
          <div className="col-span-full text-center py-4 text-gray-500">No data available</div>
        ) : (
          employees.data.map((employee) => (
            <div key={employee.emp_no} className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-600 transition-all">
              <div className="flex justify-center mb-6">
                {employee.profile_picture ? (
                  <img
                    src={`/storage/${employee.profile_picture}`}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-green-500"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-500 flex items-center justify-center text-white">
                    <img
                      src="/img/no-picture.png"
                      alt="No Picture"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-green-500">{employee.first_name} {employee.last_name}</h2>
                <p className="text-gray-300">ID: {employee.emp_no}</p>
                <p className="text-gray-400">Gender: {employee.gender === 'M' ? 'Male' : 'Female'}</p>
                <p className="text-gray-400">Department: {employee.dept_name || 'N/A'}</p>
                <p className="text-gray-400">Hire Date: {employee.hire_date}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        {employees.prev_page_url && (
          <button onClick={() => handlePagination(employees.current_page - 1)} className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500">
            Previous
          </button>
        )}
        {(() => {
          const totalPages = employees.last_page;
          const currentPage = employees.current_page;
          const maxVisiblePages = 5;

          let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
          let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
          }

          return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <button
              key={page}
              onClick={() => handlePagination(page)}
              className={`px-6 py-3 rounded-md ${currentPage === page ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'} focus:ring-2 focus:ring-green-500`}
            >
              {page}
            </button>
          ));
        })()}
        {employees.next_page_url && (
          <button onClick={() => handlePagination(employees.current_page + 1)} className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
