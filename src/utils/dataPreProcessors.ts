export const composeOrdersTableData = (data, attributesToShow) => {
    // Validate input
    if (!Array.isArray(data) || !Array.isArray(attributesToShow)) {
      console.error("Invalid input: data and attributesToShow must be arrays.");
      return [];
    }
  
    // Map over the data and filter attributes
    const tableData = data.map((item) => {
      // Create a new object containing only the attributes to show
      const filteredItem = {};
      attributesToShow.forEach((attribute) => {
        if (attribute in item) {
          filteredItem[attribute] = item[attribute];
        }
      });
      return filteredItem;
    });
  
    return tableData;
  };
  