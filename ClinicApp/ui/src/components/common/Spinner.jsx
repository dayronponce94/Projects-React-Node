import React from 'react';

const Spinner = () => {
    return (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
};

export default Spinner;