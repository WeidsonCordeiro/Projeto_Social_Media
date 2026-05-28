// This file contains tests for the mapValidationErrors utility function.
import { mapValidationErrors } from "./mapValidationErrors";

describe("mapValidationErrors", () => {
  test("maps backend errors correctly", () => {
    const errors = [
      {
        field: "email",
        message: "Invalid email",
      },
    ];

    const result = mapValidationErrors(errors);

    expect(result.email).toBe("Invalid email");
  });
});
