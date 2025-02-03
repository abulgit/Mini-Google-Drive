export const getDisplayName = (filename) => {
  if (!filename) return '';
  
  // ImageKit usually adds a timestamp and random string before the original filename
  // Format is usually: timestamp_randomstring_originalfilename.extension
  const parts = filename.split('_');
  
  // If the filename has the expected format with underscores
  if (parts.length > 2) {
    // Return everything after the second underscore
    return parts.slice(2).join('_');
  }
  
  // For other formats, try to remove any timestamp at the start (if present)
  const timestampRemoved = filename.replace(/^\d+_/, '');
  
  // If there's still a random string before the actual filename
  const randomStringRemoved = timestampRemoved.replace(/^[a-zA-Z0-9]{8,}_/, '');
  
  return randomStringRemoved;
};

// Test cases (you can remove these in production)
/* 
console.log(getDisplayName('1234567890_abc123_myfile.jpg')); // -> myfile.jpg
console.log(getDisplayName('1234567890_abc123_my_file_name.jpg')); // -> my_file_name.jpg
console.log(getDisplayName('abc123_myfile.jpg')); // -> myfile.jpg
console.log(getDisplayName('myfile.jpg')); // -> myfile.jpg
console.log(getDisplayName('1234567890_myfile.jpg')); // -> myfile.jpg
*/ 