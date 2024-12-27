import React from "react";
import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        403 - Access Forbidden
      </h1>
      <p>You don't have permission to access this page.</p>
      <Link className="px-4 py-2 bg-red-400 text-gray-100 rounded-md mt-4 " to="/dashboard">
        Return to Home
      </Link>
    </div>
  );
};

export default Forbidden;
