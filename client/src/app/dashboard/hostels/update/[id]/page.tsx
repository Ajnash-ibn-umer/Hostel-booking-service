import React from "react";

const ComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Coming Soon</h1>
      <p className="mt-4 text-lg text-gray-600">
        We're working hard to bring you this page. Stay tuned!
      </p>
      <div className="mt-6">
        <img
          src="/path/to/your/coming-soon-image.svg"
          alt="Coming Soon"
          className="w-1/2"
        />
      </div>
    </div>
  );
};

export default ComingSoon;
