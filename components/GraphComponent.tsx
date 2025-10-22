import React from 'react';

interface GraphComponentProps {
  onSave: () => void;
  onDiscard: () => void;
}

const GraphComponent: React.FC<GraphComponentProps> = ({ onSave, onDiscard }) => {
  // Generate random data for the bar chart
  const graphData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 90) + 10);

  return (
    <div className="flex-shrink-0 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col p-6 m-2 md:m-4 md:w-96 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Generated Graph</h3>
      <div className="flex-grow flex items-end justify-around border-b-2 border-gray-200 pb-2 min-h-[150px]" aria-label="Bar chart">
        {graphData.map((height, index) => (
          <div
            key={index}
            className="w-10 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all duration-300 ease-in-out"
            style={{ height: `${height}%` }}
            title={`Value: ${height}`}
          ></div>
        ))}
      </div>
       <div className="flex justify-around pt-2 text-sm text-gray-500">
        <span>Q1</span>
        <span>Q2</span>
        <span>Q3</span>
        <span>Q4</span>
        <span>Q5</span>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onDiscard}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          aria-label="Discard graph"
        >
          Discard
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          aria-label="Save graph"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default GraphComponent;