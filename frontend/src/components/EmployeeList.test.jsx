import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EmployeeList from './EmployeeList';
import { listEmployees } from '../services/EmployeeService';
import { BrowserRouter } from 'react-router-dom';

// Mock the EmployeeService
vi.mock('../services/EmployeeService');

// Mock useNavigate
const mockedNavigator = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigator,
    };
});

describe('EmployeeList Component', () => {
    const mockEmployees = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            position: 'Developer',
            department: 'IT'
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            position: 'Manager',
            department: 'HR'
        }
    ];

    beforeEach(() => {
        listEmployees.mockResolvedValue({ data: mockEmployees });
    });

    it('renders employee list correctly', async () => {
        render(
            <BrowserRouter>
                <EmployeeList />
            </BrowserRouter>
        );

        // Check for title
        expect(screen.getByText(/Employee/i)).toBeInTheDocument();
        expect(screen.getByText(/Management/i)).toBeInTheDocument();

        // Wait for employees to be loaded
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Developer')).toBeInTheDocument();
        expect(screen.getByText('IT')).toBeInTheDocument();
    });

    it('renders "No employees found" when list is empty', async () => {
        listEmployees.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <EmployeeList />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No employees found')).toBeInTheDocument();
        });
    });
});
