import React from 'react';
import type { SizeChart } from '@/data/sizeCharts';

interface SizeChartTableProps {
  sizeChart: SizeChart;
}

export function SizeChartTable({ sizeChart }: SizeChartTableProps) {
  const sizes = sizeChart.measurements.map(m => m.size);
  const measurementKeys = Object.keys(sizeChart.measurementLabels);

  return (
    <div>
      <h3 className="text-lg font-bold text-black mb-4">{sizeChart.title}</h3>
      {sizeChart.description && (
        <p className="text-sm text-gray-600 mb-3">{sizeChart.description}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-3 text-left font-semibold border-r border-gray-700">Size</th>
              {sizes.map((size, idx) => (
                <th 
                  key={size} 
                  className={`px-4 py-3 text-center font-semibold ${idx < sizes.length - 1 ? 'border-r border-gray-700' : ''}`}
                >
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {measurementKeys.map((key) => (
              <tr key={key} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-black bg-gray-50 border-r border-gray-200">
                  {sizeChart.measurementLabels[key]}
                </td>
                {sizeChart.measurements.map((measurement, idx) => {
                  const value = measurement[key as keyof typeof measurement];
                  const displayValue = Array.isArray(value) 
                    ? `${value[0]}-${value[1]}` 
                    : value || '-';
                  
                  return (
                    <td 
                      key={`${measurement.size}-${key}`}
                      className={`px-4 py-3 text-center text-black ${idx < sizeChart.measurements.length - 1 ? 'border-r border-gray-200' : ''}`}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
