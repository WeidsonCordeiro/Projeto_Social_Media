export const getRelationshipLabel = (value) => {
  switch (value) {
    case 1:
      return "Single";
    case 2:
      return "Married";
    case 3:
      return "Divorced";
    default:
      return "Not specified";
  }
};
