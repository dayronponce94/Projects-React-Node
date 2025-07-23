import React from 'react';
import { Badge } from 'react-bootstrap';

const ProgressBadge = ({ progress }) => {
    const validatedProgress = Math.min(100, Math.max(0, progress));

    const getVariant = () => {
        if (progress >= 80) return 'success';
        if (progress >= 50) return 'info';
        if (progress >= 30) return 'warning';
        return 'danger';
    };

    const getText = () => {
        if (progress === 0) return 'No progress';
        if (progress < 30) return 'Getting started';
        if (progress < 50) return 'In progress';
        if (progress < 80) return 'Good progress';
        if (progress < 100) return 'Almost done';
        return 'Completed!';
    };

    return (
        <Badge bg={getVariant()} className="d-flex align-items-center p-2">
            <div className="me-2">
                <div className="position-relative" style={{ width: '40px', height: '40px' }}>
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="4"
                        />
                        <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${progress}, 100`}
                            transform="rotate(-90 20 20)"
                        />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle text-white fw-bold small">
                        {validatedProgress}%
                    </div>
                </div>
            </div>
            <div>
                <div className="fw-bold">{getText()}</div>
                <div className="small">Completion rate</div>
            </div>
        </Badge>
    );
};

export default ProgressBadge;