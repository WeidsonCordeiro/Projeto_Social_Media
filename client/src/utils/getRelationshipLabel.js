export const getRelationshipLabel = (value) => {
  switch (value) {
    case 1:
      return "Solteiro";
    case 2:
      return "Casado";
    case 3:
      return "Divorciado";
    default:
      return "Não informado";
  }
};
