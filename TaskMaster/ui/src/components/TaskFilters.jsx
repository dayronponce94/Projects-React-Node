import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

function TaskFilters({ currentFilter, onFilterChange }) {
    return (
        <div className="d-flex justify-content-end mb-3">
            <small className="me-2 align-self-center text-muted">Filter:</small>
            <ButtonGroup size="sm">
                <Button
                    aria-pressed={currentFilter === 'all' ? 'true' : 'false'}
                    variant={currentFilter === 'all' ? 'primary' : 'outline-secondary'}
                    className="d-flex align-items-center"
                >
                    All
                    {currentFilter === 'all' && (
                        <span className="ms-2 badge bg-light text-dark rounded-pill">
                            <i className="bi bi-check-lg"></i>
                        </span>
                    )}
                </Button>
                <Button
                    variant={currentFilter === 'completed' ? 'primary' : 'outline-secondary'}
                    onClick={() => onFilterChange('completed')}
                >
                    Completed
                </Button>
                <Button
                    variant={currentFilter === 'incomplete' ? 'primary' : 'outline-secondary'}
                    onClick={() => onFilterChange('incomplete')}
                >
                    Incomplete
                </Button>
            </ButtonGroup>
        </div>
    );
}

export default TaskFilters;