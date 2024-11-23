import Papa from 'papaparse';

// Function to read and parse a CSV file from an input file element
export const parseCSVFile = (file, callback) => {
  Papa.parse(file, {
    complete: (result) => {
      console.log('CSV parsed successfully:', result);
      callback(result.data);
    },
    header: true, // Assuming the first row contains headers
    skipEmptyLines: true, // Skip any empty lines in the CSV
  });
};
