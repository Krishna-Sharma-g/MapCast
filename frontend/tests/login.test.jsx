import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/pages/Login.jsx';
import { AuthContext } from '../src/context/AuthContext.jsx';

const renderLogin = (contextOverrides = {}) => {
  const contextValue = {
    login: vi.fn(),
    loading: false,
    error: null,
    token: null,
    setError: vi.fn(),
    ...contextOverrides,
  };

  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe('Login page', () => {
  it('renders email and password fields', () => {
    renderLogin();

    expect(
      screen.getByRole('heading', { name: /welcome back/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
