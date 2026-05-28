import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import Login from "./Login";
import { AuthContext } from "../../context/AuthContext";

describe("Login", () => {
  const mockContextValue = {
    user: null,
    isFetching: false,
    error: null,
    dispatch: vi.fn(),
  };

  const renderLogin = () => {
    render(
      <AuthContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test("renders email input", () => {
    renderLogin();

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  test("renders password input", () => {
    renderLogin();

    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  test("updates email input", async () => {
    renderLogin();

    const input = screen.getByPlaceholderText(/email/i);

    await userEvent.type(input, "test@email.com");

    expect(input).toHaveValue("test@email.com");
  });

  test("clicks login button", async () => {
    renderLogin();

    const button = screen.getByRole("button", {
      name: /log in/i,
    });

    await userEvent.click(button);

    expect(button).toBeInTheDocument();
  });
});
