import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { Session, User } from '@supabase/supabase-js';

// Mock session voor tests
const mockUser: User = {
  id: 'test-user',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockSession: Session = {
  access_token: 'test-token',
  refresh_token: 'test-refresh',
  user: mockUser,
  expires_in: 3600,
  expires_at: 9999999999,
  token_type: 'bearer'
};

describe('Header', () => {
  it('should render navigation links', () => {
    render(<Header session={null} />);
    
    // Check of alle nav links aanwezig zijn
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should toggle mobile menu', () => {
    render(<Header session={null} />);
    
    // Check of menu initieel gesloten is
    const nav = screen.getByRole('navigation');
    expect(nav).not.toHaveClass('show');
    
    // Open menu
    const menuButton = screen.getByLabelText('Toggle navigation');
    fireEvent.click(menuButton);
    expect(nav).toHaveClass('show');
    
    // Sluit menu
    fireEvent.click(menuButton);
    expect(nav).not.toHaveClass('show');
  });

  it('should close mobile menu when clicking outside', () => {
    render(<Header session={null} />);
    
    // Open menu
    const menuButton = screen.getByLabelText('Toggle navigation');
    fireEvent.click(menuButton);
    
    // Click outside
    fireEvent.mouseDown(document.body);
    
    // Check of menu gesloten is
    const nav = screen.getByRole('navigation');
    expect(nav).not.toHaveClass('show');
  });

  it('should be responsive', () => {
    render(<Header session={null} />);
    
    const nav = screen.getByRole('navigation');
    
    // Mobile view
    window.innerWidth = 375;
    fireEvent(window, new Event('resize'));
    expect(nav).toHaveClass('mobile');
    
    // Desktop view
    window.innerWidth = 1024;
    fireEvent(window, new Event('resize'));
    expect(nav).not.toHaveClass('mobile');
  });

  it('should show admin link when logged in', () => {
    render(<Header session={mockSession} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should not show admin link when logged out', () => {
    render(<Header session={null} />);
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
