import { ReactNode } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const TableComponent = ({isLoading,page,totalPages,tableHeadings,tableBody,handleNext,handlePrevious}:{
    isLoading: boolean;
    page: number;
    tableHeadings: string[];
    totalPages: number;
    tableBody: ReactNode;
    handlePrevious: () => void;
    handleNext: () => void;
}) => {
  return (
    <>
      <table className="min-w-full  rounded-xl shadow-md overflow-scroll hide-scrollbar">
        <thead>
          <tr className="text-white">
            {tableHeadings.map((heading,key) => (
                <th className="py-3 px-6 text-left text-xs text-secondary" key={key}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody className="mt-5">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : (
            tableBody
          )}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="px-4 py-2 text-white rounded disabled:opacity-50"
        >
          <FaAngleLeft />
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2  text-white rounded disabled:opacity-50"
        >
          <FaAngleRight />
        </button>
      </div>
    </>
  );
};

export default TableComponent;